import { clearToken} from './auth';
import api from './api';

export const login = async (email, password) => {
    try {
      const response = await api.post('/Account/login', { email, password });

      return response.data;

    } catch (error) {
        console.error("Erro ao fazer login: ", error.response?.data || error.message);
        throw error;
    }
};

export const register = async (name, email, password, gymName, gymLocation) => {
    try {
        const response = await api.post('/Account/register', {
          name,
          email,
          password,
          gymName,
          gymLocation
        });

        const { token, message } = response.data;

        return { token, message };

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao registrar usuário";
      const details = error.response?.data?.details || [];

      console.error("Erro ao registrar: ", errorMessage, details);
        
      const customError = new Error(errorMessage);
      customError.details = details;

      throw customError;
    } 
};

export const logout = () => {
    clearToken();
    localStorage.removeItem('userDetailsCache');
    localStorage.removeItem('equipmentsCache');
    localStorage.removeItem('usersCache');

    Object.keys(localStorage)
        .filter(key => key.startsWith('userDetails_'))
        .forEach(key => localStorage.removeItem(key));

    console.log("Usuário deslogado");
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/Account/forgot-password', { email });

        return response.message;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao solicitar recuperação de senha.";

        console.error("Erro ao solicitar recuperação de senha:", errorMessage);

        throw new Error(errorMessage);
    }
}

export const resetPassword = async ({ email, token, newPassword }) => {
    try {
        const response = await api.post('/Account/reset-password', { 
            email, 
            token, 
            newPassword 
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao redefinir a senha:", error.response?.data || error.message);

        throw error.response?.data;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete('/Account/delete-user/', {
          data: { id : userId },
        });
  
        return response.data;

    } catch (error) {
        console.error("Erro ao excluir usuário: ", error.response?.data || error.message);
        throw error;
    }
};