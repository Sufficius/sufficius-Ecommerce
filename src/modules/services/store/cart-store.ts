// src/modules/services/store/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/axios';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  imagem?: string;
  categoria?: string;
  quantidadeSelecionada: number;
}

interface UserCart {
  [userId: string]: CartItem[];
}

interface CartStore {
  userCarts: UserCart;
  currentUserId: string | null;
  setCurrentUser: (userId: string | null) => void;
  addItem: (produto: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  getTotalItemsDoUsuario: (userId: string) => number;
  getItem: (id: string) => CartItem | undefined;
  getItemsDoUsuarioAtual: () => CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      userCarts: {},
      currentUserId: null,

      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },

      addItem: (produto) => {
        const { currentUserId, userCarts } = get();

        if (!currentUserId) {
          toast.error("Faça login para adicionar produtos ao carrinho");
          return;
        }
        const userCart = userCarts[currentUserId] || [];
        const existingItem = userCart.find(item => item.id === produto.id);

        let newUserCart: CartItem[];

        if (existingItem) {
          // Se o produto já existe, atualiza a quantidade
          newUserCart = userCart.map(item =>
            item.id === produto.id
              ? {
                ...item,
                quantidadeSelecionada: Math.min(item.quantidadeSelecionada + produto.quantidadeSelecionada, item.quantidade)
              }
              : item
          );
        } else {
          // Adiciona novo produto
          newUserCart = [...userCart, produto];
        }

        set({
          userCarts: {
            ...userCarts,
            [currentUserId]: newUserCart
          }
        });
        toast.success("Produto adicionado ao carrinho!");
      },

      removeItem: async (id) => {
        const { currentUserId, userCarts } = get();

        if (!currentUserId) return;

        try {
          await api.delete(`/carrinho/item/${id}`);

          const userCart = userCarts[currentUserId] || [];
          const newUserCart = userCart.filter(item => item.id !== id);

          set({
            userCarts: {
              ...userCarts,
              [currentUserId]: newUserCart
            }
          });

          toast.info("Produto removido do carrinho");
        } catch (error) {
          console.error('Erro ao remover item:', error);
          toast.error("Erro ao remover produto");
        }
      },

      updateQuantity: (id, quantidade) => {
        const { currentUserId, userCarts } = get();
        if (!currentUserId) return;

        const userCart = userCarts[currentUserId] || [];
        const item = userCart.find(item => item.id === id);

        if (!item) return;

        // Valida se a quantidade é válida (entre 1 e quantidade disponível)
        const novaQuantidade = Math.max(1, Math.min(quantidade, item.quantidade));

        const newUserCart = userCart.map(item =>
          item.id === id
            ? { ...item, quantidadeSelecionada: novaQuantidade }
            : item
        );

        set({
          userCarts: {
            ...userCarts,
            [currentUserId]: newUserCart
          }
        });
      },

      clearCart: async () => {
        const { currentUserId, userCarts } = get();
        if (!currentUserId) return;

        try {
          await api.delete(`/carrinho/limpar`);

          set({
            userCarts: {
              ...userCarts,
              [currentUserId]: []
            }
          });

          toast.success("Carrinho limpo com sucesso!");
        } catch (error) {
          console.error('Erro ao limpar carrinho:', error);
          toast.error("Erro ao limpar carrinho");
        }
      },

      getTotal: () => {
        const { currentUserId, userCarts } = get();
        if (!currentUserId) return 0;

        const userCart = userCarts[currentUserId] || [];

        return userCart.reduce(
          (total, item) => total + (item.preco * item.quantidadeSelecionada),
          0
        );
      },

      getTotalItems: () => {
        const { currentUserId, userCarts } = get();

        if (!currentUserId) return 0;
        const userCart = userCarts[currentUserId] || [];

        return userCart.reduce(
          (total, item) => total + item.quantidadeSelecionada,
          0
        );
      },

      getTotalItemsDoUsuario: (userId: string) => {
        const { userCarts } = get();
        const userCart = userCarts[userId] || [];

        return userCart.reduce(
          (total, item) => total + item.quantidadeSelecionada,
          0
        );
      },

      getItem: (id) => {
        const { currentUserId, userCarts } = get();

        if (!currentUserId) return undefined;

        const userCart = userCarts[currentUserId] || [];
        return userCart.find(item => item.id === id);
      },

      getItemsDoUsuarioAtual: () => {
        const { currentUserId, userCarts } = get();

        if (!currentUserId) return [];

        return userCarts[currentUserId] || [];
      },
    }),
    {
      name: 'cart-storage', // Nome para localStorage
    }
  )
);