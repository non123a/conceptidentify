from django.db.models import Avg
from django.db.models import Max
from assessments.models import StudentResponse
from topics.models import Topic
from assessments.models import Question


from courses.models import Course

def get_topic_performance(student, course):
    topics = Topic.objects.filter(course=course)

    results = []

    for topic in topics:
        questions = Question.objects.filter(topic=topic)
        total_questions = questions.count()

        responses = StudentResponse.objects.filter(
            student=student,
            question__topic=topic
        )
        
        # answered = responses.count()
        answered = responses.values("question").distinct().count()
        avg_score = responses.aggregate(avg=Avg("score"))["avg"] or 0

        completion = (answered / total_questions * 100) if total_questions > 0 else 0
        performance = avg_score * 100
        has_data = answered > 0

        is_weak = has_data and performance < 50 

        results.append({
            "topic": topic.name,
            "total_questions": total_questions,
            "answered": answered,
            "avg_score": round(avg_score, 2),
            "completion": round(completion, 2),
            "performance": round(performance, 2),
            "has_data": has_data,
            "is_weak": is_weak
            
        })

    return results

def get_class_topic_performance(course):
    topics = Topic.objects.filter(course=course)
    
    results = []

    for topic in topics:
        total_questions = Question.objects.filter(topic=topic).count()

        responses = StudentResponse.objects.filter(
            question__topic=topic
        )
        question_stats = []

        questions = Question.objects.filter(topic=topic)

        for q in questions:
            q_responses = responses.filter(question=q)

            total = q_responses.count()
            correct = q_responses.filter(score__gte=0.5).count()

            if total > 0:
                acc = correct / total

                if acc < 0.5:
                    question_stats.append({
                        "text": q.text[:50],
                        "accuracy": round(acc * 100, 2)
                    })
        total_responses = responses.count()

        incorrect = responses.filter(score__lt=0.5).count()

        error_rate = (incorrect / total_responses * 100) if total_responses > 0 else 0

        # unique students who answered this topic
        students_answered = responses.values("student").distinct().count()

        # total students in course
        total_students = course.enrollment_set.count()

        avg_score = responses.aggregate(avg=Avg("score"))["avg"] or 0

        completion_rate = (
            students_answered / total_students * 100
            if total_students > 0 else 0
        )

        performance = avg_score * 100

        has_data = students_answered > 0

        is_weak = has_data and performance < 50 if has_data else False 

        results.append({
            "topic": topic.name,
            "total_questions": total_questions,
            "students_answered": students_answered,
            "total_students": total_students,
            "completion_rate": round(completion_rate, 2),
            "performance": round(performance, 2),
            "has_data": has_data,
            "is_weak": is_weak,
            "students_answered": students_answered,   # 👈 ADD
            "total_students": total_students,  
            "error_rate": round(error_rate, 2), 
            "weak_questions": question_stats[:2],  # top 2 weakest
            "topic_id": topic.id,
            
        })

    return results


# def get_single_topic_performance(topic):
#     from assessments.models import StudentResponse
#     from django.db.models import Avg

#     responses = StudentResponse.objects.filter(
#         question__topic=topic
#     )

#     total_students = topic.course.enrollment_set.count()

#     students_answered = responses.values("student").distinct().count()

#     avg_score = responses.aggregate(avg=Avg("score"))["avg"] or 0

#     completion_rate = (
#         students_answered / total_students * 100
#         if total_students > 0 else 0
#     )
#     question_stats = []

#     questions = Question.objects.filter(topic=topic)

#     for q in questions:
#         q_responses = responses.filter(question=q)

#         total = q_responses.count()
#         correct = q_responses.filter(score__gte=0.5).count()

#         if total > 0:
#             acc = correct / total

#             if acc < 0.5:
#                 question_stats.append({
#                     "text": q.text[:100],
#                     "accuracy": round(acc * 100, 2)
#                 })
#     performance = avg_score * 100
#     has_data = students_answered > 0

#     is_weak = has_data and performance < 50

#     return {
#         "topic": topic.name,
#         "completion_rate": round(completion_rate, 2),
#         "performance": round(performance, 2),
#         "has_data": has_data,
#         "is_weak": is_weak,
#         "weak_questions": question_stats
#     }
def get_single_topic_performance(topic):

    from assessments.models import StudentResponse
    from django.db.models import Avg

    responses = StudentResponse.objects.filter(
        question__topic=topic
    ).select_related(
        "student",
        "question"
    )

    total_students = (
        topic.course.enrollment_set.count()
    )

    students_answered = (
        responses.values("student")
        .distinct()
        .count()
    )

    avg_score = (
        responses.aggregate(
            avg=Avg("score")
        )["avg"]
        or 0
    )

    completion_rate = (
        students_answered / total_students * 100
        if total_students > 0 else 0
    )

    performance = avg_score * 100

    has_data = students_answered > 0

    is_weak = (
        has_data and performance < 50
    )

    # ==================================================
    # Student Analysis
    # ==================================================

    student_scores = {}

    for response in responses:

        username = (
            response.student.username
        )

        if username not in student_scores:

            student_scores[username] = []

        student_scores[username].append(
            response.score
        )

    struggling_students = []

    strong_students = 0
    average_students = 0
    weak_students = 0

    for username, scores in student_scores.items():

        avg = (
            sum(scores)
            / len(scores)
            * 100
        )

        if avg < 50:

            weak_students += 1

            struggling_students.append({
                "student": username,
                "performance": round(avg, 2)
            })

        elif avg < 70:

            average_students += 1

        else:

            strong_students += 1

    # ==================================================
    # Question Analysis
    # ==================================================

    question_performance = []

    questions = Question.objects.filter(
        topic=topic
    )

    for question in questions:

        question_responses = responses.filter(
            question=question
        )

        attempted = (
            question_responses.count()
        )

        correct = (
            question_responses
            .filter(score__gte=0.5)
            .count()
        )

        incorrect = attempted - correct

        accuracy = (
            correct / attempted * 100
            if attempted > 0
            else 0
        )

        question_performance.append({

            "id": question.id,

            "text": question.text[:150],

            "attempted": attempted,

            "correct": correct,

            "incorrect": incorrect,

            "accuracy": round(
                accuracy,
                2
            ),

            "is_weak": (
                accuracy < 50
                if attempted > 0
                else False
            )

        })

    question_performance.sort(
        key=lambda q: q["accuracy"]
    )

    weak_questions = [

        q

        for q in question_performance

        if q["is_weak"]

    ][:5]

    # ==================================================
    # Return
    # ==================================================

    return {

        "topic": topic.name,

        "completion_rate": round(
            completion_rate,
            2
        ),

        "performance": round(
            performance,
            2
        ),

        "has_data": has_data,

        "is_weak": is_weak,

        "students_struggling": len(
            struggling_students
        ),

        "struggling_students":
            struggling_students,

        "student_distribution": {

            "strong":
                strong_students,

            "average":
                average_students,

            "weak":
                weak_students,

        },

        "question_performance":
            question_performance,

        "weak_questions":
            weak_questions,

    }
from assessments.models import StudentResponse

def get_students_needing_help(course):
    results = {}

    responses = StudentResponse.objects.filter(
        question__topic__course=course
    ).select_related("student", "question__topic")

    for r in responses:
        student = r.student.username
        topic = r.question.topic.name

        if student not in results:
            results[student] = {}

        if topic not in results[student]:
            results[student][topic] = []

        results[student][topic].append(r.score)

    weak_students = []

    for student, topics in results.items():
        for topic, scores in topics.items():
            avg = sum(scores) / len(scores) * 100

            if avg < 50:
                weak_students.append({
                    "student": student,
                    "topic": topic,
                    "performance": round(avg, 2)
                })

    return weak_students


def get_student_topic_performance(student, topic):

    responses = (
        StudentResponse.objects
        .filter(
            student=student,
            question__topic=topic
        )
        .select_related("question")
    )

    total_questions = (
        Question.objects
        .filter(topic=topic)
        .count()
    )

    answered = (
        responses.values("question")
        .distinct()
        .count()
    )

    avg_score = (
        responses.aggregate(
            avg=Avg("score")
        )["avg"]
        or 0
    )

    performance = avg_score * 100

    completion_rate = (
        answered / total_questions * 100
        if total_questions > 0
        else 0
    )

    question_results = []

    correct_answers = 0
    incorrect_answers = 0

    for response in responses:

        is_correct = (
            response.score >= 0.5
        )

        if is_correct:
            correct_answers += 1
        else:
            incorrect_answers += 1

        question_results.append({

            "question_id":
                response.question.id,

            "question":
                response.question.text,

            "question_type":
                response.question.question_type,

            "your_answer":
                response.answer,

            "correct_answer":
                response.question.correct_answer,

            "score":
                response.score,

            "feedback":
                response.feedback,

            "is_correct":
                is_correct,

        })

    weak_questions = [

        q

        for q in question_results

        if not q["is_correct"]

    ]

    return {

        "topic":
            topic.name,

        "performance":
            round(performance, 2),

        "completion_rate":
            round(completion_rate, 2),

        "total_questions":
            total_questions,

        "answered":
            answered,

        "correct_answers":
            correct_answers,

        "incorrect_answers":
            incorrect_answers,

        "weak_questions":
            weak_questions,

        "question_results":
            question_results,

    }