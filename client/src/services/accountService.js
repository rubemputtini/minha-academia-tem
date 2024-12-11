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
    console.log("Usuário deslogado");
};

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