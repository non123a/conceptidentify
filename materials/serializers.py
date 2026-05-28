from rest_framework import serializers

from .models import Material


class MaterialSerializer(serializers.ModelSerializer):

    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:

        model = Material

        fields = [
            "id",
            "title",
            "file",
            "uploaded_at",
            "uploaded_by_name",
        ]

    def get_uploaded_by_name(self, obj):

        return (
            f"{obj.uploaded_by.first_name} "
            f"{obj.uploaded_by.last_name}"
        )