"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Globe,
  CreditCard,
  Truck,
  Mail,
  Shield,
  Bell,
  Tag,
  Store,
  Image,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  Edit,
  Camera,
  Palette,
  Zap,
  Database,
  Cloud,
  Server,
  Key,
  FileText,
  HelpCircle,
  Info,
  Settings
} from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [abaAtiva, setAbaAtiva] = useState("geral");
  const [salvando, setSalvando] = useState(false);
  const [modoManutencao, setModoManutencao] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estado para configurações
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações Gerais
    geral: {
      nomeLoja: "Sufficius Commerce",
      slogan: "Sua loja online de confiança",
      emailContato: "contato@sufficius.com",
      telefoneContato: "+244 123 456 789",
      cnpj: "12.345.678/0001-99",
      endereco: "Luanda, Angola",
      horarioFuncionamento: "Segunda a Sexta: 08:00 - 18:00",
      moeda: "KZ",
      simboloMoeda: "Kz",
      fusoHorario: "Africa/Luanda",
      idioma: "pt",
      formatoData: "DD/MM/YYYY"
    },

    // Aparência
    aparencia: {
      logo: "/logo.png",
      favicon: "/favicon.ico",
      corPrimaria: "#D4AF37",
      corSecundaria: "#1a1a1a",
      corFundo: "#ffffff",
      corTexto: "#333333",
      fontePrincipal: "Inter",
      tema: "claro",
      bannerAtivo: true,
      bannerTexto: "Promoção especial! Até 50% OFF",
      bannerCor: "#FF6B6B"
    },

    // Pagamentos
    pagamentos: {
      stripeAtivo: false,
      stripeChavePublica: "",
      stripeChaveSecreta: "",
      mpAtivo: true,
      mpAccessToken: "",
      pixAtivo: true,
      pixChave: "123.456.789-00",
      boletoAtivo: true,
      boletoDiasVencimento: 3,
      cartaoCreditoAtivo: true,
      cartaoDebitoAtivo: true,
      transferenciaAtivo: true,
      pagamentoEntregaAtivo: true,
      taxaCartao: 2.99,
      prazoEstorno: 30
    },

    // Entregas
    entregas: {
      freteGratisAtivo: true,
      freteGratisMinimo: 50000,
      calcularFreteAutomatico: true,
      prazoEntregaPadrao: "3-5 dias úteis",
      retiradaLojaAtivo: true,
      zonasEntrega: [
        { nome: "Luanda", valor: 5000, prazo: "1-2 dias" },
        { nome: "Outras Províncias", valor: 15000, prazo: "5-7 dias" }
      ],
      transportadoras: [
        { nome: "DHL", ativo: true },
        { nome: "FedEx", ativo: false },
        { nome: "Correios", ativo: true }
      ]
    },

    // Notificações
    notificacoes: {
      emailPedidoCriado: true,
      emailPedidoPago: true,
      emailPedidoEnviado: true,
      emailPedidoEntregue: true,
      emailBoasVindas: true,
      emailPromocional: true,
      smsPedidoCriado: false,
      smsPedidoEnviado: false,
      pushPedidoCriado: true,
      pushOfertas: true,
      emailServidor: "smtp.gmail.com",
      emailPorta: 587,
      emailUsuario: "notificacoes@sufficius.com",
      emailSenha: "",
      emailSeguranca: "tls"
    },

    // Segurança
    seguranca: {
      loginTentativas: 5,
      bloqueioTempo: 30,
      senhaMinima: 8,
      senhaMaiuscula: true,
      senhaMinuscula: true,
      senhaNumero: true,
      senhaEspecial: false,
      sessaoTempo: 24,
      httpsForcado: true,
      captchaLogin: true,
      captchaRegistro: true,
      verificarEmail: true,
      doisFatoresAdmin: true,
      logAcesso: true,
      ipRestricao: false
    },

    // API
    api: {
      apiAtiva: true,
      chaveApi: "sk_live_1234567890abcdef",
      chaveSecreta: "",
      webhookUrl: "https://api.sufficius.com/webhook",
      webhookEventos: ["pedido.criado", "pedido.pago", "pedido.entregue"],
      limiteRequisicoes: 1000,
      tempoLimite: 3600,
      corsOrigins: ["https://sufficius.com", "https://admin.sufficius.com"]
    }
  });

  // URLs sociais
  const [redesSociais, setRedesSociais] = useState({
    facebook: "https://facebook.com/sufficius",
    instagram: "https://instagram.com/sufficius",
    twitter: "https://twitter.com/sufficius",
    linkedin: "https://linkedin.com/company/sufficius",
    youtube: "https://youtube.com/sufficius",
    tiktok: "https://tiktok.com/@sufficius"
  });

  // Termos e políticas
  const [termos, setTermos] = useState({
    termosUso: `# Termos de Uso\n\nBem-vindo ao Sufficius Commerce!`,
    privacidade: `# Política de Privacidade\n\nSua privacidade é importante para nós.`,
    trocas: `# Política de Trocas e Devoluções\n\nPrazo de 30 dias para trocas.`,
    frete: `# Política de Frete\n\nFrete grátis para compras acima de 50.000 Kz.`
  });

  // Manipular mudanças
  const handleChange = (secao: string, campo: string, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [secao]: {
        ...prev[secao as keyof typeof prev],
        [campo]: valor
      }
    }));
  };

  // Salvar configurações
  const handleSalvar = async () => {
    setSalvando(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSalvando(false);
    }
  };

  // Abas de navegação
  const abas = [
    { id: "geral", label: "Geral", icon: <Store className="h-5 w-5" /> },
    { id: "aparencia", label: "Aparência", icon: <Palette className="h-5 w-5" /> },
    { id: "pagamentos", label: "Pagamentos", icon: <CreditCard className="h-5 w-5" /> },
    { id: "entregas", label: "Entregas", icon: <Truck className="h-5 w-5" /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell className="h-5 w-5" /> },
    { id: "seguranca", label: "Segurança", icon: <Shield className="h-5 w-5" /> },
    { id: "api", label: "API", icon: <Database className="h-5 w-5" /> },
    { id: "sociais", label: "Redes Sociais", icon: <Globe className="h-5 w-5" /> },
    { id: "termos", label: "Termos", icon: <FileText className="h-5 w-5" /> }
  ];

  // Renderizar conteúdo da aba
  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case "geral":
        return <ConfiguracoesGerais />;
      case "aparencia":
        return <ConfiguracoesAparencia />;
      case "pagamentos":
        return <ConfiguracoesPagamentos />;
      case "entregas":
        return <ConfiguracoesEntregas />;
      case "notificacoes":
        return <ConfiguracoesNotificacoes />;
      case "seguranca":
        return <ConfiguracoesSeguranca />;
      case "api":
        return <ConfiguracoesAPI />;
      case "sociais":
        return <ConfiguracoesSociais />;
      case "termos":
        return <ConfiguracoesTermos />;
      default:
        return <ConfiguracoesGerais />;
    }
  };

  // Componentes de cada seção
  function ConfiguracoesGerais() {
    return (
      <div className="space-y-8">
        {/* Informações da Loja */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Informações da Loja
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Loja *
              </label>
              <input
                type="text"
                value={configuracoes.geral.nomeLoja}
                onChange={(e) => handleChange("geral", "nomeLoja", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                value={configuracoes.geral.slogan}
                onChange={(e) => handleChange("geral", "slogan", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail de Contato *
              </label>
              <input
                type="email"
                value={configuracoes.geral.emailContato}
                onChange={(e) => handleChange("geral", "emailContato", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone de Contato
              </label>
              <input
                type="tel"
                value={configuracoes.geral.telefoneContato}
                onChange={(e) => handleChange("geral", "telefoneContato", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <textarea
                value={configuracoes.geral.endereco}
                onChange={(e) => handleChange("geral", "endereco", e.target.value)}
                rows={2}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                value={configuracoes.geral.horarioFuncionamento}
                onChange={(e) => handleChange("geral", "horarioFuncionamento", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={configuracoes.geral.cnpj}
                onChange={(e) => handleChange("geral", "cnpj", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
        </div>

        {/* Configurações Regionais */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Configurações Regionais
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moeda *
              </label>
              <select
                value={configuracoes.geral.moeda}
                onChange={(e) => handleChange("geral", "moeda", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="KZ">Kwanza (KZ)</option>
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Símbolo da Moeda
              </label>
              <input
                type="text"
                value={configuracoes.geral.simboloMoeda}
                onChange={(e) => handleChange("geral", "simboloMoeda", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                maxLength={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuso Horário *
              </label>
              <select
                value={configuracoes.geral.fusoHorario}
                onChange={(e) => handleChange("geral", "fusoHorario", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="Africa/Luanda">Africa/Luanda (GMT+1)</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                <option value="Europe/Lisbon">Europe/Lisbon (GMT+0)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma *
              </label>
              <select
                value={configuracoes.geral.idioma}
                onChange={(e) => handleChange("geral", "idioma", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Data *
              </label>
              <select
                value={configuracoes.geral.formatoData}
                onChange={(e) => handleChange("geral", "formatoData", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modo Manutenção */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Modo Manutenção
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Ativar Modo Manutenção</div>
              <div className="text-sm text-gray-600">
                A loja ficará temporariamente indisponível para visitantes
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={modoManutencao}
                onChange={(e) => setModoManutencao(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
          
          {modoManutencao && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Modo Manutenção Ativo
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Apenas administradores podem acessar a loja. Os visitantes verão uma página de manutenção.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function ConfiguracoesAparencia() {
    return (
      <div className="space-y-8">
        {/* Logo e Favicon */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Image className="h-5 w-5 mr-2" />
            Logo e Favicon
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Logo da Loja
              </label>
              
              <div className="flex items-center gap-6">
                <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {configuracoes.aparencia.logo ? (
                    <img
                      src={configuracoes.aparencia.logo}
                      alt="Logo"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]">
                    <Upload className="h-4 w-4" />
                    Upload Nova Logo
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  {configuracoes.aparencia.logo && (
                    <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Recomendado: PNG ou SVG, fundo transparente, mínimo 200x200px
              </div>
            </div>
            
            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Favicon
              </label>
              
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {configuracoes.aparencia.favicon ? (
                    <img
                      src={configuracoes.aparencia.favicon}
                      alt="Favicon"
                      className="h-10 w-10"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]">
                    <Upload className="h-4 w-4" />
                    Upload Favicon
                  </button>
                  <div className="text-sm text-gray-500">
                    Tamanho: 32x32px ou 64x64px
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cores da Loja */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Cores da Loja
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cor Primária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: configuracoes.aparencia.corPrimaria }}
                />
                <input
                  type="text"
                  value={configuracoes.aparencia.corPrimaria}
                  onChange={(e) => handleChange("aparencia", "corPrimaria", e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2 font-mono"
                  placeholder="#D4AF37"
                />
              </div>
            </div>
            
            {/* Cor Secundária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: configuracoes.aparencia.corSecundaria }}
                />
                <input
                  type="text"
                  value={configuracoes.aparencia.corSecundaria}
                  onChange={(e) => handleChange("aparencia", "corSecundaria", e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2 font-mono"
                  placeholder="#1a1a1a"
                />
              </div>
            </div>
            
            {/* Cor de Fundo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Fundo
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: configuracoes.aparencia.corFundo }}
                />
                <input
                  type="text"
                  value={configuracoes.aparencia.corFundo}
                  onChange={(e) => handleChange("aparencia", "corFundo", e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2 font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            
            {/* Cor do Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Texto
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: configuracoes.aparencia.corTexto }}
                />
                <input
                  type="text"
                  value={configuracoes.aparencia.corTexto}
                  onChange={(e) => handleChange("aparencia", "corTexto", e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2 font-mono"
                  placeholder="#333333"
                />
              </div>
            </div>
            
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <select
                value={configuracoes.aparencia.tema}
                onChange={(e) => handleChange("aparencia", "tema", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
                <option value="auto">Automático (sistema)</option>
              </select>
            </div>
            
            {/* Fonte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonte Principal
              </label>
              <select
                value={configuracoes.aparencia.fontePrincipal}
                onChange={(e) => handleChange("aparencia", "fontePrincipal", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Preview das Cores
            </label>
            <div className="grid grid-cols-5 gap-4">
              {[
                { nome: "Primária", cor: configuracoes.aparencia.corPrimaria },
                { nome: "Secundária", cor: configuracoes.aparencia.corSecundaria },
                { nome: "Fundo", cor: configuracoes.aparencia.corFundo },
                { nome: "Texto", cor: configuracoes.aparencia.corTexto },
                { nome: "Banner", cor: configuracoes.aparencia.bannerCor }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="h-16 w-full rounded-lg mb-2 border"
                    style={{ backgroundColor: item.cor }}
                  />
                  <div className="text-xs font-medium">{item.nome}</div>
                  <div className="text-xs text-gray-500 font-mono">{item.cor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Banner Promocional */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Banner Promocional
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Ativar Banner</div>
                <div className="text-sm text-gray-600">
                  Exibir banner promocional no topo da loja
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.aparencia.bannerAtivo}
                  onChange={(e) => handleChange("aparencia", "bannerAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {configuracoes.aparencia.bannerAtivo && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto do Banner
                  </label>
                  <input
                    type="text"
                    value={configuracoes.aparencia.bannerTexto}
                    onChange={(e) => handleChange("aparencia", "bannerTexto", e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Promoção especial! Até 50% OFF"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Banner
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border"
                      style={{ backgroundColor: configuracoes.aparencia.bannerCor }}
                    />
                    <input
                      type="text"
                      value={configuracoes.aparencia.bannerCor}
                      onChange={(e) => handleChange("aparencia", "bannerCor", e.target.value)}
                      className="flex-1 border rounded-lg px-4 py-2 font-mono"
                      placeholder="#FF6B6B"
                    />
                  </div>
                </div>
                
                {/* Preview do Banner */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </div>
                  <div
                    className="p-4 rounded-lg text-white font-medium text-center"
                    style={{ backgroundColor: configuracoes.aparencia.bannerCor }}
                  >
                    {configuracoes.aparencia.bannerTexto}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesPagamentos() {
    return (
      <div className="space-y-8">
        {/* Métodos de Pagamento */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Métodos de Pagamento
          </h3>
          
          <div className="space-y-6">
            {/* Cartão de Crédito */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Cartão de Crédito</div>
                  <div className="text-sm text-gray-600">Aceite pagamentos com cartão</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.cartaoCreditoAtivo}
                  onChange={(e) => handleChange("pagamentos", "cartaoCreditoAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {/* PIX */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-gray-600">Pagamentos instantâneos</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.pixAtivo}
                  onChange={(e) => handleChange("pagamentos", "pixAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {/* Boleto */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">Boleto Bancário</div>
                  <div className="text-sm text-gray-600">Pagamento em até 3 dias</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.boletoAtivo}
                  onChange={(e) => handleChange("pagamentos", "boletoAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {/* Pagamento na Entrega */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">Pagamento na Entrega</div>
                  <div className="text-sm text-gray-600">Dinheiro ou cartão na entrega</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.pagamentoEntregaAtivo}
                  onChange={(e) => handleChange("pagamentos", "pagamentoEntregaAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações Avançadas
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa do Cartão (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={configuracoes.pagamentos.taxaCartao}
                  onChange={(e) => handleChange("pagamentos", "taxaCartao", parseFloat(e.target.value))}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  step="0.01"
                  min="0"
                  max="20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo para Estorno (dias)
              </label>
              <input
                type="number"
                value={configuracoes.pagamentos.prazoEstorno}
                onChange={(e) => handleChange("pagamentos", "prazoEstorno", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                min="1"
                max="90"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dias para Vencimento do Boleto
              </label>
              <input
                type="number"
                value={configuracoes.pagamentos.boletoDiasVencimento}
                onChange={(e) => handleChange("pagamentos", "boletoDiasVencimento", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                min="1"
                max="30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave PIX
              </label>
              <input
                type="text"
                value={configuracoes.pagamentos.pixChave}
                onChange={(e) => handleChange("pagamentos", "pixChave", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="CPF/CNPJ, e-mail ou telefone"
              />
            </div>
          </div>
        </div>

        {/* Integrações */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Integrações de Pagamento
          </h3>
          
          {/* Stripe */}
          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Stripe</div>
                  <div className="text-sm text-gray-600">Pagamentos internacionais</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.stripeAtivo}
                  onChange={(e) => handleChange("pagamentos", "stripeAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {configuracoes.pagamentos.stripeAtivo && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave Pública
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={configuracoes.pagamentos.stripeChavePublica}
                      onChange={(e) => handleChange("pagamentos", "stripeChavePublica", e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="pk_live_..."
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave Secreta
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={configuracoes.pagamentos.stripeChaveSecreta}
                      onChange={(e) => handleChange("pagamentos", "stripeChaveSecreta", e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="sk_live_..."
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mercado Pago */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Mercado Pago</div>
                  <div className="text-sm text-gray-600">Pagamentos locais</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.pagamentos.mpAtivo}
                  onChange={(e) => handleChange("pagamentos", "mpAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {configuracoes.pagamentos.mpAtivo && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={configuracoes.pagamentos.mpAccessToken}
                    onChange={(e) => handleChange("pagamentos", "mpAccessToken", e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="APP_USR-..."
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesEntregas() {
    const [novaZona, setNovaZona] = useState({ nome: "", valor: "", prazo: "" });

    const handleAdicionarZona = () => {
      if (!novaZona.nome || !novaZona.valor) return;
      
      const zonas = [...configuracoes.entregas.zonasEntrega, {
        nome: novaZona.nome,
        valor: parseInt(novaZona.valor),
        prazo: novaZona.prazo || "3-5 dias"
      }];
      
      handleChange("entregas", "zonasEntrega", zonas);
      setNovaZona({ nome: "", valor: "", prazo: "" });
    };

    const handleRemoverZona = (index: number) => {
      const zonas = configuracoes.entregas.zonasEntrega.filter((_, i) => i !== index);
      handleChange("entregas", "zonasEntrega", zonas);
    };

    return (
      <div className="space-y-8">
        {/* Configurações Gerais de Entrega */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Configurações Gerais
          </h3>
          
          <div className="space-y-6">
            {/* Frete Grátis */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Frete Grátis</div>
                <div className="text-sm text-gray-600">Oferecer frete grátis para compras acima de um valor</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.entregas.freteGratisAtivo}
                  onChange={(e) => handleChange("entregas", "freteGratisAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {configuracoes.entregas.freteGratisAtivo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mínimo para Frete Grátis
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={configuracoes.entregas.freteGratisMinimo}
                    onChange={(e) => handleChange("entregas", "freteGratisMinimo", parseInt(e.target.value))}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Kz
                  </div>
                </div>
              </div>
            )}
            
            {/* Cálculo Automático */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Cálculo Automático de Frete</div>
                <div className="text-sm text-gray-600">Calcular frete automaticamente baseado no CEP</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.entregas.calcularFreteAutomatico}
                  onChange={(e) => handleChange("entregas", "calcularFreteAutomatico", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {/* Prazo Padrão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo de Entrega Padrão
              </label>
              <input
                type="text"
                value={configuracoes.entregas.prazoEntregaPadrao}
                onChange={(e) => handleChange("entregas", "prazoEntregaPadrao", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="ex: 3-5 dias úteis"
              />
            </div>
            
            {/* Retirada na Loja */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Retirada na Loja</div>
                <div className="text-sm text-gray-600">Permitir que clientes retirem pedidos na loja física</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.entregas.retiradaLojaAtivo}
                  onChange={(e) => handleChange("entregas", "retiradaLojaAtivo", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Zonas de Entrega */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Map className="h-5 w-5 mr-2" />
            Zonas de Entrega
          </h3>
          
          <div className="space-y-4">
            {/* Lista de zonas */}
            {configuracoes.entregas.zonasEntrega.map((zona, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{zona.nome}</div>
                  <div className="text-sm text-gray-600">
                    Valor: Kz {zona.valor.toLocaleString()} • Prazo: {zona.prazo}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoverZona(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {/* Adicionar nova zona */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Zona
                  </label>
                  <input
                    type="text"
                    value={novaZona.nome}
                    onChange={(e) => setNovaZona({...novaZona, nome: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="ex: Luanda Centro"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Frete (Kz)
                  </label>
                  <input
                    type="number"
                    value={novaZona.valor}
                    onChange={(e) => setNovaZona({...novaZona, valor: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="5000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Entrega
                  </label>
                  <input
                    type="text"
                    value={novaZona.prazo}
                    onChange={(e) => setNovaZona({...novaZona, prazo: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="ex: 1-2 dias"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAdicionarZona}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]"
              >
                <Plus className="h-4 w-4" />
                Adicionar Zona
              </button>
            </div>
          </div>
        </div>

        {/* Transportadoras */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Transportadoras
          </h3>
          
          <div className="space-y-4">
            {configuracoes.entregas.transportadoras.map((transportadora, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    transportadora.ativo ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Truck className={`h-4 w-4 ${
                      transportadora.ativo ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{transportadora.nome}</div>
                    <div className={`text-sm ${
                      transportadora.ativo ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {transportadora.ativo ? 'Ativa' : 'Inativa'}
                    </div>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transportadora.ativo}
                    onChange={(e) => {
                      const transportadoras = [...configuracoes.entregas.transportadoras];
                      transportadoras[index].ativo = e.target.checked;
                      handleChange("entregas", "transportadoras", transportadoras);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesNotificacoes() {
    return (
      <div className="space-y-8">
        {/* Notificações por E-mail */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Notificações por E-mail
          </h3>
          
          <div className="space-y-4">
            {[
              { id: 'emailPedidoCriado', label: 'Novo Pedido Criado', desc: 'Enviar e-mail quando um pedido é criado' },
              { id: 'emailPedidoPago', label: 'Pedido Pago', desc: 'Enviar e-mail quando um pedido é pago' },
              { id: 'emailPedidoEnviado', label: 'Pedido Enviado', desc: 'Enviar e-mail quando um pedido é enviado' },
              { id: 'emailPedidoEntregue', label: 'Pedido Entregue', desc: 'Enviar e-mail quando um pedido é entregue' },
              { id: 'emailBoasVindas', label: 'E-mail de Boas-vindas', desc: 'Enviar e-mail de boas-vindas para novos clientes' },
              { id: 'emailPromocional', label: 'E-mails Promocionais', desc: 'Enviar e-mails com promoções e ofertas' }
            ].map((notificacao) => (
              <div key={notificacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{notificacao.label}</div>
                  <div className="text-sm text-gray-600">{notificacao.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes[notificacao.id as keyof typeof configuracoes.notificacoes] as boolean}
                    onChange={(e) => handleChange("notificacoes", notificacao.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Configurações do Servidor de E-mail */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Configurações do Servidor de E-mail
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servidor SMTP
              </label>
              <input
                type="text"
                value={configuracoes.notificacoes.emailServidor}
                onChange={(e) => handleChange("notificacoes", "emailServidor", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porta
              </label>
              <input
                type="number"
                value={configuracoes.notificacoes.emailPorta}
                onChange={(e) => handleChange("notificacoes", "emailPorta", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="587"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={configuracoes.notificacoes.emailUsuario}
                onChange={(e) => handleChange("notificacoes", "emailUsuario", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="notificacoes@sufficius.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={configuracoes.notificacoes.emailSenha}
                  onChange={(e) => handleChange("notificacoes", "emailSenha", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segurança
              </label>
              <select
                value={configuracoes.notificacoes.emailSeguranca}
                onChange={(e) => handleChange("notificacoes", "emailSeguranca", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Nenhuma</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                Testar Conexão
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesSeguranca() {
    return (
      <div className="space-y-8">
        {/* Segurança do Login */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Segurança do Login
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tentativas de Login
              </label>
              <input
                type="number"
                value={configuracoes.seguranca.loginTentativas}
                onChange={(e) => handleChange("seguranca", "loginTentativas", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                min="1"
                max="10"
              />
              <div className="text-sm text-gray-500 mt-1">
                Número de tentativas antes do bloqueio
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de Bloqueio (minutos)
              </label>
              <input
                type="number"
                value={configuracoes.seguranca.bloqueioTempo}
                onChange={(e) => handleChange("seguranca", "bloqueioTempo", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                min="1"
                max="1440"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de Sessão (horas)
              </label>
              <input
                type="number"
                value={configuracoes.seguranca.sessaoTempo}
                onChange={(e) => handleChange("seguranca", "sessaoTempo", parseInt(e.target.value))}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                min="1"
                max="168"
              />
            </div>
          </div>
        </div>

        {/* Requisitos de Senha */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Requisitos de Senha
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Comprimento Mínimo</div>
                <div className="text-sm text-gray-600">Número mínimo de caracteres</div>
              </div>
              <input
                type="number"
                value={configuracoes.seguranca.senhaMinima}
                onChange={(e) => handleChange("seguranca", "senhaMinima", parseInt(e.target.value))}
                className="w-20 border rounded-lg px-3 py-2 text-center"
                min="6"
                max="32"
              />
            </div>
            
            {[
              { id: 'senhaMaiuscula', label: 'Letra Maiúscula', desc: 'Exigir pelo menos uma letra maiúscula' },
              { id: 'senhaMinuscula', label: 'Letra Minúscula', desc: 'Exigir pelo menos uma letra minúscula' },
              { id: 'senhaNumero', label: 'Número', desc: 'Exigir pelo menos um número' },
              { id: 'senhaEspecial', label: 'Caractere Especial', desc: 'Exigir pelo menos um caractere especial (!@#$%)' }
            ].map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{req.label}</div>
                  <div className="text-sm text-gray-600">{req.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.seguranca[req.id as keyof typeof configuracoes.seguranca] as boolean}
                    onChange={(e) => handleChange("seguranca", req.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Medidas Avançadas */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Medidas Avançadas de Segurança
          </h3>
          
          <div className="space-y-4">
            {[
              { id: 'httpsForcado', label: 'HTTPS Forçado', desc: 'Redirecionar todas as requisições HTTP para HTTPS' },
              { id: 'captchaLogin', label: 'CAPTCHA no Login', desc: 'Exigir CAPTCHA na página de login' },
              { id: 'captchaRegistro', label: 'CAPTCHA no Registro', desc: 'Exigir CAPTCHA no registro de novos usuários' },
              { id: 'verificarEmail', label: 'Verificação de E-mail', desc: 'Exigir verificação de e-mail para novos usuários' },
              { id: 'doisFatoresAdmin', label: 'Autenticação em Dois Fatores (Admin)', desc: 'Exigir 2FA para acesso administrativo' },
              { id: 'logAcesso', label: 'Log de Acessos', desc: 'Registrar todos os acessos ao sistema' },
              { id: 'ipRestricao', label: 'Restrição por IP', desc: 'Restringir acesso a IPs específicos' }
            ].map((medida) => (
              <div key={medida.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{medida.label}</div>
                  <div className="text-sm text-gray-600">{medida.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.seguranca[medida.id as keyof typeof configuracoes.seguranca] as boolean}
                    onChange={(e) => handleChange("seguranca", medida.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesAPI() {
    return (
      <div className="space-y-8">
        {/* Configurações da API */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Configurações da API
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">API Ativa</div>
                <div className="text-sm text-gray-600">Ativar acesso à API REST</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.api.apiAtiva}
                  onChange={(e) => handleChange("api", "apiAtiva", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {configuracoes.api.apiAtiva && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave da API
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={configuracoes.api.chaveApi}
                      onChange={(e) => handleChange("api", "chaveApi", e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono"
                      readOnly
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(configuracoes.api.chaveApi);
                        toast.success("Chave copiada!");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Use esta chave para autenticar suas requisições
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave Secreta
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={configuracoes.api.chaveSecreta}
                      onChange={(e) => handleChange("api", "chaveSecreta", e.target.value)}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Webhook
                  </label>
                  <input
                    type="url"
                    value={configuracoes.api.webhookUrl}
                    onChange={(e) => handleChange("api", "webhookUrl", e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="https://seu-servidor.com/webhook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite de Requisições (por hora)
                  </label>
                  <input
                    type="number"
                    value={configuracoes.api.limiteRequisicoes}
                    onChange={(e) => handleChange("api", "limiteRequisicoes", parseInt(e.target.value))}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    min="10"
                    max="10000"
                  />
                </div>
                
                <button
                  onClick={() => {
                    const novaChave = `sk_live_${Math.random().toString(36).substr(2, 20)}`;
                    handleChange("api", "chaveApi", novaChave);
                    toast.success("Nova chave da API gerada!");
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Gerar Nova Chave
                </button>
              </>
            )}
          </div>
        </div>

        {/* Documentação */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documentação da API
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Documentação Completa</div>
                  <div className="text-sm text-blue-700">
                    Consulte nossa documentação para detalhes sobre endpoints e autenticação
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium">Autenticação</div>
                <div className="text-sm text-gray-600 mt-1">
                  Como autenticar suas requisições
                </div>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium">Endpoints</div>
                <div className="text-sm text-gray-600 mt-1">
                  Lista completa de endpoints disponíveis
                </div>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium">Webhooks</div>
                <div className="text-sm text-gray-600 mt-1">
                  Configurar e usar webhooks
                </div>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <div className="font-medium">Limites</div>
                <div className="text-sm text-gray-600 mt-1">
                  Limites de requisição e uso
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesSociais() {
    return (
      <div className="space-y-8">
        {/* Redes Sociais */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Redes Sociais
          </h3>
          
          <div className="space-y-6">
            {[
              { id: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/sufficius' },
              { id: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/sufficius' },
              { id: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/sufficius' },
              { id: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/sufficius' },
              { id: 'youtube', label: 'YouTube', icon: '🎥', placeholder: 'https://youtube.com/sufficius' },
              { id: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@sufficius' }
            ].map((rede) => (
              <div key={rede.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-2">{rede.icon}</span>
                  {rede.label}
                </label>
                <input
                  type="url"
                  value={redesSociais[rede.id as keyof typeof redesSociais]}
                  onChange={(e) => setRedesSociais({...redesSociais, [rede.id]: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder={rede.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Compartilhamento */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhamento
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compartilhamento em Redes Sociais</div>
                <div className="text-sm text-gray-600">
                  Adicionar botões de compartilhamento nas páginas de produtos
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Meta Tags para SEO</div>
                <div className="text-sm text-gray-600">
                  Gerar automaticamente meta tags para redes sociais
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ConfiguracoesTermos() {
    const [termoAtivo, setTermoAtivo] = useState('termosUso');

    return (
      <div className="space-y-8">
        {/* Seletor de Termos */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Termos e Políticas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { id: 'termosUso', label: 'Termos de Uso' },
              { id: 'privacidade', label: 'Privacidade' },
              { id: 'trocas', label: 'Trocas' },
              { id: 'frete', label: 'Frete' }
            ].map((termo) => (
              <button
                key={termo.id}
                onClick={() => setTermoAtivo(termo.id)}
                className={`px-4 py-3 rounded-lg text-center ${
                  termoAtivo === termo.id
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {termo.label}
              </button>
            ))}
          </div>
          
          {/* Editor de Texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <textarea
              value={termos[termoAtivo as keyof typeof termos]}
              onChange={(e) => setTermos({...termos, [termoAtivo]: e.target.value})}
              rows={12}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono text-sm"
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Dica: Use Markdown para formatação (# para títulos, **para negrito**, etc.)
          </div>
        </div>

        {/* Configurações de Cookies */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Configurações de Cookies
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Banner de Cookies</div>
                <div className="text-sm text-gray-600">
                  Exibir banner de consentimento de cookies
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Política de Cookies</div>
                <div className="text-sm text-gray-600">
                  Link para política de cookies no rodapé
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Banner de Cookies
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Este site usa cookies para melhorar sua experiência..."
                defaultValue="Este site usa cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Import necessário para o ícone Map
  const { Map, Copy, Share2 } = require("lucide-react");

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Configure todas as opções da sua loja</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#c19b2c] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {salvando ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Salvar Alterações
              </>
            )}
          </button>
          
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5" />
            Backup
          </button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex border-b">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  abaAtiva === aba.id
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {aba.icon}
                {aba.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Conteúdo da aba */}
        <div className="p-6">
          {renderizarConteudo()}
        </div>
      </div>

      {/* Rodapé com ações */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-white rounded-xl shadow">
        <div className="text-sm text-gray-600">
          As configurações serão aplicadas imediatamente após salvar
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Restaurar todas as configurações para os valores padrão?")) {
                // Lógica para resetar configurações
                toast.success("Configurações restauradas!");
              }
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            Restaurar Padrões
          </button>
          
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#c19b2c] disabled:opacity-70"
          >
            <Save className="h-5 w-5" />
            Salvar Todas as Configurações
          </button>
        </div>
      </div>
    </div>
  );
}