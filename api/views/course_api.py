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

from rest_framework import status

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


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def course_detail(request, course_id):

#     try:

#         course = Course.objects.get(
#             id=course_id
#         )

#     except Course.DoesNotExist:

#         return Response({
#             "success": False,
#             "message": "Course not found",
#         }, status=404)

#     serializer = CourseSerializer(course)

#     return Response({
#         "success": True,
#         "data": serializer.data,
#     })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_detail(request, course_id):

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
                    "message": "You are not enrolled in this course."
                },
                status=403
            )

    serializer = CourseSerializer(course)

    return Response(
        {
            "success": True,
            "data": serializer.data,
        }
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_course(request):

    if request.user.role != "lecturer":

        return Response(
            {
                "success": False,
                "message": "Lecturers only."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    name = request.data.get("name")
    description = request.data.get(
        "description",
        ""
    )

    if not name:

        return Response(
            {
                "success": False,
                "message": "Course name is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    course = Course.objects.create(
        name=name,
        description=description,
        lecturer=request.user,
    )

    serializer = CourseSerializer(course)

    return Response(
        {
            "success": True,
            "message": "Course created successfully.",
            "data": serializer.data,
        },
        status=status.HTTP_201_CREATED
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_course(request):

    if request.user.role != "student":

        return Response(
            {
                "success": False,
                "message": "Students only."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    join_code = request.data.get(
        "join_code"
    )

    if not join_code:

        return Response(
            {
                "success": False,
                "message": "Join code is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        course = Course.objects.get(
            join_code=join_code
        )

    except Course.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Invalid join code."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if Enrollment.objects.filter(
        student=request.user,
        course=course
    ).exists():

        return Response(
            {
                "success": False,
                "message": "Already enrolled."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    Enrollment.objects.create(
        student=request.user,
        course=course
    )

    return Response(
        {
            "success": True,
            "message": "Successfully joined course.",
            "data": CourseSerializer(course).data
        }
    )