import axios from "axios";
import { API_URL } from "../utils/constants";
import { getToken } from "./auth";

const createHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const submitReport = async (userEmail, gymName, equipmentIds) => {   
    const gymReport = {
        UserName: userEmail,
        GymName: gymName,
        EquipmentIds: equipmentIds,
    };

    try {
        await axios.post(
            `${API_URL}/api/v1/Report/send-gym-report`, 
            gymReport,
            createHeaders()
        );

        return true;     

    } catch (error) {
        console.error('Erro ao enviar o relatório:', error);

        return false;
    }
};

export const saveEquipmentSelection = async (equipmentIds) => {
    try {    
        await axios.post(
            `${API_URL}/api/v1/Report/save-selection`,
            { EquipmentIds: equipmentIds },
            createHeaders()
        );

    } catch (error) {
        console.error('Erro ao salvar o relatório:', error);
    }
}

export const sendFeedback = async (feedback) => {
    try {
        await axios.post(
            `${API_URL}/api/v1/Report/send-feedback`, 
            { Feedback: feedback },
            createHeaders()
        );

    } catch (error) {
        console.error('Erro ao enviar o feedback:', error);
    }
}