from rest_framework import serializers

from .models import Topic


class TopicSerializer(serializers.ModelSerializer):

    material_count = serializers.SerializerMethodField()

    question_count =   serializers.SerializerMethodField()

    class Meta:

        model = Topic

        fields = [
            "id",
            "name",
            "description",
            "material_count",
            "question_count",
        ]

    def get_material_count(self, obj):

        return obj.materials.count()

    def get_question_count(self, obj):

        return obj.questions.count()