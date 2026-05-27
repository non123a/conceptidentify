
from assessments.models import StudentResponse
from services.ai.evaluator import evaluate_open_answer
from materials.models import Material

def handle_topic_submission(student, questions, post_data):
    temp_results = []
    is_retry = False
    
    for q in questions:
        raw_answer = post_data.get(f"question_{q.id}")
        display_answer = raw_answer
        ai_pending = False 
        ai_feedback = "Evaluating..."
        display_score = None
        feedback = ""
        # 🔥 Convert MCQ ID → text
        if q.question_type == "mcq" and raw_answer:
            choice = q.choices.filter(id=raw_answer).first()
            if choice:
                display_answer = choice.text

        if raw_answer:
            existing = StudentResponse.objects.filter(
                student=student,
                question=q
            ).first()

            # =====================
            # 🔥 MCQ (NO AI)
            # =====================
            if q.question_type == "mcq":
                correct_choice = q.choices.filter(is_correct=True).first()
                score = 1 if correct_choice and str(correct_choice.id) == raw_answer else 0
                feedback = ""

                # display_score = score
                if not existing:
                    StudentResponse.objects.create(
                        student=student,
                        question=q,
                        answer=display_answer,
                        score=score,
                        feedback=""
                    )
                else:
                    is_retry = True

                display_score = score
                ai_feedback = ""  # 0 or 1

            else:
                print("🔥 ENTER OPEN AI BLOCK for:", q.text)
                # Check for cached evaluation (any student with same question and answer)
                cached_response = StudentResponse.objects.filter(
                    question=q,
                    answer=display_answer
                ).exclude(feedback__in=["Evaluating...", "Evaluation pending"]).first()
                
                if cached_response:
                    # Use cached result
                    ai_score = cached_response.score * 100  # Convert back to 0-100
                    ai_feedback = cached_response.feedback
                    display_score = round(ai_score, 2)
                    ai_pending = False
                    print("🔥 USING CACHED RESULT for:", q.text)
                else:
                    # Need to evaluate
                    ai_score = None
                    ai_feedback = "Evaluating..."
                    display_score = None
                    ai_pending = True
                    print("🔥 CALLING AI NOW for:", q.text)
                
                # Always create/update the student's response record
                if not existing:
                    response_obj = StudentResponse.objects.create(
                        student=student,
                        question=q,
                        answer=display_answer,
                        score=ai_score / 100 if ai_score is not None else 0,
                        feedback=ai_feedback
                    )
                else:
                    existing.score = ai_score / 100 if ai_score is not None else 0
                    existing.feedback = ai_feedback
                    existing.save()
                    response_obj = existing
                
                # If we need to evaluate, do it now
                if cached_response is None:
                    # 🔥 Fetch material for this topic
                    materials = Material.objects.filter(topic=q.topic)

                    material_text = "\n".join([
                        f"{m.title}: {m.extracted_text}" for m in materials
                    ])
                    if not material_text.strip():
                        material_text = "No lecture material provided"
                
                    ai_score, ai_feedback = evaluate_open_answer(
                        question=q.text,
                        student_answer=display_answer,
                        topic_name=q.topic.name,
                        reference_answer=q.correct_answer,
                        material_text=material_text 
                    )

                    
                    if ai_score is not None:
                        response_obj.score = ai_score / 100
                        response_obj.feedback = ai_feedback
                        display_score = round(ai_score, 2)
                        ai_pending = False
                    else:
                        ai_pending = True
                        display_score = None
                        ai_feedback = "Evaluating..."
                    
                    response_obj.save()
            temp_results.append({
                "question": q.text,
                "answer": display_answer,
                "score": display_score,
                "type": q.question_type,   # 🔥 IMPORTANT

                "feedback": ai_feedback,
                "ai_pending": ai_pending
            })

    return temp_results, is_retry