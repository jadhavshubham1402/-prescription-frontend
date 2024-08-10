import Axios from "./axios";

export const login = (data) => {
  return Axios.post("/api/login", data);
};

export const register = (data) => {
  return Axios.post("/api/register", data);
};

export const getAllUser = (data) => {
  return Axios.post("/api/getAllUser", data);
};

export const getOneUser = (data) => {
  return Axios.post("/api/getOneUser", data);
};

export const createConsultant = (data) => {
  return Axios.post("/api/createConsultant", data);
};

export const createPrescription = (data) => {
  return Axios.post("/api/createPrescription", data);
};

export const updatePrescription = (data) => {
  return Axios.post("/api/updatePrescription", data);
};

export const getAllConsultant = (data) => {
  return Axios.post("/api/getAllConsultant", data);
};

export const getOnePrescription = (data) => {
  return Axios.post("/api/getOnePrescription", data);
};
