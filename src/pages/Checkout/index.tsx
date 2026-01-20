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
  Building2,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import InputMask from 'react-input-mask';

// Tipos de dados
interface ProdutoCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  sku?: string;
}

interface EnderecoEntrega {
  nome: string;
  email: string;
  telefone: string;
  provincia: string;
  municipio: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
  referencia?: string;
}

interface DadosPagamento {
  metodo: "multicaixa" | "cartao" | "transferencia" | "dinheiro";
  numeroCartao?: string;
  nomeCartao?: string;
  validade?: string;
  cvv?: string;
  banco?: string;
}

interface CheckoutData {
  endereco: EnderecoEntrega;
  pagamento: DadosPagamento;
  termosAceitos: boolean;
}

// Componentes reutilizáveis
const InfoBox = ({ 
  title, 
  icon: Icon, 
  children,
  className = ""
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
  isLast = false 
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
      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        isActive 
          ? "bg-[#D4AF37] text-white shadow-lg" 
          : isCompleted
          ? "bg-green-500 text-white"
          : "bg-gray-100 text-gray-400"
      }`}>
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <span className="font-semibold">{stepIndex + 1}</span>
        )}
      </div>
      <div className="ml-2 mr-4">
        <div className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </div>
      </div>
      {!isLast && (
        <div className={`h-1 w-16 transition-all duration-500 ${
          isCompleted ? "bg-green-500" : "bg-gray-200"
        }`} />
      )}
    </div>
  );
};

// API Base URL - Substituir pela URL real da sua API
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.sufficiuscommerce.ao/v1";

// Províncias e municípios de Angola
const PROVINCIAS_ANGOLA = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", 
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla", 
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", 
  "Namibe", "Uíge", "Zaire"
];

const MUNICIPIOS_POR_PROVINCIA: Record<string, string[]> = {
  "Luanda": ["Belas", "Cacuaco", "Cazenga", "Ícolo e Bengo", "Luanda", "Quiçama", "Talatona", "Viana"],
  "Benguela": ["Benguela", "Baía Farta", "Balombo", "Bocoio", "Caimbambo", "Catumbela", "Chongoroi", "Cubal", "Ganda", "Lobito"],
  "Huambo": ["Huambo", "Bailundo", "Caála", "Cachiungo", "Ecunha", "Londuimbali", "Longonjo", "Mungo", "Chicala-Choloanga", "Chinjenje", "Ucuma"],
  // Adicione mais municípios conforme necessário
};

// Página de Checkout/Pagamento
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<"endereco" | "pagamento" | "confirmacao">("endereco");
  const [carregando, setCarregando] = useState(false);
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [cupomDesconto, setCupomDesconto] = useState(0);
  const [codigoCupom, setCodigoCupom] = useState("");
  const [municipios, setMunicipios] = useState<string[]>([]);
  
  // Dados do formulário
  const [formData, setFormData] = useState<CheckoutData>({
    endereco: {
      nome: "",
      email: "",
      telefone: "",
      provincia: "",
      municipio: "",
      bairro: "",
      rua: "",
      numero: "",
      complemento: "",
      referencia: ""
    },
    pagamento: {
      metodo: "multicaixa",
      banco: "BAI"
    },
    termosAceitos: false
  });
  
  // Estados para APIs
  const [carrinho, setCarrinho] = useState<ProdutoCarrinho[]>([]);
  const [carregandoCarrinho, setCarregandoCarrinho] = useState(true);
  const [verificandoCupom, setVerificandoCupom] = useState(false);
  
  // Bancos angolanos
  const BANCOS_ANGOLA = [
    { codigo: "BAI", nome: "Banco Angolano de Investimentos" },
    { codigo: "BFA", nome: "Banco de Fomento Angola" },
    { codigo: "BCI", nome: "Banco de Comércio e Indústria" },
    { codigo: "BPC", nome: "Banco de Poupança e Crédito" },
    { codigo: "BANC", nome: "Banco Atlântico" },
    { codigo: "SOL", nome: "Banco Sol" },
    { codigo: "KEVE", nome: "Banco Keve" },
    { codigo: "VTB", nome: "Banco VTB África" }
  ];
  
  // Buscar carrinho da API
  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        setCarregandoCarrinho(true);
        // Substituir pela chamada real à sua API
        const response = await fetch(`${API_BASE_URL}/carrinho`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCarrinho(data.produtos || []);
        } else {
          // Fallback para dados de exemplo
          setCarrinho([
            { 
              id: 1, 
              nome: "Smartphone Samsung Galaxy S23", 
              preco: 120000, 
              quantidade: 1, 
              imagem: "📱",
              sku: "SMS23-256GB" 
            },
            { 
              id: 2, 
              nome: "Fones Bluetooth JBL", 
              preco: 25000, 
              quantidade: 2, 
              imagem: "🎧",
              sku: "JBL-TUNE-710" 
            }
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        toast.error("Erro ao carregar carrinho");
        // Dados de exemplo
        setCarrinho([
          { 
            id: 1, 
            nome: "Smartphone Samsung Galaxy S23", 
            preco: 120000, 
            quantidade: 1, 
            imagem: "📱",
            sku: "SMS23-256GB" 
          },
          { 
            id: 2, 
            nome: "Fones Bluetooth JBL", 
            preco: 25000, 
            quantidade: 2, 
            imagem: "🎧",
            sku: "JBL-TUNE-710" 
          }
        ]);
      } finally {
        setCarregandoCarrinho(false);
      }
    };
    
    fetchCarrinho();
  }, []);
  
  // Carregar dados salvos
  useEffect(() => {
    const saved = localStorage.getItem('checkoutDataAngola');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        
        // Carregar municípios baseado na província salva
        if (parsed.endereco.provincia) {
          setMunicipios(MUNICIPIOS_POR_PROVINCIA[parsed.endereco.provincia] || []);
        }
      } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
      }
    }
  }, []);
  
  // Atualizar municípios quando a província mudar
  useEffect(() => {
    if (formData.endereco.provincia) {
      setMunicipios(MUNICIPIOS_POR_PROVINCIA[formData.endereco.provincia] || []);
      // Resetar municío quando mudar província
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          municipio: ""
        }
      }));
    }
  }, [formData.endereco.provincia]);
  
  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('checkoutDataAngola', JSON.stringify(formData));
  }, [formData]);
  
  // Cálculos de valores
  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const frete = calcularFrete(formData.endereco.provincia, subtotal);
  const total = subtotal + frete - cupomDesconto;
  
  // Função para calcular frete baseado na província
  function calcularFrete(provincia: string, valorSubtotal: number): number {
    if (valorSubtotal > 100000) return 0; // Frete grátis para compras acima de 100.000 Kz
    
    const fretesPorProvincia: Record<string, number> = {
      "Luanda": 2500,
      "Benguela": 3500,
      "Huambo": 4000,
      "Huíla": 4500,
      "Cabinda": 6000,
      "Quando Cubango": 8000,
      "Lunda Norte": 7500,
      "Lunda Sul": 7500,
      "Moxico": 8500,
      "Cunene": 8000
    };
    
    return fretesPorProvincia[provincia] || 5000; // Valor padrão
  }
  
  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };
  
  const handlePagamentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        [name]: value
      }
    }));
  };
  
  const handleMetodoPagamentoChange = (metodo: DadosPagamento['metodo']) => {
    setFormData(prev => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        metodo
      }
    }));
  };
  
  const validarEtapaEndereco = (): boolean => {
    const camposObrigatorios = ["nome", "email", "telefone", "provincia", "municipio", "bairro", "rua", "numero"];
    
    for (const campo of camposObrigatorios) {
      if (!formData.endereco[campo as keyof EnderecoEntrega]) {
        const nomeCampo = campo === "numero" ? "número" : campo;
        toast.error(`O campo ${nomeCampo} é obrigatório`);
        return false;
      }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.endereco.email)) {
      toast.error("E-mail inválido");
      return false;
    }
    
    // Validar telefone angolano (9 dígitos)
    const telefoneLimpo = formData.endereco.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length !== 9) {
      toast.error("Telefone inválido. Use 9 dígitos (ex: 923456789)");
      return false;
    }
    
    return true;
  };
  
  const validarEtapaPagamento = (): boolean => {
    if (formData.pagamento.metodo === "cartao") {
      if (!formData.pagamento.numeroCartao || !formData.pagamento.nomeCartao || !formData.pagamento.validade || !formData.pagamento.cvv) {
        toast.error("Preencha todos os dados do cartão");
        return false;
      }
      
      // Validar número do cartão
      const cartaoLimpo = formData.pagamento.numeroCartao.replace(/\D/g, '');
      if (cartaoLimpo.length !== 16) {
        toast.error("Número do cartão inválido. Deve ter 16 dígitos");
        return false;
      }
      
      // Validar CVV
      const cvvLimpo = formData.pagamento.cvv.replace(/\D/g, '');
      if (cvvLimpo.length !== 3) {
        toast.error("CVV inválido. Deve ter 3 dígitos");
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
  
  const verificarCupom = async () => {
    if (!codigoCupom.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }
    
    setVerificandoCupom(true);
    
    try {
      // Substituir pela chamada real à sua API
      const response = await fetch(`${API_BASE_URL}/cupons/verificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          codigo: codigoCupom,
          total: subtotal
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.valido) {
          setCupomDesconto(data.desconto);
          setCupomAplicado(true);
          toast.success(`Cupom aplicado! Desconto de ${data.desconto} KZ`);
        } else {
          toast.error("Cupom inválido ou expirado");
        }
      } else {
        toast.error("Erro ao verificar cupom");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setVerificandoCupom(false);
    }
  };
  
  const finalizarCompra = async () => {
    if (!formData.termosAceitos) {
      toast.error("Você deve aceitar os termos e condições");
      return;
    }
    
    setCarregando(true);
    
    try {
      // Criar pedido na API
      const pedidoPayload = {
        produtos: carrinho.map(item => ({
          id: item.id,
          quantidade: item.quantidade,
          preco: item.preco
        })),
        enderecoEntrega: formData.endereco,
        pagamento: formData.pagamento,
        subtotal,
        frete,
        desconto: cupomDesconto,
        total,
        cupom: cupomAplicado ? codigoCupom : null
      };
      
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pedidoPayload)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Limpar dados salvos
        localStorage.removeItem('checkoutDataAngola');
        
        // Redirecionar para confirmação com ID do pedido
        toast.success("🎉 Pedido realizado com sucesso!");
        setTimeout(() => {
          navigate(`/confirmacao?pedido=${data.numeroPedido}`);
        }, 1500);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao processar pedido");
      }
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.message || "Erro ao processar pedido. Tente novamente.");
      setCarregando(false);
    }
  };
  
  const formatarTelefone = (telefone: string) => {
    const limpo = telefone.replace(/\D/g, '');
    if (limpo.length === 9) {
      return `+244 ${limpo.slice(0, 3)} ${limpo.slice(3, 6)} ${limpo.slice(6, 9)}`;
    }
    return telefone;
  };
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(valor);
  };
  
  if (carregandoCarrinho) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu carrinho...</p>
        </div>
      </div>
    );
  }
  
  if (carrinho.length === 0) {
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
                <span className="ml-2 font-bold text-gray-900">Sufficius Commerce</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra</p>
            <button
              onClick={() => navigate("/produtos")}
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
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para a loja
            </button>
            
            <div className="flex items-center">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <span className="ml-2 font-bold text-gray-900">Sufficius Commerce</span>
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
          <p className="text-gray-600 mt-2">Complete seu pedido em apenas algumas etapas</p>
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
              isLast={true}
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
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.endereco.nome}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.endereco.email}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <InputMask
                        mask="999 999 999"
                        name="telefone"
                        value={formData.endereco.telefone}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="923 456 789"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Formato: 9XX XXX XXX</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Província *
                      </label>
                      <select
                        name="provincia"
                        value={formData.endereco.provincia}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        required
                      >
                        <option value="">Selecione a província</option>
                        {PROVINCIAS_ANGOLA.map(provincia => (
                          <option key={provincia} value={provincia}>{provincia}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Município *
                      </label>
                      <select
                        name="municipio"
                        value={formData.endereco.municipio}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        required
                        disabled={!formData.endereco.provincia}
                      >
                        <option value="">Selecione o município</option>
                        {municipios.map(municipio => (
                          <option key={municipio} value={municipio}>{municipio}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.endereco.bairro}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Nome do bairro"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        name="rua"
                        value={formData.endereco.rua}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Nome da rua"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.endereco.numero}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Número da casa"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.endereco.complemento}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Apartamento, bloco, etc."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ponto de Referência
                      </label>
                      <input
                        type="text"
                        name="referencia"
                        value={formData.endereco.referencia}
                        onChange={handleEnderecoChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                        placeholder="Ex: Próximo ao mercado, ao lado da escola, etc."
                      />
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
                        id: "multicaixa" as const, 
                        label: "Multicaixa Express", 
                        icon: "🏧", 
                        desc: "Pagamento instantâneo via referência",
                        color: "bg-blue-50 border-blue-200"
                      },
                      { 
                        id: "cartao" as const, 
                        label: "Cartão de Crédito/Débito", 
                        icon: "💳", 
                        desc: "Visa, Mastercard, Multicaixa",
                        color: "bg-purple-50 border-purple-200"
                      },
                      { 
                        id: "transferencia" as const, 
                        label: "Transferência Bancária", 
                        icon: "🏦", 
                        desc: "Transferência direta para nossa conta",
                        color: "bg-green-50 border-green-200"
                      },
                      { 
                        id: "dinheiro" as const, 
                        label: "Dinheiro na Entrega", 
                        icon: "💵", 
                        desc: "Pague quando receber o produto",
                        color: "bg-yellow-50 border-yellow-200"
                      }
                    ].map((metodo) => (
                      <div
                        key={metodo.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.pagamento.metodo === metodo.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                            : `${metodo.color} hover:border-gray-400`
                        }`}
                        onClick={() => handleMetodoPagamentoChange(metodo.id)}
                      >
                        <div className="text-2xl mr-4">{metodo.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{metodo.label}</div>
                          <div className="text-sm text-gray-500">{metodo.desc}</div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${
                          formData.pagamento.metodo === metodo.id
                            ? "border-[#D4AF37] bg-[#D4AF37]"
                            : "border-gray-300"
                        }`}>
                          {formData.pagamento.metodo === metodo.id && (
                            <div className="h-2 w-2 bg-white rounded-full m-0.5 mx-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Formulário específico para cada método */}
                  {formData.pagamento.metodo === "multicaixa" && (
                    <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                      <h3 className="font-bold mb-4 text-blue-900 flex items-center">
                        <Building2 className="h-5 w-5 mr-2" />
                        Multicaixa Express
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-blue-800 mb-2">
                            Após confirmar o pedido, você receberá uma referência Multicaixa para pagamento.
                          </p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Pagamento em qualquer terminal Multicaixa</li>
                            <li>• Aprovação instantânea</li>
                            <li>• Disponível 24/7</li>
                            <li>• Sem custos adicionais</li>
                          </ul>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banco Preferencial
                          </label>
                          <select
                            name="banco"
                            value={formData.pagamento.banco}
                            onChange={handlePagamentoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                          >
                            {BANCOS_ANGOLA.map(banco => (
                              <option key={banco.codigo} value={banco.codigo}>
                                {banco.nome} ({banco.codigo})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.pagamento.metodo === "cartao" && (
                    <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                      <h3 className="font-bold mb-4 text-purple-900">Dados do Cartão</h3>
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
                  
                  {formData.pagamento.metodo === "transferencia" && (
                    <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                      <h3 className="font-bold mb-4 text-green-900">Transferência Bancária</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-green-800 mb-4">
                            Faça a transferência para nossa conta e envie o comprovante.
                          </p>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Banco:</span>
                              <span className="font-medium">Banco Angolano de Investimentos (BAI)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conta:</span>
                              <span className="font-medium">1234567890</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">NIB:</span>
                              <span className="font-medium">0043.0000.12345678901.29</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Titular:</span>
                              <span className="font-medium">Sufficius Commerce Lda.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.pagamento.metodo === "dinheiro" && (
                    <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                      <h3 className="font-bold mb-4 text-yellow-900">Pagamento na Entrega</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-yellow-800 mb-2">
                            Você pode pagar em dinheiro quando receber o produto.
                          </p>
                          <div className="text-sm text-yellow-700 space-y-1">
                            <li>• Apenas em Kwanzas (AOA)</li>
                            <li>• Troco para notas até 5.000 KZ</li>
                            <li>• Não aceitamos moedas estrangeiras</li>
                            <li>• O entregador fornecerá recibo</li>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                        <h3 className="font-bold text-green-900">Revise seu pedido</h3>
                        <p className="text-green-700 text-sm">
                          Confirme todas as informações antes de finalizar sua compra
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <InfoBox title="Resumo do Pedido" icon={CheckCircle}>
                      {carrinho.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                              <span className="text-xl">{item.imagem}</span>
                            </div>
                            <div>
                              <div className="font-medium">{item.nome}</div>
                              {item.sku && (
                                <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                              )}
                              <div className="text-sm text-gray-500">Quantidade: {item.quantidade}</div>
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
                        <p className="font-medium">{formData.endereco.nome}</p>
                        <p className="text-gray-600">
                          {formData.endereco.rua}, {formData.endereco.numero}
                          {formData.endereco.complemento && ` - ${formData.endereco.complemento}`}
                        </p>
                        <p className="text-gray-600">
                          {formData.endereco.bairro}, {formData.endereco.municipio}
                        </p>
                        <p className="text-gray-600">
                          {formData.endereco.provincia}
                        </p>
                        {formData.endereco.referencia && (
                          <p className="text-gray-600 text-sm">
                            Referência: {formData.endereco.referencia}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm">Telefone: {formatarTelefone(formData.endereco.telefone)}</p>
                        <p className="text-gray-600 text-sm">E-mail: {formData.endereco.email}</p>
                      </div>
                    </InfoBox>
                    
                    <InfoBox title="Método de Pagamento" icon={CreditCard}>
                      <div className="flex items-center">
                        <div className="text-2xl mr-4">
                          {formData.pagamento.metodo === "multicaixa" ? "🏧" : 
                           formData.pagamento.metodo === "cartao" ? "💳" : 
                           formData.pagamento.metodo === "transferencia" ? "🏦" : "💵"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {formData.pagamento.metodo === "multicaixa" ? "Multicaixa Express" : 
                             formData.pagamento.metodo === "cartao" ? "Cartão de Crédito/Débito" : 
                             formData.pagamento.metodo === "transferencia" ? "Transferência Bancária" : 
                             "Dinheiro na Entrega"}
                          </p>
                          {formData.pagamento.metodo === "cartao" && formData.pagamento.numeroCartao && (
                            <p className="text-sm text-gray-600">
                              **** **** **** {formData.pagamento.numeroCartao.slice(-4)}
                            </p>
                          )}
                          {formData.pagamento.metodo === "multicaixa" && formData.pagamento.banco && (
                            <p className="text-sm text-gray-600">
                              Banco: {BANCOS_ANGOLA.find(b => b.codigo === formData.pagamento.banco)?.nome}
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
                          checked={formData.termosAceitos}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            termosAceitos: e.target.checked
                          }))}
                          className="h-5 w-5 mt-0.5 mr-3 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                        />
                        <label htmlFor="termosAceitos" className="text-sm text-gray-600">
                          Ao clicar em "Finalizar Compra", você concorda com nossos{" "}
                          <a href="/termos" className="text-[#D4AF37] underline hover:text-[#c19b2c] font-medium">
                            Termos de Uso
                          </a>{" "}
                          e{" "}
                          <a href="/privacidade" className="text-[#D4AF37] underline hover:text-[#c19b2c] font-medium">
                            Política de Privacidade
                          </a>
                          . Também concorda com as condições de entrega, troca e devolução.
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
                  onClick={etapa === "confirmacao" ? finalizarCompra : avancarEtapa}
                  disabled={carregando}
                  className="px-8 py-3 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#c19b2c] disabled:opacity-70 disabled:cursor-not-allowed flex items-center transition-colors shadow-md hover:shadow-lg"
                >
                  {carregando ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
              <h3 className="font-bold mb-4 text-gray-800">Compra 100% Segura</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Site Seguro</div>
                    <div className="text-sm text-gray-600">Certificado SSL 256-bit</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Pagamento Seguro</div>
                    <div className="text-sm text-gray-600">Criptografia PCI DSS</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Entrega Garantida</div>
                    <div className="text-sm text-gray-600">Rastreamento em tempo real</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Resumo do Pedido</h2>
              
              {/* Produtos */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {carrinho.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-xl">{item.imagem}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.nome}</div>
                        <div className="text-xs text-gray-500">Qtd: {item.quantidade}</div>
                        <div className="text-xs text-gray-500">{formatarMoeda(item.preco)} cada</div>
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
                  <span className="text-gray-600">Frete para {formData.endereco.provincia || "Angola"}</span>
                  <span className={frete === 0 ? "text-green-600 font-medium" : ""}>
                    {frete === 0 ? "Grátis" : formatarMoeda(frete)}
                  </span>
                </div>
                
                {cupomAplicado && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Desconto Cupom</span>
                    <span className="font-bold">- {formatarMoeda(cupomDesconto)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">
                    {formatarMoeda(total)}
                  </span>
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
                  {formData.endereco.provincia === "Luanda" ? "1-2 dias úteis" : 
                   ["Benguela", "Huambo", "Huíla"].includes(formData.endereco.provincia) ? "3-4 dias úteis" : 
                   "5-7 dias úteis"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Para {formData.endereco.provincia || "sua província"}
                </div>
              </div>
              
              {/* Cupom */}
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="text"
                    value={codigoCupom}
                    onChange={(e) => setCodigoCupom(e.target.value)}
                    placeholder="Código do cupom"
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    disabled={cupomAplicado || verificandoCupom}
                  />
                  <button 
                    onClick={verificarCupom}
                    disabled={verificandoCupom || cupomAplicado}
                    className="bg-gray-800 text-white px-4 py-3 rounded-r-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verificandoCupom ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : cupomAplicado ? (
                      "✓"
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>
                {cupomAplicado && (
                  <p className="text-green-600 text-sm mt-2">Cupom aplicado com sucesso!</p>
                )}
              </div>
              
              {/* Informações */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Seu pedido será processado imediatamente após a confirmação de pagamento</span>
                </div>
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Garantia de 30 dias para devolução ou troca</span>
                </div>
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <Smartphone className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Rastreamento do pedido disponível no aplicativo</span>
                </div>
              </div>
              
              {/* Suporte */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Precisa de ajuda?{" "}
                  <a href="tel:+244923456789" className="font-medium underline hover:text-blue-900">
                    +244 923 456 789
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}