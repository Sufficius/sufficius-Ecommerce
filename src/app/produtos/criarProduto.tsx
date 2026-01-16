import { produtosRoute } from "@/modules/services/api/routes/produtos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriaRoutes } from "@/modules/services/api/routes/categorias";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadArea from "@/(admin)/components/upload-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NovoProdutoModalProps {
  children: React.ReactNode;
  id_categoria?: string;
}

export const NovoProdutoModal = ({
  children,
}: NovoProdutoModalProps) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    id_categoria: "",
    status: "ACTIVO",
  });

  const [imagem, setImagem] = useState<File>();
  const [errors, setErrors] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    id_categoria: "",
    imagemproduto: "",
  });

  const { data: categorias } = useQuery({
    queryKey: ["getProdutosCategorias"],
    queryFn: async () => {
      const response = await categoriaRoutes.getAllCategoria();
      return response;
    },
    staleTime: 3000000,
  });

  useEffect(() => {
    if (!form.id_categoria) return;
  }, [form.id_categoria]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number" && (name === "preco" || name === "quantidade")) {
      if (value === "" || Number(value) < 0) {
        setForm({ ...form, [name]: "" });
      }
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (file: File) => {
    const validExt = /\.(jpe?g|png|gif|webp)$/i;

    if (
      file &&
      (!file.type.startsWith("image/") || !validExt.test(file.name))
    ) {
      toast.error("O arquivo selecionado não é uma imagem.");
      return;
    }
    setImagem(file);
  };

  const validate = () => {
    const newErrors = {
      nome: "",
      descricao: "",
      preco: "",
      quantidade: "",
      id_categoria: "",
      imagemproduto: "",
    };

    if (!form.nome.trim()) newErrors.nome === "Nome é obrigatório.";
    if (!form.descricao.trim())
      newErrors.descricao === "Descrição é obrigatória.";
    if (!form.preco || isNaN(Number(form.preco)) || Number(form.preco) <= 0)
      newErrors.descricao === "Preço deve ser maior que zero.";
    if (
      !form.quantidade ||
      isNaN(Number(form.quantidade)) ||
      Number(form.quantidade) < 0
    )
      newErrors.quantidade === "Quantidade deve ser zero ou maior.";
    if (!form.id_categoria)
      newErrors.id_categoria === "Categoria é obrigatória.";
    if (!imagem) newErrors.imagemproduto === "Imagem é obrigatória.";
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const criarProduto = useMutation({
    mutationKey: ["criarProdutos"],
    mutationFn: async () => {
      if (!form.id_categoria || form.id_categoria.trim() === "") throw new Error("ID da categoria não fornecido.");
      if (!imagem) throw new Error("Imagem do produto não fornecida.");

      const produtoData = {
        nome: form.nome,
        preco: form.preco,
        descricao: form.descricao,
        id_categoria: form.id_categoria,
        quantidade: form.quantidade,
        imagemproduto: imagem,
      };
      return await produtosRoute.criarProduto(produtoData);
    },

    
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Produto criado com sucesso!");
      setForm({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        status: "ACTIVO",
        id_categoria: "",
      });
      setImagem(undefined);
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar produto.");
    },
  });

  const handleCriarProduto = async () => {
    if (!validate()) return;
    await criarProduto.mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="h-full md:max-h-[90vh] overflow-y-auto w-full  max-w-2xl [&::-webkit-scrollbar]:hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-start text-xl">
            Adicionar Novo Produto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </Label>
              <Input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleInput}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Ex: iPhone 15 Pro Max"
              />
              {errors.nome && (
                <span className="text-xs text-red-500">{errors.nome}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </Label>
              <Select
                value={form.id_categoria}
                name="id_categoria"
                onValueChange={(value) => {
                  setForm((prev) => ({
                    ...prev,
                    id_categoria: value,
                  }));
                  setErrors((prev) => ({ ...prev, id_categoria: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Selecionar categoria"
                    className="focus-visible:ring-0 ring-0 outline-none dark:text-white"
                  />
                </SelectTrigger>
                <SelectContent>
                  {categorias?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_categoria && (
                <span className="text-xs text-red-500">
                  {errors.id_categoria}
                </span>
              )}
            </div>
            <div className="flex flex-col md:flex-1 gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (KZ) *
              </Label>
              <Input
                type="number"
                name="preco"
                value={form.preco}
                onChange={handleInput}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col md:flex-1 gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </Label>
              <Input
                type="number"
                name="quantidade"
                value={form.quantidade}
                onChange={handleInput}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col md:flex-1 gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </Label>
              <Textarea
                name="descricao"
                value={form.descricao}
                onChange={handleInput}
                disabled={criarProduto.isPending}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Descreva o produto..."
              />
              {errors.descricao && (
                <span className="text-xs text-red-500">{errors.descricao}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-1 gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Produto
              </Label>
              <UploadArea onChange={handleImagemChange} />
              {errors.imagemproduto && (
                <span className="text-xs text-red-500">
                  {errors.imagemproduto}
                </span>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={criarProduto.isPending}
          >
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={handleCriarProduto}
            disabled={criarProduto.isPending}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {criarProduto.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Criando...
              </>
            ) : (
              "Criar Produto"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
