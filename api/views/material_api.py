from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, close_old_connections
from threading import Thread
from materials.models import MaterialChunk
from materials.services.chunk_service import chunk_text
from materials.services.embedding_service import generate_embedding
from materials.services.material_text_service import (
    extract_material_text,
    get_supported_material_type,
    is_supported_material_file,
)
from api.permissions import IsLecturer, is_topic_owner
from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from materials.models import Material

from materials.serializers import (
    MaterialSerializer,
)

from courses.models import (
    Course,
    Enrollment,
)
# from courses.models import Material
from topics.models import Topic

from materials.models import Material, MaterialChunk, MaterialProcessingStatus


def _claim_material_for_processing(material_id):

    with transaction.atomic():

        material = Material.objects.select_for_update().get(id=material_id)

        if material.processing_status == MaterialProcessingStatus.PROCESSING:

            return None

        if material.processing_status not in {
            MaterialProcessingStatus.PENDING,
            MaterialProcessingStatus.FAILED,
        }:

            return None

        MaterialChunk.objects.filter(material=material).delete()

        material.extracted_text = None
        material.processing_status = MaterialProcessingStatus.PROCESSING
        material.processing_error = ""
        material.save(
            update_fields=[
                "extracted_text",
                "processing_status",
                "processing_error",
            ]
        )

        return material


def _start_material_processing(material_id, file_path, material_type):

    material = _claim_material_for_processing(material_id)

    if not material:

        return False

    try:

        thread = Thread(
            target=_process_material_pipeline,
            args=(material_id, file_path, material_type),
            daemon=True,
        )
        thread.start()

        return True

    except Exception as e:

        with transaction.atomic():

            material = Material.objects.select_for_update().get(id=material_id)
            material.processing_status = MaterialProcessingStatus.FAILED
            material.processing_error = str(e)
            material.save(update_fields=["processing_status", "processing_error"])

        return False


def _schedule_material_processing(material_id, file_path, material_type):

    transaction.on_commit(
        lambda: _start_material_processing(
            material_id,
            file_path,
            material_type,
        )
    )


