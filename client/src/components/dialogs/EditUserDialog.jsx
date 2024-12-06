import { useState, useEffect } from 'react';
import { updateUser } from '../../services/userService';
import { CircularProgress } from '@mui/material';

const EditUserDialog = ({ user, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gymName: '',
        gymLocation: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                gymName: user.gymName || '',
                gymLocation: user.gymLocation || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateUser(user.id, formData);
            onUpdate(user.id, formData);
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form
                onSubmit={handleFormSubmit}
                className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center mx-4 sm:mx-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Usuário</h3>
                <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Nome</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Academia</label>
                    <input
                        type="text"
                        name="gymName"
                        value={formData.gymName}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 font-medium mb-1">Localização</label>
                    <input
                        type="text"
                        name="gymLocation"
                        value={formData.gymLocation}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>
                <div className="flex mt-4 justify-center gap-3">
                    <button
                        type="submit"
                        className={`px-5 py-2 bg-green-500 text-white text-lg font-semibold rounded-xl transition duration-300 hover:bg-green-600 transform hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "SALVAR"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-500 text-white text-lg font-semibold rounded-xl transition duration-300 hover:bg-gray-600 transform hover:scale-105"
                        disabled={isLoading}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserDialog;
