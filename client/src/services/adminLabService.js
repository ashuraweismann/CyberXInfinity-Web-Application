
import api from "./api";

export const getAdminLabs = async (params = {}) => {
  const response = await api.get("/admin/labs", {
    params,
  });

  return response.data;
};

export const getAdminLab = async (id) => {
  const response = await api.get(`/admin/labs/${id}`);

  return response.data;
};

export const createAdminLab = async (labData) => {
  const response = await api.post("/admin/labs", labData);

  return response.data;
};

export const updateAdminLab = async (id, labData) => {
  const response = await api.put(
    `/admin/labs/${id}`,
    labData
  );

  return response.data;
};

export const deleteAdminLab = async (id) => {
  const response = await api.delete(`/admin/labs/${id}`);

  return response.data;
};
