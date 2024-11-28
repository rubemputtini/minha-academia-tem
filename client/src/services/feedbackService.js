import axios from "axios";
import { API_URL } from "../utils/constants";
import { getToken } from "./auth";

const createHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const sendFeedback = async (feedback) => {
    try {
        await axios.post(
            `${API_URL}/api/v1/Feedback/send-feedback`, 
            { Message: feedback },
            createHeaders()
        );

    } catch (error) {
        console.error('Erro ao enviar o feedback:', error);
    }
}

export const getUserFeedbacks = async (userId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/v1/Feedback/user-feedbacks/${userId}`,
            createHeaders() 
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os feedbacks do usuário:', error);
    }
}