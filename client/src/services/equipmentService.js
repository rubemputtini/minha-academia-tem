import axios from 'axios';
import { API_URL } from '../utils/constants';

export const fetchEquipments = async () => {
    const response = await axios.get(`${API_URL}/api/v1/Equipment`);
    return response.data;
};
