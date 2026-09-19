import api from "./api";

export const getDashboard = async () => {
  const response = await api.get("/users/dashboard");

  return response.data;
};