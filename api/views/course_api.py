from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Course, Enrollment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    user = request.user

    # Lecturer courses
    if user.role == 'lecturer':
        courses = Course.objects.filter(lecturer=user)

    # Student enrolled courses
    else:
        enrolled_course_ids = Enrollment.objects.filter(
            student=user
        ).values_list('course_id', flat=True)

        courses = Course.objects.filter(id__in=enrolled_course_ids)

    data = []

    for course in courses:
        data.append({
            "id": course.id,
            "name": course.name,
            "description": course.description,
            "join_code": course.join_code,
            "created_at": course.created_at,
        })

    return Response(data)