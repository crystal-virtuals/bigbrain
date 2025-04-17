import Toast from "./Toast";

function ToastContainer({ toasts, removeToast }) {
  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed z-500 inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {toasts.sort((a, b) => b.timestamp - a.timestamp).map((toast) => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              description={toast.description}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ToastContainer;