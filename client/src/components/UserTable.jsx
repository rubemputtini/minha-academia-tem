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
        <Box sx={{ overflowX: "auto" }}>
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
                        {sortedUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    "&:nth-of-type(odd)": { backgroundColor: "#282828" },
                                    "&:nth-of-type(even)": { backgroundColor: "#242424" },
                                    "&:hover": { backgroundColor: "#333" },
                                }}
                            >
                                <TableCell sx={{ color: "#FFFFFF" }} className="text-xs sm:text-sm">{user.name}</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }} className="text-xs sm:text-sm">{user.email}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => onViewClick(user.id)}
                                        sx={{
                                            color: "#FFCD54", "&:hover": {
                                                backgroundColor: "#444",
                                                color: "#FFFFFF",
                                            },
                                            mr: 1,
                                        }}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onEditClick(user.id)}
                                        sx={{
                                            color: "#FFCD54",
                                            "&:hover": {
                                                backgroundColor: "#444",
                                                color: "#FFFFFF",
                                            },
                                            mr: 1,
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onDeleteClick(user.id)}
                                        sx={{
                                            color: "#FF6347",
                                            "&:hover": {
                                                backgroundColor: "#444",
                                                color: "#FFFFFF",
                                            },
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
