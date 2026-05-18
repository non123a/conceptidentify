from django.db import models
from topics.models import Topic


class Material(models.Model):
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='materials'
    )

    title = models.CharField(max_length=255)
    content = models.TextField()  # for now, simple text

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic.name} - {self.title}"