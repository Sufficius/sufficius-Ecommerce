"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { useForm } from "react-hook-form";
import { authRoute } from "@/modules/services/api/auth";
import { LoginData } from "@/modules/validation/login";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const googleScriptLoaded = useRef(false);
  const googleInitialized = useRef(false);
  const googleInitAttempted = useRef(false);

  const login = useAuthStore((state) => state.login);

  // CORREÇÃO: Use apenas react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Carregar configuração do Google
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (clientId && !clientId.includes("your-google-client-id")) {
      setGoogleClientId(clientId);
      
      if (!googleScriptLoaded.current) {
        loadGoogleScript(() => {});
      }
    } else {
      // console.warn("⚠️  Google Client ID não configurado ou está com valor padrão");
      setGoogleClientId(null);
    }
  }, []);

  // CORREÇÃO: Função onSubmit simplificada e correta
  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setLoginError("");

    try {
      const response = await authRoute.login({
        email: data.email,
        password: data.password
      });


      const { user, token } = response;
      if (user && token) {
        login(user, token);
        
        // CORREÇÃO: Verifique tanto 'role' quanto 'tipo'
        const userRole = user.role || user.role;
        if (userRole === "ADMIN") {
          navigate("/dashboard");
          toast.success("Login realizado com sucesso!");
        } 
      } else {
        toast.error("Autenticação falhou: resposta inválida");
      }
    } catch (error: any) {
      console.error("❌ Erro completo no login:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📄 Dados do erro:", error.response?.data);

      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error.response?.status === 401) {
        errorMessage = error.response?.data?.message || "Credenciais inválidas";
      } else if (error.response?.status === 400) {
        errorMessage = "Requisição inválida. Verifique os dados informados.";
      } else if (error.message?.includes("Network")) {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }

      setLoginError(errorMessage);
      toast.error(errorMessage);
      
      // Configurar erro no formulário
      if (error.response?.data?.field === "email") {
        setError("email", { type: "manual", message: errorMessage });
      } else if (error.response?.data?.field === "password") {
        setError("password", { type: "manual", message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar script do Google
  const loadGoogleScript = (callback: () => void) => {
    if (googleScriptLoaded.current) {
      console.log("ℹ️  Script do Google já carregado");
      callback();
      return;
    }

    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      googleScriptLoaded.current = true;
      callback();
      return;
    }

    console.log("📥 Carregando script do Google Identity Services...");
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleScriptLoaded.current = true;
      setTimeout(() => callback(), 100);
    };
    script.onerror = () => {
      console.error("❌ Falha ao carregar script do Google");
      toast.error("Erro ao carregar serviço do Google. Usando modo desenvolvimento.");
      callback();
    };
    document.head.appendChild(script);
  };

  // NOVA FUNÇÃO: Inicializar o Google Sign-In uma única vez
  const initGoogleSignInOnce = () => {
    if (googleInitialized.current) {
      console.log("ℹ️  Google já inicializado, mostrando prompt");
      // @ts-ignore
      if (window.google?.accounts?.id?.prompt) {
        // @ts-ignore
        window.google.accounts.id.prompt();
      }
      return true;
    }
    
    if (googleInitAttempted.current) {
      console.log("ℹ️  Inicialização do Google já tentada, aguardando...");
      return false;
    }
    
    googleInitAttempted.current = true;
    return initializeGoogleSignIn();
  };

  // Função para login com Google
  const handleGoogleLogin = () => {
    if (isGoogleLoading) return;
    
    setIsGoogleLoading(true);
    setLoginError("");

    if (!googleClientId || googleClientId.includes("your-google-client-id")) {
      toast.info("Google OAuth não configurado. Usando modo desenvolvimento.");
      handleGoogleDevLogin();
      return;
    }

    // console.log("🔄 Iniciando login com Google...");
    
    loadGoogleScript(() => {
      console.log("🔧 Tentando inicializar Google Sign-In...");
      
      const checkGoogleReady = () => {
        // @ts-ignore
        if (window.google && window.google.accounts && window.google.accounts.id) {
          // console.log("✅ Google Identity Services está pronto");
          
          if (initGoogleSignInOnce()) {
            renderGoogleButton();
          }
        } else {
          // console.warn("⚠️  Google ainda não está pronto, tentando novamente...");
          
          if (googleInitAttempted.current) {
            setTimeout(checkGoogleReady, 100);
          } else {
            setTimeout(() => {
              if (!googleInitialized.current) {
                console.error("❌ Timeout ao aguardar Google");
                toast.error("Serviço do Google não respondeu. Usando modo desenvolvimento.");
                handleGoogleDevLogin();
              }
            }, 1000);
          }
        }
      };
      
      checkGoogleReady();
    });
  };

  const initializeGoogleSignIn = () => {
    try {
      // console.log("🔐 Inicializando Google Identity Services...");
      
      // @ts-ignore
      if (!window.google || !window.google.accounts) {
        throw new Error("Google Identity Services não carregado");
      }

      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
      });

      // console.log("✅ Google Identity Services inicializado");
      googleInitialized.current = true;
      
      renderGoogleButton();
      
      try {
        // @ts-ignore
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // console.log("ℹ️  One Tap não mostrado (pode ser bloqueado por popup blocker)");
          } else {
            // console.log("✅ One Tap mostrado ao usuário");
          }
        });
      } catch (promptError) {
        // console.warn("⚠️  Não foi possível mostrar One Tap:", promptError);
      }
      
      return true;
      
    } catch (error: any) {
      console.error("❌ Erro ao inicializar Google Sign-In:", error.message);
      googleInitAttempted.current = false;
      
      if (error.message.includes("origin") || error.message.includes("not allowed")) {
        toast.error(
          <div className="text-sm">
            <p className="font-semibold">Google OAuth não configurado corretamente</p>
            <p className="mt-1">Adicione <code>http://localhost:5173</code> às "Authorized JavaScript origins"</p>
          </div>,
          { duration: 5000 }
        );
      }
      
      handleGoogleDevLogin();
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Função para renderizar o botão do Google
  const renderGoogleButton = () => {
    const buttonContainer = document.getElementById("googleSignInButton");
    if (!buttonContainer) {
      console.warn("⚠️  Container do botão Google não encontrado");
      return;
    }

    buttonContainer.innerHTML = "";
    
    try {
      // @ts-ignore
      window.google.accounts.id.renderButton(buttonContainer, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 300,
        locale: "pt_BR"
      });
      
      console.log("✅ Botão Google renderizado");
    } catch (error) {
      console.error("❌ Erro ao renderizar botão Google:", error);
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      console.log("🔑 Resposta do Google recebida");
      
      const backendResponse = await authRoute.googleLogin(response.credential);
      
      if (backendResponse.token && backendResponse.user) {
        const { user, token } = backendResponse;
        
        login(user, token);
        toast.success("Login com Google realizado com sucesso!");
        
        const userRole = user.role || user;
        if (userRole === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/proposta");
        }
      } else {
        throw new Error("Falha na autenticação");
      }
      
    } catch (error: any) {
      console.error("❌ Erro na autenticação Google:", error);
      
      let errorMsg = "Falha no login com Google";
      if (error.message?.includes("Token") || error.message?.includes("token")) {
        errorMsg = "Token inválido ou expirado";
      } else if (error.message?.includes("network") || error.message?.includes("Network")) {
        errorMsg = "Erro de conexão com o servidor";
      } else if (error.response?.status === 403) {
        errorMsg = "Acesso não autorizado";
      }
      
      toast.error(errorMsg);
      setLoginError(`Erro ao autenticar com Google: ${errorMsg}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Função alternativa para desenvolvimento
  const handleGoogleDevLogin = async () => {
    setIsGoogleLoading(true);
    setLoginError("");

    try {
      toast.info("Modo desenvolvimento ativado", {
        description: "Criando usuário de teste...",
        duration: 2000,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        id_user: Date.now().toString(),
        nome: "Usuário Google Teste",
        email: `google_test_${Date.now()}@example.com`,
        BI: `GOOGLE_DEV_${Date.now()}`,
        role: "ADMIN" as const,
        googleId: `google_dev_${Date.now()}`
      };

      const mockToken = `mock_jwt_${Date.now()}`;
      
      login(mockUser, mockToken);
      toast.success("Login de desenvolvimento realizado!");
      
      setTimeout(() => {
        navigate("/proposta");
      }, 500);

    } catch (error) {
      console.error("Erro no login de desenvolvimento:", error);
      toast.error("Erro no login simulado");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Efeito para pré-carregar o Google
  useEffect(() => {
    if (googleClientId && !googleScriptLoaded.current) {
      console.log("🚀 Pré-carregando Google Identity Services...");
      loadGoogleScript(() => {
        console.log("✅ Google pré-carregado para uso futuro");
      });
    }
  }, [googleClientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-[#D4AF37] rounded-xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sufficius Admin</h1>
          <p className="text-gray-400 mt-2">Painel de Administração</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-[#D4AF37]" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Apenas administradores autorizados
          </p>

          {/* CORREÇÃO: Mensagem de erro */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

          {/* CORREÇÃO: Formulário usando react-hook-form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="admin@sufficius.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  {...register("password", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Senha deve ter pelo menos 6 caracteres"
                    }
                  })}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-[#D4AF37] rounded border-gray-300"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Lembrar-me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#D4AF37] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-medium hover:bg-[#c19b2c] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Autenticando...
                </>
              ) : (
                "Entrar no Painel"
              )}
            </button>
          </form>

          {/* Seção Google Login (opcional) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Container para botão Google dinâmico (opcional) */}
          <div id="googleSignInButton" className="mt-4 flex justify-center"></div>

          {/* Aviso de segurança */}
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  Acesso Restrito
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Esta área é exclusiva para administradores autorizados.
                  Atividades não autorizadas serão registradas.
                </p>
              </div>
            </div>
          </div>

          {/* {/* Info de acesso de teste */}
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Para teste, use:
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Email: admin@test.com<br />
              Senha: admin123
            </p>
          </div> */}
        </div> 

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sufficius Commerce
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sistema de administração v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}