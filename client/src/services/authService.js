import axios from 'axios';
import { API_URL } from '../utils/constants'
import { clearToken } from './auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(
          `${API_URL}/Account/login`, 
          { email, password },
          { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Erro ao fazer login: ", error.response?.data || error.message);
        throw error;
    }
};

export const register = async (email, password, gymName, gymLocation) => {
    try {
        const response = await axios.post(`${API_URL}/Account/register`, {
          email,
          password,
          gymName,
          gymLocation
        });

        return response.data;

      } catch (error) {
         const errorMessage = error.response?.data?.message || "Erro ao registrar usuário";
         console.error("Erro ao registrar: ", errorMessage);
         
         throw new Error(errorMessage);
      } 
};

export const logout = () => {
    clearToken();
    console.log("Usuário deslogado");
};