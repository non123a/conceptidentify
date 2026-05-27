from rest_framework import serializers

from .models import Course
from .models import Enrollment

from users.models import User


class LecturerSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]


class CourseSerializer(serializers.ModelSerializer):

    lecturer = LecturerSerializer(
        read_only=True
    )

    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Course

        fields = [
            "id",
            "name",
            "description",
            "join_code",
            "created_at",
            "lecturer",
            "student_count",
        ]

    def get_student_count(self, obj):

        return Enrollment.objects.filter(
            course=obj
        ).count()