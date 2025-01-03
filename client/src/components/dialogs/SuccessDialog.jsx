const SuccessDialog = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center mx-4 sm:mx-8">
            <p className="text-lg font-semibold mb-4 text-black">{message}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl w-full sm:w-auto" onClick={onClose}>
                FECHAR
            </button>
        </div>
    </div>
);

export default SuccessDialog;