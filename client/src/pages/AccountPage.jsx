import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import Footer from '../components/Footer';
import Header from '../components/Header';

const AccountPage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/Account/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [token]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6 text-white">Minha Conta</h1>
                {userDetails ? (
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
