import { useState } from 'react';
import { register } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import { errorMessages } from '../utils/constants';
import Footer from '../components/Footer';

const SignupPage = () => {
    const [userName, setUserName] = useState('');
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
            const { token } = await register(userName, email, password, gymName, gymLocation);

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
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-center py-6">
                <h1 className="text-4xl font-bold text-center text-gray-300">
                    <span className="inline-flex items-center space-x-2">
                        <span>Minha Academia <span className="text-yellow-500">TEM?</span></span>
                    </span>
                </h1>
            </header>
            <SignupForm
                title="Crie sua conta"
                buttonText="Registrar"
                onSubmit={handleRegister}
                userName={userName}
                setUserName={setUserName}
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
            <Footer />
        </div>
    );
};

export default SignupPage;
