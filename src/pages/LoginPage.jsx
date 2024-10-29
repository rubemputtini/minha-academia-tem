import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import Footer from '../components/Footer';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { token, email: userEmail, role } = await login(email, password);
            console.log('Login com sucesso:', { userEmail, role });

            // Armazena o token em localStorage ou sessionStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', userEmail);

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
