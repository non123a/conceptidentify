from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("materials", "0005_materialchunk_embedding"),
    ]

    operations = [
        migrations.AddField(
            model_name="material",
            name="processing_error",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="material",
            name="processing_status",
            field=models.CharField(
                choices=[
                    ("PENDING", "Pending"),
                    ("PROCESSING", "Processing"),
                    ("READY", "Ready"),
                    ("FAILED", "Failed"),
                ],
                default="PENDING",
                max_length=20,
            ),
        ),
    ]