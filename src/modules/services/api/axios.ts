import axios from "axios";

const apiUrl =  "https://sufficius-ecommerce-back.onrender.com";
// const localUrl = import.meta.env.VITE_API_URL;
export const api = axios.create({
    // baseURL: localUrl,
    baseURL: apiUrl,
    withCredentials: true
})

// ✅ INTERCEPTOR para FormData
api.interceptors.request.use((config) => {
  // Se os dados são FormData, remover Content-Type para o browser definir
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']; // Deixe o browser definir
  }
  return config;
});