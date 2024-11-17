import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    CircularProgress,
    Alert,
    Box,
    InputAdornment,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Typography,
} from "@mui/material";
import { ArrowDropUp, ArrowDropDown, Search } from "@mui/icons-material";
import { getUsers } from "../services/adminService";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getUserRole } from "../services/auth";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const isAdmin = getUserRole() === 'admin';
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

    const handleUserClick = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleSort = () => {
        const order = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(order);

        const sortedUsers = [...users].sort((a, b) => {
            return order === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });

        setUsers(sortedUsers);
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
                        InputProps={{
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
                    <TableContainer
                        component={Paper}
                        sx={{
                            backgroundColor: "#222",
                            color: "white",
                            borderRadius: "10px",
                            overflowX: "auto",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <Table>
                            <TableHead sx={{ backgroundColor: "#333" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#FFCD54", fontWeight: "bold" }} className="text-sm sm:text-base">
                                        Nome
                                        <IconButton onClick={handleSort} sx={{ ml: 1, color: "#FFD700" }}>
                                            {sortOrder === "asc" ? <ArrowDropUp /> : <ArrowDropDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ color: "#FFCD54", fontWeight: "bold" }} className="text-sm sm:text-base">
                                        Email
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#282828" },
                                            "&:nth-of-type(even)": { backgroundColor: "#242424" },
                                            "&:hover": { backgroundColor: "#333" },
                                        }}
                                    >
                                        <TableCell className="text-xs sm:text-sm">{user.name}</TableCell>
                                        <TableCell className="text-xs sm:text-sm">{user.email}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleUserClick(user.id)}
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    backgroundColor: "#FFCD54",
                                                    color: "black",
                                                    "&:hover": {
                                                        backgroundColor: "#FFC107",
                                                    },
                                                }}
                                                className="text-xs sm:text-sm"
                                            >
                                                Detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default AdminPage;
