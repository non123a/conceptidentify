"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        aria-modal="true"
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-semibold ${
              danger
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            !
          </div>
        </div>

        <div className="text-center">
          <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>

          <p
            id="confirm-dialog-description"
            className="mt-3 text-sm leading-6 text-gray-600"
          >
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="ci-button-secondary min-w-[120px]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`min-w-[120px] ${
              danger
                ? "ci-button-danger"
                : "ci-button-primary"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
