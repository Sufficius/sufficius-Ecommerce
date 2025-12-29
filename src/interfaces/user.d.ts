interface User {
    id_user: string;
    name: string;
    email: string;
    telefone: string;
    avatar: string | null;
    data_nascimento: string;
    role: string;
}

interface IUser {
    id: string;
    name: string;
    email: string;
    born: string;
    password?: string;
    role: string;
    telefone: string;
    status: string;
}

interface UserAuth {
    token: string;
    user: {
        id_user: string,
        name: string,
        email: string,
        phone_number: string,
        avatar: string | null,
        born: string,
        role: string,
        BI:string,
    }
}

interface UserToCreate {
    name: string,
    email: string,
    phone_number: string,
    password: string,
    avatar?: string,
    born: Date | undefined,
    role: "ADMINISTRADOR" | "OPERADOR",
    user_status?: "ACTIVO" | "INACTIVO",
}

interface UserToEdit {
    name?: string,
    email?: string,
    password?: string,
    phone_number?: string,
    role?: string,
    avatar?: string,
    user_status?: "ACTIVO" | "INACTIVO",
    born?:Date | string,
}