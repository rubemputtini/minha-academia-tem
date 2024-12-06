import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken } from './auth';

export const fetchEquipments = async (token) => {
    const response = await axios.get(`${API_URL}/api/v1/Equipment`, {
        headers:{
            Authorization: `Bearer ${getToken()}`,
        }
    });
    return response.data;
};
