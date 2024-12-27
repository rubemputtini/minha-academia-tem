import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/accountService';
import { Divider } from '@mui/material';
import { getUserRole } from '../services/auth';

const Nav = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const isAdmin = getUserRole() === 'admin';

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleAccountClick = () => {
        handleClose();
        navigate("/conta");
    };

    const handleFeedbackClick = () => {
        handleClose();
        navigate("/obrigado");
    };

    const handleSettingsClick = () => {
        handleClose();
        navigate("/admin");
    };

    const handleHomeClick = () => {
        navigate("/");
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'black' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        sx={{ mr: 2 }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '10px',
                                backgroundColor: '#323232',
                                color: 'white',
                                boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)',
                                width: '150px',
                                minWidth: 'unset',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleAccountClick}
                            sx={{
                                padding: '10px 20px',
                                '&:hover': {
                                    backgroundColor: '#3b3b3b',
                                },
                            }}
                        >
                            Conta
                        </MenuItem>
                        <MenuItem
                            onClick={handleFeedbackClick}
                            sx={{
                                padding: '10px 20px',
                                '&:hover': {
                                    backgroundColor: '#3b3b3b',
                                },
                            }}
                        >
                            Feedback
                        </MenuItem>
                        {isAdmin && (
                            <MenuItem
                                onClick={handleSettingsClick}
                                sx={{
                                    padding: '10px 20px',
                                    '&:hover': {
                                        backgroundColor: '#3b3b3b',
                                    },
                                }}
                            >
                                Configurações
                            </MenuItem>
                        )}
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                padding: '10px 20px',
                                '&:hover': {
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                },
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Nav;
