const ActionButton = ({ label, colorClass, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={`py-4 px-10 text-xl rounded-full shadow-lg transition-all duration-200 w-full ${isSelected ? `${colorClass}-600` : `${colorClass}-500 hover:${colorClass}-600`
                }`}
        >
            {label}
        </button>
    );
};

export default ActionButton;
