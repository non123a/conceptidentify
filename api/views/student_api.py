"""
Student Quiz API Endpoints

GET /api/topics/<topic_id>/quiz/
- Returns approved questions for students (assessment)

POST /api/topics/<topic_id>/submit/
- Student submits quiz answers
- Reuses handle_topic_submission from quiz_service

GET /api/topics/<topic_id>/results/
- Returns student's quiz results with scores and feedback
"""

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import models

from assessments.models import Question, StudentResponse
from assessments.serializers import (
    QuestionForStudentSerializer,
    StudentResponseSerializer,
)
from topics.models import Topic
from topics.serializers import TopicSerializer
from courses.models import Enrollment
from api.permissions import IsStudent
from services.quiz_service import evaluate_question_answer, handle_topic_submission


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def get_student_quiz(request, topic_id):
    """
    GET /api/topics/<topic_id>/quiz/
    
    Return approved questions for a topic.
    - Filters: is_approved=True only
    - Excludes: correct_answer, is_correct on choices
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)
        
        # ✅ Verify student is enrolled in the course
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
        
        answered_question_ids = StudentResponse.objects.filter(
            student=request.user,
            question__topic=topic
        ).values_list("question_id", flat=True)

        # ✅ Get approved questions only if this student has not answered them
        questions = Question.objects.filter(
            topic=topic,
            is_approved=True
        ).exclude(
            id__in=answered_question_ids
        ).order_by("id")
        
        topic_serializer = TopicSerializer(topic)
        questions_serializer = QuestionForStudentSerializer(
            questions,
            many=True
        )
        
        return Response({
            "success": True,
            "topic": topic_serializer.data,
            "questions": questions_serializer.data,
        })
    
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def submit_student_quiz(request, topic_id):
    """
    POST /api/topics/<topic_id>/submit/
    
    Student submits answers for a quiz.
    Reuses handle_topic_submission from quiz_service.
    
    Expected Input:
    {
        "answers": {
            "12": "A",           // MCQ: choice ID or text
            "13": "Civil law..." // Open: answer text
        }
    }
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)
        
        # ✅ Verify enrollment
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
        
        answered_question_ids = StudentResponse.objects.filter(
            student=request.user,
            question__topic=topic
        ).values_list("question_id", flat=True)

        # ✅ Get approved unanswered questions only
        questions = Question.objects.filter(
            topic=topic,
            is_approved=True
        ).exclude(
            id__in=answered_question_ids
        ).order_by("id")
        
        if not questions.exists():
            return Response(
                {
                    "success": False,
                    "error": "No unanswered diagnostic questions available for this topic"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ✅ Parse incoming answers
        data = request.data or {}
        answers = data.get("answers", {})
        
        if not answers:
            return Response(
                {
                    "success": False,
                    "error": "No answers provided"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ✅ Convert JSON format to quiz_service format
        # quiz_service expects: {"question_<id>": "answer"}
        post_data = {}
        for question_id, answer_text in answers.items():
            try:
                q_id = int(question_id)
                post_data[f"question_{q_id}"] = answer_text
            except (ValueError, TypeError):
                continue
        
        # ✅ Reuse handle_topic_submission from quiz_service
        results, is_retry = handle_topic_submission(
            student=request.user,
            questions=questions,
            post_data=post_data,
            persist=True
        )
        
        return Response({
            "success": True,
            "message": "Quiz submitted successfully",
            "is_retry": is_retry,
            "results": results,
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
def get_practice_questions(request, topic_id):
    """
    GET /api/topics/<topic_id>/practice/

    Return approved questions this student has already answered diagnostically.
    Practice does not affect analytics.
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)

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

        answered_question_ids = StudentResponse.objects.filter(
            student=request.user,
            question__topic=topic
        ).values_list("question_id", flat=True)

        questions = Question.objects.filter(
            topic=topic,
            is_approved=True,
            id__in=answered_question_ids
        ).order_by("id")

        return Response({
            "success": True,
            "topic": TopicSerializer(topic).data,
            "questions": QuestionForStudentSerializer(
                questions,
                many=True
            ).data,
        })

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def submit_practice_questions(request, topic_id):
    """
    POST /api/topics/<topic_id>/practice/submit/

    Evaluate already answered questions without creating/updating StudentResponse.
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)

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

        answered_question_ids = StudentResponse.objects.filter(
            student=request.user,
            question__topic=topic
        ).values_list("question_id", flat=True)

        questions = Question.objects.filter(
            topic=topic,
            is_approved=True,
            id__in=answered_question_ids
        ).order_by("id")

        if not questions.exists():
            return Response(
                {
                    "success": False,
                    "error": "No practice questions available for this topic"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data or {}
        answers = data.get("answers", {})

        if not answers:
            return Response(
                {
                    "success": False,
                    "error": "No answers provided"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        post_data = {}
        for question_id, answer_text in answers.items():
            try:
                q_id = int(question_id)
                post_data[f"question_{q_id}"] = answer_text
            except (ValueError, TypeError):
                continue

        results, _ = handle_topic_submission(
            student=request.user,
            questions=questions,
            post_data=post_data,
            persist=False
        )

        return Response({
            "success": True,
            "message": "Practice submitted successfully",
            "results": results,
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
def get_student_results(request, topic_id):
    """
    GET /api/topics/<topic_id>/results/
    
    Return student's quiz results for a topic.
    Includes: question text, answer, score, feedback
    """
    try:
        topic = get_object_or_404(Topic, id=topic_id)
        
        # ✅ Verify enrollment
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
        
        # ✅ Get student's responses for this topic's questions
        responses = StudentResponse.objects.filter(
            student=request.user,
            question__topic=topic
        ).order_by("-created_at")
        pending_count = responses.filter(
            feedback="Evaluating..."
        ).count()
        
        serializer = StudentResponseSerializer(
            responses,
            many=True
        )
        
        # ✅ Calculate summary stats
        total_responses = responses.count()
        # if total_responses > 0:
        #     avg_score = responses.aggregate(
        #         models.Avg('score')
        #     )['score__avg']
        #     total_score = responses.aggregate(
        #         models.Sum('score')
        #     )['score__sum']
        # else:
        #     avg_score = 0
        #     total_score = 0
        #new score with pending system
        graded_responses = responses.exclude(
            feedback="Evaluating..."
        )
        if graded_responses.exists():

            avg_score = graded_responses.aggregate(
                models.Avg("score")
            )["score__avg"]

            total_score = graded_responses.aggregate(
                models.Sum("score")
            )["score__sum"]

        else:

            avg_score = 0
            total_score = 0
        return Response({
            "success": True,
            "topic": TopicSerializer(topic).data,
            "total_responses": total_responses,
            "average_score": round(avg_score or 0, 2),
            "total_score": round(total_score or 0, 2),
            "pending_count": pending_count,
            "results": serializer.data,
        })
        #-----------------------
        # return Response({
        #     "success": True,
        #     "topic": TopicSerializer(topic).data,
        #     "total_responses": total_responses,
        #     "average_score": round(avg_score or 0, 2),
        #     "total_score": round(total_score or 0, 2),
        #     "results": serializer.data,
        # })
    
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def reevaluate_pending_answers(
    request,
    topic_id
):
    """
    POST /api/topics/<topic_id>/reevaluate/

    Re-evaluate all pending AI answers for
    the current student.
    """

    try:

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
                    "error":
                    "Not enrolled in this course"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        pending_responses = (
            StudentResponse.objects.filter(
                student=request.user,
                question__topic=topic,
                feedback__in=[
                    "Evaluating...",
                    "Evaluation pending"
                ]
            )
        )
        print("TOPIC:", topic.id)
        print("USER:", request.user.id)
        print("PENDING COUNT:", pending_responses.count())

        for r in pending_responses:
            print(
                "FOUND:",
                r.id,
                r.feedback
            )

        updated = 0

        for response in pending_responses:

            result = evaluate_question_answer(
                response.question,
                response.answer
            )

            if not result["ai_pending"]:

                response.score = (
                    result["stored_score"]
                )

                response.feedback = (
                    result["feedback"]
                )

                response.save()

                updated += 1

        remaining_pending = (
            StudentResponse.objects.filter(
                student=request.user,
                question__topic=topic,
                feedback__in=[
                    "Evaluating...",
                    "Evaluation pending"
                ]
            ).count()
        )

        return Response(
            {
                "success": True,
                "updated": updated,
                "remaining_pending":
                remaining_pending
            }
        )

    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )