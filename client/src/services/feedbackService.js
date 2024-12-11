import api from "./api";

export const sendFeedback = async (feedback) => {
    try {
        await api.post('/api/v1/Feedback/send-feedback', 
            { Message: feedback },
        );

    } catch (error) {
        console.error('Erro ao enviar o feedback:', error);
    }
}

export const getUserFeedbacks = async (userId) => {
    try {
        const response = await api.get(
            `/api/v1/Feedback/user-feedbacks/${userId}`
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os feedbacks do usuário:', error);
    }
}