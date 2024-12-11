import api from './api';

export const fetchUserDetails = async (userId = null, forceRefresh = false) => {
    const url = userId ? `/Account/details/${userId}` : `/Account/details`;
    const cacheKey = userId ? `userDetails_${userId}` : 'userDetailsCache';

    if (!forceRefresh) {
        const cachedUserDetails = localStorage.getItem(cacheKey);

        if (cachedUserDetails) {
            return JSON.parse(cachedUserDetails);
        }
    }
   
    try {
        const response = await api.get(url);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));

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