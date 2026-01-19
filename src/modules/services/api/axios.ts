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
// import { toast } from "sonner";

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
  
  // // Log dos headers para debug
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('📋 Headers da requisição:', {
  //     'Authorization': config.headers.Authorization ? 'Presente' : 'Ausente',
  //     'Content-Type': config.headers['Content-Type'] || 'auto',
  //     'URL': config.url
  //   });
  // }
  
  return config;
}, (error) => {
  console.error('❌ Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// // ✅ INTERCEPTOR PARA RESPOSTAS (tratar erros 401)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error('❌ Erro na resposta:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data
//     });
    
//     // Se for erro 401 (Unauthorized)
//     if (error.response?.status === 401) {
      
//       // Limpar tokens locais
//       // localStorage.removeItem('token');
//       // localStorage.removeItem('authSufficius-token');
      
//       // Mostrar mensagem para o usuário
//       if (typeof window !== 'undefined') {
//         // Se estiver em uma rota protegida, redirecionar para login
//         if (window.location.pathname !== '/login') {
//           toast.error('Sessão expirada. Por favor, faça login novamente.');
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     // Se for erro 400 (Bad Request)
//     if (error.response?.status === 400) {
//       console.log('📝 Erro de validação:', error.response.data);
//     }
    
//     return Promise.reject(error);
//   }
// );

// Função de teste para verificar configuração
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testando conexão com API...');
    const response = await api.get('/health');
    console.log('✅ API conectada:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Falha ao conectar com API:', error);
    return false;
  }
};

// Função para verificar token manualmente
export const verifyToken = () => {
  const token = getToken();
  if (!token) {
    console.log('❌ Nenhum token encontrado');
    return null;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token não é JWT válido');
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const isExpired = Date.now() > payload.exp * 1000;
    
    console.log('🔍 Informações do token:', {
      userId: payload.id,
      email: payload.email,
      tipo: payload.tipo,
      expiracao: new Date(payload.exp * 1000).toLocaleString('pt-PT'),
      expirado: isExpired
    });
    
    return {
      token,
      payload,
      isExpired
    };
  } catch (error) {
    console.log('❌ Erro ao decodificar token:', error);
    return null;
  }
};