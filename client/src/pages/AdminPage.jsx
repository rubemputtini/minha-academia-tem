import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Container,
    CircularProgress,
    Alert,
    Box,
    InputAdornment,
    TextField,
    Typography,
    Pagination
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getUsers } from "../services/adminService";
import { deleteUser } from "../services/accountService";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import UserTable from "../components/UserTable";
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog";
import SuccessDialog from "../components/dialogs/SuccessDialog";
import EditUserDialog from "../components/dialogs/EditUserDialog";
import { fetchUserDetails, updateUser } from "../services/userService";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userDeleted, setUserDeleted] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [sortOrder] = useState("asc");
    const [totalUsers, setTotalUsers] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get("page")) || 1;

    const fetchUsers = async (page, sortOrder, searchQuery) => {
        try {
            setLoading(true);
            const data = await getUsers(page, pageSize, sortOrder, searchQuery);
            setUsers(data.users);
            setTotalUsers(data.totalCount)
        } catch (err) {
            setError("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(initialPage, sortOrder, searchQuery);
        setPage(initialPage);
    }, [initialPage, sortOrder, searchQuery]);

    const handlePageChange = (event, newPage) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", newPage);

        window.history.pushState(null, "", `?${searchParams.toString()}`);
        setPage(newPage);
        fetchUsers(newPage, sortOrder, searchQuery);
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        fetchUsers(1, sortOrder, query);
    }

    const handleViewClick = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleEditClick = async (userId) => {
        try {
            const userDetails = await fetchUserDetails(userId);

            setEditingUser(userDetails);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError("Não foi possível carregar os detalhes da conta.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            await updateUser(userId, updatedData);
            const refreshedUsers = await getUsers(page, pageSize);
            setUsers(refreshedUsers.users);
            setTotalUsers(refreshedUsers.totalCount);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
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

    return (
        <>
            <Nav />
            <Container maxWidth="lg" sx={{ mt: 4, color: "white" }}>
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        color: "#FFCD54",
                        fontWeight: "bold",
                        mb: 4,
                        letterSpacing: 1.2,
                    }}
                >
                    Gerenciador de Usuários
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 4,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Pesquisar por nome"
                        onChange={handleSearch}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search style={{ color: "#666" }} />
                                    </InputAdornment>
                                ),
                            },
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
                        {totalUsers} usuário(s) encontrado(s)
                    </Typography>
                )}

                {loading ? (
                    <Box my={22} display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : totalUsers === 0 ? (
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            mt: 4,
                            color: "#FFCD54",
                            fontStyle: "italic",
                        }}
                    >
                        Nenhum usuário encontrado.
                    </Typography>
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onViewClick={handleViewClick}
                            onEditClick={(userId) => handleEditClick(userId)}
                            onDeleteClick={handleDeleteClick}
                        />
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={Math.ceil(totalUsers / pageSize)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        '&.Mui-selected': {
                                            backgroundColor: '#FFCD54',
                                            color: 'white',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#FFCD54',
                                            color: 'white',
                                        },
                                    },
                                    '& .MuiPaginationItem-ellipsis': {
                                        color: 'white',
                                    },
                                    '& .MuiPaginationItem-icon': {
                                        color: '#FFCD54',
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
            </Container>

            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdate={handleUpdateUser}
                />
            )}

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
