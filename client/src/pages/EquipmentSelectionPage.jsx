import { useCallback, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import EquipmentCard from '../components/EquipmentCard';
import { submitReport, saveEquipmentSelection } from '../services/reportService';
import { fetchEquipments } from '../services/equipmentService';
import { fetchUserDetails } from '../services/userService';
import SuccessDialog from '../components/dialogs/SuccessDialog';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const EquipmentSelectionPage = () => {
    const [equipments, setEquipments] = useState([]);
    const [selections, setSelections] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCheckmark, setShowCheckMark] = useState(false);
    const [gymName, setGymName] = useState('');
    const [userName, setUserName] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const loadUserData = async () => {

        try {
            const userDetails = await fetchUserDetails();
            setUserName(userDetails.email);
            setGymName(userDetails.gymName);

        } catch (error) {
            console.error("Erro ao buscar detalhes do usuário:", error);
        }
    };

    const loadEquipments = useCallback(async () => {

        try {
            const equipmentData = await fetchEquipments();
            setEquipments(equipmentData);
            setSelections(new Array(equipmentData.length).fill(false));

        } catch (error) {
            console.error("Erro ao buscar a lista de equipamentos:", error);
        }
    }, []);

    useEffect(() => {
        loadEquipments();
    }, [loadEquipments]);

    useEffect(() => {
        loadUserData();
    }, []);

    const handleSelection = (selected) => {
        const updatedSelections = [...selections];
        updatedSelections[currentIndex] = selected;
        setSelections(updatedSelections);
        setShowCheckMark(true);

        setTimeout(() => {
            setShowCheckMark(false);

            if (currentIndex < equipments.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setShowConfirmation(true);
            }
        }, 900);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);

            setShowCheckMark(true);
            setTimeout(() => setShowCheckMark(false), 900);
        }
    };

    const handleConfirmSaveAndSubmit = async () => {
        setLoading(true);

        const selectedEquipmentIds = selections
            .map((isSelected, index) => isSelected ? equipments[index].equipmentId : null)
            .filter(id => id !== null);

        await saveEquipmentSelection(selectedEquipmentIds);
        await submitReport(userName, gymName, selectedEquipmentIds);

        setReportSubmitted(true);
        setShowConfirmation(false);
        setLoading(false);
    };

    const handleSuccessDialogClose = () => {
        setReportSubmitted(false);
        navigate("/obrigado");
    };

    const currentEquipment = equipments[currentIndex];
    const currentSelection = selections[currentIndex];

    return (
        <>
            <Nav />
            <div className="container mx-auto flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">
                    <span className="inline-flex items-center space-x-2">
                        <span>Minha Academia <span className="text-yellow-500">TEM?</span></span>
                    </span>
                </h2>
                <div className="flex justify-center w-full">
                    {currentEquipment ? (
                        <EquipmentCard
                            equipment={currentEquipment}
                            onSelection={handleSelection}
                            onBack={handleBack}
                            showBackButton={currentIndex > 0}
                            currentSelection={currentSelection}
                            showCheckmark={showCheckmark}
                        />
                    ) : (
                        <Box my={22} display="flex" flexDirection="column" alignItems="center">
                            <CircularProgress color="primary" />
                        </Box>
                    )}
                </div>
            </div>
            {showConfirmation && !reportSubmitted && (
                <ConfirmationDialog
                    message={"Deseja salvar suas escolhas e enviar o relatório?"}
                    onConfirm={handleConfirmSaveAndSubmit}
                    onCancel={() => setShowConfirmation(false)}
                    isLoading={loading}
                />
            )}
            {reportSubmitted &&
                <SuccessDialog
                    message={"Relatório enviado com sucesso!"}
                    onClose={handleSuccessDialogClose} />}
            <Footer />
        </>
    );
};

export default EquipmentSelectionPage;
