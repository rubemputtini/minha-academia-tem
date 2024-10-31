import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getToken } from '../services/auth';
import { fetchUserDetails } from '../services/userService';

const AccountPage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const token = getToken();

            try {
                const data = await fetchUserDetails(token);
                setUserDetails(data);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("Não foi possível carregar os detalhes da conta.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6 text-white">Minha Conta</h1>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : userDetails ? (
                    <div className="bg-[#1E1E1E] rounded-2xl shadow-lg p-6 w-full max-w-md">
                        <p className="text-gray-200"><strong>Nome:</strong> {userDetails.name}</p>
                        <p className="text-gray-200"><strong>Email:</strong> {userDetails.email}</p>
                        <p className="text-gray-200"><strong>Academia:</strong> {userDetails.gymName}</p>
                        <p className="text-gray-200"><strong>Localização:</strong> {userDetails.gymLocation}</p>
                        <p className="text-gray-200"><strong>Exercícios Selecionados:</strong> {userDetails.selectedExercises.join(', ') || 'Nenhum'}</p>
                    </div>
                ) : (
                    <p className="text-red-500">Não foi possível carregar os detalhes da conta.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AccountPage;
