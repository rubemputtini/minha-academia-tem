import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import Footer from '../components/Footer';
import { setToken } from '../services/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { token, role } = await login(email, password);
            console.log('Login com sucesso:', { email, role });

            setToken(token);

            navigate("/equipamentos");
        } catch (error) {
            const errorMsg = error.response?.data || 'Erro ao fazer login, tente novamente.';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <>
            <AuthForm
                title="Login"
                buttonText="Entrar"
                onSubmit={handleLogin}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                errorMessage={errorMessage}
            />
            <Footer />
        </>
    );
};

export default LoginPage;
