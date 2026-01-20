// import axios from "axios";

// // const apiUrl =  "https://sufficius-ecommerce-back.onrender.com";
// const localUrl = import.meta.env.VITE_API_URL;
// export const api = axios.create({
//     baseURL: localUrl,
//     // baseURL: apiUrl,
//     withCredentials: true
// })

// // ✅ INTERCEPTOR para FormData
// api.interceptors.request.use((config) => {
//   // Se os dados são FormData, remover Content-Type para o browser definir
//   if (config.data instanceof FormData) {
//     delete config.headers['Content-Type']; // Deixe o browser definir
//   }
//   return config;
// });

import axios from "axios";

// const apiUrl =  "https://sufficius-ecommerce-back.onrender.com";
const localUrl = import.meta.env.VITE_API_URL;

// FUNÇÃO PARA EXTRAIR O TOKEN DO COOKIE OU LOCALSTORAGE
const getToken = (): string | null => {  
  // 1. Primeiro tenta do localStorage
  let token = localStorage.getItem('token');
  if (!token) {
    token = localStorage.getItem('authSufficius-token');
  }
  
  // 2. Se não tiver no localStorage, tenta do COOKIE
  if (!token) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'authSufficius-token') {
        token = decodeURIComponent(value);
        break;
      }
    }
  }
  
  // 3. Verifica se é um token válido
  if (token) {
    // Verifica se tem formato JWT (3 partes separadas por ponto)
    if (token.split('.').length === 3) {
      return token;
    } else {
      return null;
    }
  }
  
  return null;
};

// Configuração base do axios
export const api = axios.create({
  baseURL: localUrl,
  withCredentials: true, // Importante para enviar cookies automaticamente
  timeout: 30000, // 30 segundos de timeout
});

// ✅ INTERCEPTOR PARA ADICIONAR TOKEN AUTOMATICAMENTE
api.interceptors.request.use((config) => {
  
  // Obter o token
  const token = getToken();
  
  if (token) {
    // Adicionar token ao header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    
    // Se for uma rota protegida (POST, PUT, DELETE, PATCH em /produtos), avisar
    const isProtectedRoute = config.url?.includes('/produtos') && 
                            ['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '');
    
    if (isProtectedRoute) {
      console.error('❌ Tentando acessar rota protegida sem token!');
    }
  }
  
  // Se os dados são FormData, remover Content-Type para o browser definir
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']; // Deixe o browser definir
  }
  
  return config;
}, (error) => {
  console.error('❌ Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});


// Função para verificar token manualmente
export const verifyToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const isExpired = Date.now() > payload.exp * 1000;
    
    
    return {
      token,
      payload,
      isExpired
    };
  } catch (error) {
    return null;
  }
};