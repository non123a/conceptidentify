
from assessments.models import StudentResponse
from services.ai.evaluator import evaluate_open_answer
from materials.models import Material


def evaluate_question_answer(question, raw_answer):
    if raw_answer is not None:
        raw_answer = str(raw_answer)

    display_answer = raw_answer
    ai_pending = False
    ai_feedback = ""
    display_score = None
    stored_score = 0

    if question.question_type == "mcq" and raw_answer:
        choice = question.choices.filter(id=raw_answer).first()
        if choice:
            display_answer = choice.text

        correct_choice = question.choices.filter(is_correct=True).first()
        stored_score = 1 if correct_choice and str(correct_choice.id) == raw_answer else 0
        display_score = stored_score

    else:
        cached_response = StudentResponse.objects.filter(
            question=question,
            answer=display_answer
        ).exclude(
            feedback__in=["Evaluating...", "Evaluation pending"]
        ).first()

        if cached_response:
            stored_score = cached_response.score
            display_score = round(cached_response.score * 100, 2)
            ai_feedback = cached_response.feedback
        else:
            materials = Material.objects.filter(topic=question.topic)

            material_text = "\n".join([
                f"{material.title}: {material.extracted_text}"
                for material in materials
            ])

            if not material_text.strip():
                material_text = "No lecture material provided"

            ai_score, ai_feedback = evaluate_open_answer(
                question=question.text,
                student_answer=display_answer,
                topic_name=question.topic.name,
                reference_answer=question.correct_answer,
                material_text=material_text
            )

            if ai_score is not None:
                stored_score = ai_score / 100
                display_score = round(ai_score, 2)
            else:
                stored_score = 0
                display_score = None
                ai_feedback = "Evaluating..."
                ai_pending = True

    return {
        "question": question.text,
        "answer": display_answer,
        "score": display_score,
        "stored_score": stored_score,
        "type": question.question_type,
        "feedback": ai_feedback,
        "ai_pending": ai_pending,
    }


def handle_topic_submission(student, questions, post_data, persist=True):
    temp_results = []
    is_retry = False
    
    for q in questions:
        raw_answer = post_data.get(f"question_{q.id}")
        if raw_answer:
            existing = StudentResponse.objects.filter(
                student=student,
                question=q
            ).first()

            result = evaluate_question_answer(q, raw_answer)

            if persist and not existing:
                StudentResponse.objects.create(
                    student=student,
                    question=q,
                    answer=result["answer"],
                    score=result["stored_score"],
                    feedback=result["feedback"]
                )
            elif existing:
                is_retry = True

            result.pop("stored_score", None)
            temp_results.append(result)

    return temp_results, is_retry
