# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('lecturer', 'Lecturer'),
        ('student', 'Student'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_approved = models.BooleanField(default=True)
    google_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True
    )
