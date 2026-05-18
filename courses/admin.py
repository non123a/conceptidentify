from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'lecturer', 'join_code', 'created_at')
    readonly_fields = ('join_code',)

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'lecturer')
        }),
        ('Join Info', {
            'fields': ('join_code',)
        }),
    )

from .models import Enrollment

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'joined_at')