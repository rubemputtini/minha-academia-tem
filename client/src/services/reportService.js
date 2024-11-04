import axios from "axios";
import { API_URL } from "../utils/constants";

export const submitReport = async (userEmail, gymName, equipmentsIds) => {   
    const gymReport = {
        UserName: userEmail,
        GymName: gymName,
        EquipmentIds: equipmentsIds,
    };

    try {
        console.log(gymReport)
        await axios.post(`${API_URL}/api/v1/Report/send-gym-report`, gymReport);
        alert('Relatório enviado com sucesso!');
        return true;     

    } catch (error) {
        console.error('Erro ao enviar o relatório:', error);
        alert('Erro ao enviar o relatório.');
        return false;
    }
};