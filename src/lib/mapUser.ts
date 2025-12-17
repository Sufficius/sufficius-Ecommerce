
export const mapUser = (apiUser: any): User => ({
    id_user: apiUser.id_user,
    name: apiUser.name,
    email: apiUser.email,
    telefone: apiUser.phone_number,
    data_nascimento: apiUser.born,
    avatar: apiUser.avatar,
    role: apiUser.role,
});
