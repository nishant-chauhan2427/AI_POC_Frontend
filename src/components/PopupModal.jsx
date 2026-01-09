export default function PopupModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl bg-white/20 p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <div className="text-left text-lg text-yellow-400">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-4  rounded-md bg-red-500 px-4 py-2 cursor-pointer font-bold text-white transition   active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
