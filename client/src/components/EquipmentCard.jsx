import ActionButton from './buttons/ActionButton';

const EquipmentCard = ({ equipment, onSelection, onBack, showBackButton, currentSelection, showCheckmark }) => {
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
            <h2 className="font-bold text-3xl text-center mb-6 text-gray-200">{equipment.name}</h2>
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
        </div>
    );
};

export default EquipmentCard;
