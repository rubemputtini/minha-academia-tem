import axios from "axios";
import { API_URL } from "../utils/constants";
import { getToken } from "./auth";

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: {
        'Authorization': `Bearer ${getToken()}`,
    },
});

  return response.data;
};

export const getUserEquipments = async (userId) => {
  const response = await axios.get(`${API_URL}/admin/GetUserEquipments/${userId}`, {
    headers: {
        'Authorization': `Bearer ${getToken()}`,
    },
});

  return response.data;
};
