import { useState } from 'react';
import ActionButton from './buttons/ActionButton';
import VideoModal from './VideoModal';

const EquipmentCard = ({ equipment, onSelection, onBack, showBackButton, currentSelection, showCheckmark }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openVideoModal = () => setModalOpen(true);
    const closeVideoModal = () => setModalOpen(false);

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 h-auto flex flex-col justify-between items-center w-auto md:max-w-sm mx-auto relative">
            {showCheckmark && currentSelection !== undefined && (
                <div
                    className={`absolute inset-0 flex justify-center items-center text-9xl font-bold text-white ${currentSelection ? 'text-green-500' : 'text-red-500'
                        } animate-fade`}
                >
                    {currentSelection ? '✔️' : '❌'}
                </div>
            )}
            <img
                src={equipment.photoUrl}
                alt={equipment.name}
                className="w-full h-full object-cover mb-6 rounded-lg shadow-md"
            />
            <div className="flex items-center justify-center gap-2 mb-6">
                <h2 className="font-bold text-xl md:text-2xl text-center text-gray-200">{equipment.name}</h2>
                <button
                    onClick={openVideoModal}
                    className="text-xl text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label={`Assistir vídeo sobre o equipamento ${equipment.name}`}
                >
                    🎥
                </button>
            </div>
            <div className="flex flex-col items-center gap-4 w-full">
                <ActionButton
                    label="SIM 😄"
                    colorClass="bg-green-500 hover:bg-green-600"
                    onClick={() => onSelection(true)}
                    isSelected={currentSelection === true}
                />
                <ActionButton
                    label="NÃO 🥲"
                    colorClass="bg-red-500 hover:bg-red-600"
                    onClick={() => onSelection(false)}
                    isSelected={currentSelection === false}
                />
                {showBackButton && (
                    <ActionButton
                        label="VOLTAR 🔙"
                        colorClass="bg-gray-300 hover:bg-gray-400"
                        onClick={onBack}
                        isSelected={false}
                    />
                )}
            </div>
            <VideoModal
                videoUrl={equipment.videoUrl}
                isOpen={isModalOpen}
                onClose={closeVideoModal}
            />
        </div>
    );
};

export default EquipmentCard;
