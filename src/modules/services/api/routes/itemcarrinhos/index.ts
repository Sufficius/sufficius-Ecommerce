import { api } from "../../axios";


class ItemsCarrinhosRoute {
  async getItemCarrinho() {
    try {
      const response = await api.get("/itemcarrinho");
      return response.data
    }
    catch (error: any) {
      console.error('Erro ao buscar item do carrinho:', error);
      throw new Error("Erro ao carregar item do carrinho");
    }
  }

}

export const itemcarrinhosRoute = new ItemsCarrinhosRoute();