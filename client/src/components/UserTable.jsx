import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Box,
    Typography,
} from "@mui/material";

const UserTable = ({ users, onUserClick }) => {
    return (
        <Box sx={{ overflowX: "auto" }}>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: "#1f1f1f",
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Table sx={{ minWidth: 320 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "yellow", fontWeight: "bold", fontSize: 18 }}>
                                Nome
                            </TableCell>
                            <TableCell sx={{ color: "yellow", fontWeight: "bold", fontSize: 18 }}>
                                Email
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    sx={{ color: "yellow", fontWeight: "bold", fontSize: 18 }}
                                >
                                    Ações
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    "&:nth-of-type(odd)": { backgroundColor: "#2a2a2a" },
                                    "&:hover": { backgroundColor: "#333" },
                                }}
                            >
                                <TableCell sx={{ color: "yellow", fontSize: 16 }}>
                                    {user.name}
                                </TableCell>
                                <TableCell sx={{ color: "yellow", fontSize: 16 }}>
                                    {user.email}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "yellow",
                                            color: "#000",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            "&:hover": { backgroundColor: "#ffd700" },
                                        }}
                                        onClick={() => onUserClick(user.id)}
                                    >
                                        Detalhes
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserTable;
