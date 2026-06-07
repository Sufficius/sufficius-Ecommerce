import Cookies from "js-cookie";
import { toast } from "sonner";
import { create } from "zustand";

interface User {
    id_usuario: string;
    nome: string;
    email: string;
    role: string;
    BI: string;
    avatar?: string | null;
    googleId?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
        user: Cookies.get("authSufficius-user") ? JSON.parse(Cookies.get("authSufficius-user")!) : null,
        token: Cookies.get("authSufficius-token") || null,
        isAuthenticated: !!Cookies.get("authSufficius-token"),
        login: (user, token) => {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);

            Cookies.set("authSufficius-token", token, { expires: expirationDate });
            Cookies.set("authSufficius-user", JSON.stringify(user), { expires: expirationDate },);
            set({
                user,
                token,
                isAuthenticated: true,
            });
        },
        logout: async () => {
            toast.loading("Terminando a sessão...");

            await new Promise(resolve => setTimeout(resolve, 800));

            toast.dismiss();

            toast.success("Sessão terminada com sucesso!");

            await new Promise(resolve => setTimeout(resolve, 500));

            Cookies.remove("Sufficius-role");
            Cookies.remove("Sufficius-token");
            Cookies.remove("authSufficius-token");
            Cookies.remove("authSufficius-user");

            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });

            window.location.href = "/";
        },
    }));