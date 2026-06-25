import tempfile
from types import SimpleNamespace
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.db.models import Value
from rest_framework.test import APITestCase

from courses.models import Course
from materials.models import Material, MaterialChunk
from materials.services.material_text_service import (
    extract_material_text,
    get_supported_material_type,
    is_supported_material_file,
)
from topics.models import Topic
from users.models import User


class FakeEmbedding:
    def tolist(self):
        return [0.1] * 384


class MaterialTextServiceTests(TestCase):

    def test_supported_material_types_are_detected_by_extension(self):
        self.assertEqual(
            get_supported_material_type("lecture.pdf"),
            "pdf"
        )
        self.assertEqual(
            get_supported_material_type("notes.txt"),
            "txt"
        )
        self.assertEqual(
            get_supported_material_type("outline.md"),
            "md"
        )
        self.assertIsNone(
            get_supported_material_type("slides.docx")
        )

    def test_supported_material_file_requires_valid_extension_and_mime(self):
        self.assertTrue(
            is_supported_material_file(
                SimpleUploadedFile(
                    "lecture.pdf",
                    b"content",
                    content_type="application/pdf"
                )
            )
        )
        self.assertTrue(
            is_supported_material_file(
                SimpleUploadedFile(
                    "outline.md",
                    b"# Heading",
                    content_type="text/markdown"
                )
            )
        )
        self.assertFalse(
            is_supported_material_file(
                SimpleUploadedFile(
                    "lecture.pdf",
                    b"content",
                    content_type="text/plain"
                )
            )
        )

    @patch(
        "materials.services.material_text_service.extract_pdf_text"
    )
    def test_pdf_extraction_uses_existing_pdf_pipeline(
        self,
        mock_extract_pdf_text
    ):
        mock_extract_pdf_text.return_value = "PDF\x00 text\n✓"

        text = extract_material_text(
            "/tmp/lecture.pdf",
            "pdf"
        )

        self.assertEqual(text, "PDF text\n✓")
        mock_extract_pdf_text.assert_called_once_with(
            "/tmp/lecture.pdf"
        )

    def test_txt_extraction_reads_plain_text(self):
        with tempfile.NamedTemporaryFile(
            suffix=".txt"
        ) as text_file:
            text_file.write(
                "Plain\x00 text learning material\n✓".encode("utf-8")
            )
            text_file.flush()

            self.assertEqual(
                extract_material_text(
                    text_file.name,
                    "txt"
                ),
                "Plain text learning material\n✓"
            )

    def test_md_extraction_preserves_markdown_structure(self):
        markdown = "# Heading\n\n## Subheading\x00\n\nUseful details. ✓"

        with tempfile.NamedTemporaryFile(
            suffix=".md"
        ) as markdown_file:
            markdown_file.write(
                markdown.encode("utf-8")
            )
            markdown_file.flush()

            self.assertEqual(
                extract_material_text(
                    markdown_file.name,
                    "md"
                ),
                "# Heading\n\n## Subheading\n\nUseful details. ✓"
            )


