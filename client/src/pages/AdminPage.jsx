import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    CircularProgress,
    Alert,
    Box,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getUsers } from "../services/adminService";
import { deleteUser } from "../services/accountService";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserTable from "../components/UserTable";
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog";
import SuccessDialog from "../components/dialogs/SuccessDialog";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userDeleted, setUserDeleted] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                setError("Erro ao carregar usuários.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleViewClick = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleEditClick = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDialog(true);
    };

    const handleDialogConfirm = () => {
        deleteUser(userToDelete);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
        setShowDialog(false);
        setUserDeleted(true);
        navigate("/admin");
    };

    const handleDialogCancel = () => {
        setShowDialog(false);
    };

    const handleDialogClose = () => {
        setUserDeleted(false);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, color: "white" }}>
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        color: "#FFCD54",
                        fontWeight: "bold",
                        mb: 3,
                    }}
                >
                    Gerenciador de Usuários
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 3,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar por nome"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search style={{ color: "#666" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: "100%",
                            maxWidth: "400px",
                            backgroundColor: "white",
                            borderRadius: "25px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                            transition: "0.3s ease",
                            "&:hover": {
                                transform: "scale(1.02)",
                            },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "25px",
                            },
                        }}
                    />
                </Box>

                {!loading && !error && (
                    <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "center", mb: 2, fontStyle: "italic" }}
                    >
                        {filteredUsers.length} usuário(s) encontrado(s)
                    </Typography>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : filteredUsers.length === 0 ? (
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            mt: 4,
                            color: "#FFCD54",
                        }}
                    >
                        Nenhum usuário encontrado.
                    </Typography>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onViewClick={handleViewClick}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                    />
                )}
            </Container>

            {showDialog && (
                <ConfirmationDialog
                    message="Tem certeza de que deseja excluir este usuário?"
                    onConfirm={handleDialogConfirm}
                    onCancel={handleDialogCancel}
                />
            )}

            {userDeleted &&
                <SuccessDialog
                    message={"Usuário excluído com sucesso!"}
                    onClose={handleDialogClose} />}
            <Footer />
        </>
    );
};

export default AdminPage;