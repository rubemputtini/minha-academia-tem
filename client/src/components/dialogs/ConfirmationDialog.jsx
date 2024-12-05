import { CircularProgress } from "@mui/material";

const ConfirmationDialog = ({ message, onConfirm, onCancel, isLoading }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center mx-4 sm:mx-8">
            <p className="text-lg font-semibold mb-4">{message}</p>
            <div className="flex justify-center gap-4">
                <button
                    className={`mt-4 px-4 py-2 text-white rounded-xl w-full sm:w-auto ${isLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                        }`}
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "CONFIRMAR"
                    )}
                </button>
                <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-xl w-full sm:w-auto hover:bg-gray-600"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    CANCELAR
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmationDialog;