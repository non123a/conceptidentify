import time
from threading import Thread
import traceback

from django.db import close_old_connections, transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.permissions import IsLecturer, is_topic_owner
from courses.models import Course, Enrollment
from materials.models import (
    Material,
    MaterialChunk,
    MaterialProcessingStatus,
)
from materials.serializers import MaterialSerializer
from materials.services.chunk_service import chunk_text
from materials.services.embedding_service import generate_embeddings
from materials.services.material_text_service import (
    extract_material_text,
    get_supported_material_type,
    is_supported_material_file,
)
from topics.models import Topic

UPLOAD_TIMING_LOG_PATH = "/tmp/upload_timing.log"


def _append_upload_timing_log(label, started_at, prefix="UPLOAD TIMING"):

    elapsed_ms = (time.perf_counter() - started_at) * 1000

    with open(UPLOAD_TIMING_LOG_PATH, "a", encoding="utf-8") as log_file:
        log_file.write(f"[{prefix}] {label}: {elapsed_ms:.1f} ms\n")


def _log_elapsed(label, started_at, prefix="UPLOAD TIMING"):

    _append_upload_timing_log(label, started_at, prefix)


def _log_elapsed_s(label, started_at, prefix="BACKGROUND TIMING"):

    elapsed_s = time.perf_counter() - started_at

    with open(UPLOAD_TIMING_LOG_PATH, "a", encoding="utf-8") as log_file:
        log_file.write(f"[{prefix}] {label}: {elapsed_s:.3f} s\n")


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


def _start_material_processing(material_id, file_path, material_type, started_at=None):

    if started_at is not None:

        _log_elapsed("_start_material_processing called", started_at)

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

        if started_at is not None:

            _log_elapsed("Background processing thread started", started_at)

        return True

    except Exception as e:

        with transaction.atomic():

            material = Material.objects.select_for_update().get(id=material_id)
            material.processing_status = MaterialProcessingStatus.FAILED
            material.processing_error = str(e)
            material.save(update_fields=["processing_status", "processing_error"])

        return False


def _schedule_material_processing(material_id, file_path, material_type, started_at=None):

    transaction.on_commit(
        lambda: _start_material_processing(
            material_id,
            file_path,
            material_type,
            started_at,
        )
    )


def _process_material_pipeline(material_id, file_path, material_type):

    background_started_at = time.perf_counter()
    _log_elapsed_s("Background thread started", background_started_at)

    close_old_connections()

    try:

        material = Material.objects.get(id=material_id)

        _log_elapsed_s("Material lookup", background_started_at)

        extraction_started_at = time.perf_counter()
        extracted_text = extract_material_text(
            file_path,
            material_type,
        )
        _log_elapsed_s("Text extraction", background_started_at)

        chunk_started_at = time.perf_counter()
        material.extracted_text = extracted_text
        material.save(update_fields=["extracted_text"])

        chunks = chunk_text(extracted_text)
        _log_elapsed_s("Chunk generation", background_started_at)

        embedding_started_at = time.perf_counter()
        embeddings = generate_embeddings(chunks)
        for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            MaterialChunk.objects.create(
                material=material,
                chunk_index=index,
                chunk_text=chunk,
                embedding=embedding,
            )
        # for index, chunk in enumerate(chunks):

        #     embedding = generate_embedding(chunk)

        #     MaterialChunk.objects.create(
        #         material=material,
        #         chunk_index=index,
        #         chunk_text=chunk,
        #         embedding=embedding,
        #     )
        _log_elapsed_s("Embedding generation and database inserts", background_started_at)

        status_started_at = time.perf_counter()
        material.processing_status = MaterialProcessingStatus.READY
        material.processing_error = ""
        material.save(update_fields=["processing_status", "processing_error"])
        _log_elapsed_s("Status update to READY", background_started_at)

        _log_elapsed_s("Background processing completed", background_started_at)

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

    request_started_at = time.perf_counter()
    _log_elapsed("HTTP request received", request_started_at)

    request_data_started_at = time.perf_counter()
    data = request.data
    _log_elapsed("Reading request.data", request_started_at)

    title = data.get('title')
    topic_id = data.get('topic_id')

    request_files_started_at = time.perf_counter()
    file = request.FILES.get('file')
    _log_elapsed("Reading request.FILES", request_started_at)

    _log_elapsed("Request body/file upload completed", request_started_at)

    if not file:
        return Response({
            "error": "No file uploaded"
        }, status=400)

    material_type = get_supported_material_type(
        file.name
    )

    file_validation_started_at = time.perf_counter()
    if not is_supported_material_file(file):
        _log_elapsed("File validation", request_started_at)
        return Response(
            {
                "error":
                "Only PDF, TXT, and Markdown files are allowed."
            },
            status=400
        )

    _log_elapsed("File validation", request_started_at)

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

    _log_elapsed("Topic lookup", request_started_at)

    if not is_topic_owner(request.user, topic):
        return Response({
            "success": False,
            "error": "You are not the instructor for this course",
        }, status=403)
    _log_elapsed("Permission check", request_started_at)

    transaction_started_at = time.perf_counter()
    with transaction.atomic():

        material = Material.objects.create(
            topic=topic,
            title=title,
            file=file,
            uploaded_by=request.user,
            processing_status=MaterialProcessingStatus.PENDING,
            processing_error="",
        )
        _log_elapsed("Material.objects.create(...)", request_started_at)

        material_id = material.id
        file_path = material.file.path
        _log_elapsed("material.file.path", request_started_at)

        _schedule_material_processing(
            material_id,
            file_path,
            material_type,
            request_started_at,
        )
        _log_elapsed("_schedule_material_processing(...)", request_started_at)

    _log_elapsed("Exit transaction.atomic()", request_started_at)

    _log_elapsed("Immediately before return Response(...)", request_started_at)

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

    except Topic.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Topic not found",
            },
            status=404
        )

    except Exception as e:

        traceback.print_exc()

        return Response(
            {
                "success": False,
                "error": str(e),
                "exception": repr(e),
                "traceback": traceback.format_exc(),
            },
            status=500,
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
