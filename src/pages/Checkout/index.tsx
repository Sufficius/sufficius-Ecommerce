"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftIcon,
  Copy,
  Loader2,
  ShoppingCartIcon,
  Trash,
  XCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { carrinhosRoute} from "@/modules/services/api/routes/carrinhos";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import UploadArea from "@/(admin)/components/upload-area";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const user_Id = user?.id_usuario || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any[]>([]);
  const [editedItems, setEditedItems] = useState<Record<string, number>>({});
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [copyMessage, setCopyMessage] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    location?: string;
    paymentProof?: string;
  }>({});
  const iban = "AO006.0040.0000.8729.0482.1013.4";



  const handleCopy = () => {
    navigator.clipboard.writeText(iban);
    setCopyMessage(true);
    setTimeout(() => setCopyMessage(false), 2000);
  };

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await carrinhosRoute.getCarrinho(),
  });



  const queryClient = useQueryClient();

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (cartData?.data?.id) {
        await carrinhosRoute.deleteAllProductsInCart(cartData.data?.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Todos os produtos foram removidos do carrinho.");
      setCart([]);
    },
    onError: () => {
      toast.error("Não foi possível esvaziar o carrinho. Tente novamente.");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (produtoId: string) => {
      if (cartData?.data?.id) {
        await carrinhosRoute.deleteProductInCart(cartData.data?.id, produtoId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Produto removido");
    },
    onError: () => {
      toast.error("Erro ao remover produto");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (cartData?.data?.id) {
        await carrinhosRoute.atualizarItem(
          cartData.data?.id,
          productId,
          quantity,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Quantidade atualizada");
      setEditedItems({});
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: () => {
      toast.error("Erro ao adicionar produto ao carrinho");
    },
  });

  const finalizePurchaseMutation = useMutation({
    mutationFn: async () => {
      if (user_Id && paymentProof && location) {
        await carrinhosRoute.finalizePurchase(
          user_Id,
          paymentProof,
          location,
          phone,

        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Compra finalizada");
      setCart([]);
      setPaymentProof(null);
    },
    onError: () => {
      toast.error("Erro ao finalizar compra");
    },
  });

  useEffect(() => {
    if (cartData?.data?.itens) {
      const mapped = cartData.data?.itens.map((item) => ({
        id: item.id,
        name: item.produto.nome,
        description: item.produto.imagemAlt,
        image: item.produto.imagem,
        price: item.produto.preco,
        quantity: item.quantidade,
        product_id: item.produtoId,
      }));
      setCart(mapped);
    }
  }, [cartData]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
    setEditedItems((prev) => ({ ...prev, [id]: quantity }));
  };

  const saveQuantity = async (id: string) => {
    const quantity = editedItems[id];
    if (quantity !== undefined) {
      await updateQuantityMutation.mutate({ productId: id, quantity });
    }
  };

  const removeItem = async (id: string) => {
    await removeItemMutation.mutate(id);
  };

  const clearCart = async () => {
    await clearCartMutation.mutate();
  };

  const finalizePurchase = async () => {
    const newErrors: {
      phone?: string;
      location?: string;
      paymentProof?: string;
    } = {};
    if (!phone.trim()) {
      newErrors.phone = "Por favor, preencha o telefone.";
    }
    if (!location.trim()) {
      newErrors.location = "Por favor, preencha o endereço de entrega.";
    }
    if (!paymentProof) {
      newErrors.paymentProof = "Por favor, envie o comprovativo de pagamento.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(
        "Preencha todos os campos obrigatórios para finalizar a compra.",
      );
      return;
    }

    console.log('Enviando checkout:', {
    userId: user_Id,
    location,
    phone,
    paymentProof: paymentProof?.name
  });

    await finalizePurchaseMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 w-full md:w-auto"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="text-xl md:text-2xl  font-bold text-center text-gray-900 dark:text-gray-200">
            🛒 Carrinho de Compras
          </h1>
          {cart.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex items-center gap-2"
            >
              <XCircle size={18} />
              Esvaziar
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-md animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-28 bg-gray-100 animate-pulse rounded" />
                  <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
                <div className="w-24 h-10 bg-gray-100 animate-pulse rounded" />
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
                <div className="w-20 h-8 bg-gray-300 animate-pulse rounded" />
              </div>

              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-md space-y-4">
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-px bg-gray-300" />
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-28 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-10 w-full bg-gray-300 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-500 w-full md:w-auto"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Voltar
        </Link>
        <h1 className="text-xl md:text-2xl  font-bold text-center text-gray-900 dark:text-gray-200">
          🛒 Carrinho de Compras
        </h1>
        {cart.length > 0 && (
          <Button
            variant="outline"
            onClick={clearCart}
            className="flex items-center gap-2"
          >
            <XCircle size={18} />
            Esvaziar
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500 text-center">
          <ShoppingCartIcon size={50} className="mb-4" />
          <p className="text-lg">Seu carrinho está vazio.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-black/80 dark:border shadow-md rounded-lg"
              >
                {/* Imagem e detalhes */}
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <img
                    src={item.img}
                    alt={item.name}
                    width={90}
                    height={90}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-base font-semibold">{item.name}</h2>
                    <span className="text-sm text-gray-700">
                      Preço: {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm font-medium">
                      Total: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Quantidade e ações */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  {editedItems[item.id] !== undefined && (
                    <Button
                      size="sm"
                      onClick={() => saveQuantity(item.id)}
                      disabled={updateQuantityMutation.isPending}
                      className="bg-green-600 text-white ml-2"
                    >
                      {updateQuantityMutation.isPending ? "..." : "Salvar"}
                    </Button>
                  )}
                </div>

                {/* Remover */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.product_id)}
                  disabled={removeItemMutation.isPending}
                >
                  {removeItemMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-md dark:bg-black/80">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="flex justify-between text-lg mb-4">
              <span>Total:</span>
              <span className="font-bold">{formatCurrency(totalPrice)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Coordenadas Bancárias</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={iban}
                  className="focus-visible:ring-0"
                  disabled
                />
                <div
                  className={`cursor-pointer flex items-center gap-1 ${copyMessage ? "bg-green-500" : "text-gray-500 hover:bg-gray-100"}   rounded-md p-2 text-sm`}
                  onClick={handleCopy}
                >
                  <Copy size={14} />
                  {copyMessage ? "Copiado!" : "Copiar"}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-medium">Telefone</label>
              <Input
                type="text"
                placeholder="Digite o seu contacto"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <span className="text-red-500 text-xs">{errors.phone}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="font-medium">Endereço de entrega</label>
              <Input
                type="text"
                placeholder="Digite o endereço de entrega"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && (
                <span className="text-red-500 text-xs">{errors.location}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="font-medium">Comprovativo de pagamento</label>
              <UploadArea onChange={(file) => setPaymentProof(file)} />
              {errors.paymentProof && (
                <span className="text-red-500 text-xs">
                  {errors.paymentProof}
                </span>
              )}
            </div>
            <Button
              className="w-full bg-[#D4AF37] hover:bg-[#987e28] text-white text-md"
              onClick={finalizePurchase}
              disabled={finalizePurchaseMutation.isPending}
            >
              {finalizePurchaseMutation.isPending
                ? "Finalizando..."
                : "Finalizar Compra"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
