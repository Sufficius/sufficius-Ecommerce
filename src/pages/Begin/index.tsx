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
import { useSearchParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CgClose } from "react-icons/cg";

interface Produto {
  id: number;
  imagem: JSX.Element;
  nome: string;
  descricao: string;
  preco: number;
}

const Begin = () => {
  const [, setCarrinho] = useState<number[]>([]);
  const [params] = useSearchParams();

  const query = params.get("q")?.toLowerCase() || "";

  const produtos: Produto[] = [
    { id: 1, imagem: <PrimeiraImagem />, nome: "Rose de Soleil", descricao: "For Women", preco: 2500 },
    { id: 2, imagem: <SegundaImagem />, nome: "Zara Rosella", descricao: "Loui Martin", preco: 15000 },
    { id: 3, imagem: <TerceiraImagem />, nome: "Berry Kiss", descricao: "Body Luxures", preco: 5500 },
    { id: 4, imagem: <QuartaImagem />, nome: "Kiss Me", descricao: "Rumor Sexy", preco: 20000 },
    { id: 5, imagem: <QuintaImagem />, nome: "Sauvage", descricao: "Eau de Parfum", preco: 2500 },
    { id: 6, imagem: <SextaImagem />, nome: "3.4 Floz", descricao: "Zara Eau de Parfum", preco: 2500 },
  ];

  // Filtra produtos em tempo real
  const produtosFiltrados = useMemo(() => {
    if (!query) return produtos;
    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(query) ||
        produto.descricao.toLowerCase().includes(query)
    );
  }, [query, produtos]);

  // Modal
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => [...prev, produto.id]);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <div className="flex flex-col gap-6 p-5 md:p-10 bg-gray-50 min-h-screen">

      {/* INDICADOR DE PESQUISA */}
      {query && (
        <p className="text-sm text-gray-600">
          Resultados para:{" "}
          <span className="font-semibold text-[#D4AF37]">{query}</span>
        </p>
      )}

      {/* SEM RESULTADOS */}
      {produtosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Nenhum produto encontrado 😕</p>
      )}

      {/* PRODUTOS */}
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
                <h2 className="text-xl font-bold text-gray-800">{produto.nome}</h2>
                <p className="text-gray-500 mt-1">{produto.descricao}</p>
                <p className="text-[#D4AF37] font-semibold mt-2 text-lg">
                  {produto.preco.toLocaleString()} KZ
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                {/* DETALHES */}
                <button
                  onClick={() => setProdutoSelecionado(produto)}
                  className="flex items-center justify-center gap-2 flex-1 h-10 bg-[#D4AF37] text-white rounded hover:bg-[#dfae0e] transition text-sm"
                >
                  <BsEye size={20} />
                  Detalhes
                </button>

                {/* CARRINHO */}
                <button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="flex items-center justify-center gap-2 flex-1 h-10 bg-gray-600 text-white rounded hover:bg-gray-800 transition text-sm"
                >
                  <FiShoppingCart size={20} />
                  Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PROFISSIONAL */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">

            {/* BRILHO */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />

            {/* CONTEÚDO */}
            <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10">

              {/* IMAGEM */}
              <div className="w-56 flex items-center justify-center bg-gray-50 rounded-xl h-80 md:h-auto overflow-hidden">
                {produtoSelecionado.imagem}
              </div>

              {/* DETALHES */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{produtoSelecionado.nome}</h2>
                  <p className="text-gray-500 mt-2">{produtoSelecionado.descricao}</p>
                  <p className="text-[#D4AF37] text-2xl font-semibold mt-4">
                    {produtoSelecionado.preco.toLocaleString()} KZ
                  </p>

                   <p className="text-gray-500  mt-4">
                    Quantidade em estoque : {"20"}
                  </p>
                </div>

                <div className="flex gap-5">
                  <button className="bg-black p-3 w-auto rounded-md text-white mt-2">
                    -
                  </button>
                  <input type="number" min={0} className="text-gray-600 text-center w-auto border rounded-md mt-4" />

                   <button className="bg-black p-3 w-auto rounded-md text-white mt-2">
                    +
                  </button>
                   <button className="bg-gray-500 p-2 rounded-md text-white mt-2">
                    Pagar
                  </button>
                </div>

                {/* AÇÕES */}
                <div className="mt-6 flex flex-col  gap-4">
                  <button
                    onClick={() => {
                      adicionarAoCarrinho(produtoSelecionado);
                      setProdutoSelecionado(null);
                    }}
                    className="flex items-center w-56 xl:w-80 justify-center gap-3 h-12 p-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#dfae0e] transition font-medium"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao carrinho
                  </button>

                  <button
                    onClick={() => setProdutoSelecionado(null)}
                    className="flex items-center w-56 xl:w-80 justify-center gap-3 h-12 p-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    <CgClose size={20} />
                    Fechar
                  </button>
                </div>
              </div>
            </div>

            {/* BOTÃO FECHAR NO CANTO */}
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
