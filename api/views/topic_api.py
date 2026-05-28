from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from courses.models import Course

from topics.models import Topic

from topics.serializers import (
    TopicSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_topics(request, course_id):

    try:

        course = Course.objects.get(
            id=course_id
        )

    except Course.DoesNotExist:

        return Response({
            "success": False,
            "message": "Course not found",
        }, status=404)

    topics = Topic.objects.filter(
        course=course
    )

    serializer = TopicSerializer(
        topics,
        many=True
    )

    return Response({
        "success": True,
        "data": serializer.data,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_topic(request, course_id):

    try:

        course = Course.objects.get(
            id=course_id
        )

    except Course.DoesNotExist:

        return Response({
            "success": False,
            "message": "Course not found",
        }, status=404)

    topic = Topic.objects.create(
        course=course,
        name=request.data.get("name"),
        description=request.data.get(
            "description"
        ),
    )

    serializer = TopicSerializer(topic)

    return Response({
        "success": True,
        "message": "Topic created",
        "data": serializer.data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_detail(request, topic_id):

    try:

        topic = Topic.objects.get(
            id=topic_id
        )

    except Topic.DoesNotExist:

        return Response({
            "success": False,
            "message": "Topic not found",
        }, status=404)

    serializer = TopicSerializer(topic)

    return Response({
        "success": True,
        "data": serializer.data,
    })