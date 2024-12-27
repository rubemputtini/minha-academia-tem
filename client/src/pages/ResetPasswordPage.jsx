import { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, CircularProgress } from '@mui/material';
import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import SuccessDialog from "../components/dialogs/SuccessDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/accountService";
import { errorMessages } from "../utils/constants";

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorDetails, setErrorDetails] = useState([]);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailParam = searchParams.get("email");
        const tokenParam = searchParams.get("token");

        if (emailParam && tokenParam) {
            try {
                const decodedToken = decodeURIComponent(tokenParam);
                setToken(decodedToken.trim());
                setEmail(emailParam);
            } catch (err) {
                console.error("Erro ao decodificar o token:", err.message);
                setErrorMessage("Link inválido. Por favor, solicite um novo.");
            }
        } else {
            console.error("Parâmetros de email ou token ausentes.");
            setErrorMessage("Parâmetros ausentes. Por favor, solicite um novo link.");
        }
    }, [location.search]);

    const handleSubmit = async (newPassword, confirmPassword) => {
        setLoading(true);
        setErrorMessage("");
        setErrorDetails([]);

        if (newPassword !== confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            await resetPassword({ email, token, newPassword });
            setResetSuccess(true);
        } catch (err) {
            const details = err.details ? err.details.map(detail => errorMessages[detail] || detail) : [];
            setErrorMessage(err.message);
            setErrorDetails(details);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setResetSuccess(false);
        navigate("/login");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <ResetPasswordForm
                        email={email}
                        token={token}
                        onSubmit={handleSubmit}
                        disableSubmit={loading}
                        buttonText="Redefinir Senha"
                        errorMessage={errorMessage}
                        errorDetails={errorDetails}
                    />
                )}
                {resetSuccess && (
                    <SuccessDialog
                        message={"Senha redefinida com sucesso! Agora você pode fazer login."}
                        onClose={handleDialogClose}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ResetPasswordPage;
