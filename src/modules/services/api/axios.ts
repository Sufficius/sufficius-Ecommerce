import axios from "axios";

const apiUrl =  "https://sufficius-ecommerce-back.onrender.com";
// const localUrl = import.meta.env.VITE_API_URL;
export const api = axios.create({
    // baseURL: localUrl,
    baseURL: apiUrl,
    withCredentials: true
})