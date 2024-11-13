const ConfirmationDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center mx-4 sm:mx-8">
            <p className="text-lg font-semibold mb-4">Deseja salvar suas escolhas e enviar o relatório?</p>
            <div className="flex justify-center gap-4">
                <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl w-full sm:w-auto" onClick={onConfirm}>
                    CONFIRMAR
                </button>
                <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-xl w-full sm:w-auto" onClick={onCancel}>
                    CANCELAR
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmationDialog;