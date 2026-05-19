from urllib import request

from django.shortcuts import render, get_object_or_404
from services.analysis import get_topic_performance
from .models import Course
from users.models import User
from services.quiz_service import handle_topic_submission

def student_dashboard(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    data = get_topic_performance(request.user, course)

    # 🔥 SUMMARY CALCULATIONS
    if data:
        avg_performance = sum(d["performance"] for d in data) / len(data)
        avg_completion = sum(d["completion"] for d in data) / len(data)
        weak_topics = sum(1 for d in data if d["is_weak"])
    else:
        avg_performance = 0
        avg_completion = 0
        weak_topics = 0

    return render(request, "courses/student_dashboard.html", {
        "course": course,
        "data": data,
        "avg_performance": round(avg_performance, 2),
        "avg_completion": round(avg_completion, 2),
        "weak_topics": weak_topics
    })
from services.analysis import get_class_topic_performance
from services.analysis import get_students_needing_help



def lecturer_dashboard(request, course_id):

    course = get_object_or_404(Course, id=course_id)

    data = get_class_topic_performance(course)
    # weak_students = get_students_needing_help(course)
    weak_students = sorted(
    get_students_needing_help(course),
    key=lambda x: x["performance"]
    )
    # weak_topics = [t for t in data if t["performance"] < 50]
    weak_topics = [
    t for t in data
    if t["has_data"] and t["performance"] < 50
    ]

    return render(request, "courses/lecturer_dashboard.html", {
    "course": course,
    "data": data,
    "weak_students": weak_students,
    "weak_topics": weak_topics,
    })

from django.shortcuts import render, redirect
from .models import Course, Enrollment

from django.shortcuts import redirect
from django.contrib import messages

def join_course(request):
    if request.method == "POST":
        code = request.POST.get("join_code")

        try:
            course = Course.objects.get(join_code=code)

            if Enrollment.objects.filter(student=request.user, course=course).exists():
                messages.warning(request, "Already joined this course.")
            else:
                Enrollment.objects.create(student=request.user, course=course)
                messages.success(request, "Successfully joined course.")

        except Course.DoesNotExist:
            messages.error(request, "Invalid join code.")

    return redirect("student_courses")

def student_courses(request):
    if request.user.role == "student":
        enrollments = Enrollment.objects.filter(student=request.user)
        courses = [e.course for e in enrollments]

    else:  # lecturer
        courses = Course.objects.filter(lecturer=request.user)

    return render(request, "courses/student_courses.html", {
        "courses": courses
    })

from django.shortcuts import get_object_or_404
from topics.models import Topic

from topics.models import Topic
from assessments.models import Question
from services.analysis import get_topic_performance


def course_detail(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    # topics = Topic.objects.filter(course=course).filter(
    #     questions__is_approved=True
    # ).distinct()
    topics = Topic.objects.filter(course=course)

    # 🔥 ADD THIS (only for student)
    data = None
    if request.user.role == "student":
        data = get_topic_performance(request.user, course)

    return render(request, "courses/course_detail.html", {
        "course": course,
        "topics": topics,
        "data": data
    })



import random
import string
from django.shortcuts import render, redirect
from .forms import CourseForm

def generate_join_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def create_course(request):
    if request.method == "POST":
        form = CourseForm(request.POST)

        if form.is_valid():
            course = form.save(commit=False)

            course.lecturer = request.user
            course.join_code = generate_join_code()

            course.save()

            return redirect("student_courses")

    else:
        form = CourseForm()

    return render(request, "courses/create_course.html", {"form": form})


from assessments.models import Question, StudentResponse

def topic_questions(request, course_id, topic_id):
    # 🔒 BLOCK lecturer
    if request.user.role == "lecturer":
        return redirect("lecturer_dashboard", course_id=course_id)

    course = get_object_or_404(Course, id=course_id)
    topic = get_object_or_404(Topic, id=topic_id, course=course)

    questions = Question.objects.filter(topic=topic, is_approved=True)

    # 🔥 BLOCK EMPTY SUBMISSION
    if request.method == "POST" and not questions.exists():
        return redirect("course_detail", course_id=course.id)

    if request.method == "POST":
        temp_results, is_retry = handle_topic_submission(
            student=request.user,
            questions=questions,
            post_data=request.POST
        )
        
        # # 🔥 Calculate performance for this topic
        responses = StudentResponse.objects.filter(
            student=request.user,
            question__topic_id=topic_id
        )

        total_questions = responses.count()

        if total_questions > 0:
            total_score = sum([r.score for r in responses])
            performance = round((total_score / total_questions) * 100, 2)
        else:
            performance = 0
        # 🔥 Completion (how many answered vs total)
        total_topic_questions = questions.count()
        completion = round((total_questions / total_topic_questions) * 100, 2) if total_topic_questions > 0 else 0
        return render(request, "courses/topic_result.html", {
            "course": course,
            "topic": topic,
            "temp_results": temp_results,
            "is_retry": is_retry,
            "performance": performance,
            "completion": completion
        })
    # ======================
    # 🔥 GET → SHOW QUESTIONS
    # ======================
    return render(request, "courses/topic_questions.html", {
        "course": course,
        "topic": topic,
        "questions": questions
    })
def topic_performance(request, course_id, topic_id):
    from services.analysis import get_single_topic_performance

    course = get_object_or_404(Course, id=course_id)
    topic = get_object_or_404(Topic, id=topic_id, course=course)

    data = get_single_topic_performance(topic)

    return render(request, "courses/topic_performance.html", {
        "course": course,
        "topic": topic,
        "data": data
    })


from django.db.models import Avg

def topic_result(request, course_id, topic_id):
    course = get_object_or_404(Course, id=course_id)
    topic = get_object_or_404(Topic, id=topic_id, course=course)

    responses = StudentResponse.objects.filter(
        student=request.user,
        question__topic=topic
    )

    total_questions = Question.objects.filter(topic=topic).count()
    answered = responses.values("question").distinct().count()

    avg_score = responses.aggregate(avg=Avg("score"))["avg"] or 0
    performance = avg_score * 100
    completion = (answered / total_questions * 100) if total_questions > 0 else 0

    return render(request, "courses/topic_result.html", {
        "course": course,
        "topic": topic,
        "performance": round(performance, 2),
        "completion": round(completion, 2)
    })

from topics.models import Topic
from django.shortcuts import render, redirect, get_object_or_404

def create_topic(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    # 🔒 Only lecturer can access
    if request.user.role != "lecturer":
        return redirect("course_detail", course_id=course.id)

    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")

        if name:
            Topic.objects.create(
                course=course,
                name=name,
                description=description
            )
            return redirect("course_detail", course_id=course.id)

    return render(request, "courses/create_topic.html", {
        "course": course
    })

from assessments.models import Question

from assessments.models import Question, Choice

def topic_question_bank(request, course_id, topic_id):
    course = get_object_or_404(Course, id=course_id)
    topic = get_object_or_404(Topic, id=topic_id, course=course)

    if request.user.role != "lecturer":
        return redirect("course_detail", course_id=course.id)

    questions = Question.objects.filter(topic=topic).prefetch_related("choices").order_by("-created_at")

    return render(request, "courses/topic_question_bank.html", {
        "course": course,
        "topic": topic,
        "questions": questions
    })

def create_question(request, course_id, topic_id):
    course = get_object_or_404(Course, id=course_id)
    topic = get_object_or_404(Topic, id=topic_id, course=course)

    if request.user.role != "lecturer":
        return redirect("course_detail", course_id=course.id)

    if request.method == "POST":
        text = request.POST.get("text")
        question_type = request.POST.get("question_type")

        if text and question_type:
            question = Question.objects.create(
                topic=topic,
                text=text,
                question_type=question_type,
                created_by="lecturer",
                is_approved=True
            )

            # 🔥 HANDLE REFERENCE ANSWER FOR OPEN QUESTIONS
            if question_type == "open":
                correct_answer = request.POST.get("correct_answer", "")
                question.correct_answer = correct_answer
                question.save()

            # 🔥 HANDLE MCQ OPTIONS
            if question_type == "mcq":
                options = request.POST.getlist("options[]")
                correct_index = request.POST.get("correct_option")

                for i, option_text in enumerate(options):
                    if option_text.strip():
                        Choice.objects.create(
                            question=question,
                            text=option_text,
                            is_correct=(str(i) == correct_index)
                        )

            return redirect("topic_question_bank", course_id=course.id, topic_id=topic.id)

    return render(request, "courses/create_question.html", {
        "course": course,
        "topic": topic
    })


from services.ai.question_generator import generate_questions
from materials.models import Material

from django.http import JsonResponse
import json
from django.http import JsonResponse
def clean_choice(text):
    import re
    return re.sub(r'^[A-D]\.\s*', '', text).strip()
def bulk_create_questions(request, course_id, topic_id):

    if request.method == "POST":
        data = json.loads(request.body)
        questions = data.get("questions", [])

        topic = get_object_or_404(Topic, id=topic_id)

        for q in questions:

            question_obj = Question.objects.create(
                topic=topic,
                text=q["question"],
                question_type=q["type"],
                
                correct_answer=(
                    q.get("correct_answer")
                    or q.get("reference_answer", "")
                ),
                is_approved=True,
                created_by="lecturer"
            )
            # for choice_text in q["choices"]:
            #     cleaned = clean_choice(choice_text)
            #     if q["type"] == "mcq":
            #         for choice_text in q["choices"]:
            #             Choice.objects.create(
            #                 question=question_obj,
            #                 text=choice_text,
            #                 is_correct=(choice_text == q["correct_answer"])
            #             )
            if q["type"] == "mcq":

                for choice_text in q["choices"]:

                    cleaned = clean_choice(choice_text)

                    Choice.objects.create(
                        question=question_obj,
                        text=cleaned,
                        is_correct=(
                            cleaned == clean_choice(q["correct_answer"])
                        )
                    )

        return JsonResponse({"status": "ok"})


def generate_topic_questions(request, course_id, topic_id):

    topic = get_object_or_404(Topic, id=topic_id)

    materials = Material.objects.filter(topic=topic)
    # material_text = " ".join([m.content for m in materials])
    material_text = " ".join([
        m.extracted_text or ""
        for m in materials
    ])

    # 🔥 HERE
    question_type = request.GET.get("type", "mcq")
    count = int(request.GET.get("count", 3))
    custom_prompt = request.GET.get("prompt", "")

    questions = generate_questions(
        topic.name,
        material_text,
        num_questions=count,
        question_type=question_type,
        custom_prompt=custom_prompt 
    )

    return JsonResponse({
        "questions": questions
    })


def edit_question(request, course_id, topic_id, question_id):

    question = get_object_or_404(Question, id=question_id)

    if request.method == "POST":
        question.text = request.POST.get("text")

        if question.question_type == "open":
            question.correct_answer = request.POST.get("correct_answer")

        question.save()

        # 🔥 update choices
        if question.question_type == "mcq":
            options = request.POST.getlist("options[]")
            correct_index = request.POST.get("correct_option")

            question.choices.all().delete()

            for i, option in enumerate(options):
                Choice.objects.create(
                    question=question,
                    text=option,
                    is_correct=(str(i) == correct_index)
                )

        return redirect("topic_question_bank", course_id=course_id, topic_id=topic_id)

    return render(request, "courses/edit_question.html", {
        "question": question
    })


def delete_question(request, course_id, topic_id, question_id):
    question = get_object_or_404(Question, id=question_id)

    if request.method == "POST":
        question.delete()
        return JsonResponse({"status": "ok"})

    return JsonResponse({"status": "error"})

def toggle_question_status(request, course_id, topic_id, question_id):
    question = get_object_or_404(Question, id=question_id)

    question.is_approved = not question.is_approved
    question.save()

    return redirect("topic_question_bank", course_id=course_id, topic_id=topic_id)