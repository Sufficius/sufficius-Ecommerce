"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import InputMask from "react-input-mask";
import { pedidosRoute } from "@/modules/services/api/routes/pedidos";
import { enderecosRoute } from "@/modules/services/api/routes/enderecos";
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";
import { useQuery } from "@tanstack/react-query";

// Tipos de dados
interface ProdutoCarrinho {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
  sku?: string;
}

interface EnderecoEntrega {
  rua: string;
  nome: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia?: string;
}

interface PagamentoData {
  metodo: "cartao" | "mbway" | "dinheiro" | "multicaixa";
  numeroCartao?: string;
  nomeCartao?: string;
  validade?: string;
  cvv?: string;
}

interface PedidoData {
  enderecoEntrega: EnderecoEntrega;
  pagamento: PagamentoData;
  observacoes?: string;
}

// Componentes reutilizáveis
const InfoBox = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
    <h3 className="font-bold mb-3 flex items-center text-gray-800">
      <Icon className="h-5 w-5 mr-2 text-[#D4AF37]" />
      {title}
    </h3>
    {children}
  </div>
);

const ProgressStep = ({
  step,
  currentStep,
  label,
  isLast = false,
}: {
  step: string;
  currentStep: string;
  label: string;
  isLast?: boolean;
}) => {
  const steps = ["endereco", "pagamento", "confirmacao"];
  const currentIndex = steps.indexOf(currentStep);
  const stepIndex = steps.indexOf(step);
  const isCompleted = stepIndex < currentIndex;
  const isActive = step === currentStep;

  return (
    <div className="flex items-center">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
          isActive
            ? "bg-[#D4AF37] text-white shadow-lg"
            : isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <span className="font-semibold">{stepIndex + 1}</span>
        )}
      </div>
      <div className="ml-2 mr-4">
        <div
          className={`text-sm font-medium ${
            isActive || isCompleted ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {label}
        </div>
      </div>
      {!isLast && (
        <div
          className={`h-1 w-16 transition-all ${
            isCompleted ? "bg-green-500" : "bg-gray-200"
          }`}
        />
      )}
    </div>
  );
};

// Componente principal
export default function CheckoutPage() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<"endereco" | "pagamento" | "confirmacao">(
    "endereco"
  );
  const [carregando, setCarregando] = useState(false);
  const [carregandoCarrinho, setCarregandoCarrinho] = useState(true);

  // Dados do formulário
  const [formData, setFormData] = useState<PedidoData>({
    enderecoEntrega: {
      rua: "",
      nome: "",
      email: "",
      telefone: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    pagamento: {
      metodo: "cartao",
    },
  });

  const [, setCarrinho] = useState<ProdutoCarrinho[]>([]);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [enderecosSalvos, setEnderecosSalvos] = useState<any[]>([]);
  const [usandoEnderecoSalvo, setUsandoEnderecoSalvo] = useState(false);

  const { data: carrinho } = useQuery({
    queryKey: ["carrinho"],
    queryFn: async () => {
      const response = await carrinhosRoute.getCarrinho();
      return (
        response.data || {
          id: "",
          usuarioId: "",
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          itens: [],
          totalItens: 0,
          subtotal: 0,
          desconto: 0,
          total: 0,
        }
      );
    },
  });

  const { data: enderecos } = useQuery({
    queryKey: ["endereco"],
    queryFn: async () => {
      const response = await  enderecosRoute.getEnderecos();
      return response?.data;
    },
  });


  useEffect(() => {
    if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
      setCarregandoCarrinho(false);
    } else {
      setCarregandoCarrinho(false);
    }
    const carregarDados = async () => {
      try {
        setCarregandoCarrinho(true);

        // Carregar carrinho
        const carrinhoResponse = await carrinhosRoute.getCarrinho();
        if (carrinhoResponse.success) {
          setCarrinho(
            Array.isArray(carrinhoResponse?.data) ? carrinhoResponse.data : []
          );
        }

        // Carregar endereços salvos
        const enderecosResponse = await enderecosRoute.listarEnderecos();
        if (enderecosResponse.success && enderecosResponse.data?.length > 0) {
          setEnderecosSalvos(enderecosResponse.data);
          // Preencher com primeiro endereço
          const primeiroEndereco = enderecosResponse.data[0];
          setFormData((prev) => ({
            ...prev,
            enderecoEntrega: {
              ...prev.enderecoEntrega,
              rua: primeiroEndereco.rua || "",
              nome: primeiroEndereco.nome,
              email: primeiroEndereco.email || "",
              telefone: primeiroEndereco.telefone,
              logradouro: primeiroEndereco.logradouro,
              numero: primeiroEndereco.numero,
              complemento: primeiroEndereco.complemento,
              bairro: primeiroEndereco.bairro,
              cidade: primeiroEndereco.cidade,
              estado: primeiroEndereco.estado,
            },
          }));
          setUsandoEnderecoSalvo(true);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do carrinho");
      } finally {
        setCarregandoCarrinho(false);
      }
    };

    carregarDados();
  }, [carrinho]);

  // Cálculos
  const subtotal =
    carrinho?.subtotal ||
    carrinho?.itens?.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    ) ||
    0;
  const frete = subtotal > 50000 ? 0 : 1500; // Frete grátis acima de 50.000 Kz
  const total = carrinho?.total || subtotal + frete;

  const handleEnderecoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      enderecoEntrega: {
        ...prev.enderecoEntrega,
        [name]: value,
      },
    }));
    setUsandoEnderecoSalvo(false);
  };

  const handlePagamentoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        [name]: value,
      },
    }));
  };

  const handleMetodoPagamentoChange = (metodo: PagamentoData["metodo"]) => {
    setFormData((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        metodo,
      },
    }));
  };

  const validarEtapaEndereco = (): boolean => {
    const camposObrigatorios = [
      "nome",
      "email",
      "telefone",
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
    ];

    for (const campo of camposObrigatorios) {
      const valor = formData.enderecoEntrega[campo as keyof EnderecoEntrega];
      if (!valor || (typeof valor === "string" && valor.trim() === "")) {
        const nomeCampo =
          campo === "numero"
            ? "número"
            : campo === "logradouro"
            ? "endereço"
            : campo;

        toast.error(`O campo ${nomeCampo} é obrigatório`);
        return false;
      }
    }

    // Validar email
    const email = formData.enderecoEntrega.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("E-mail inválido");
      return false;
    }

    // Validar telefone (Angola: 9 dígitos)
    const telefone = formData.enderecoEntrega.telefone;
    const telefoneLimpo = telefone?.replace(/\D/g, "");
    if (telefoneLimpo.length !== 9) {
      toast.error("Telefone inválido. Use 9 dígitos");
      return false;
    }

    return true;
  };

  const validarEtapaPagamento = (): boolean => {
    if (formData.pagamento.metodo === "cartao") {
      if (
        !formData.pagamento.numeroCartao ||
        !formData.pagamento.nomeCartao ||
        !formData.pagamento.validade ||
        !formData.pagamento.cvv
      ) {
        toast.error("Preencha todos os dados do cartão");
        return false;
      }

      const cartaoLimpo = formData.pagamento.numeroCartao.replace(/\D/g, "");
      if (cartaoLimpo.length !== 16) {
        toast.error("Número do cartão inválido. Deve ter 16 dígitos");
        return false;
      }
    }

    return true;
  };

  const avancarEtapa = async () => {
    if (etapa === "endereco") {
      if (!validarEtapaEndereco()) return;
      setEtapa("pagamento");
    } else if (etapa === "pagamento") {
      if (!validarEtapaPagamento()) return;
      setEtapa("confirmacao");
    }
  };

  const voltarEtapa = () => {
    if (etapa === "pagamento") {
      setEtapa("endereco");
    } else if (etapa === "confirmacao") {
      setEtapa("pagamento");
    }
  };

  const salvarEndereco = async () => {
    try {
      const response = await enderecosRoute.criarEndereco(
        formData.enderecoEntrega
      );

      if (response.success) {
        toast.success("Endereço salvo com sucesso");
        // Atualizar lista de endereços
        const enderecosResponse = await enderecosRoute.listarEnderecos();
        if (enderecosResponse.success) {
          setEnderecosSalvos(enderecosResponse.data || []);
        }
      } else {
        toast.error(response.data?.message || "Erro ao salvar endereço");
      }
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    }
  };

  const finalizarCompra = async () => {
    if (!termosAceitos) {
      toast.error("Você deve aceitar os termos e condições");
      return;
    }

    if (!carrinho?.itens || carrinho?.itens?.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setCarregando(true);

    try {
      const enderecoResponse = await enderecosRoute.criarEndereco({
        rua: formData.enderecoEntrega.logradouro || "",
        numero: formData.enderecoEntrega.logradouro,
        bairro: formData.enderecoEntrega.bairro,
        cidade: formData.enderecoEntrega.cidade,
        estado: formData.enderecoEntrega.estado,
        complemento: formData.enderecoEntrega.complemento || "",
        email: formData.enderecoEntrega.email,
        nome: formData.enderecoEntrega.nome,
        logradouro: formData.enderecoEntrega.logradouro,
        telefone: formData.enderecoEntrega.telefone,
        principal: true,
      });

      if (!enderecoResponse.success) {
        toast.error("Erro ao salvar endereço", enderecoResponse.message);
        setCarregando(false);
        return;
      }

      const enderecoId = enderecoResponse.data.id || enderecos?.[0]?.id;
      // Preparar dados para a API
      const pedidoPayload = {
        enderecoId: enderecoId || enderecos?.[0]?.id,
        enderecoEntrega: formData.enderecoEntrega,
        metodoPagamento: formData.pagamento.metodo,
        observacoes: formData.observacoes || undefined,
        // Se tiver dados do cartão
        ...(formData.pagamento.metodo === "cartao" && {
          dadosCartao: {
            numero: formData.pagamento.numeroCartao,
            nome: formData.pagamento.nomeCartao,
            validade: formData.pagamento.validade,
            cvv: formData.pagamento.cvv,
          },
        }),
        itens: carrinho.itens.map((item: any) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
        subtotal: subtotal,
        frete: frete,
        total: total,
      };


      const response = await pedidosRoute.criarPedido(pedidoPayload as any);
      if (response.success) {
        toast.success("🎉 Pedido realizado com sucesso!");

        await carrinhosRoute.limparCarrinho();
        // Redirecionar para página de confirmação
        setTimeout(() => {
          navigate(`/confirmacao?pedido=${carrinho?.itens?.[0]?.produtoId}`);
        }, 1500);
      } else {
        toast.error(response.message || "Erro ao criar pedido");
      }
    } catch (error: any) {
      console.error("Erro ao finalizar compra:", error);
      toast.error(error.message || "Erro ao processar pedido");
    } finally {
      setCarregando(false);
    }
  };

  const formatarTelefone = (telefone: string) => {
    const limpo = telefone.replace(/\D/g, "");
    if (limpo.length === 9) {
      return `+244 ${limpo.slice(0, 3)} ${limpo.slice(3, 6)} ${limpo.slice(
        6,
        9
      )}`;
    }
    return telefone;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(valor);
  };

  if (carregandoCarrinho) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#D4AF37]" />
          <p className="text-gray-600">Carregando seu carrinho...</p>
        </div>
      </div>
    );
  }

  if (carrinho?.itens?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar para a loja
              </button>

              <div className="flex items-center">
                <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-lg">S</span>
                </div>
                <span className="ml-2 font-bold text-gray-900">
                  Sufficius Commerce
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos ao carrinho antes de finalizar a compra
            </p>
            <button
              onClick={() => navigate("/#produtos")}
              className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#c19b2c]"
            >
              Ver Produtos
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para a loja
            </button>

            <div className="flex items-center">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <span className="ml-2 font-bold text-gray-900">
                Sufficius Commerce
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Compra 100% segura
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600 mt-2">
            Complete seu pedido em apenas algumas etapas
          </p>
        </div>

        {/* Progresso */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <ProgressStep
              step="endereco"
              currentStep={etapa}
              label="Endereço"
            />
            <ProgressStep
              step="pagamento"
              currentStep={etapa}
              label="Pagamento"
            />
            <ProgressStep
              step="confirmacao"
              currentStep={etapa}
              label="Confirmação"
              isLast
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Etapa 1: Endereço */}
              {etapa === "endereco" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <MapPin className="h-6 w-6 mr-2 text-[#D4AF37]" />
                    Endereço de Entrega
                  </h2>

                  {enderecosSalvos.length > 0 && !usandoEnderecoSalvo && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 mb-2">
                        Você tem {enderecosSalvos.length} endereço(s) salvo(s).
                        <button
                          onClick={() => {
                            const primeiroEndereco = enderecosSalvos[0];
                            setFormData((prev) => ({
                              ...prev,
                              enderecoEntrega: {
                                ...prev.enderecoEntrega,
                                nome: primeiroEndereco.nome,
                                email: primeiroEndereco.email || "",
                                telefone: primeiroEndereco.telefone,
                                logradouro: primeiroEndereco.logradouro,
                                numero: primeiroEndereco.numero,
                                complemento: primeiroEndereco.complemento,
                                bairro: primeiroEndereco.bairro,
                                cidade: primeiroEndereco.cidade,
                                estado: primeiroEndereco.estado,
                              },
                            }));
                            setUsandoEnderecoSalvo(true);
                          }}
                          className="text-blue-600 underline hover:text-blue-800 ml-1"
                        >
                          Usar endereço salvo
                        </button>
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.enderecoEntrega.nome}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Digite seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.enderecoEntrega.email}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <InputMask
                        mask="999 999 999"
                        name="telefone"
                        value={formData.enderecoEntrega.telefone}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="923 456 789"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formato: 9XX XXX XXX
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço (Rua/Avenida) *
                      </label>
                      <input
                        type="text"
                        name="logradouro"
                        value={formData.enderecoEntrega.logradouro}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Nome da rua ou avenida"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.enderecoEntrega.numero}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.enderecoEntrega.complemento}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Apartamento, bloco, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.enderecoEntrega.bairro}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.enderecoEntrega.cidade}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Nome da cidade"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado/Província *
                      </label>
                      <select
                        name="estado"
                        value={formData.enderecoEntrega.estado}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      >
                        <option value="">Selecione</option>
                        <option value="Luanda">Luanda</option>
                        <option value="Benguela">Benguela</option>
                        <option value="Huambo">Huambo</option>
                        <option value="Huíla">Huíla</option>
                        <option value="Cabinda">Cabinda</option>
                        <option value="Malange">Malange</option>
                        <option value="Uíge">Uíge</option>
                        <option value="Zaire">Zaire</option>
                        <option value="Bengo">Bengo</option>
                        <option value="Kwanza Sul">Kwanza Sul</option>
                        <option value="Kwanza Norte">Kwanza Norte</option>
                        <option value="Lunda Norte">Lunda Norte</option>
                        <option value="Lunda Sul">Lunda Sul</option>
                        <option value="Moxico">Moxico</option>
                        <option value="Cuando Cubango">Cuando Cubango</option>
                        <option value="Cunene">Cunene</option>
                        <option value="Namibe">Namibe</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ponto de Referência
                      </label>
                      <input
                        type="text"
                        name="referencia"
                        value={formData.enderecoEntrega.referencia}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Próximo ao mercado, ao lado da escola, etc."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={salvarEndereco}
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Salvar endereço
                    </button>

                    <div className="text-sm text-gray-600">
                      * Campos obrigatórios
                    </div>
                  </div>
                </>
              )}

              {/* Etapa 2: Pagamento */}
              {etapa === "pagamento" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <CreditCard className="h-6 w-6 mr-2 text-[#D4AF37]" />
                    Método de Pagamento
                  </h2>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        id: "cartao" as const,
                        label: "Cartão de Crédito/Débito",
                        icon: "💳",
                        desc: "Visa, Mastercard, Multicaixa",
                      },
                      {
                        id: "multicaixa" as const,
                        label: "Multicaixa Express",
                        icon: "🏧",
                        desc: "Pagamento instantâneo via referência",
                      },
                      {
                        id: "mbway" as const,
                        label: "Mbay",
                        icon: "🏦",
                        desc: "Transferência instantânea",
                      },
                      {
                        id: "dinheiro" as const,
                        label: "Dinheiro",
                        icon: "📄",
                        desc: "Pagamento em cache",
                      },
                    ].map((metodo) => (
                      <div
                        key={metodo.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.pagamento.metodo === metodo.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleMetodoPagamentoChange(metodo.id)}
                      >
                        <div className="text-2xl mr-4">{metodo.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{metodo.label}</div>
                          <div className="text-sm text-gray-500">
                            {metodo.desc}
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 ${
                            formData.pagamento.metodo === metodo.id
                              ? "border-[#D4AF37] bg-[#D4AF37]"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.pagamento.metodo === metodo.id && (
                            <div className="h-2 w-2 bg-white rounded-full m-0.5 mx-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulário do cartão */}
                  {formData.pagamento.metodo === "cartao" && (
                    <div className="border-t pt-6">
                      <h3 className="font-bold mb-4">Dados do Cartão</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número do Cartão *
                          </label>
                          <InputMask
                            mask="9999 9999 9999 9999"
                            name="numeroCartao"
                            value={formData.pagamento.numeroCartao || ""}
                            onChange={handlePagamentoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome no Cartão *
                          </label>
                          <input
                            type="text"
                            name="nomeCartao"
                            value={formData.pagamento.nomeCartao || ""}
                            onChange={handlePagamentoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                            placeholder="Como está escrito no cartão"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validade *
                          </label>
                          <InputMask
                            mask="99/99"
                            name="validade"
                            value={formData.pagamento.validade || ""}
                            onChange={handlePagamentoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                            placeholder="MM/AA"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <InputMask
                            mask="999"
                            name="cvv"
                            value={formData.pagamento.cvv || ""}
                            onChange={handlePagamentoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações do Pedido (Opcional)
                    </label>
                    <textarea
                      value={formData.observacoes || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          observacoes: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      placeholder="Instruções especiais para entrega, etc."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Etapa 3: Confirmação */}
              {etapa === "confirmacao" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                    <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                    Confirmação do Pedido
                  </h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-bold text-green-900">
                          Revise seu pedido
                        </h3>
                        <p className="text-green-700 text-sm">
                          Confirme todas as informações antes de finalizar sua
                          compra
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <InfoBox title="Resumo do Pedido" icon={CheckCircle}>
                      {carrinho?.itens?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 border-b last:border-b-0"
                        >
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                              <span className="text-xl">
                                {item.imagemUrl ? "🖼️" : "📦"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{item.nome}</div>
                              <div className="text-sm text-gray-500">
                                Quantidade: {item.quantidade}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold">
                            {formatarMoeda(item.preco * item.quantidade)}
                          </div>
                        </div>
                      ))}
                    </InfoBox>

                    <InfoBox title="Endereço de Entrega" icon={MapPin}>
                      <div className="space-y-2">
                        <p className="font-medium">
                          {formData.enderecoEntrega.nome}
                        </p>
                        <p className="text-gray-600">
                          {formData.enderecoEntrega.logradouro},{" "}
                          {formData.enderecoEntrega.numero}
                          {formData.enderecoEntrega.complemento &&
                            ` - ${formData.enderecoEntrega.complemento}`}
                        </p>
                        <p className="text-gray-600">
                          {formData.enderecoEntrega.bairro},{" "}
                          {formData.enderecoEntrega.cidade}
                        </p>
                        {formData.enderecoEntrega.referencia && (
                          <p className="text-gray-600 text-sm">
                            Referência: {formData.enderecoEntrega.referencia}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm">
                          Telefone:{" "}
                          {formatarTelefone(formData.enderecoEntrega.telefone)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          E-mail: {formData.enderecoEntrega.email}
                        </p>
                      </div>
                    </InfoBox>

                    <InfoBox title="Método de Pagamento" icon={CreditCard}>
                      <div className="flex items-center">
                        <div className="text-2xl mr-4">
                          {formData.pagamento.metodo === "cartao"
                            ? "💳"
                            : formData.pagamento.metodo === "multicaixa"
                            ? "🏧"
                            : formData.pagamento.metodo === "dinheiro"
                            ? "🏦"
                            : "📄"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {formData.pagamento.metodo === "cartao"
                              ? "Cartão de Crédito/Débito"
                              : formData.pagamento.metodo === "multicaixa"
                              ? "Multicaixa Express"
                              : formData.pagamento.metodo === "dinheiro"
                              ? "Dinheiro"
                              : "Cache"}
                          </p>
                          {formData.pagamento.metodo === "cartao" &&
                            formData.pagamento.numeroCartao && (
                              <p className="text-sm text-gray-600">
                                **** **** ****{" "}
                                {formData.pagamento.numeroCartao.slice(-4)}
                              </p>
                            )}
                        </div>
                      </div>
                    </InfoBox>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="termosAceitos"
                          checked={termosAceitos}
                          onChange={(e) => setTermosAceitos(e.target.checked)}
                          className="h-5 w-5 mt-0.5 mr-3 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                        />
                        <label
                          htmlFor="termosAceitos"
                          className="text-sm text-gray-600"
                        >
                          Ao clicar em "Finalizar Compra", você concorda com
                          nossos{" "}
                          <a
                            href="/termos"
                            className="text-[#D4AF37] underline hover:text-[#c19b2c]"
                          >
                            Termos de Uso
                          </a>{" "}
                          e{" "}
                          <a
                            href="/privacidade"
                            className="text-[#D4AF37] underline hover:text-[#c19b2c]"
                          >
                            Política de Privacidade
                          </a>
                          . Também concorda com as condições de entrega, troca e
                          devolução.
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={voltarEtapa}
                  disabled={etapa === "endereco"}
                  className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                    etapa === "endereco"
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  Voltar
                </button>

                <button
                  onClick={
                    etapa === "confirmacao" ? finalizarCompra : avancarEtapa
                  }
                  disabled={carregando}
                  className="px-8 py-3 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#c19b2c] disabled:opacity-70 disabled:cursor-not-allowed flex items-center transition-colors shadow-md hover:shadow-lg"
                >
                  {carregando ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : etapa === "confirmacao" ? (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Finalizar Compra
                    </>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </div>
            </div>

            {/* Garantias */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-4 text-gray-800">
                Compra 100% Segura
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Site Seguro</div>
                    <div className="text-sm text-gray-600">
                      Certificado SSL 256-bit
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Pagamento Seguro</div>
                    <div className="text-sm text-gray-600">
                      Criptografia PCI DSS
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Entrega Garantida</div>
                    <div className="text-sm text-gray-600">
                      Rastreamento em tempo real
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Resumo do Pedido
              </h2>

              {/* Produtos */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {carrinho?.itens?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-xl">
                          {item.imagemUrl ? "🖼️" : "📦"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {item.produto?.nome}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qtd: {item.quantidade}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatarMoeda(item.preco)} cada
                        </div>
                      </div>
                    </div>
                    <div className="font-bold">
                      {formatarMoeda(item.preco * item.quantidade)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Valores */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatarMoeda(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span
                    className={frete === 0 ? "text-green-600 font-medium" : ""}
                  >
                    {frete === 0 ? "Grátis" : formatarMoeda(frete)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">{formatarMoeda(total)}</span>
                </div>
              </div>

              {/* Entrega */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Truck className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">Entrega Estimada</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formData.enderecoEntrega.estado === "Luanda"
                    ? "1-2 dias úteis"
                    : "3-5 dias úteis"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Para {formData.enderecoEntrega.estado || "sua região"}
                </div>
              </div>

              {/* Informações */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Seu pedido será processado imediatamente após a confirmação
                    de pagamento
                  </span>
                </div>
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Garantia de 30 dias para devolução ou troca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
