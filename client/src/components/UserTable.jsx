import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
} from "@mui/material";
import { ArrowDropUp, ArrowDropDown, Visibility, Edit, Delete } from "@mui/icons-material";

const UserTable = ({ users, onViewClick, onEditClick, onDeleteClick }) => {
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = () => {
        const order = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(order);
    };

    const sortedUsers = [...users].sort((a, b) => {
        return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    return (
        <Box sx={{ overflowX: "auto", mb: 4 }}>
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
                    <TableHead sx={{
                        backgroundColor: "linear-gradient(to bottom, #1A1A1A, #111111)",
                        borderBottom: "2px solid #444",
                    }}>
                        <TableRow>
                            <TableCell sx={{
                                color: "#FFCD54",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                letterSpacing: "0.05rem",
                            }}>
                                Nome
                                <IconButton onClick={handleSort} sx={{
                                    ml: 1,
                                    color: "#FFCD54",
                                    "&:hover": { color: "#FFD700" },
                                    transition: "color 0.3s ease",
                                }}>
                                    {sortOrder === "asc" ? <ArrowDropUp /> : <ArrowDropDown />}
                                </IconButton>
                            </TableCell>
                            <TableCell sx={{
                                color: "#FFCD54",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                letterSpacing: "0.05rem",
                            }}>
                                Email
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user, index) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#1A1A1A" : "#232323",
                                    "&:hover": { backgroundColor: "#3A3A3A" },
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                <TableCell
                                    sx={{
                                        color: "#E0E0E0",
                                        fontSize: "0.9rem",
                                        letterSpacing: "0.03rem",
                                    }}
                                >
                                    {user.name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#C0C0C0",
                                        fontSize: "0.9rem",
                                        letterSpacing: "0.03rem",
                                    }}
                                >
                                    {user.email}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => onViewClick(user.id)}
                                        sx={{
                                            color: "#4A90E2",
                                            "&:hover": { color: "#6AAFE9" },
                                            transition: "color 0.2s ease",
                                        }}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onEditClick(user.id)}
                                        sx={{
                                            color: "#5CB85C",
                                            "&:hover": { color: "#78D178" },
                                            transition: "color 0.2s ease",
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onDeleteClick(user.id)}
                                        sx={{
                                            color: "#D9534F",
                                            "&:hover": { color: "#E57373" },
                                            transition: "color 0.2s ease",
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
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
