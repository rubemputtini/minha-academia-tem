import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EquipmentCard from '../components/EquipmentCard';

const EquipmentSelectionPage = () => {
    const [equipments, setEquipments] = useState([]);
    const [selections, setSelections] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reportSent, setReportSent] = useState(false);

    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/Equipment`);
                setEquipments(response.data);
                setSelections(new Array(response.data.length).fill(undefined));
            } catch (error) {
                console.error("Error fetching equipments:", error);
            }
        };

        fetchEquipments();
    }, []);

    const handleSelection = (selected) => {
        const updatedSelections = [...selections];
        updatedSelections[currentIndex] = selected;
        setSelections(updatedSelections);

        if (currentIndex < equipments.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitReport(updatedSelections);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const submitReport = async (selectionsData) => {
        if (reportSent) {
            alert('Relatório já foi enviado!');
            return;
        }

        const userEmail = localStorage.getItem('userEmail');
        const gymReport = {
            userName: userEmail,
            selectedEquipments: selectionsData,
        };

        try {
            await axios.post(`${API_URL}/api/v1/Report/send-gym-report`, gymReport);
            setReportSent(true);
            alert('Relatório enviado com sucesso!');
        } catch (error) {
            console.error('Error sending report:', error);
            alert('Erro ao enviar o relatório.');
        }
    };

    const currentEquipment = equipments[currentIndex];
    const currentSelection = selections[currentIndex];

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6 text-white">Minha Academia TEM?</h1>
                <div className="flex justify-center w-full">
                    {currentEquipment ? (
                        <EquipmentCard
                            equipment={currentEquipment}
                            onSelection={handleSelection}
                            onBack={handleBack}
                            showBackButton={currentIndex > 0}
                            currentSelection={currentSelection}
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
