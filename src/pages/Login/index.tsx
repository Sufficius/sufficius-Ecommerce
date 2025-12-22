import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginSchema, loginSchema } from "@/modules/validation/login";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { authRoute } from "@/modules/services/api/auth";
import Cookies from "js-cookie";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { mapUser } from "@/lib/mapUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authRoute.login(values);
      const { user, token } = response;

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      Cookies.set("Sufficius-role", user.role);
      Cookies.set("Sufficius-token", token, { expires: expirationDate });
      toast.success("Sessão iniciada com sucesso");
      login(mapUser(user), token);

      let rota = user.role === "ADMINISTRADOR" ? "/" : "/auth/login";
      navigate(rota, { replace: true });
    } catch (error: any) {
      if (error || error.response?.data?.error === "User not found") {
        toast.error("Credenciais inválidas! Tente novamente.");
      }
      toast.error("Erro ao autenticar!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-full border rounded-xl p-11">
        <h1 className="text-2xl font-semibold text-center mb-6">Entrar</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="border-gray-300 focus:border-blue-500"
                      {...field}
                      aria-label="Email"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-black">Senha</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        className="border-gray-300 focus:border-blue-500"
                        {...field}
                        aria-label="Senha"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-[53px] transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="size-5" />
                        ) : (
                          <EyeOff className="size-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 p-5 rounded-lg hover:bg-[#f0d270] bg-[#D4AF37] text-white font-medium  transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "A entrar..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
