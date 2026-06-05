from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)
from api.permissions import IsLecturer, is_course_owner

from rest_framework.response import Response

from courses.models import Course, Enrollment

from topics.models import Topic

from topics.serializers import (
    TopicSerializer,
)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def course_topics(request, course_id):

#     try:

#         course = Course.objects.get(
#             id=course_id
#         )

#     except Course.DoesNotExist:

#         return Response({
#             "success": False,
#             "message": "Course not found",
#         }, status=404)

#     topics = Topic.objects.filter(
#         course=course
#     )

#     serializer = TopicSerializer(
#         topics,
#         many=True
#     )

#     return Response({
#         "success": True,
#         "data": serializer.data,
#     })
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_topics(request, course_id):

    try:

        course = Course.objects.get(
            id=course_id
        )

    except Course.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Course not found",
            },
            status=404
        )

    # Lecturer ownership check
    if request.user.role == "lecturer":

        if course.lecturer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Access denied."
                },
                status=403
            )

    # Student enrollment check
    else:

        is_enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not is_enrolled:

            return Response(
                {
                    "success": False,
                    "message":
                    "You are not enrolled in this course."
                },
                status=403
            )

    topics = Topic.objects.filter(
        course=course
    )

    serializer = TopicSerializer(
        topics,
        many=True
    )

    return Response(
        {
            "success": True,
            "data": serializer.data,
        }
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsLecturer])
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

    if not is_course_owner(request.user, course):

        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=403)

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


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def topic_detail(request, topic_id):

#     try:

#         topic = Topic.objects.get(
#             id=topic_id
#         )

#     except Topic.DoesNotExist:

#         return Response({
#             "success": False,
#             "message": "Topic not found",
#         }, status=404)

#     serializer = TopicSerializer(topic)

#     return Response({
#         "success": True,
#         "data": serializer.data,
#     })
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_detail(request, topic_id):

    try:

        topic = Topic.objects.get(
            id=topic_id
        )

    except Topic.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Topic not found",
            },
            status=404
        )

    course = topic.course

    # Lecturer ownership check
    if request.user.role == "lecturer":

        if course.lecturer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Access denied."
                },
                status=403
            )

    # Student enrollment check
    else:

        is_enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not is_enrolled:

            return Response(
                {
                    "success": False,
                    "message":
                    "You are not enrolled in this course."
                },
                status=403
            )

    serializer = TopicSerializer(
        topic
    )

    return Response(
        {
            "success": True,
            "data": serializer.data,
        }
    )