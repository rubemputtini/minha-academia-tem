import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    CircularProgress,
    Grid2,
    Alert,
    Box,
    Card,
    CardContent,
    CardMedia,
    TextField,
    Typography,
    Divider,
    IconButton
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getUserEquipments } from "../services/adminService";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserFeedbacks from "../components/UserFeedbacks";

const UserDetailsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [equipments, setEquipments] = useState([]);
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const equipmentData = await getUserEquipments(userId);
                const availableEquipments = equipmentData.filter(equipment => equipment.isAvailable);

                setEquipments(availableEquipments);
                setFilteredEquipments(availableEquipments);
            } catch (err) {
                setError("Erro ao carregar os dados do usuário ou equipamentos.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [userId]);

    useEffect(() => {
        if (search === "") {
            setFilteredEquipments(equipments);

        } else {
            const filtered = equipments.filter((equipment) =>
                equipment.name.toLowerCase().includes(search.toLowerCase())
            );

            setFilteredEquipments(filtered);
        }
    }, [search, equipments]);

    const groupEquipmentsByMuscle = () => {
        return filteredEquipments.reduce((groups, equipment) => {
            const group = equipment.muscleGroup;

            if (!groups[group]) groups[group] = [];
            groups[group].push(equipment);

            return groups;
        }, {});
    };

    const groupedEquipments = groupEquipmentsByMuscle();

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <>
            <Header />
            <Container
                maxWidth="lg"
                sx={{
                    backgroundColor: "#121212",
                    color: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
            >
                <Box mb={3}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#FFCD54",
                            backgroundColor: "#1e1e1e",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                                backgroundColor: "#333",
                            },
                        }}
                    >
                        <ArrowBack fontSize="large" />
                    </IconButton>
                </Box>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ color: "#FFCD54", fontWeight: "bold" }}
                >
                    Equipamentos da Academia
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Pesquisar equipamentos..."
                                value={search}
                                onChange={handleSearch}
                                sx={{
                                    backgroundColor: "#1e1e1e",
                                    borderRadius: "4px",
                                    input: { color: "white" },
                                    label: { color: "#90caf9" },
                                }}
                                slotProps={{
                                    style: { color: "white" },
                                }}
                            />
                        </Box>

                        {Object.keys(groupedEquipments).length > 0 ? (
                            Object.keys(groupedEquipments).map((muscleGroup) => (
                                <Box key={muscleGroup} mb={4}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "#FFCD54",
                                            marginBottom: "10px",
                                            fontWeight: "bold",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {muscleGroup}
                                    </Typography>
                                    <Divider sx={{ marginBottom: "20px", backgroundColor: "#333" }} />
                                    <Grid2 container spacing={2}>
                                        {groupedEquipments[muscleGroup].map((equipment) => (
                                            <Grid2 item xs={6} sm={4} md={3} key={equipment.equipmentId}>
                                                <Card
                                                    sx={{
                                                        backgroundColor: "#1e1e1e",
                                                        color: "white",
                                                        borderRadius: "10px",
                                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        image={equipment.photoUrl}
                                                        alt={equipment.name}
                                                        sx={{
                                                            height: 140,
                                                            objectFit: "cover",
                                                            borderTopLeftRadius: "10px",
                                                            borderTopRightRadius: "10px",
                                                        }}
                                                    />
                                                    <CardContent>
                                                        <Typography
                                                            variant="body1"
                                                            align="center"
                                                            sx={{ fontWeight: "bold" }}
                                                        >
                                                            {equipment.name}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                </Box>
                            ))
                        ) : (
                            <Alert severity="info">Nenhum equipamento encontrado.</Alert>
                        )}
                    </>
                )}
                <UserFeedbacks userId={userId} />
            </Container>
            <Footer />
        </>
    );
};

export default UserDetailsPage;
