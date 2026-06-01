from rest_framework.permissions import BasePermission

class IsLecturer(BasePermission):
    """Allows access only to authenticated lecturers."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'lecturer')

class IsStudent(BasePermission):
    """Allows access only to authenticated students."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'student')


def is_course_owner(user, course):
    return bool(
        user
        and user.is_authenticated
        and user.role == "lecturer"
        and course.lecturer_id == user.id
    )


def is_topic_owner(user, topic):
    return is_course_owner(user, topic.course)


def is_question_owner(user, question):
    return is_topic_owner(user, question.topic)
