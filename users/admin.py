from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    # list_display = ('username', 'email', 'role', 'is_approved', 'is_staff')
    list_display = (
    'username',
    'first_name',
    'last_name',
    'email',
    'role',
    'is_approved',
    'is_staff',
    )
    list_filter = ('role', 'is_approved', 'is_staff')

    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role', 'is_approved')}),
    )


admin.site.register(User, CustomUserAdmin)