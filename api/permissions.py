from rest_framework.permissions import BasePermission

class IsLecturer(BasePermission):
    """Allows access only to authenticated lecturers."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'lecturer')

class IsStudent(BasePermission):
    """Allows access only to authenticated students."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'student')