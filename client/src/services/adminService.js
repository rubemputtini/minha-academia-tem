import api from "./api";

export const getUsers = async () => {
  const response = await api.get('/admin/users');

  return response.data;
};

export const getUserEquipments = async (userId) => {
  const response = await api.get(`admin/GetUserEquipments/${userId}`);

  return response.data;
};