@override_settings(
    MEDIA_ROOT=tempfile.mkdtemp()
)
class MaterialUploadPipelineTests(APITestCase):

    def setUp(self):
        self.lecturer = User.objects.create_user(
            username="lecturer",
            password="password",
            role="lecturer"
        )
        self.course = Course.objects.create(
            name="Course",
            description="Description",
            lecturer=self.lecturer
        )
        self.topic = Topic.objects.create(
            course=self.course,
            name="Topic",
            description="Description"
        )
        self.client.force_authenticate(
            user=self.lecturer
        )

    def upload_material_file(
        self,
        filename,
        content_type,
        content=b"material content"
    ):
        upload = SimpleUploadedFile(
            filename,
            content,
            content_type=content_type
        )

        return self.client.post(
            "/api/materials/upload/",
            {
                "title": filename,
                "topic_id": self.topic.id,
                "file": upload,
            },
            format="multipart"
        )

    @patch(
        "api.views.material_api.generate_embedding"
    )
    @patch(
        "api.views.material_api.chunk_text"
    )
    @patch(
        "api.views.material_api.extract_material_text"
    )
    def test_upload_pdf_txt_and_md_use_same_chunk_embedding_pipeline(
        self,
        mock_extract_material_text,
        mock_chunk_text,
        mock_generate_embedding
    ):
        mock_extract_material_text.return_value = (
            "Extracted material text with enough words to be chunked."
        )
        mock_chunk_text.return_value = [
            "First reusable chunk",
            "Second reusable chunk",
        ]
        mock_generate_embedding.return_value = [0.1] * 384

        files = [
            ("lecture.pdf", "application/pdf", "pdf"),
            ("notes.txt", "text/plain", "txt"),
            ("outline.md", "text/markdown", "md"),
        ]

        for filename, content_type, material_type in files:
            with self.subTest(filename=filename):
                response = self.upload_material_file(
                    filename,
                    content_type
                )

                self.assertEqual(
                    response.status_code,
                    200
                )
                material = Material.objects.get(
                    title=filename
                )
                self.assertEqual(
                    material.extracted_text,
                    mock_extract_material_text.return_value
                )
                self.assertEqual(
                    material.chunks.count(),
                    2
                )
                mock_extract_material_text.assert_any_call(
                    material.file.path,
                    material_type
                )

        self.assertEqual(
            mock_chunk_text.call_count,
            3
        )
        self.assertEqual(
            mock_generate_embedding.call_count,
            6
        )

    def test_upload_rejects_unsupported_file_types(self):
        response = self.upload_material_file(
            "lecture.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

        self.assertEqual(
            response.status_code,
            400
        )
        self.assertEqual(
            Material.objects.count(),
            0
        )

    def test_upload_rejects_supported_extension_with_wrong_mime_type(self):
        response = self.upload_material_file(
            "lecture.pdf",
            "text/plain"
        )

        self.assertEqual(
            response.status_code,
            400
        )
        self.assertEqual(
            Material.objects.count(),
            0
        )

    @patch(
        "api.views.material_api.generate_embedding"
    )
    @patch(
        "api.views.material_api.chunk_text"
    )
    @patch(
        "api.views.material_api.extract_material_text"
    )
    def test_upload_generates_and_stores_embeddings(
        self,
        mock_extract_material_text,
        mock_chunk_text,
        mock_generate_embedding
    ):
        mock_extract_material_text.return_value = "Extracted text"
        mock_chunk_text.return_value = ["Chunk text"]
        mock_generate_embedding.return_value = [0.25] * 384

        response = self.upload_material_file(
            "notes.txt",
            "text/plain"
        )

        self.assertEqual(
            response.status_code,
            200
        )
        chunk = MaterialChunk.objects.get()
        self.assertEqual(
            chunk.chunk_text,
            "Chunk text"
        )
        self.assertEqual(
            list(chunk.embedding),
            [0.25] * 384
        )


class RetrievalAndQuestionGenerationTests(TestCase):

    def setUp(self):
        self.lecturer = User.objects.create_user(
            username="retrieval-lecturer",
            password="password",
            role="lecturer"
        )
        self.course = Course.objects.create(
            name="Course",
            description="Description",
            lecturer=self.lecturer
        )
        self.topic = Topic.objects.create(
            course=self.course,
            name="Topic",
            description="Description"
        )

    @patch(
        "materials.services.retrieval_service.CosineDistance",
        return_value=Value(0.1)
    )
    @patch(
        "materials.services.retrieval_service.model.encode",
        return_value=FakeEmbedding()
    )
    def test_semantic_search_retrieves_chunks_for_each_supported_format(
        self,
        mock_encode,
        mock_cosine_distance
    ):
        from materials.services.retrieval_service import search_chunks

        for extension in ["pdf", "txt", "md"]:
            material = Material.objects.create(
                topic=self.topic,
                title=f"Material {extension}",
                file=f"materials/source.{extension}",
                extracted_text=f"{extension} extracted text",
                uploaded_by=self.lecturer
            )
            MaterialChunk.objects.create(
                material=material,
                chunk_index=0,
                chunk_text=f"{extension} chunk text",
                embedding=[0.1] * 384
            )

        results = list(
            search_chunks(
                "topic",
                self.topic.id,
                limit=3
            )
        )

        self.assertEqual(
            len(results),
            3
        )
        self.assertEqual(
            mock_encode.call_count,
            1
        )
        self.assertTrue(
            all(
                result.material.topic_id == self.topic.id
                for result in results
            )
        )

    @patch(
        "services.ai.question_generator.client.models.generate_content"
    )
    @patch(
        "services.ai.question_generator.search_chunks"
    )
    def test_ai_question_generation_uses_retrieved_chunks_for_each_format(
        self,
        mock_search_chunks,
        mock_generate_content
    ):
        from services.ai.question_generator import generate_questions

        mock_generate_content.return_value = SimpleNamespace(
            text=(
                '[{"question":"What is the idea?",'
                '"type":"mcq",'
                '"choices":["A","B","C","D"],'
                '"correct_answer":"A"}]'
            )
        )

        for extension in ["pdf", "txt", "md"]:
            with self.subTest(extension=extension):
                mock_search_chunks.return_value = [
                    SimpleNamespace(
                        chunk_text=f"{extension} retrieved chunk"
                    )
                ]

                questions = generate_questions(
                    self.topic.id,
                    self.topic.name,
                    f"{extension} extracted text",
                    num_questions=1,
                    question_type="mcq"
                )

                self.assertEqual(
                    questions[0]["question"],
                    "What is the idea?"
                )
                prompt = (
                    mock_generate_content.call_args
                    .kwargs["contents"]
                )
                self.assertIn(
                    f"{extension} retrieved chunk",
                    prompt
                )
