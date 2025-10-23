// src/features/Profile/services/profileService.js
import axios from "axios";
import { getAuthHeader } from "../../Auth/services/authHeaderService";

const API_URL = "http://localhost:8080/api/users";

export const getUserById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await axios.put(`${API_URL}/${id}`, userData, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

export const uploadUserImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
  return res.data;
};
