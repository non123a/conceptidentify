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
      className={`fixed top-20 right-6 z-50 rounded-xl px-5 py-4 shadow-lg border transition-all
      ${
        type === "success"
          ? "bg-green-50 border-green-300 text-green-700"
          : "bg-red-50 border-red-300 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}