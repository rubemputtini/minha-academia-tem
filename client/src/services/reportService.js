import api from "./api";

export const submitReport = async (userEmail, gymName, equipmentIds) => {   
    const gymReport = {
        UserName: userEmail,
        GymName: gymName,
        EquipmentIds: equipmentIds,
    };

    try {
        await api.post(
            '/api/v1/Report/send-gym-report', 
            gymReport,
        );

        return true;     

    } catch (error) {
        console.error('Erro ao enviar o relatório:', error);

        return false;
    }
};

export const saveEquipmentSelection = async (equipmentIds) => {
    try {    
        await api.post(
            '/api/v1/Report/save-selection',
            { EquipmentIds: equipmentIds },
        );

    } catch (error) {
        console.error('Erro ao salvar o relatório:', error);
    }
}