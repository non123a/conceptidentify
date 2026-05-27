from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from courses.models import (
    Course,
    Enrollment,
)

from courses.serializers import (
    CourseSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_courses(request):

    user = request.user

    if user.role == "lecturer":

        courses = Course.objects.filter(
            lecturer=user
        )

    else:

        enrollments = Enrollment.objects.filter(
            student=user
        )

        courses = [
            enrollment.course
            for enrollment in enrollments
        ]

    serializer = CourseSerializer(
        courses,
        many=True
    )

    return Response({
        "success": True,
        "data": serializer.data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_detail(request, course_id):

    try:

        course = Course.objects.get(
            id=course_id
        )

    except Course.DoesNotExist:

        return Response({
            "success": False,
            "message": "Course not found",
        }, status=404)

    serializer = CourseSerializer(course)

    return Response({
        "success": True,
        "data": serializer.data,
    })