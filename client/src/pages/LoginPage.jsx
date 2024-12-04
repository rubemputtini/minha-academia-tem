import { useState } from 'react';
import { login } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import Footer from '../components/Footer';
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

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-center py-6">
                <h1 className="text-4xl font-bold text-center text-gray-300">
                    <span className="inline-flex items-center space-x-2">
                        <span>Minha Academia <span className="text-yellow-500">TEM?</span></span>
                    </span>
                </h1>
            </header>
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
                />
            )}
            <Footer />
        </div>
    );
};

export default LoginPage;
