// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  carrinho: number[];
  adicionarAoCarrinho: (id: number) => void;
  removerDoCarrinho: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<number[]>([]);

  const adicionarAoCarrinho = (id: number) => {
    setCarrinho((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removerDoCarrinho = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item !== id));
  };

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
};
