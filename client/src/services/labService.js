import api from "./api";

export const getLabs = async () => {
  const response = await api.get("/labs");
  return response.data;
};

export const getLabBySlug = async (slug) => {
  const response = await api.get(`/labs/${slug}`);
  return response.data;
};