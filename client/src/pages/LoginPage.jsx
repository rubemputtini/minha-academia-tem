import { useState } from 'react';
import { login } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { setToken } from '../services/auth';
import { Box, CircularProgress } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { token, role } = await login(email, password);
            console.log('Login com sucesso:', { email, role });

            setToken(token);

            navigate("/equipamentos");
        } catch (error) {
            const errorMsg = error.response?.data || 'Erro ao fazer login, tente novamente.';
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {loading ? (
                <Box my={22} display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <AuthForm
                    title="Login"
                    buttonText="Entrar"
                    onSubmit={handleLogin}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    errorMessage={errorMessage}
                    disableSubmit={loading}
                    onForgotPassword={handleForgotPassword}
                />
            )}
            <Footer />
        </div>
    );
};

export default LoginPage;
