import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getToken } from '../services/auth';
import { fetchUserDetails, updateUser } from '../services/userService';
import { saveEquipmentSelection, submitReport } from '../services/reportService';
import { muscleGroupNames } from '../utils/constants';
import EditUserDialog from "../components/dialogs/EditUserDialog";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip, IconButton, CircularProgress, Box, Typography, Divider, Grid2, Card, CardMedia } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AccountPage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [gymName, setGymName] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isEditingEquipments, setIsEditingEquipments] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [isSavingEquipments, setIsSavingEquipments] = useState(false);
    const [updatedEquipments, setUpdatedEquipments] = useState(null);

    const fetchDetails = async () => {
        const token = getToken();

        try {
            const data = await fetchUserDetails(token);
            setUserDetails(data);
            setUserName(userDetails.email);
            setGymName(userDetails.gymName);
            setUpdatedEquipments(data?.selectedExercises || []);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError("Não foi possível carregar os detalhes da conta.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    const handleUpdateUser = async (userId, userData) => {
        setIsSavingUser(true);

        try {
            await updateUser(userId, userData);
            setUserDetails((prev) => ({ ...prev, ...userData }));
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            setError("Não foi possível atualizar os detalhes da conta.");
        } finally {
            setIsSavingUser(false);
            setIsEditingUser(false);
        }
    };

    const handleToggleEquipment = (equipmentId) => {
        setUpdatedEquipments((prev) => {
            const updated = prev.map((exercise) =>
                exercise.equipmentId === equipmentId
                    ? { ...exercise, isAvailable: !exercise.isAvailable }
                    : exercise
            );
            return updated;
        });
    };

    const handleSaveEquipments = async () => {
        setIsSavingEquipments(true);

        const selectedEquipmentIds = updatedEquipments
            .filter((exercise) => exercise.isAvailable)
            .map((exercise) => exercise.equipmentId);

        await saveEquipmentSelection(selectedEquipmentIds);
        await submitReport(userName, gymName, selectedEquipmentIds);
        await fetchDetails();

        setIsSavingEquipments(false);
        setIsEditingEquipments(false);
    };

    const handleCancelEquipments = () => {
        setUpdatedEquipments(userDetails.selectedExercises);
        setIsEditingEquipments(false);
    };

    const groupedExercises = userDetails?.selectedExercises.reduce((acc, exercise) => {

        const muscleGroup = exercise.muscleGroup;

        if (!acc[muscleGroup]) {
            acc[muscleGroup] = [];
        }
        acc[muscleGroup].push(exercise);

        return acc;
    }, {});

    if (loading) {
        return (
            <Box my={22} display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <div className="relative">
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center px-4 relative z-10">
                <div className="bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-lg mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                        Minha Conta
                        <Tooltip title="Editar Conta">
                            <IconButton onClick={() => setIsEditingUser(true)} sx={{ color: '#FFCD54', padding: 0 }}>
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
                    <div className="w-full max-w-6xl mt-8 text-center">
                        <h3 className="text-xl md:text-3xl font-semibold text-white flex items-center justify-center gap-2 mb-8">
                            Equipamentos Selecionados
                            <Tooltip title="Editar Equipamentos">
                                <IconButton onClick={() => setIsEditingEquipments(true)} sx={{ color: '#FFCD54', padding: 0 }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </h3>
                        {Object.keys(groupedExercises).length > 0 ? (
                            Object.keys(groupedExercises).map((muscleGroup) => (
                                <div key={muscleGroup} className="mb-20 text-gray-200">
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            marginBottom: "15px",
                                            fontWeight: "bold",
                                            color: "#FFCD54",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {muscleGroupNames[muscleGroup] || muscleGroup}
                                    </Typography>
                                    <Divider sx={{ marginY: "1em", borderTop: "2px solid #444" }} />
                                    <Grid2 container spacing={2} justifyContent="center">
                                        {groupedExercises[muscleGroup].map((exercise) => (
                                            <Grid2
                                                item
                                                xs={6}
                                                sm={4}
                                                md={3}
                                                lg={2}
                                                key={exercise.equipmentId}
                                                onClick={() =>
                                                    isEditingEquipments && handleToggleEquipment(exercise.equipmentId)
                                                }
                                            >
                                                <Card
                                                    sx={{
                                                        backgroundColor: "#111827",
                                                        color: "white",
                                                        borderRadius: "10px",
                                                        boxShadow: isEditingEquipments
                                                            ? updatedEquipments.find((e) => e.equipmentId === exercise.equipmentId)?.isAvailable
                                                                ? "0 0 10px 2px #4CAF50"
                                                                : "0 0 10px 2px #F44336"
                                                            : "0 4px 8px rgba(0,0,0,0.2)",
                                                        width: 250,
                                                        position: "relative",
                                                        transition: "box-shadow 0.3s ease",
                                                        cursor: isEditingEquipments ? "pointer" : "default",
                                                        zIndex: 10,
                                                    }}
                                                    onClick={() => isEditingEquipments && handleToggleEquipment(exercise.equipmentId)}
                                                >

                                                    <CardMedia
                                                        component="img"
                                                        image={exercise.photoUrl}
                                                        alt={exercise.name}
                                                        sx={{
                                                            height: 250,
                                                            objectFit: "cover",
                                                            borderTopLeftRadius: "10px",
                                                            borderTopRightRadius: "10px",
                                                            border: "2px solid #FFCD54",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            fontSize: "16px",
                                                            marginTop: "10px",
                                                            color: "white",
                                                            marginBottom: "20px",
                                                            paddingLeft: "8px",
                                                            paddingRight: "8px",
                                                        }}
                                                    >
                                                        {exercise.name}
                                                    </Typography>
                                                    <div className="absolute top-2 right-2">
                                                        {isEditingEquipments ? (
                                                            (() => {
                                                                const equipment = updatedEquipments.find(
                                                                    (e) => e.equipmentId === exercise.equipmentId
                                                                );
                                                                return equipment?.isAvailable ? (
                                                                    <CheckCircleIcon
                                                                        onClick={() => handleToggleEquipment(exercise.equipmentId)}
                                                                        className="text-green-500"
                                                                        sx={{ fontSize: 60, cursor: 'pointer' }}
                                                                    />
                                                                ) : (
                                                                    <CancelIcon
                                                                        onClick={() => handleToggleEquipment(exercise.equipmentId)}
                                                                        className="text-red-500"
                                                                        sx={{ fontSize: 60, cursor: 'pointer' }}
                                                                    />
                                                                );
                                                            })()
                                                        ) : exercise.isAvailable ? (
                                                            <CheckCircleIcon
                                                                className="text-green-500"
                                                                sx={{ fontSize: 60 }}
                                                            />
                                                        ) : (
                                                            <CancelIcon
                                                                className="text-red-500"
                                                                sx={{ fontSize: 60 }}
                                                            />
                                                        )}
                                                    </div>
                                                </Card>
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
                                Nenhum equipamento selecionado.
                            </Typography>
                        )}
                    </div>
                )}
                {isEditingEquipments && (
                    <>
                        <div
                            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent z-50"
                            style={{
                                height: "20vh",
                                marginLeft: "-1rem",
                                marginRight: "-1rem",
                            }}
                        />

                        <div className="fixed bottom-10 flex justify-center gap-4 z-[100]">
                            <button
                                className={`px-4 py-2 bg-green-500 text-white rounded-xl w-full sm:w-auto shadow-lg ${isSavingEquipments ? 'opacity-50' : ''}`}
                                onClick={handleSaveEquipments}
                                disabled={isSavingEquipments}
                            >
                                {isSavingEquipments ? <CircularProgress size={20} color="inherit" /> : "SALVAR"}
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-xl w-full sm:w-auto shadow-lg"
                                onClick={handleCancelEquipments}
                                disabled={isSavingEquipments}
                            >
                                CANCELAR
                            </button>
                        </div>
                    </>
                )}
            </div >
            <Footer />

            {
                isEditingUser && (
                    <EditUserDialog
                        user={userDetails}
                        onClose={() => setIsEditingUser(false)}
                        onUpdate={handleUpdateUser}
                        isSavingUser={isSavingUser}
                    />
                )
            }

        </div>
    );
};

export default AccountPage;
