import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const ResetPasswordForm = ({
    email,
    token,
    onSubmit,
    errorMessage,
    errorDetails,
    disableSubmit,
    buttonText,
}) => {
    const [newPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newPassword, confirmPassword);
    };

    return (
        <div className="flex-grow flex justify-center items-center">
            <div className="w-full max-w-xs">
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#1E1E1E] shadow-lg rounded px-8 pt-6 pb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        Redefinir Senha
                    </h2>
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nova Senha"
                            value={newPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                    </div>
                    <div className="mb-4 relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                        >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                    </div>
                    {errorDetails && errorDetails.length > 0 ? (
                        <ul className="text-red-500 text-xs italic mb-4 list-disc list-inside">
                            {errorDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    ) : errorMessage && (
                        <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
                    )}
                    <div className="flex items-center justify-center">
                        <button
                            className={`bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition duration-300 ${disableSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={disableSubmit}
                        >
                            {disableSubmit ? <CircularProgress size={20} color="inherit" /> : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
