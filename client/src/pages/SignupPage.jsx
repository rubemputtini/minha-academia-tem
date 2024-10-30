import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gymName, setGymName] = useState('');
    const [gymLocation, setGymLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(email, password, gymName, gymLocation);
            navigate("/equipamentos");

        } catch (error) {
            const errorMsg = error.response?.data || 'Erro ao cadastrar, tente novamente.';
            setErrorMessage(errorMsg);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <>
            <SignupForm
                title="Cadastro"
                buttonText="Registrar"
                onSubmit={handleRegister}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                gymName={gymName}
                setGymName={setGymName}
                gymLocation={gymLocation}
                setGymLocation={setGymLocation}
                errorMessage={errorMessage}
                onLoginRedirect={handleLoginRedirect}
            />
        </>
    );
};

export default SignupPage;
