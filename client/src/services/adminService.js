import api from "./api";

export const getUsers = async (page = 1, pageSize = 6, sortOrder = "asc", searchQuery = "") => {
    
    try {
        const response = await api.get('/admin/users', {
            params: { page, pageSize, sortOrder, searchQuery },
        });
        
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
        throw error;
    }
};

export const getUserEquipments = async (userId) => {
    try {
        const response = await api.get(`/admin/GetUserEquipments/${userId}`);
    
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar equipamentos do usuário: ", error);
        throw error;
    }
};
