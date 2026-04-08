"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftIcon,
  Copy,
  Loader2,
  ShoppingCartIcon,
  Trash2,
  XCircle,
  CreditCard,
  MapPin,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Banknote,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import UploadArea from "@/(admin)/components/upload-area";
import { api } from "@/modules/services/api/axios";
import { motion, AnimatePresence } from "framer-motion";

// Componente de imagem com fallback e loading
const CartItemImage = ({ src, alt }: { src?: string; alt: string }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20">
      {loading && (
        <div className="absolute inset-0 bg-gray-200 rounded-xl animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className="w-20 h-20 object-cover rounded-xl"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
};

// Componente de estatísticas do pedido
const OrderStats = ({ total, quantidade }: { total: number; quantidade: number }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
        <ShoppingCartIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Itens</span>
      </div>
      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{quantidade}</p>
    </div>
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
        <CreditCard className="w-4 h-4" />
        <span className="text-sm font-medium">Total</span>
      </div>
      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(total)}</p>
    </div>
  </div>
);

// Componente de item do carrinho
const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating,
  editedItems,
  onSaveQuantity 
}: { 
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  editedItems: Record<string, number>;
  onSaveQuantity: (id: string) => void;
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const isEdited = editedItems[item.id] !== undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
      
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Imagem e detalhes */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <CartItemImage src={item.image} alt={item.name} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {item.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.price)} un.
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>

          {/* Controles de quantidade */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleQuantityChange(localQuantity - 1)}
                disabled={localQuantity <= 1 || isUpdating}
                className="h-10 w-10 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                value={localQuantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-16 text-center border-0 bg-transparent focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                disabled={isUpdating}
              />
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={isUpdating}
                className="h-10 w-10 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {isEdited && (
              <Button
                size="sm"
                onClick={() => onSaveQuantity(item.id)}
                disabled={isUpdating}
                className="bg-green-500 hover:bg-green-600 text-white h-10 px-4 rounded-xl"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.product_id)}
              disabled={isUpdating}
              className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de formulário de pagamento
const PaymentForm = ({
  phone,
  setPhone,
  location,
  setLocation,
  paymentProof,
  setPaymentProof,
  errors,
  totalPrice,
  isSubmitting,
  onSubmit
}: {
  phone: string;
  setPhone: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
  errors: any;
  totalPrice: number;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const [copyMessage, setCopyMessage] = useState(false);
  const iban = "AO006.0040.0000.8729.0482.1013.4";

  const handleCopy = () => {
    navigator.clipboard.writeText(iban);
    setCopyMessage(true);
    setTimeout(() => setCopyMessage(false), 2000);
    toast.success("IBAN copiado!");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* IBAN */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-3">
          <Banknote className="w-4 h-4" />
          <span className="text-sm font-medium">Transferência Bancária</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-800 px-4 py-3 font-mono text-sm">
            {iban}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className={`border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 ${
              copyMessage ? 'bg-green-500 text-white border-green-500' : ''
            }`}
          >
            {copyMessage ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Telefone para contato
        </label>
        <Input
          type="tel"
          placeholder="(XX) XXX-XXX-XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`h-12 ${
            errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* Endereço */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Endereço de entrega
        </label>
        <Input
          type="text"
          placeholder="Rua, número, bairro"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`h-12 ${
            errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
        />
        {errors.location && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Upload do comprovativo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Comprovativo de pagamento
        </label>
        <UploadArea 
          onChange={setPaymentProof}
          value={paymentProof as any}
          // className={(errors.paymentProof as string) ? 'border-red-500' : ''}
        />
        {errors.paymentProof && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.paymentProof}
          </p>
        )}
      </div>

      {/* Total e botão */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Total a pagar</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalPrice)}
          </span>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processando...</span>
            </div>
          ) : (
            "Finalizar Compra"
          )}
        </Button>
      </div>
    </form>
  );
};

// Componente principal
export default function CheckoutPage() {
  const { user } = useAuthStore();
  const user_Id = user?.id_usuario || "";
  const [cart, setCart] = useState<any[]>([]);
  const [editedItems, setEditedItems] = useState<Record<string, number>>({});
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => carrinhosRoute.getCarrinho(),
  });

  const clearCartMutation = useMutation({
    mutationFn: () => carrinhosRoute.deleteAllProductsInCart(cartData?.data?.id),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Carrinho esvaziado");
      setCart([]);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (produtoId: string) => 
      carrinhosRoute.deleteProductInCart(cartData?.data?.id, produtoId),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Produto removido");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      carrinhosRoute.atualizarItem(cartData?.data?.id, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Quantidade atualizada");
      setEditedItems({});
    },
  });

  useEffect(() => {
    if (cartData?.data?.itens) {
      const mapped = cartData.data.itens.map((item) => ({
        id: item.id,
        name: item.produto.nome,
        image: item.produto.foto || item.produto.imagemUrl || item.produto.imagem,
        price: item.produto.preco,
        quantity: item.quantidade,
        product_id: item.produtoId,
      }));
      setCart(mapped);
    }
  }, [cartData]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    setEditedItems(prev => ({ ...prev, [id]: quantity }));
  };

  const saveQuantity = async (id: string) => {
    const quantity = editedItems[id];
    if (quantity) {
      await updateQuantityMutation.mutateAsync({ productId: id, quantity });
    }
  };

  const finalizePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!location.trim()) newErrors.location = "Endereço é obrigatório";
    if (!paymentProof) newErrors.paymentProof = "Comprovativo é obrigatório";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (paymentProof!.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user_Id);
    formData.append("location", location);
    formData.append("phone", phone);
    formData.append("paymentProof", paymentProof!);

    const toastId = toast.loading("Enviando pedido...");

    try {
      const response = await api.post("/carrinho/checkout", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000,
      });

      toast.dismiss(toastId);
      
      if (response.data.success) {
        toast.success("Pedido realizado com sucesso!");
        setCart([]);
        setPaymentProof(null);
        setLocation("");
        setPhone("");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      
      if (error.code === 'ECONNABORTED') {
        toast.warning("Pedido recebido! Processando em segundo plano.");
        setCart([]);
        setPaymentProof(null);
        setLocation("");
        setPhone("");
      } else {
        toast.error(error.response?.data?.message || "Erro ao processar pedido");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Continuar comprando</span>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
            Finalizar Compra
          </h1>

          {cart.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => clearCartMutation.mutate()}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Esvaziar
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center mb-6">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Adicione produtos para começar suas compras
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-6 rounded-xl text-lg">
                Ver produtos
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2 space-y-6">
              <OrderStats total={totalPrice} quantidade={totalItems} />
              
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={(id) => removeItemMutation.mutate(id)}
                    isUpdating={updateQuantityMutation.isPending}
                    editedItems={editedItems}
                    onSaveQuantity={saveQuantity}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Formulário de pagamento */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    Pagamento
                  </h2>

                  <PaymentForm
                    phone={phone}
                    setPhone={setPhone}
                    location={location}
                    setLocation={setLocation}
                    paymentProof={paymentProof}
                    setPaymentProof={setPaymentProof}
                    errors={errors}
                    totalPrice={totalPrice}
                    isSubmitting={updateQuantityMutation.isPending}
                    onSubmit={finalizePurchase}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}