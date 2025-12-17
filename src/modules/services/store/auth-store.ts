import Cookies from "js-cookie";
import { create } from "zustand";

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
        logout: () => {
            Cookies.remove("Sufficius-role");
            Cookies.remove("Sufficius-token");
            Cookies.remove("authSufficius-token");
            Cookies.remove("authSufficius-user");
            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        },
    })
);