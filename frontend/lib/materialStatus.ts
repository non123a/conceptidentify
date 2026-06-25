export type MaterialStatus =
  | "PENDING"
  | "PROCESSING"
  | "READY"
  | "FAILED";

export const MATERIAL_PROCESSING_MESSAGES: Record<MaterialStatus, string> = {
  PENDING: "Waiting to start processing...",
  PROCESSING: "Processing material. This may take several minutes for large files.",
  READY: "Material is ready for AI question generation.",
  FAILED: "Material processing failed.",
};

export const MATERIAL_STILL_PROCESSING_MESSAGE =
  "Material is still being processed. Please wait until processing is complete.";

export const isMaterialProcessing = (status?: MaterialStatus) =>
  status === "PENDING" || status === "PROCESSING";

export const isMaterialTerminal = (status?: MaterialStatus) =>
  status === "READY" || status === "FAILED";
