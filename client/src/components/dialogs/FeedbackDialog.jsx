import { useState } from 'react';
import { sendFeedback } from '../../services/reportService';

const FeedbackDialog = ({ onClose }) => {
    const [feedback, setFeedback] = useState('');

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        await sendFeedback(feedback);

        console.log("Feedback enviado:", feedback);
        setFeedback('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form
                onSubmit={handleFeedbackSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center mx-4 sm:mx-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Quais outros equipamentos a sua academia TEM?</h3>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="6"
                    placeholder="Ex: Leg Press 45 Máquina Unilateral..."
                    required
                    className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <div className="flex justify-center gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-xl transition duration-300 hover:bg-green-600 transform hover:scale-105"
                    >
                        Enviar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded-xl transition duration-300 hover:bg-gray-600 transform hover:scale-105"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackDialog;
