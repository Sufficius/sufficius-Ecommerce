import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ?? "https://sufficius-ecommerce-back.onrender.com";

export const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
})