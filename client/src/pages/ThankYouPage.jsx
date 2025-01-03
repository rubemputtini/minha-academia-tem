import { useState } from 'react';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import FeedbackDialog from '../components/dialogs/FeedbackDialog';
import SuccessDialog from '../components/dialogs/SuccessDialog';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleFeedbackSuccess = () => {
        setFeedbackSubmitted(true);
        setShowFeedbackDialog(false);
    };

    const handleSuccessDialogClose = () => {
        setFeedbackSubmitted(false);
        navigate('/conta');
    };

    return (
        <>
            <Nav />
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
                    </div>
                </div>

                {showFeedbackDialog && !feedbackSubmitted && (
                    <FeedbackDialog onClose={() => setShowFeedbackDialog(false)} onSubmit={handleFeedbackSuccess} />
                )}

                {feedbackSubmitted &&
                    <SuccessDialog
                        message={"Feedback enviado com sucesso!"}
                        onClose={handleSuccessDialogClose} />}
            </div>
            <Footer />
        </>
    );
};

export default ThankYouPage;
