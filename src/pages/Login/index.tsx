"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (email === "admin@email.com" && password === "123456") {
        toast.success("Sessão iniciada com sucesso");
        localStorage.setItem("token", "Adolfo Monteiro");
        navigate("/", { replace: true });
      } else {
        toast.error("Email ou palavra-passe inválidos!");
      }
    } catch {
      toast.error("Erro ao autenticar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg z-10"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg hover:bg-[#f0d270] bg-[#D4AF37] text-white font-medium  transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "A entrar..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
