
import api from "./api";

export const getAdminQuestions = async (labId) => {
  const response = await api.get(
    `/admin/labs/${labId}/questions`
  );

  return response.data;
};

export const createAdminQuestion = async (
  labId,
  questionData
) => {
  const response = await api.post(
    `/admin/labs/${labId}/questions`,
    questionData
  );

  return response.data;
};

export const updateAdminQuestion = async (
  labId,
  questionId,
  questionData
) => {
  const response = await api.put(
    `/admin/labs/${labId}/questions/${questionId}`,
    questionData
  );

  return response.data;
};

export const deleteAdminQuestion = async (
  labId,
  questionId
) => {
  const response = await api.delete(
    `/admin/labs/${labId}/questions/${questionId}`
  );

  return response.data;
};
