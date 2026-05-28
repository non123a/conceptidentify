from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import (
    Response,
)

from assessments.models import (
    Question,
    Choice,
)

from assessments.serializers import (
    QuestionSerializer,
)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_questions(request, topic_id):

    questions = Question.objects.filter(
        topic_id=topic_id
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
@permission_classes([IsAuthenticated])
def create_question(request, topic_id):

    text = request.data.get("text")

    question_type = request.data.get(
        "question_type"
    )

    correct_answer = request.data.get(
        "correct_answer",
        ""
    )

    question = Question.objects.create(
        topic_id=topic_id,
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