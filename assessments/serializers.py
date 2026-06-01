from rest_framework import serializers

from .models import (
    Question,
    Choice,
    StudentResponse,
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


# ====================================
# STUDENT-FACING SERIALIZERS
# ====================================

class ChoiceForStudentSerializer(serializers.ModelSerializer):
    """
    Serializer for MCQ choices shown to students.
    Excludes is_correct to prevent answer leaking.
    """
    class Meta:
        model = Choice
        fields = [
            "id",
            "text",
        ]


class QuestionForStudentSerializer(serializers.ModelSerializer):
    """
    Serializer for questions shown to students taking a quiz.
    Excludes: correct_answer, is_approved
    """
    choices = ChoiceForStudentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Question
        fields = [
            "id",
            "text",
            "question_type",
            "choices",
        ]


class StudentResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for student's quiz responses/results
    """
    question_text = serializers.CharField(
        source='question.text',
        read_only=True
    )
    question_type = serializers.CharField(
        source='question.question_type',
        read_only=True
    )

    class Meta:
        model = StudentResponse
        fields = [
            "id",
            "question_text",
            "question_type",
            "answer",
            "score",
            "feedback",
            "created_at",
        ]