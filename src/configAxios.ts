import axios, { type AxiosInstance } from "axios";
import { API_URL } from "./constants/apiUrl";

const getAxios = async (timeout: number = 600000) => {
  const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: timeout,
  });

  return instance;
};

export default getAxios;
