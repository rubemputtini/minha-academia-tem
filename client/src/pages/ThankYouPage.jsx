import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import FeedbackDialog from '../components/dialogs/FeedbackDialog';

const ThankYouPage = () => {
    const navigate = useNavigate();
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

    const handleNewReport = () => {
        navigate("/equipamentos");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-gray-500 text-white">
                <div className="text-center max-w-lg mx-4 md:mx-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12">Obrigado por compartilhar quais equipamentos a sua academia TEM! 💪</h2>
                    <p className="mb-6 text-md md:text-xl font-medium">
                        Agora posso garantir que seu treino será ainda mais <b className="text-yellow-500">PERSONALIZADO</b> e vamos explorar o potencial máximo da sua academia.
                    </p>
                    <p className="mb-6 text-md md:text-xl font-light italic">
                        Se houver outros equipamentos que não foram listados aqui e você gostaria de incluir, envie um feedback!
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setShowFeedbackDialog(true)}
                            className="px-4 py-2 w-32 sm:w-auto bg-green-500 text-white rounded-xl shadow-lg transition duration-300 hover:bg-yellow-600 transform hover:scale-105"
                        >
                            FEEDBACK
                        </button>
                        <button
                            onClick={handleNewReport}
                            className="px-4 py-2 w-32 sm:w-auto bg-cyan-600 text-white rounded-xl shadow-lg transition duration-300 hover:bg-cyan-700 transform hover:scale-105"
                        >
                            NOVO
                        </button>
                    </div>
                </div>

                {showFeedbackDialog && (
                    <FeedbackDialog onClose={() => setShowFeedbackDialog(false)} />
                )}
            </div>
            <Footer />
        </>
    );
};

export default ThankYouPage;
