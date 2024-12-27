import { CircularProgress } from "@mui/material";

const ForgotPasswordForm = ({
    email,
    setEmail,
    onSubmit,
    errorMessage,
    disableSubmit,
    buttonText,
}) => {

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="w-full max-w-xs bg-[#1E1E1E] shadow-lg rounded px-8 pt-6 pb-8"
            >
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    Recuperar Senha
                </h2>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                    />
                </div>
                {errorMessage && (
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
        </>
    );
};

export default ForgotPasswordForm;
