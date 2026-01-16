import { api } from "../../axios";

interface ICategoria {
    id: string;
    nome: string;
    descricao: string;
    criadoEm: string;
    atualizadoEm: string;
}

interface CategoriasResponse {
    success: boolean;
    data: ICategoria[];
    total: number;
}
interface CategoriaToCreate {
    nome: string;
    descricao: string;
}

class CategoriaRoutes {

    async criarCategoria(data: CategoriaToCreate) {
        const response = await api.post("/categorias", data);
        return response.data;
    }

    async getAllCategoria() {
        const response = await api.get<CategoriasResponse>("/categorias");
        return response.data.data;
    }

    async getCategoriaById(id_produto: string) {
        const response = await api.get<ICategoria>(`/categorias/${id_produto}`);
        return response.data;
    }
}
export const categoriaRoutes = new CategoriaRoutes();