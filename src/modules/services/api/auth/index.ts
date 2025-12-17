import { api } from "../axios";

class AuthClass {
    async login(login: Login) {
        const { data } = await api.post<UserAuth>("/auth/login", login, {
            method: "POST",
            withCredentials: true,
        })
        return data;
    }
    async getUser() {
        const { data } = await api.get<UserAuth>("/auth/user-info", {
            withCredentials: true
        })
        return data;
    }

    async logout() {
        const { data } = await api.post("/auth/logout", {}, {
            withCredentials: true
        })
        return data;
    }
}

export const authRoute = new AuthClass();