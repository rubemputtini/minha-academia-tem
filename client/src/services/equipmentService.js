import api from './api';

export const fetchEquipments = async (token) => {
    const cachedEquipments = localStorage.getItem('equipmentsCache');

    if (cachedEquipments) {
        return JSON.parse(cachedEquipments);
    }

    const response = await api.get('/api/v1/Equipment');

    localStorage.setItem("equipmentsCache", JSON.stringify(response.data));
    return response.data;
};
