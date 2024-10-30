import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import Footer from '../components/Footer';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate("/login");

        } catch (error) {
            const errorMsg = error.response?.data || 'Erro ao cadastrar, tente novamente.';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <>
            <AuthForm
                title="Cadastro"
                buttonText="Registrar"
                onSubmit={handleRegister}
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

export default SignupPage;
