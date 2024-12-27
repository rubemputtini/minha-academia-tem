import { useState } from 'react';
import { register } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import { errorMessages } from '../utils/constants';
import Footer from '../components/Footer';
import { Box, CircularProgress } from "@mui/material";
import { setToken } from '../services/auth';
import Header from '../components/Header';

const SignupPage = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gymName, setGymName] = useState('');
    const [gymLocation, setGymLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { token } = await register(userName, email, password, gymName, gymLocation);

            if (token) {
                setToken(token);
            }

            navigate("/equipamentos");

        } catch (error) {
            const errorMsg = error.message || 'Erro ao cadastrar, tente novamente.';
            const details = error.details ? error.details.map(detail => errorMessages[detail] || detail) : [];

            setErrorMessage(errorMsg);
            setErrorDetails(details);
        } finally {
            setLoading(false);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 30;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        setPasswordStrength(Math.min(strength, 100));
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {loading ? (
                <Box my={22} display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <SignupForm
                    title="Crie sua conta"
                    buttonText="Registrar"
                    onSubmit={handleRegister}
                    userName={userName}
                    setUserName={setUserName}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={(val) => {
                        setPassword(val);
                        calculatePasswordStrength(val);
                    }}
                    gymName={gymName}
                    setGymName={setGymName}
                    gymLocation={gymLocation}
                    setGymLocation={setGymLocation}
                    errorMessage={errorMessage}
                    errorDetails={errorDetails}
                    onLoginRedirect={handleLoginRedirect}
                    disableSubmit={loading}
                    passwordStrength={passwordStrength}
                />
            )}
            <Footer />
        </div>
    );
};

export default SignupPage;
