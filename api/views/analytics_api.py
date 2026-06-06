"""
Analytics API Endpoints

Reuses services/analysis.py functions without modification.

GET /api/courses/<course_id>/student-analytics/ - Student performance across topics
GET /api/courses/<course_id>/lecturer-analytics/ - Class performance + students needing help
GET /api/topics/<topic_id>/analytics/ - Single topic performance details
"""

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from courses.models import Course, Enrollment
from topics.models import Topic
from api.permissions import IsStudent, IsLecturer
from services.analysis import (
    get_topic_performance,
    get_class_topic_performance,
    get_single_topic_performance,
    get_students_needing_help,
    get_student_topic_performance,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def student_analytics(request, course_id):
    """
    GET /api/courses/<course_id>/student-analytics/
    
    Return student's performance across all topics in a course.
    Reuses: get_topic_performance(student, course)
    
    Requirements:
    - Student must be enrolled in course
    - Only authenticated students
    """
    try:
        course = get_object_or_404(Course, id=course_id)
        
        # ✅ Verify enrollment
        enrollment = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).first()
        if not enrollment:
            return Response(
                {
                    "success": False,
                    "error": "Not enrolled in this course"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # ✅ Reuse analysis service (UNCHANGED)
        analytics = get_topic_performance(request.user, course)
        
        return Response({
            "success": True,
            "course": {
                "id": course.id,
                "name": course.name,
            },
            "analytics": analytics,
        })
    
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsLecturer])
def lecturer_analytics(request, course_id):
    """
    GET /api/courses/<course_id>/lecturer-analytics/
    
    Return class performance and students who need help.
    Reuses:
    - get_class_topic_performance(course)
    - get_students_needing_help(course)
    
    Requirements:
    - Lecturer role only
    - Must be the course lecturer
    """
    try:
        course = get_object_or_404(Course, id=course_id)
        
        # ✅ Verify lecturer owns this course
        if course.lecturer != request.user:
            return Response(
                {
                    "success": False,
                    "error": "You are not the instructor for this course"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # ✅ Reuse analysis services (UNCHANGED)
        topics = get_class_topic_performance(course)
        students_needing_help = get_students_needing_help(course)
        
        return Response({
            "success": True,
            "course": {
                "id": course.id,
                "name": course.name,
            },
            "topics": topics,
            "students_needing_help": students_needing_help,
        })
    
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsLecturer])
def topic_analytics(request, topic_id):
    """
    GET /api/topics/<topic_id>/analytics/
    
    Return detailed performance analytics for a single topic.
    Reuses: get_single_topic_performance(topic)
    
    Requirements:
    - Lecturer role only
    - Must be the course lecturer
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)
        
        # ✅ Verify lecturer owns this course
        if topic.course.lecturer != request.user:
            return Response(
                {
                    "success": False,
                    "error": "You are not the instructor for this course"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # ✅ Reuse analysis service (UNCHANGED)
        analytics = get_single_topic_performance(topic)
        
        return Response({
            "success": True,
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "course": {
                    "id": topic.course.id,
                    "name": topic.course.name,
                }
            },
            "analytics": analytics,
        })
    
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def student_topic_analytics(
    request,
    topic_id
):

    topic = get_object_or_404(
        Topic,
        id=topic_id
    )

    enrollment = Enrollment.objects.filter(
        student=request.user,
        course=topic.course
    ).first()

    if not enrollment:

        return Response(
            {
                "success": False,
                "error": "Not enrolled in this course"
            },
            status=status.HTTP_403_FORBIDDEN
        )

    analytics = get_student_topic_performance(
        request.user,
        topic
    )

    return Response({

        "success": True,

        "topic": {

            "id": topic.id,

            "name": topic.name,

            "course": {

                "id":
                    topic.course.id,

                "name":
                    topic.course.name,

            }

        },

        "analytics":
            analytics,

    })