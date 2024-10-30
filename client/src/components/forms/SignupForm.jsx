const SignupForm = ({
    title,
    buttonText,
    onSubmit,
    email,
    setEmail,
    password,
    setPassword,
    gymName,
    setGymName,
    gymLocation,
    setGymLocation,
    errorMessage,
    onLoginRedirect
}) => (
    <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-full max-w-xs">
            <form
                onSubmit={onSubmit}
                className="bg-[#1E1E1E] shadow-lg rounded px-8 pt-6 pb-8 mb-4"
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-white">{title}</h2>
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        type="text"
                        placeholder="Nome da Academia"
                        value={gymName}
                        onChange={(e) => setGymName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        type="text"
                        placeholder="Localização"
                        value={gymLocation}
                        onChange={(e) => setGymLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#2E2E2E] placeholder-gray-400"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
                )}
                <div className="flex items-center justify-center">
                    <button
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition duration-300"
                        type="submit"
                    >
                        {buttonText}
                    </button>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <p className="text-gray-400">Já tem uma conta?{' '}</p>
                    <button
                        onClick={onLoginRedirect}
                        className="text-[#3B82F6] hover:underline font-bold ml-1"
                    >
                        Faça login
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default SignupForm;
