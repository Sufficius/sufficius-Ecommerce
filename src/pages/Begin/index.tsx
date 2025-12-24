"use client";

import {
  PrimeiraImagem,
  QuartaImagem,
  QuintaImagem,
  SegundaImagem,
  SextaImagem,
  TerceiraImagem,
} from "../../components/images";
import { FiShoppingCart } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CgClose } from "react-icons/cg";
import { BiDollar } from "react-icons/bi";
import { toast } from "sonner";
// import { useCart } from "@/context/CartContext";

interface Produto {
  id: number;
  imagem: JSX.Element;
  nome: string;
  descricao: string;
  preco: number;
}

const Begin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(1);
  // const { carrinho, adicionarAoCarrinho } = useCart();

  const query = params.get("q")?.toLowerCase() || "";

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

  const produtosFiltrados = useMemo(() => {
    if (!query) return produtos;
    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(query) ||
        produto.descricao.toLowerCase().includes(query)
    );
  }, [query, produtos]);

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );

  const handleAdicionarAoCarrinho = (produto: Produto) => {
    // if (!carrinho.includes(produto.id)) {
    //   // adicionarAoCarrinho(produto.id);
    //   toast.success(`${produto.nome} adicionado ao carrinho!`);
    // } else {
    //   toast.warning(`${produto.nome} já está no carrinho.`);
    // }
  };

  // Corrigido: envia um array de items para o Pagamento
  const handlePagar = (produto: Produto, quantidade: number) => {
    navigate("/pagamento", {
      state: {
        items: [
          {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade,
          },
        ],
      },
    });
  };

  const handleQuantidade = (action: "increment" | "decrement") => {
    setQuantidade((prev) =>
      action === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  return (
    <div className="flex flex-col gap-6 p-5 md:p-10 bg-gray-50 min-h-screen">
      {query && (
        <p className="text-sm text-gray-600">
          Resultados para:{" "}
          <span className="font-semibold text-[#D4AF37]">{query}</span>
        </p>
      )}

      {produtosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Nenhum produto encontrado 😕
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-lg border hover:scale-105 shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            <div className="h-56 w-full flex items-center justify-center overflow-hidden">
              {produto.imagem}
            </div>
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {produto.nome}
                </h2>
                <p className="text-gray-500 mt-1">{produto.descricao}</p>
                <p className="text-[#D4AF37] font-semibold mt-2 text-lg">
                  {produto.preco.toLocaleString()} KZ
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setProdutoSelecionado(produto);
                    setQuantidade(1);
                  }}
                  className="flex items-center justify-center gap-2 flex-1 h-10 bg-[#D4AF37] text-white rounded hover:bg-[#dfae0e] transition text-sm"
                >
                  <BsEye size={20} /> Detalhes
                </button>
                <button
                  onClick={() => handleAdicionarAoCarrinho(produto)}
                  className="flex items-center justify-center gap-2 flex-1 h-10 bg-gray-600 text-white rounded hover:bg-gray-800 transition text-sm"
                >
                  <FiShoppingCart size={20} /> Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10">
              <div className="w-56 flex items-center justify-center bg-gray-50 rounded-xl h-80 md:h-auto overflow-hidden">
                {produtoSelecionado.imagem}
              </div>
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {produtoSelecionado.nome}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {produtoSelecionado.descricao}
                  </p>
                  <p className="text-[#D4AF37] text-2xl font-semibold mt-4">
                    {produtoSelecionado.preco.toLocaleString()} KZ
                  </p>
                  <p className="text-gray-500 mt-2">
                    Quantidade em estoque: 20
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={() => handleQuantidade("decrement")}
                      className="bg-gray-800 text-white w-10 h-10 rounded-md"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantidade}
                      readOnly
                      className="w-16 text-center flex items-center border rounded-md text-gray-700"
                    />
                    <button
                      onClick={() => handleQuantidade("increment")}
                      className="bg-gray-800 text-white w-10 h-10 rounded-md"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        handlePagar(produtoSelecionado, quantidade)
                      }
                      className="flex gap-1 items-center bg-green-600 text-white px-4 py-2 rounded-md ml-auto hover:bg-green-500 transition"
                    >
                      <BiDollar size={20} /> Pagar
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handleAdicionarAoCarrinho(produtoSelecionado);
                      setProdutoSelecionado(null);
                    }}
                    className="flex items-center justify-center gap-3 h-12 bg-[#D4AF37] text-white rounded-lg hover:bg-[#dfae0e] transition font-medium"
                  >
                    <ShoppingCart size={20} /> Adicionar ao carrinho
                  </button>
                  <button
                    onClick={() => setProdutoSelecionado(null)}
                    className="flex items-center justify-center gap-3 h-12 border rounded-lg hover:bg-gray-100 transition"
                  >
                    <CgClose size={20} /> Fechar
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setProdutoSelecionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Begin;
