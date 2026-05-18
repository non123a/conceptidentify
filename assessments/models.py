from django.db import models
from topics.models import Topic


class Question(models.Model):
    QUESTION_TYPE = (
        ('mcq', 'Multiple Choice'),
        ('open', 'Open Ended'),
    )

    CREATED_BY = (
        ('ai', 'AI'),
        ('lecturer', 'Lecturer'),
    )

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    text = models.TextField()

    question_type = models.CharField(
        max_length=10,
        choices=QUESTION_TYPE
    )

    created_by = models.CharField(
        max_length=10,
        choices=CREATED_BY
    )
    # ✅ 🔥 MOVE IT HERE
    correct_answer = models.TextField(
        max_length=255,
        null=True,
        blank=True
    )

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic.name} - {self.text[:50]}"
    

from django.conf import settings

User = settings.AUTH_USER_MODEL

# correct_answer = models.CharField(max_length=255, null=True, blank=True)
class StudentResponse(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='responses'
    )

    answer = models.TextField()

    score = models.FloatField(default=0)   # supports partial understanding
    feedback = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.question.id}"
    


class Choice(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="choices"
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text