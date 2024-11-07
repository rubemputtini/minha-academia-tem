import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EquipmentCard from '../components/EquipmentCard';
import { submitReport } from '../services/reportService';
import { fetchEquipments } from '../services/equipmentService';
import { getToken } from '../services/auth';
import { fetchUserDetails } from '../services/userService';

const EquipmentSelectionPage = () => {
    const [equipments, setEquipments] = useState([]);
    const [selections, setSelections] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCheckmark, setShowCheckMark] = useState(false);
    const [gymName, setGymName] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const loadEquipments = async () => {
            try {
                const equipmentData = await fetchEquipments();
                setEquipments(equipmentData);
                setSelections(new Array(equipmentData.length).fill(false));

                const token = getToken();
                const userDetails = await fetchUserDetails(token);
                setUserName(userDetails.email);
                setGymName(userDetails.gymName);
            } catch (error) {
                console.error("Erro ao buscar a lista de equipamentos:", error);
            }
        };

        loadEquipments();
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
                const selectedEquipmentIds = updatedSelections
                    .map((isSelected, index) => isSelected ? equipments[index].equipmentId : null)
                    .filter(id => id !== null);

                submitReport(userName, gymName, selectedEquipmentIds);
            }
        }, 900);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
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
            <Footer />
        </>
    );
};

export default EquipmentSelectionPage;
