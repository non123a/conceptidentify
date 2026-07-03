type ToastProps = {
  message: string;
  type: "success" | "error";
};

export default function Toast({
  message,
  type,
}: ToastProps) {

  return (
    <div
      className={`fixed top-20 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition-all
      ${
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-rose-50 border-rose-200 text-rose-700"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}