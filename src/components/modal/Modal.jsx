const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-md text-center">
        <p className="text-gray-800">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );

export default Modal;  
