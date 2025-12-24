"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      if (email === "admin@sufficius.com" && senha === "admin123") {
        localStorage.setItem("adminToken", "fake-jwt-token");
        localStorage.setItem("adminRole", "super_admin");
        localStorage.setItem("adminName", "Administrador");
        
        toast.success("Login realizado com sucesso!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Credenciais inválidas");
      }
      setLoading(false);
    }, 1500);
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="admin@sufficius.com"
                  required
                />
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="••••••••"
                  required
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

          {/* Info de acesso de teste */}
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Credenciais de teste: <br />
              <span className="text-gray-700">admin@sufficius.com</span> / 
              <span className="text-gray-700"> admin123</span>
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