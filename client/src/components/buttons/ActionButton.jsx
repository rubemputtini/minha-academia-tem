const ActionButton = ({ label, colorClass, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={`py-4 px-10 text-xl rounded-full shadow-lg transition-all duration-200 w-full md:max-w-sm ${isSelected ? `${colorClass}` : `${colorClass} hover:${colorClass}`
                }`}
        >
            {label}
        </button>
    );
};

export default ActionButton;
