"use client";

import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Download,
  Share2,
  Star,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Shield,
  Gift
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ConfirmacaoCompra() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<any>(null);
  const [etapaEntrega, setEtapaEntrega] = useState(0); // 0: processando, 1: preparando, 2: enviado, 3: entregue

  useEffect(() => {
    const dadosPedido = {
      numero: "SC20241125001",
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: "CONFIRMADO",
      metodoPagamento: "Cartão de Crédito",
      ultimosDigitos: "4242",
      total: 12997.90,
      desconto: 0,
      frete: 0,
      subtotal: 12997.90,
      cliente: {
        nome: "João Silva",
        email: "joao.silva@email.com",
        telefone: "(11) 99999-9999"
      },
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apartamento 45",
        bairro: "Jardim América",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567"
      },
      produtos: [
        {
          id: 1,
          nome: "Smartphone Premium",
          preco: 8999,
          quantidade: 1,
          imagem: "📱",
          categoria: "Eletrônicos"
        },
        {
          id: 2,
          nome: "Fone Bluetooth Premium",
          preco: 1999,
          quantidade: 2,
          imagem: "🎧",
          categoria: "Áudio"
        }
      ],
      codigoRastreio: "BR123456789SP",
      previsaoEntrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    };

    setPedido(dadosPedido);

    // Simular progresso da entrega
    const interval = setInterval(() => {
      setEtapaEntrega(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const etapasEntrega = [
    { 
      titulo: "Pedido Confirmado", 
      descricao: "Seu pedido foi recebido e confirmado",
      icon: <CheckCircle className="h-6 w-6" />,
      cor: "bg-green-500"
    },
    { 
      titulo: "Em Preparação", 
      descricao: "Seus produtos estão sendo preparados",
      icon: <Package className="h-6 w-6" />,
      cor: "bg-blue-500"
    },
    { 
      titulo: "Enviado", 
      descricao: "Seu pedido saiu para entrega",
      icon: <Truck className="h-6 w-6" />,
      cor: "bg-orange-500"
    },
    { 
      titulo: "Entregue", 
      descricao: "Pedido entregue com sucesso!",
      icon: <Home className="h-6 w-6" />,
      cor: "bg-[#D4AF37]"
    }
  ];

  const handleDownloadComprovante = () => {
    toast.success("Comprovante baixado com sucesso!");
    // Aqui você implementaria o download real do PDF
  };

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meu pedido #${pedido.numero}`,
          text: `Acabei de fazer um pedido na Sufficius Commerce! Pedido #${pedido.numero}`,
          url: window.location.href,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleAvaliar = () => {
    navigate("/avaliar");
  };

  const handleVerMaisProdutos = () => {
    navigate("/");
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" />
      
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
              <span className="ml-2 font-bold text-gray-900">Sufficius Commerce</span>
            </div>
            
            <button className="hidden md:flex items-center text-sm text-gray-600 hover:text-[#D4AF37]">
              <Shield className="h-5 w-5 mr-2" />
              Ajuda
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner de Sucesso */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Compra realizada com sucesso!</h1>
                <p className="text-green-100">
                  Seu pedido #{pedido.numero} foi confirmado e já está sendo processado.
                </p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm mb-1">Código do Pedido</div>
              <div className="text-2xl font-mono font-bold">{pedido.numero}</div>
              <div className="text-sm mt-1">{pedido.data} às {pedido.hora}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Status da Entrega */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Truck className="h-6 w-6 mr-2 text-[#D4AF37]" />
                Acompanhe seu pedido
              </h2>
              
              <div className="relative">
                {/* Linha de progresso */}
                <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 -translate-y-1/2">
                  <div 
                    className="h-full bg-[#D4AF37] transition-all duration-1000"
                    style={{ width: `${(etapaEntrega / 3) * 100}%` }}
                  />
                </div>
                
                {/* Etapas */}
                <div className="grid grid-cols-4 gap-4">
                  {etapasEntrega.map((etapa, index) => (
                    <div key={index} className="text-center relative">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        index <= etapaEntrega ? etapa.cor : "bg-gray-200"
                      } ${index <= etapaEntrega ? "text-white" : "text-gray-400"}`}>
                        {etapa.icon}
                      </div>
                      <div className="font-medium mb-1">{etapa.titulo}</div>
                      <div className="text-sm text-gray-600">{etapa.descricao}</div>
                      {index <= etapaEntrega && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {index === etapaEntrega ? "Em andamento..." : "Concluído ✓"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Previsão de Entrega</span>
                  </div>
                  <div className="text-2xl font-bold text-[#D4AF37]">{pedido.previsaoEntrega}</div>
                  <div className="text-sm text-gray-600 mt-1">Entre 2-4 dias úteis</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Código de Rastreio</span>
                  </div>
                  <div className="text-2xl font-mono font-bold">{pedido.codigoRastreio}</div>
                  <button className="text-sm text-[#D4AF37] font-medium mt-1 hover:underline">
                    Acompanhar envio →
                  </button>
                </div>
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Detalhes do Pedido</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-gray-600 font-medium">Produto</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Quantidade</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Preço Unitário</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.produtos.map((produto: any) => (
                      <tr key={produto.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                              {produto.imagem}
                            </div>
                            <div>
                              <div className="font-medium">{produto.nome}</div>
                              <div className="text-sm text-gray-500">{produto.categoria}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium">{produto.quantidade}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium">{formatarValor(produto.preco)}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-bold text-[#D4AF37]">
                            {formatarValor(produto.preco * produto.quantidade)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Resumo Financeiro */}
              <div className="mt-8 max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatarValor(pedido.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  {pedido.desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- {formatarValor(pedido.desconto)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">{formatarValor(pedido.total)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 text-right">
                      Em 12x de {formatarValor(pedido.total / 12)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Entrega e Pagamento */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Endereço de Entrega */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Endereço de Entrega
                </h3>
                <div className="space-y-2">
                  <div className="font-medium">{pedido.cliente.nome}</div>
                  <div>
                    {pedido.endereco.rua}, {pedido.endereco.numero}
                    {pedido.endereco.complemento && ` - ${pedido.endereco.complemento}`}
                  </div>
                  <div>{pedido.endereco.bairro}</div>
                  <div>{pedido.endereco.cidade} - {pedido.endereco.estado}</div>
                  <div>CEP: {pedido.endereco.cep}</div>
                </div>
                <button className="mt-4 text-[#D4AF37] font-medium hover:underline flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver no mapa
                </button>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Método de Pagamento
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="font-medium">{pedido.metodoPagamento}</div>
                    <div className="text-sm text-gray-600">
                      Final {pedido.ultimosDigitos} • Em 12x sem juros
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Comprovante de pagamento enviado para: {pedido.cliente.email}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleDownloadComprovante}
                className="flex-1 min-w-[200px] bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Comprovante
              </button>
              
              <button
                onClick={handleCompartilhar}
                className="flex-1 min-w-[200px] border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhar Pedido
              </button>
              
              <button
                onClick={handleAvaliar}
                className="flex-1 min-w-[200px] border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl font-medium hover:bg-[#D4AF37]/5 transition flex items-center justify-center"
              >
                <Star className="h-5 w-5 mr-2" />
                Avaliar Compra
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold mb-4">Próximos Passos</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium">Confirmação por e-mail</div>
                    <div className="text-sm text-gray-600">Enviado para {pedido.cliente.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium">Notificações por SMS</div>
                    <div className="text-sm text-gray-600">Atualizações no {pedido.cliente.telefone}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium">Tempo de entrega</div>
                    <div className="text-sm text-gray-600">2-4 dias úteis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suporte */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Precisa de ajuda?
              </h3>
              
              <div className="space-y-3 mb-6">
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <div className="font-medium">Acompanhar pedido</div>
                  <div className="text-sm text-gray-300">Status e localização</div>
                </button>
                
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <div className="font-medium">Alterar entrega</div>
                  <div className="text-sm text-gray-300">Data ou endereço</div>
                </button>
                
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <div className="font-medium">Falar com suporte</div>
                  <div className="text-sm text-gray-300">24h por dia, 7 dias</div>
                </button>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="text-sm mb-2">Central de atendimento</div>
                <div className="text-2xl font-bold">0800 123 4567</div>
                <div className="text-sm text-gray-300 mt-1">suporte@sufficius.com</div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-[#D4AF37]" />
                Você também pode gostar
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg hover:border-[#D4AF37] transition cursor-pointer">
                  <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-xl mr-3">
                    ⌚
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Smartwatch Pro</div>
                    <div className="text-sm text-gray-600">R$ 1.599,00</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex items-center p-3 border rounded-lg hover:border-[#D4AF37] transition cursor-pointer">
                  <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-xl mr-3">
                    🎮
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Controle Gamer</div>
                    <div className="text-sm text-gray-600">R$ 399,00</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <button
                  onClick={handleVerMaisProdutos}
                  className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-medium hover:bg-[#D4AF37]/5 transition flex items-center justify-center"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ver mais produtos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Garantias */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Por que comprar conosco?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold mb-2">Garantia de 30 Dias</h3>
              <p className="text-gray-600">
                Se não gostar, devolvemos seu dinheiro. Sem complicações.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Entregamos em todo o Brasil em até 4 dias úteis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Suporte 24/7</h3>
              <p className="text-gray-600">
                Nossa equipe está sempre disponível para ajudar você.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold">Sufficius Commerce</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">Obrigado por comprar conosco! 🎉</p>
              <p className="text-sm text-gray-500 mt-1">
                Seu pedido #{pedido.numero} está sendo processado com cuidado.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Sufficius Commerce. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">
              Em caso de dúvidas, entre em contato: suporte@sufficius.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}