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

export const NovoProdutoModal = ({ children }: NovoProdutoModalProps) => {
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
    const { name, value } = e.target;

    // Limpar erro quando usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validação em tempo real para números
    if (name === "preco" || name === "quantidade") {
      const numValue = parseFloat(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0)) {
        setErrors((prev) => ({
          ...prev,
          [name]: `O valor deve ser um número válido e positivo`,
        }));
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (file: File) => {
    // Limpar erro anterior
    if (errors.imagemproduto) {
      setErrors((prev) => ({ ...prev, imagemproduto: "" }));
    }

    const validExt = /\.(jpe?g|png|gif|webp|bmp)$/i;
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!file) {
      setImagem(undefined);
      return;
    }

    if (!file.type.startsWith("image/") || !validExt.test(file.name)) {
      toast.error(
        "O arquivo selecionado não é uma imagem válida. Use JPG, PNG, GIF ou WebP."
      );
      setImagem(undefined);
      return;
    }

    if (file.size > maxSize) {
      toast.error("A imagem é muito grande. Tamanho máximo: 15MB.");
      setImagem(undefined);
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

    let isValid = true;

    // Nome
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório.";
      isValid = false;
    } else if (form.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres.";
      isValid = false;
    }

    // Descrição
    if (!form.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória.";
      isValid = false;
    } else if (form.descricao.trim().length < 10) {
      newErrors.descricao = "Descrição deve ter pelo menos 10 caracteres.";
      isValid = false;
    }

    // Preço
    if (!form.preco || form.preco.trim() === "") {
      newErrors.preco = "Preço é obrigatório.";
      isValid = false;
    } else {
      const preco = parseFloat(form.preco);
      if (isNaN(preco) || preco <= 0) {
        newErrors.preco = "Preço deve ser maior que zero.";
        isValid = false;
      }
    }

    // Quantidade
    if (!form.quantidade || form.quantidade.trim() === "") {
      newErrors.quantidade = "Quantidade é obrigatória.";
      isValid = false;
    } else {
      const quantidade = parseInt(form.quantidade);
      if (isNaN(quantidade) || quantidade < 0) {
        newErrors.quantidade = "Quantidade deve ser zero ou maior.";
        isValid = false;
      }
    }

    // Categoria
    if (!form.id_categoria || form.id_categoria.trim() === "") {
      newErrors.id_categoria = "Categoria é obrigatória.";
      isValid = false;
    }

    // Imagem
    if (!imagem) {
      newErrors.imagemproduto = "Imagem é obrigatória.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const criarProduto = useMutation({
    mutationKey: ["criarProdutos"],
    mutationFn: async () => {
      // Validação final antes de enviar
      if (!validate()) {
        throw new Error("Por favor, corrija os erros no formulário.");
      }

      if (!form.id_categoria || form.id_categoria.trim() === "") {
        throw new Error("ID da categoria não fornecido.");
      }

      if (!imagem) {
        throw new Error("Imagem do produto não fornecida.");
      }

      // Log dos dados para debug
      console.log("📤 Dados do produto:", {
        nome: form.nome,
        preco: form.preco,
        quantidade: form.quantidade,
        categoria: form.id_categoria,
        temImagem: !!imagem,
        tamanhoImagem: imagem
          ? `${(imagem.size / 1024 / 1024).toFixed(2)}MB`
          : "N/A",
      });

      // Criar objeto de dados para enviar
      const produtoData = {
        nome: form.nome,
        preco: parseFloat(form.preco).toString(),
        descricao: form.descricao,
        id_categoria: form.id_categoria,
        quantidade: parseInt(form.quantidade).toString(),
        status: form.status,
        imagemproduto: imagem,
      };

      return await produtosRoute.criarProduto(produtoData);
    },

    onSuccess: (data) => {
      console.log("✅ Produto criado com sucesso:", data);
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas-produtos"] });
      toast.success("Produto criado com sucesso!");

      // Resetar formulário
      setForm({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        status: "ACTIVO",
        id_categoria: "",
      });
      setImagem(undefined);
      setErrors({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        id_categoria: "",
        imagemproduto: "",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error("❌ Erro ao criar produto:", error);
      toast.error(error.message || "Erro ao criar produto. Tente novamente.");
    },
  });

  const handleCriarProduto = async () => {
    // Validar antes de enviar
    if (!validate()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    // Verificar se já está enviando
    if (criarProduto.isPending) {
      return;
    }

    await criarProduto.mutateAsync();
  };

  // Resetar tudo quando o modal abrir/fechar
  useEffect(() => {
    if (!open) {
      setForm({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        status: "ACTIVO",
        id_categoria: "",
      });
      setImagem(undefined);
      setErrors({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        id_categoria: "",
        imagemproduto: "",
      });
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="h-full md:max-h-[90vh] overflow-y-auto w-full max-w-2xl [&::-webkit-scrollbar]:hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-start text-xl">
            Adicionar Novo Produto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 mt-4">
            {/* Nome */}
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </Label>
              <Input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleInput}
                disabled={criarProduto.isPending}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Ex: iPhone 15 Pro Max"
              />
              {errors.nome && (
                <span className="text-xs text-red-500">{errors.nome}</span>
              )}
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </Label>
              <Select
                value={form.id_categoria}
                onValueChange={(value) => {
                  setForm((prev) => ({ ...prev, id_categoria: value }));
                  if (errors.id_categoria) {
                    setErrors((prev) => ({ ...prev, id_categoria: "" }));
                  }
                }}
                disabled={criarProduto.isPending}
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

            {/* Preço e Quantidade lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preço */}
              <div className="flex flex-col gap-2">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (KZ) *
                </Label>
                <Input
                  type="number"
                  name="preco"
                  value={form.preco}
                  onChange={handleInput}
                  disabled={criarProduto.isPending}
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="0.00"
                />
                {errors.preco && (
                  <span className="text-xs text-red-500">{errors.preco}</span>
                )}
              </div>

              {/* Quantidade */}
              <div className="flex flex-col gap-2">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </Label>
                <Input
                  type="number"
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleInput}
                  disabled={criarProduto.isPending}
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="0"
                />
                {errors.quantidade && (
                  <span className="text-xs text-red-500">
                    {errors.quantidade}
                  </span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </Label>
              <Textarea
                name="descricao"
                value={form.descricao}
                onChange={handleInput}
                disabled={criarProduto.isPending}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] min-h-[100px]"
                placeholder="Descreva o produto em detalhes..."
              />
              <div className="flex justify-between">
                {errors.descricao && (
                  <span className="text-xs text-red-500">
                    {errors.descricao}
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {form.descricao.length}/500 caracteres
                </span>
              </div>
            </div>

            {/* Imagem */}
            <div className="flex flex-col gap-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Produto *
              </Label>
              <div className="mb-2">
                <UploadArea onChange={handleImagemChange} />
              </div>
              {imagem && (
                <div className="text-sm text-gray-600">
                  <p>
                    ✓ Imagem selecionada: <strong>{imagem.name}</strong>
                  </p>
                  <p>Tamanho: {(imagem.size / 1024).toFixed(2)} KB</p>
                  <p>Tipo: {imagem.type}</p>
                </div>
              )}
              {errors.imagemproduto && (
                <span className="text-xs text-red-500">
                  {errors.imagemproduto}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 15MB
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={criarProduto.isPending}
            onClick={() => {
              if (!criarProduto.isPending) setOpen(false);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={handleCriarProduto}
            disabled={criarProduto.isPending}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {criarProduto.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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
