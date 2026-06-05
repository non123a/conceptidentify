from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)
from api.permissions import (
    IsLecturer,
    is_question_owner,
    is_topic_owner,
)

from rest_framework.response import (
    Response,
)
from rest_framework import status
from django.shortcuts import get_object_or_404

from assessments.models import (
    Question,
    Choice,
)
from topics.models import Topic
from materials.models import Material
from services.ai.question_generator import generate_questions

from assessments.serializers import (
    QuestionSerializer,
)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsLecturer])
def topic_questions(request, topic_id):

    topic = get_object_or_404(
        Topic,
        id=topic_id
    )

    if not is_topic_owner(request.user, topic):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    questions = Question.objects.filter(
        topic=topic
    ).order_by("-created_at")

    serializer = QuestionSerializer(
        questions,
        many=True
    )

    return Response({
        "success": True,
        "data": serializer.data,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsLecturer])
def create_question(request, topic_id):

    topic = get_object_or_404(
        Topic,
        id=topic_id
    )

    if not is_topic_owner(request.user, topic):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    text = request.data.get("text")

    question_type = request.data.get(
        "question_type"
    )

    correct_answer = request.data.get(
        "correct_answer",
        ""
    )

    question = Question.objects.create(
        topic=topic,
        text=text,
        question_type=question_type,
        correct_answer=correct_answer,
        created_by="lecturer",
        is_approved=True,
    )

    if question_type == "mcq":

        options = request.data.getlist(
            "options"
        )

        correct_index = int(
            request.data.get(
                "correct_option",
                0
            )
        )

        for index, option in enumerate(
            options
        ):

            Choice.objects.create(
                question=question,
                text=option,
                is_correct=(
                    index == correct_index
                )
            )

    serializer = QuestionSerializer(
        question
    )

    return Response({
        "success": True,
        "message": "Question created",
        "data": serializer.data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsLecturer])
def generate_topic_questions(request, topic_id):

    topic = get_object_or_404(
        Topic,
        id=topic_id
    )

    if not is_topic_owner(request.user, topic):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    materials = Material.objects.filter(
        topic=topic
    )

    material_text = " ".join([
        material.extracted_text or ""
        for material in materials
    ])

    question_type = request.query_params.get(
        "type",
        "mcq"
    )

    count = int(
        request.query_params.get(
            "count",
            3
        )
    )

    custom_prompt = request.query_params.get(
        "prompt",
        ""
    )

    questions = generate_questions(
        topic.id,
        topic.name,
        material_text,
        num_questions=count,
        question_type=question_type,
        custom_prompt=custom_prompt
    )

    if not questions:

        return Response({
            "success": False,
            "message": "AI service temporarily unavailable",
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({
        "success": True,
        "questions": questions,
    })


def clean_choice(text):
    import re
    return re.sub(r'^[A-D]\.\s*', '', text).strip()


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsLecturer])
def bulk_create_questions(request, topic_id):

    topic = get_object_or_404(
        Topic,
        id=topic_id
    )

    if not is_topic_owner(request.user, topic):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    questions = request.data.get(
        "questions",
        []
    )

    for question_data in questions:

        question_type = question_data.get(
            "type"
        )

        correct_answer = (
            question_data.get("correct_answer")
            or question_data.get("reference_answer", "")
        )

        question = Question.objects.create(
            topic=topic,
            text=question_data.get("question", ""),
            question_type=question_type,
            correct_answer=correct_answer,
            created_by="lecturer",
            is_approved=True,
        )

        if question_type == "mcq":

            choices = question_data.get(
                "choices",
                []
            )

            cleaned_correct_answer = clean_choice(
                correct_answer
            )

            for choice_text in choices:

                cleaned_text = clean_choice(
                    choice_text
                )

                Choice.objects.create(
                    question=question,
                    text=cleaned_text,
                    is_correct=(
                        cleaned_text == cleaned_correct_answer
                    )
                )

    return Response({
        "success": True,
        "message": "Questions saved",
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsLecturer])
def toggle_question_status(request, question_id):

    question = get_object_or_404(
        Question,
        id=question_id
    )

    if not is_question_owner(request.user, question):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    question.is_approved = not question.is_approved
    question.save()

    return Response({
        "success": True,
        "is_approved": question.is_approved,
    })


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsLecturer])
def delete_question(request, question_id):

    question = get_object_or_404(
        Question,
        id=question_id
    )

    if not is_question_owner(request.user, question):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    question.delete()

    return Response({
        "success": True,
        "message": "Question deleted",
    })


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsLecturer])
def edit_question(request, question_id):

    question = get_object_or_404(
        Question,
        id=question_id
    )

    if not is_question_owner(request.user, question):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=status.HTTP_403_FORBIDDEN)

    question.text = request.data.get(
        "text",
        question.text
    )

    if question.question_type == "open":

        question.correct_answer = request.data.get(
            "correct_answer",
            ""
        )

    question.save()

    if question.question_type == "mcq":

        choices = request.data.get(
            "choices",
            []
        )

        correct_index = int(
            request.data.get(
                "correct_option",
                0
            )
        )

        question.choices.all().delete()

        for index, choice_text in enumerate(choices):

            if choice_text.strip():

                Choice.objects.create(
                    question=question,
                    text=choice_text,
                    is_correct=(
                        index == correct_index
                    )
                )

    return Response({
        "success": True,
        "message": "Question updated",
    })
