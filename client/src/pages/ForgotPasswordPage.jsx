import { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, CircularProgress } from '@mui/material';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import SuccessDialog from "../components/dialogs/SuccessDialog";
import { forgotPassword } from "../services/accountService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword(email);
            setEmailSent(true);
            setErrorMessage("");
            setEmail("");
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setEmailSent(false);
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <ForgotPasswordForm
                        email={email}
                        setEmail={setEmail}
                        onSubmit={handleSubmit}
                        errorMessage={errorMessage}
                        disableSubmit={loading}
                        buttonText="Enviar Link"
                    />
                )}
                {emailSent &&
                    <SuccessDialog
                        message={"E-mail enviado com sucesso! Verifique sua caixa de entrada."}
                        onClose={handleDialogClose} />}
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPasswordPage;
