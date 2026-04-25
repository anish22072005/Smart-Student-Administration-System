import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
});

export const getStudents = async (filters = {}) => {
  const response = await api.get("/students", { params: filters });
  return response.data;
};

export const getStudentStats = async () => {
  const response = await api.get("/students/stats");
  return response.data;
};

export const createStudent = async (payload) => {
  const response = await api.post("/students", payload);
  return response.data;
};

export const updateStudent = async (studentId, payload) => {
  const response = await api.put(`/students/${studentId}`, payload);
  return response.data;
};

export const deleteStudent = async (studentId) => {
  await api.delete(`/students/${studentId}`);
};
