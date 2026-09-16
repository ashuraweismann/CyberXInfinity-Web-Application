import api from "./api";

export const getQuizByLab = async (labId) => {
  const response = await api.get(`/quizzes/lab/${labId}`);

  return response.data;
};

export const submitQuiz = async (labId, answers) => {
  const response = await api.post(
    `/quizzes/${labId}/submit`,
    {
      answers,
    }
  );

  return response.data;
};