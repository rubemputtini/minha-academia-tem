import { useCallback, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EquipmentCard from '../components/EquipmentCard';
import { submitReport, saveEquipmentSelection } from '../services/reportService';
import { fetchEquipments } from '../services/equipmentService';
import { getToken } from '../services/auth';
import { fetchUserDetails } from '../services/userService';
import SuccessDialog from '../components/SuccessDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const EquipmentSelectionPage = () => {
    const [equipments, setEquipments] = useState([]);
    const [selections, setSelections] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCheckmark, setShowCheckMark] = useState(false);
    const [gymName, setGymName] = useState('');
    const [userName, setUserName] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const navigate = useNavigate();

    const loadUserData = async () => {

        try {
            const userDetails = await fetchUserDetails(getToken());
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
            await loadUserData();

        } catch (error) {
            console.error("Erro ao buscar a lista de equipamentos:", error);
        }
    }, []);

    useEffect(() => {
        loadEquipments();
    }, [loadEquipments]);

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
        const selectedEquipmentIds = selections
            .map((isSelected, index) => isSelected ? equipments[index].equipmentId : null)
            .filter(id => id !== null);

        await saveEquipmentSelection(selectedEquipmentIds);
        const success = await submitReport(userName, gymName, selectedEquipmentIds);

        if (success) {
            setReportSubmitted(true);
        } else {
            console.log("Falha ao enviar o relatório.");
        }
        setShowConfirmation(false);
    };

    const handleSuccessDialogClose = () => {
        setReportSubmitted(false);
        navigate("/report-status");
    };

    const currentEquipment = equipments[currentIndex];
    const currentSelection = selections[currentIndex];

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6">Minha Academia TEM?</h1>
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
                        <p>Carregando...</p>
                    )}
                </div>
            </div>
            {showConfirmation && !reportSubmitted && (
                <ConfirmationDialog
                    onConfirm={handleConfirmSaveAndSubmit}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
            {reportSubmitted && <SuccessDialog onClose={handleSuccessDialogClose} />}
            <Footer />
        </>
    );
};

export default EquipmentSelectionPage;