def _process_material_pipeline(material_id, file_path, material_type):

    close_old_connections()

    try:

        material = Material.objects.get(id=material_id)

        extracted_text = extract_material_text(
            file_path,
            material_type,
        )

        material.extracted_text = extracted_text
        material.save(update_fields=["extracted_text"])

        chunks = chunk_text(extracted_text)

        for index, chunk in enumerate(chunks):

            embedding = generate_embedding(chunk)

            MaterialChunk.objects.create(
                material=material,
                chunk_index=index,
                chunk_text=chunk,
                embedding=embedding,
            )

        material.processing_status = MaterialProcessingStatus.READY
        material.processing_error = ""
        material.save(update_fields=["processing_status", "processing_error"])

    except Exception as e:

        try:

            material = Material.objects.get(id=material_id)
            MaterialChunk.objects.filter(material=material).delete()
            material.extracted_text = None
            material.processing_status = MaterialProcessingStatus.FAILED
            material.processing_error = str(e)
            material.save(
                update_fields=[
                    "extracted_text",
                    "processing_status",
                    "processing_error",
                ]
            )

        except Exception:

            print("Material extraction failed:", e)

    finally:

        close_old_connections()

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsLecturer])
def upload_material(request):

    title = request.data.get('title')
    topic_id = request.data.get('topic_id')

    file = request.FILES.get('file')

    if not file:
        return Response({
            "error": "No file uploaded"
        }, status=400)
    if not file:
        return Response({
            "error": "No file uploaded"
        }, status=400)

    material_type = get_supported_material_type(
        file.name
    )

    if not is_supported_material_file(file):
        return Response(
            {
                "error":
                "Only PDF, TXT, and Markdown files are allowed."
            },
            status=400
        )

    # Size validation (20MB)
    if file.size > 20 * 1024 * 1024:
        return Response(
            {
                "error":
                "File size must be less than 20MB."
            },
            status=400
        )
    try:
        topic = Topic.objects.get(id=topic_id)

    except Topic.DoesNotExist:
        return Response({
            "error": "Topic not found"
        }, status=404)

    if not is_topic_owner(request.user, topic):
        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=403)

    with transaction.atomic():

        material = Material.objects.create(
            topic=topic,
            title=title,
            file=file,
            uploaded_by=request.user,
            processing_status=MaterialProcessingStatus.PENDING,
            processing_error="",
        )

        material_id = material.id
        file_path = material.file.path

        _schedule_material_processing(
            material_id,
            file_path,
            material_type,
        )

    return Response({
        "message": "Material uploaded successfully",
        "material_id": material.id,
        "title": material.title,
        "processing_status": MaterialProcessingStatus.PENDING,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def material_status(request, material_id):

    material = get_object_or_404(Material, id=material_id)

    if request.user.role == "lecturer":

        if material.uploaded_by != request.user and not is_topic_owner(request.user, material.topic):

            return Response(
                {
                    "success": False,
                    "message": "Access denied.",
                },
                status=403,
            )

    return Response(
        {
            "success": True,
            "data": {
                "id": material.id,
                "title": material.title,
                "processing_status": material.processing_status,
                "processing_error": material.processing_error,
                "uploaded_at": material.uploaded_at,
            },
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsLecturer])
def retry_material_processing(request, material_id):

    material = get_object_or_404(Material, id=material_id)

    if not is_topic_owner(request.user, material.topic):

        return Response(
            {
                "success": False,
                "error": "You are not the instructor for this course",
            },
            status=403,
        )

    started = _start_material_processing(
        material.id,
        material.file.path,
        get_supported_material_type(material.file.name),
    )

    if not started:

        current_material = Material.objects.get(id=material.id)

        if current_material.processing_status == MaterialProcessingStatus.PROCESSING:

            return Response(
                {
                    "success": True,
                    "message": "Material is already processing.",
                    "data": {
                        "id": current_material.id,
                        "processing_status": current_material.processing_status,
                    },
                }
            )

        return Response(
            {
                "success": False,
                "message": "Only failed materials can be retried.",
            },
            status=400,
        )

    return Response(
        {
            "success": True,
            "message": "Material processing restarted.",
            "data": {
                "id": material.id,
                "processing_status": MaterialProcessingStatus.PROCESSING,
            },
        }
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_materials(request, course_id):

    try:

        course = Course.objects.get(
            id=course_id
        )

    except Course.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Course not found",
            },
            status=404
        )

    # Lecturer ownership check
    if request.user.role == "lecturer":

        if course.lecturer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Access denied."
                },
                status=403
            )

    # Student enrollment check
    else:

        is_enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not is_enrolled:

            return Response(
                {
                    "success": False,
                    "message":
                    "You are not enrolled in this course."
                },
                status=403
            )

    materials = Material.objects.filter(
        topic__course=course
    ).order_by("-uploaded_at")

    serializer = MaterialSerializer(
        materials,
        many=True
    )

    return Response(
        {
            "success": True,
            "data": serializer.data,
        }
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_materials(request, topic_id):

    try:

        topic = Topic.objects.get(
            id=topic_id
        )

    except Topic.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Topic not found",
            },
            status=404
        )

    course = topic.course

    # Lecturer ownership check
    if request.user.role == "lecturer":

        if course.lecturer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Access denied."
                },
                status=403
            )

    # Student enrollment check
    else:

        is_enrolled = Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists()

        if not is_enrolled:

            return Response(
                {
                    "success": False,
                    "message":
                    "You are not enrolled in this course."
                },
                status=403
            )

    materials = Material.objects.filter(
        topic=topic
    ).order_by("-uploaded_at")

    serializer = MaterialSerializer(
        materials,
        many=True
    )

    return Response(
        {
            "success": True,
            "data": serializer.data,
        }
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsLecturer])
def delete_material(request, material_id):

    material = get_object_or_404(
        Material,
        id=material_id
    )

    if material.topic.course.lecturer != request.user:

        return Response(
            {
                "success": False,
                "message": "Access denied."
            },
            status=403
        )

    # delete physical file
    if material.file:

        material.file.delete(
            save=False
        )

    material.delete()

    return Response(
        {
            "success": True,
            "message":
            "Material deleted successfully"
        }
    )
