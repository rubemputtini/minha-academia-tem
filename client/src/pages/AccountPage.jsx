import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getToken } from '../services/auth';
import { fetchUserDetails } from '../services/userService';
import { muscleGroupNames } from '../utils/constants';

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
        return <p className="text-white text-center">Carregando...</p>;
    }

    const groupedExercises = userDetails?.selectedExercises.reduce((acc, exercise) => {

        const muscleGroup = exercise.muscleGroup;

        if (!acc[muscleGroup]) {
            acc[muscleGroup] = [];
        }
        acc[muscleGroup].push(exercise);

        return acc;
    }, {});

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center">
                <div className="bg-[#1E1E1E] rounded-2xl shadow-lg p-6 w-full max-w-md mb-8">
                    <h1 className="text-3xl font-bold mb-6 text-white">Minha Conta</h1>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : userDetails ? (
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-200"><strong>Nome:</strong> {userDetails.name}</p>
                                <p className="text-gray-200"><strong>Email:</strong> {userDetails.email}</p>
                                <p className="text-gray-200"><strong>Academia:</strong> {userDetails.gymName}</p>
                                <p className="text-gray-200"><strong>Localização:</strong> {userDetails.gymLocation}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Não foi possível carregar os detalhes da conta.</p>
                    )}
                </div>

                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Equipamentos Selecionados</h2>
                    {Object.keys(groupedExercises).map((muscleGroup) => {
                        const muscleGroupName = muscleGroupNames[muscleGroup] || muscleGroup;
                        return (
                            <div key={muscleGroup} className="mb-8">
                                <div className="flex justify-center mb-4">
                                    <h3 className="text-gray-200 text-2xl font-semibold text-center">{muscleGroupName}</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {groupedExercises[muscleGroup].map((exercise) => (
                                        <div key={exercise.equipmentId} className="bg-[#333333] p-4 rounded-lg shadow-md">
                                            <img
                                                src={exercise.imageUrl}
                                                alt={exercise.name}
                                                className="w-full h-32 object-cover rounded-md mb-4"
                                            />
                                            <p className="text-gray-200 text-lg text-center font-medium">{exercise.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AccountPage;
