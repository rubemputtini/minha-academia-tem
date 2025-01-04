import api from './api';

export const fetchUserDetails = async (userId = null, forceRefresh = false) => {
    const url = userId ? `/Account/details/${userId}` : `/Account/details`;

    try {
        const response = await api.get(url);

        return response.data;

    } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error.response?.data || error.message);

        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/Account/edit-user/${userId}`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
        
        throw new Error('Erro ao atualizar usuário');
    }
};