// src/modules/services/store/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface CartStore {
  items: CartItem[];
  addItem: (produto: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  getItem: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (produto) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === produto.id);
        
        if (existingItem) {
          // Se o produto já existe, atualiza a quantidade
          set({
            items: currentItems.map(item =>
              item.id === produto.id
                ? {
                    ...item,
                    quantidadeSelecionada: Math.min(
                      item.quantidadeSelecionada + produto.quantidadeSelecionada,
                      item.quantidade // Não pode exceder o estoque
                    )
                  }
                : item
            )
          });
        } else {
          // Adiciona novo produto
          set({ items: [...currentItems, produto] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      
      updateQuantity: (id, quantidade) => {
        const currentItems = get().items;
        const item = currentItems.find(item => item.id === id);
        
        if (!item) return;
        
        // Valida se a quantidade é válida (entre 1 e quantidade disponível)
        const novaQuantidade = Math.max(1, Math.min(quantidade, item.quantidade));
        
        set({
          items: currentItems.map(item =>
            item.id === id
              ? { ...item, quantidadeSelecionada: novaQuantidade }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.preco * item.quantidadeSelecionada),
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantidadeSelecionada,
          0
        );
      },
      
      getItem: (id) => {
        return get().items.find(item => item.id === id);
      }
    }),
    {
      name: 'cart-storage', // Nome para localStorage
    }
  )
);