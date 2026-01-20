"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { useForm } from "react-hook-form";
import { authRoute } from "@/modules/services/api/auth";
import { LoginData } from "@/modules/validation/login";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const googleScriptLoaded = useRef(false);
  const googleInitialized = useRef(false);

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Carregar configuração do Google
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (clientId && !clientId.includes("your-google-client-id")) {
      setGoogleClientId(clientId);

      // Pré-carregar o script do Google
      loadGoogleScript();
    } else {
      console.warn("⚠️ Google Client ID não configurado no .env");
      setGoogleClientId(null);
    }
  }, []);

  // Inicializar o Google quando o script carregar
  useEffect(() => {
    if (
      googleClientId &&
      googleScriptLoaded.current &&
      !googleInitialized.current
    ) {
      initializeGoogleSignIn();
    }
  }, [googleClientId]);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setLoginError("");

    try {
      const response = await authRoute.login({
        email: data.email,
        password: data.password,
      });

      const { user, token } = response;
      if (user && token) {
        login(user, token);

        const userRole = user.role || user.tipo;
        if (userRole === "ADMIN") {
          navigate("/dashboard");
          toast.success("Login realizado com sucesso!");
        } else if (userRole === "CLIENTE") {
          navigate("/");
          toast.success("Login realizado com sucesso!");
        }
      } else {
        toast.error("Autenticação falhou: resposta inválida");
      }
    } catch (error: any) {
      console.error("❌ Erro completo no login:", error);

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

      if (error.response?.data?.field === "email") {
        setError("email", { type: "manual", message: errorMessage });
      } else if (error.response?.data?.field === "password") {
        setError("password", { type: "manual", message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Função simplificada para carregar script do Google
  const loadGoogleScript = () => {
    if (googleScriptLoaded.current) {
      return;
    }

    if (
      document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      )
    ) {
      googleScriptLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleScriptLoaded.current = true;
    };
    script.onerror = () => {
      console.error("❌ Falha ao carregar script do Google");
    };
    document.head.appendChild(script);
  };

  // Inicializar o Google Sign-In
  const initializeGoogleSignIn = () => {
    if (googleInitialized.current || !googleClientId) return;

    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        return;
      }

      window.google.accounts.id!.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
        use_fedcm_for_prompt: true,
      });

      googleInitialized.current = true;
    } catch (error: any) {
      console.error("❌ Erro ao inicializar Google Sign-In:", error.message);

      if (
        error.message.includes("origin") ||
        error.message.includes("not allowed")
      ) {
        toast.error(
          <div className="text-sm">
            <p className="font-semibold">
              Google OAuth não configurado corretamente
            </p>
            <p className="mt-1">
              Você precisa configurar o Google Cloud Console:
              <br />
              1. Acesse{" "}
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                className="underline"
              >
                Google Cloud Console
              </a>
              <br />
              2. Vá para "APIs & Services" → "Credentials"
              <br />
              3. Clique no seu OAuth 2.0 Client ID
              <br />
              4. Em "Authorized JavaScript origins" adicione:
              <br />• <code>http://localhost:5173</code>
              <br />• <code>http://localhost:3000</code>
              <br />
              5. Em "Authorized redirect URIs" adicione:
              <br />• <code>http://localhost:5173</code>
              <br />• <code>http://localhost:3000</code>
            </p>
          </div>,
          { duration: 10000 }
        );
      }
    }
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

    // Verifica se o Google já está inicializado
    if (!googleInitialized.current) {
      loadGoogleScript();

      // Tenta inicializar se o script já carregou
      if (googleScriptLoaded.current) {
        initializeGoogleSignIn();
      }

      // Aguarda um pouco para garantir a inicialização
      setTimeout(() => {
        triggerGoogleLogin();
      }, 500);
    } else {
      triggerGoogleLogin();
    }
  };

  // Função para acionar o popup do Google
  const triggerGoogleLogin = () => {
    try {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        // Método direto para acionar o popup do Google
        window.google.accounts.id.prompt();

        // Alternativa: usar o método renderButton para criar um botão temporário
        const tempContainer = document.createElement("div");
        window.google.accounts.id.renderButton(tempContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 240,
          locale: "pt_BR",
        });

        // Simula clique no botão
        const button = tempContainer.querySelector('div[role="button"]');
        if (button) {
          (button as HTMLElement).click();
        }
      } else {
        console.error("Google Identity Services não disponível");
        toast.error(
          "Serviço do Google não está disponível. Verifique sua conexão."
        );
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Erro ao acionar Google Login:", error);
      toast.error("Erro ao abrir login do Google");
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      const backendResponse = await authRoute.googleLogin(response.credential);

      if (backendResponse.token && backendResponse.user) {
        const { user, token } = backendResponse;

        login(user, token);
        toast.success("Login com Google realizado com sucesso!");

        const userRole = user.role || user.tipo;
        if (userRole === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Falha na autenticação");
      }
    } catch (error: any) {
      console.error("❌ Erro na autenticação Google:", error);

      let errorMsg = "Falha no login com Google";
      if (
        error.message?.includes("Token") ||
        error.message?.includes("token")
      ) {
        errorMsg = "Token inválido ou expirado";
      } else if (
        error.message?.includes("network") ||
        error.message?.includes("Network")
      ) {
        errorMsg = "Erro de conexão com o servidor";
      } else if (error.response?.status === 403) {
        errorMsg = "Acesso não autorizado";
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("origin")
      ) {
        errorMsg =
          "Domínio não autorizado. Configure corretamente no Google Cloud Console.";
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id_user: Date.now().toString(),
        nome: "Usuário Google Teste",
        email: `google_test_${Date.now()}@example.com`,
        BI: `GOOGLE_DEV_${Date.now()}`,
        role: "ADMIN" as const,
        googleId: `google_dev_${Date.now()}`,
      };

      const mockToken = `mock_jwt_${Date.now()}`;

      login(mockUser, mockToken);
      toast.success("Login de desenvolvimento realizado!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Erro no login de desenvolvimento:", error);
      toast.error("Erro no login simulado");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

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
                      message: "Email inválido",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="admin@sufficius.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
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
                      message: "Senha deve ter pelo menos 6 caracteres",
                    },
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
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
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
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

          {/* Seção Google Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 w-full max-w-xs"
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

            {/* Instruções de configuração (apenas se houver erro) */}
            {!googleClientId && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Google OAuth não configurado:</strong> Adicione no seu
                  arquivo <code>.env</code>:
                </p>
                <pre className="text-xs mt-1 bg-black/10 p-2 rounded">
                  VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui
                </pre>
              </div>
            )}
          </div>

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
