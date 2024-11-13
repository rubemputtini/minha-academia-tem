import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import { errorMessages } from '../utils/constants';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gymName, setGymName] = useState('');
    const [gymLocation, setGymLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { token } = await register(email, password, gymName, gymLocation);

            if (token) {
                navigate("/equipamentos");
            }

        } catch (error) {
            const errorMsg = error.message || 'Erro ao cadastrar, tente novamente.';
            const details = error.details ? error.details.map(detail => errorMessages[detail] || detail) : [];

            setErrorMessage(errorMsg);
            setErrorDetails(details);
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
                errorDetails={errorDetails}
                onLoginRedirect={handleLoginRedirect}
            />
        </>
    );
};

export default SignupPage;
