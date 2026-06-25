from django.db import models
from topics.models import Topic
from users.models import User
from pgvector.django import VectorField


class MaterialProcessingStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PROCESSING = "PROCESSING", "Processing"
    READY = "READY", "Ready"
    FAILED = "FAILED", "Failed"


class Material(models.Model):
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='materials'
    )

    title = models.CharField(max_length=255)

    file = models.FileField(
        upload_to='materials/'
    )
    extracted_text = models.TextField(
            blank=True,
            null=True
            )
    processing_status = models.CharField(
        max_length=20,
        choices=MaterialProcessingStatus.choices,
        default=MaterialProcessingStatus.PENDING,
    )
    processing_error = models.TextField(
        blank=True,
        default="",
    )
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"{self.topic.name} - {self.title}"
    
class MaterialChunk(models.Model):

    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='chunks'
    )

    chunk_index = models.IntegerField()

    chunk_text = models.TextField()
    embedding = VectorField(
        dimensions=384,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    
    def __str__(self):
        return f"{self.material.title} - Chunk {self.chunk_index}"