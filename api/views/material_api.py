from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from materials.models import MaterialChunk
from materials.services.chunk_service import chunk_text
from materials.services.pdf_service import extract_pdf_text
from materials.services.embedding_service import generate_embedding
from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from materials.models import Material

from materials.serializers import (
    MaterialSerializer,
)
# from courses.models import Material
from topics.models import Topic

from materials.models import Material
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_material(request):

    title = request.data.get('title')
    topic_id = request.data.get('topic_id')

    file = request.FILES.get('file')

    if not file:
        return Response({
            "error": "No file uploaded"
        }, status=400)

    try:
        topic = Topic.objects.get(id=topic_id)

    except Topic.DoesNotExist:
        return Response({
            "error": "Topic not found"
        }, status=404)

    # material = Material.objects.create(
    #     topic=topic,
    #     title=title,
    #     file=file,
    #     uploaded_by=request.user
    # )
    material = Material.objects.create(
    topic=topic,
    title=title,
    file=file,
    uploaded_by=request.user
    )

    # Extract PDF text
    try:
        extracted_text = extract_pdf_text(
            material.file.path
        )

        material.extracted_text = extracted_text
        material.save()
                # Create chunks
        chunks = chunk_text(extracted_text)

        for index, chunk in enumerate(chunks):

            # MaterialChunk.objects.create(
            #     material=material,
            #     chunk_index=index,
            #     chunk_text=chunk
            # )

            embedding = generate_embedding(chunk)

            MaterialChunk.objects.create(
                material=material,
                chunk_index=index,
                chunk_text=chunk,
                embedding=embedding
            )

    except Exception as e:
        print("PDF extraction failed:", e)

    return Response({
        "message": "Material uploaded successfully",
        "material_id": material.id,
        "title": material.title,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_materials(request, course_id):

    materials = Material.objects.filter(
        topic__course_id=course_id
    ).order_by("-uploaded_at")

    serializer = MaterialSerializer(
        materials,
        many=True
    )

    return Response({
        "success": True,
        "data": serializer.data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_materials(request, topic_id):

    materials = Material.objects.filter(
        topic_id=topic_id
    ).order_by("-uploaded_at")

    serializer = MaterialSerializer(
        materials,
        many=True
    )

    return Response({
        "success": True,
        "data": serializer.data,
    })