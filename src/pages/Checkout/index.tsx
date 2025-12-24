"use client";

import { useState } from "react";
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
  Calendar
} from "lucide-react";
import { toast } from "sonner";

// Página de Checkout/Pagamento
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<"endereco" | "pagamento" | "confirmacao">("endereco");
  const [metodoPagamento, setMetodoPagamento] = useState("cartao");
  const [carregando, setCarregando] = useState(false);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    cpf: "",
    numeroCartao: "",
    nomeCartao: "",
    validade: "",
    cvv: ""
  });
  
  // Dados do carrinho (exemplo)
  const [carrinho] = useState([
    { id: 1, nome: "Smartphone Premium", preco: 8999, quantidade: 1, imagem: "📱" },
    { id: 2, nome: "Fone Bluetooth", preco: 1999, quantidade: 2, imagem: "🎧" }
  ]);
  
  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const frete = subtotal > 5000 ? 0 : 29.90;
  const total = subtotal + frete;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const avancarEtapa = () => {
    if (etapa === "endereco") {
      // Validação básica
      if (!formData.nome || !formData.email || !formData.endereco) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      setEtapa("pagamento");
    } else if (etapa === "pagamento") {
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
  
  const finalizarCompra = () => {
    setCarregando(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setCarregando(false);
      toast.success("🎉 Compra realizada com sucesso!");
      
      // Redirecionar para página de confirmação
      setTimeout(() => {
        navigate("/confirmacao");
      }, 1500);
    }, 2000);
  };
  
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
            {["endereco", "pagamento", "confirmacao"].map((etapaAtual, index) => (
              <div key={etapaAtual} className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  etapa === etapaAtual 
                    ? "bg-[#D4AF37] text-white" 
                    : etapa === "pagamento" && index === 0
                    ? "bg-green-500 text-white"
                    : etapa === "confirmacao" && index <= 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {etapa === "confirmacao" && index <= 1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-2 mr-4">
                  <div className="text-sm font-medium">
                    {etapaAtual === "endereco" ? "Endereço" : 
                     etapaAtual === "pagamento" ? "Pagamento" : "Confirmação"}
                  </div>
                </div>
                {index < 2 && (
                  <div className={`h-1 w-16 ${
                    (etapa === "pagamento" && index === 0) || 
                    (etapa === "confirmacao" && index <= 1)
                      ? "bg-green-500" 
                      : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              {/* Etapa 1: Endereço */}
              {etapa === "endereco" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
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
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="00000-000"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço *
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                        value={formData.complemento}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Apartamento, Bloco, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Sua cidade"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PR">Paraná</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Etapa 2: Pagamento */}
              {etapa === "pagamento" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-[#D4AF37]" />
                    Método de Pagamento
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {[
                      { id: "cartao", label: "Cartão de Crédito", icon: "💳" },
                      { id: "pix", label: "PIX", icon: "🏦" },
                      { id: "boleto", label: "Boleto Bancário", icon: "📄" },
                      { id: "debito", label: "Cartão de Débito", icon: "💵" }
                    ].map((metodo) => (
                      <div
                        key={metodo.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          metodoPagamento === metodo.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/5"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setMetodoPagamento(metodo.id)}
                      >
                        <div className="text-2xl mr-4">{metodo.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{metodo.label}</div>
                          {metodo.id === "cartao" && (
                            <div className="text-sm text-gray-500">Em até 12x sem juros</div>
                          )}
                          {metodo.id === "pix" && (
                            <div className="text-sm text-gray-500">5% de desconto</div>
                          )}
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${
                          metodoPagamento === metodo.id
                            ? "border-[#D4AF37] bg-[#D4AF37]"
                            : "border-gray-300"
                        }`}>
                          {metodoPagamento === metodo.id && (
                            <div className="h-2 w-2 bg-white rounded-full m-0.5 mx-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Formulário do cartão */}
                  {metodoPagamento === "cartao" && (
                    <div className="border-t pt-6">
                      <h3 className="font-bold mb-4">Dados do Cartão</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número do Cartão *
                          </label>
                          <input
                            type="text"
                            name="numeroCartao"
                            value={formData.numeroCartao}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                            value={formData.nomeCartao}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="Como está escrito no cartão"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validade *
                          </label>
                          <input
                            type="text"
                            name="validade"
                            value={formData.validade}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="MM/AA"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Informações PIX */}
                  {metodoPagamento === "pix" && (
                    <div className="border rounded-lg p-6 bg-blue-50">
                      <h3 className="font-bold mb-4 text-blue-900">Pagamento via PIX</h3>
                      <p className="text-blue-800 mb-4">
                        Você ganhou <strong>5% de desconto</strong> ao pagar com PIX!
                      </p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">QR Code será gerado após confirmar o pedido</p>
                        <p className="text-sm text-gray-600">Pagamento aprovado instantaneamente</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Informações Boleto */}
                  {metodoPagamento === "boleto" && (
                    <div className="border rounded-lg p-6 bg-yellow-50">
                      <h3 className="font-bold mb-4 text-yellow-900">Boleto Bancário</h3>
                      <p className="text-yellow-800 mb-4">
                        O boleto será gerado após confirmar o pedido e enviado para seu e-mail.
                      </p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Prazo de pagamento: 3 dias úteis</p>
                        <p className="text-sm text-gray-600">Entrega será realizada após confirmação do pagamento</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Etapa 3: Confirmação */}
              {etapa === "confirmacao" && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                    Confirmação do Pedido
                  </h2>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-green-900 mb-2">Pedido #SC20241125001</h3>
                    <p className="text-green-800">
                      Revise todas as informações antes de finalizar sua compra
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-3">Resumo do Pedido</h3>
                      <div className="border rounded-lg p-4">
                        {carrinho.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                                {item.imagem}
                              </div>
                              <div>
                                <div className="font-medium">{item.nome}</div>
                                <div className="text-sm text-gray-500">Quantidade: {item.quantidade}</div>
                              </div>
                            </div>
                            <div className="font-bold">
                              R$ {(item.preco * item.quantidade).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-3">Endereço de Entrega</h3>
                      <div className="border rounded-lg p-4">
                        <p className="font-medium">{formData.nome}</p>
                        <p>{formData.endereco}, {formData.numero}</p>
                        <p>{formData.complemento}</p>
                        <p>{formData.cidade} - {formData.estado}</p>
                        <p>CEP: {formData.cep}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-3">Método de Pagamento</h3>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {metodoPagamento === "cartao" ? "💳" : 
                             metodoPagamento === "pix" ? "🏦" : 
                             metodoPagamento === "boleto" ? "📄" : "💵"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {metodoPagamento === "cartao" ? "Cartão de Crédito" : 
                               metodoPagamento === "pix" ? "PIX" : 
                               metodoPagamento === "boleto" ? "Boleto Bancário" : "Cartão de Débito"}
                            </p>
                            {metodoPagamento === "cartao" && formData.numeroCartao && (
                              <p className="text-sm text-gray-600">
                                **** **** **** {formData.numeroCartao.slice(-4)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Ao clicar em "Finalizar Compra", você concorda com nossos{" "}
                        <a href="#" className="text-[#D4AF37] underline">Termos de Uso</a> e{" "}
                        <a href="#" className="text-[#D4AF37] underline">Política de Privacidade</a>.
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              {/* Botões de navegação */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={voltarEtapa}
                  disabled={etapa === "endereco"}
                  className={`px-6 py-3 border rounded-lg font-medium ${
                    etapa === "endereco"
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Voltar
                </button>
                
                <button
                  onClick={etapa === "confirmacao" ? finalizarCompra : avancarEtapa}
                  disabled={carregando}
                  className="px-8 py-3 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#c19b2c] disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
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
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">Compra 100% Segura</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium">Site Seguro</div>
                    <div className="text-sm text-gray-600">Dados protegidos</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium">Pagamento Seguro</div>
                    <div className="text-sm text-gray-600">Criptografia SSL</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium">Entrega Garantida</div>
                    <div className="text-sm text-gray-600">Rastreamento 24h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
              
              {/* Produtos */}
              <div className="space-y-4 mb-6">
                {carrinho.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center mr-3">
                        {item.imagem}
                      </div>
                      <div>
                        <div className="font-medium">{item.nome}</div>
                        <div className="text-sm text-gray-500">Qtd: {item.quantidade}</div>
                      </div>
                    </div>
                    <div className="font-bold">
                      R$ {(item.preco * item.quantidade).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Valores */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>{frete === 0 ? "Grátis" : `R$ ${frete.toLocaleString()}`}</span>
                </div>
                {metodoPagamento === "pix" && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto PIX (5%)</span>
                    <span>- R$ {(subtotal * 0.05).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">
                    R$ {metodoPagamento === "pix" 
                      ? (total - (subtotal * 0.05)).toLocaleString() 
                      : total.toLocaleString()}
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
                  2-4 dias úteis
                </div>
              </div>
              
              {/* Cupom */}
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Código do cupom"
                    className="flex-1 border rounded-l-lg px-4 py-3 focus:outline-none"
                  />
                  <button className="bg-gray-800 text-white px-4 py-3 rounded-r-lg hover:bg-gray-900">
                    Aplicar
                  </button>
                </div>
              </div>
              
              {/* Informações */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Seu pedido será processado imediatamente após a confirmação de pagamento</span>
                </div>
                <div className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Garantia de 30 dias para devolução</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}