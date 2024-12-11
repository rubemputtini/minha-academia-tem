import api from "./api";

export const getUsers = async (page = 1, pageSize = 6) => {
    const response = await api.get('/admin/users', {
        params: { page, pageSize },
    });
    
    return response.data;
};

export const getUserEquipments = async (userId) => {
    const response = await api.get(`/admin/GetUserEquipments/${userId}`);

    return response.data;
};
