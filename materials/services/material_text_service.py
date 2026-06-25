import os

from materials.services.pdf_service import extract_pdf_text


SUPPORTED_MATERIAL_EXTENSIONS = {
    ".pdf": "pdf",
    ".txt": "txt",
    ".md": "md",
}

SUPPORTED_MATERIAL_CONTENT_TYPES = {
    "pdf": {
        "application/pdf",
    },
    "txt": {
        "text/plain",
    },
    "md": {
        "text/markdown",
        "text/x-markdown",
        "text/plain",
    },
}


def get_supported_material_type(filename):
    extension = os.path.splitext(filename or "")[1].lower()
    return SUPPORTED_MATERIAL_EXTENSIONS.get(extension)


def is_supported_material_file(uploaded_file):
    if not uploaded_file:
        return False

    material_type = get_supported_material_type(
        uploaded_file.name
    )

    if not material_type:
        return False

    content_type = getattr(
        uploaded_file,
        "content_type",
        ""
    )

    return (
        not content_type
        or content_type in SUPPORTED_MATERIAL_CONTENT_TYPES[
            material_type
        ]
    )


def extract_material_text(file_path, material_type):
    if material_type == "pdf":
        return _sanitize_extracted_text(
            extract_pdf_text(file_path)
        )

    if material_type in {"txt", "md"}:
        return _sanitize_extracted_text(
            _read_text_file(file_path)
        )

    raise ValueError("Unsupported material file type.")


def _read_text_file(file_path):
    with open(file_path, "rb") as text_file:
        content = text_file.read()

    return content.decode("utf-8-sig", errors="replace")


def _sanitize_extracted_text(text):
    return text.replace("\x00", "")
