from rest_framework import serializers

from .models import (
    Question,
    Choice,
)


class ChoiceSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Choice

        fields = [
            "id",
            "text",
            "is_correct",
        ]


class QuestionSerializer(
    serializers.ModelSerializer
):

    choices = ChoiceSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Question

        fields = [
            "id",
            "text",
            "question_type",
            "created_by",
            "is_approved",
            "correct_answer",
            "created_at",
            "choices",
        ]