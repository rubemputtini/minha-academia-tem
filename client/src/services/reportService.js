import axios from "axios";
import { API_URL } from "../utils/constants";
import { getToken } from "./auth";

export const submitReport = async (userEmail, gymName, equipmentsIds) => {   
    const gymReport = {
        UserName: userEmail,
        GymName: gymName,
        EquipmentIds: equipmentsIds,
    };

    try {
        const token = getToken()

        await axios.post(
            `${API_URL}/api/v1/Report/send-gym-report`, 
            gymReport,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        alert('Relatório enviado com sucesso!');

        return true;     

    } catch (error) {
        console.error('Erro ao enviar o relatório:', error);
        alert('Erro ao enviar o relatório.');

        return false;
    }
};