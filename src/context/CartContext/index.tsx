// src/context/CartContext.tsx
import {
  PrimeiraImagem,
  QuartaImagem,
  QuintaImagem,
  SegundaImagem,
  SextaImagem,
  TerceiraImagem,
} from "@/components/images";
import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  carrinho: number[];
  adicionarAoCarrinho: (id: number) => void;
  removerDoCarrinho: (id: number) => void;
  produtos: Produto[];
}

interface Produto {
  id: number;
  imagem: JSX.Element;
  nome: string;
  descricao: string;
  preco: number;
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

  const produtos: Produto[] = [
    {
      id: 1,
      imagem: <PrimeiraImagem />,
      nome: "Rose de Soleil",
      descricao: "For Women",
      preco: 2500,
    },
    {
      id: 2,
      imagem: <SegundaImagem />,
      nome: "Zara Rosella",
      descricao: "Loui Martin",
      preco: 15000,
    },
    {
      id: 3,
      imagem: <TerceiraImagem />,
      nome: "Berry Kiss",
      descricao: "Body Luxures",
      preco: 5500,
    },
    {
      id: 4,
      imagem: <QuartaImagem />,
      nome: "Kiss Me",
      descricao: "Rumor Sexy",
      preco: 20000,
    },
    {
      id: 5,
      imagem: <QuintaImagem />,
      nome: "Sauvage",
      descricao: "Eau de Parfum",
      preco: 2500,
    },
    {
      id: 6,
      imagem: <SextaImagem />,
      nome: "3.4 Floz",
      descricao: "Zara Eau de Parfum",
      preco: 2500,
    },
  ];

  return (
    <CartContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, produtos }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
};
