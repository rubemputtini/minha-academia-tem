import { jwtDecode } from 'jwt-decode';

export const isLoggedIn = () => {
    return !!localStorage.getItem('token'); 
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const clearToken = () => {
    localStorage.removeItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const getUserRole = () => {
    const decodedToken = jwtDecode(getToken());
    return decodedToken.role;
};