export const MATERIAL_FILE_ACCEPT =
  ".pdf,.txt,.md";

export const MATERIAL_FILE_HELP_TEXT =
  "Supported file types: PDF, TXT, or Markdown (.md). Maximum size: 20MB.";

export const MATERIAL_FILE_ERROR =
  "Only PDF, TXT, and Markdown files are allowed.";

const SUPPORTED_MATERIAL_EXTENSIONS = [
  ".pdf",
  ".txt",
  ".md",
];

const SUPPORTED_MATERIAL_MIME_TYPES: Record<
  string,
  string[]
> = {
  ".pdf": ["application/pdf"],
  ".txt": ["text/plain"],
  ".md": [
    "text/markdown",
    "text/x-markdown",
    "text/plain",
  ],
};

function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

export function validateMaterialFile(file: File) {
  const extension = getFileExtension(file.name);

  if (
    !SUPPORTED_MATERIAL_EXTENSIONS.includes(extension)
  ) {
    return MATERIAL_FILE_ERROR;
  }

  const validMimeTypes =
    SUPPORTED_MATERIAL_MIME_TYPES[extension];

  if (
    file.type &&
    !validMimeTypes.includes(file.type)
  ) {
    return MATERIAL_FILE_ERROR;
  }

  if (file.size > 20 * 1024 * 1024) {
    return "File size must be less than 20MB.";
  }

  return null;
}
