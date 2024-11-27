import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken } from '../services/auth'

export const fetchUserDetails = async (token, userId = null) => {
    const url = userId ? `${API_URL}/Account/details/${userId}` : `${API_URL}/Account/details`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const token = getToken();
    try {
        const response = await axios.put(`${API_URL}/Account/edit-user/${userId}`, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw new Error('Erro ao atualizar usuário');
    }
};