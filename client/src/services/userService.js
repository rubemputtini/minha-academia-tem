import axios from 'axios';
import { API_URL } from '../utils/constants';

export const fetchUserDetails = async (token) => {
    const response = await axios.get(`${API_URL}/Account/details`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
