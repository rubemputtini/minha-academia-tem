import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getToken } from '../services/auth';
import { fetchUserDetails, updateUser } from '../services/userService';
import { muscleGroupNames } from '../utils/constants';
import EditUserDialog from "../components/dialogs/EditUserDialog";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip, IconButton, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const AccountPage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleUpdate = async (userId, userData) => {
        try {
            await updateUser(userId, userData);
            setUserDetails((prev) => ({ ...prev, ...userData }));
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            setError("Não foi possível atualizar os detalhes da conta.");
        } finally {
            setIsEditing(false);
        }
    };

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

    const handleSelectEquipment = (equipmentId) => {
        setUserDetails((prevDetails) => {
            const updatedExercises = prevDetails.selectedExercises.map((exercise) => {
                if (exercise.equipmentId === equipmentId) {
                    return { ...exercise, isSelected: !exercise.isSelected };
                }
                return exercise;
            });
            return { ...prevDetails, selectedExercises: updatedExercises };
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1E1E1E]">
                <CircularProgress sx={{ color: "#FFCD54" }} />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center px-4">
                <div className="bg-[#1E1E1E] rounded-2xl shadow-lg p-6 w-full max-w-lg mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                        Minha Conta
                        <Tooltip title="Editar Conta">
                            <IconButton onClick={() => setIsEditing(true)} sx={{ color: '#FFCD54', padding: 0 }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </h2>
                    <hr className="my-4 border-t-2 border-[#444]" />
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : userDetails ? (
                        <div>
                            <p className="text-gray-200 text-sm md:text-base mb-2"><strong>Nome:</strong> {userDetails.name}</p>
                            <p className="text-gray-200 text-sm md:text-base mb-2"><strong>Email:</strong> {userDetails.email}</p>
                            <p className="text-gray-200 text-sm md:text-base mb-2"><strong>Academia:</strong> {userDetails.gymName}</p>
                            <p className="text-gray-200 text-sm md:text-base mb-2"><strong>Localização:</strong> {userDetails.gymLocation}</p>
                        </div>
                    ) : (
                        <p className="text-red-500">Não foi possível carregar os detalhes da conta.</p>
                    )}
                </div>

                {userDetails?.selectedExercises?.length > 0 && (
                    <div className="w-full max-w-6xl mt-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-[#FFCD54] mb-6 text-center">Equipamentos Selecionados</h3>
                        {Object.keys(groupedExercises).map((muscleGroup) => {
                            const muscleGroupName = muscleGroupNames[muscleGroup] || muscleGroup;
                            return (
                                <div key={muscleGroup} className="mb-20">
                                    <div className="flex justify-center mb-4">
                                        <h3 className="text-gray-200 text-2xl font-semibold">{muscleGroupName}</h3>
                                    </div>
                                    <hr className="my-4 border-t-2 border-[#444]" />
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                        {groupedExercises[muscleGroup].map((exercise) => (
                                            <div key={exercise.equipmentId} className="bg-[#252525] p-4 rounded-lg shadow-md hover:shadow-xl transition relative">

                                                <img
                                                    src={exercise.photoUrl}
                                                    alt={exercise.name}
                                                    className="w-full h-full object-cover rounded-md mb-4"
                                                    onClick={() => handleSelectEquipment(exercise.equipmentId)}

                                                />

                                                {exercise.isAvailable ? (
                                                    <CheckCircleIcon
                                                        className="absolute top-2 right-2 text-green-500"
                                                        sx={{ fontSize: 50 }}
                                                    />
                                                ) : (
                                                    <CancelIcon
                                                        className="absolute top-2 right-2 text-red-500"
                                                        sx={{ fontSize: 50 }}
                                                    />
                                                )}

                                                <p className="text-gray-300 text-center font-medium">{exercise.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />

            {isEditing && (
                <EditUserDialog
                    user={userDetails}
                    onClose={() => setIsEditing(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default AccountPage;
