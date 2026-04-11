import { produtosRoute } from "@/modules/services/api/routes/produtos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriaRoutes } from "@/modules/services/api/routes/categorias";
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
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { api } from "@/modules/services/api/axios";

interface NovoProdutoModalProps {
  children: React.ReactNode;
  id_categoria?: string;
  onProdutoCriado?: () => void;
}

export const NovoProdutoModal = ({
  children,
  onProdutoCriado,
}: NovoProdutoModalProps) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    id_categoria: "",
    status: "ACTIVO",
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    id_categoria: "",
    foto: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 10MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

      if (!validTypes.includes(file.type)) {
        setError("Formato inválido. Use JPEG, PNG ou WebP");
        return;
      }
      setImagem(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Limpar erro anterior
    if (errors.foto) {
      setErrors((prev) => ({ ...prev, foto: "" }));
    }

    const validExt = /\.(jpe?g|png|gif|webp|bmp)$/i;
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!file) {
      setImagem(null);
      return;
    }

    if (!file.type.startsWith("image/") || !validExt.test(file.name)) {
      toast.error(
        "O arquivo selecionado não é uma imagem válida. Use JPG, PNG, GIF ou WebP.",
      );
      setImagem(null);
      return;
    }

    if (file.size > maxSize) {
      toast.error("A imagem é muito grande. Tamanho máximo: 15MB.");
      setImagem(null);
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
      foto: "",
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
      newErrors.foto = "Imagem é obrigatória.";
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

      // Criar objeto de dados para enviar
      const produtoData = {
        nome: form.nome,
        preco: parseFloat(form.preco).toString(),
        descricao: form.descricao,
        id_categoria: form.id_categoria,
        quantidade: parseInt(form.quantidade).toString(),
        status: form.status,
        foto: imagem,
      };

      return await produtosRoute.createProduto(produtoData as any);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas-produtos"] });

      if (onProdutoCriado) {
        onProdutoCriado();
      }
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
      setImagem(null);
      setErrors({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        id_categoria: "",
        foto: "",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error("❌ Erro ao criar produto:", error);
      toast.error(error.message || "Erro ao criar produto. Tente novamente.");
    },
  });

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
      setImagem(null);
      setErrors({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        id_categoria: "",
        foto: "",
      });
    }
  }, [open]);

  const handleRemoverImagem = () => {
    setImagem(null);
    setImagemPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImagem = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("imagem", file); // 👈 NOME DEVE SER "imagem" (igual no backend)

    try {
      const token = useAuthStore.getState().token;

      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        throw new Error("Usuário não autenticado");
      }

      const response = await api.post("/upload/supabase", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // NÃO definir Content-Type! O axios vai definir automaticamente
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      if (response.data?.success) {
        return response.data.url; // Supabase retorna 'url'
      } else {
        throw new Error(response.data?.message || "Erro ao fazer upload");
      }
    } catch (error: any) {
      console.error("❌ Erro no upload:", error);

      if (error.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        window.location.href = "/login";
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Arquivo inválido");
      } else {
        toast.error(error.message || "Erro no upload");
      }

      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploadProgress(0);

    try {
      // Validar formulário
      if (!validate()) {
        return;
      }

      const token = useAuthStore.getState().token;
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }

      if (!imagem) {
        setErrors((prev) => ({ ...prev, foto: "Imagem é obrigatória" }));
        toast.error("Selecione uma imagem para o produto");
        return;
      }

      // 1. Upload da imagem
      setUploadProgress(30);

      const urlImagem = await uploadImagem(imagem);

      setUploadProgress(70);

      // 2. Criar produto
      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        quantidade: parseInt(form.quantidade),
        id_categoria: form.id_categoria,
        status: form.status,
        foto: urlImagem, // URL do Supabase
      };

      setUploadProgress(90);

       await api.post("/produtos", produtoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("✅ Produto criado:", response.data);
      setUploadProgress(100);

      toast.success("Produto criado com sucesso!");

      // Reset form
      setForm({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        id_categoria: "",
        status: "ACTIVO",
      });
      handleRemoverImagem();

      if (onProdutoCriado) {
        onProdutoCriado();
      }

      setOpen(false);
    } catch (err: any) {
      console.error("❌ Erro ao criar produto:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Erro ao criar produto";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setForm({
      nome: "",
      descricao: "",
      preco: "",
      quantidade: "",
      id_categoria: "",
      status: "ATIVO",
    });
    handleRemoverImagem();
    setError(null);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 text-lg">
                    Adicionar Novo Produto
                  </h3>
                  <button
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Enviando imagem...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {/* Nome */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Produto *
                      </Label>
                      <Input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        disabled={criarProduto.isPending}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Ex: iPhone 15 Pro Max"
                      />
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
                            setErrors((prev) => ({
                              ...prev,
                              id_categoria: "",
                            }));
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
                    </div>

                    {/* Preço */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (KZ) *
                      </Label>
                      <Input
                        type="number"
                        name="preco"
                        value={form.preco}
                        onChange={handleChange}
                        disabled={criarProduto.isPending}
                        required
                        step="0.01"
                        min="0.01"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="0.00"
                      />
                    </div>
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
                      onChange={handleChange}
                      disabled={criarProduto.isPending}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="0"
                    />
                  </div>

                  {/* Imagem */}
                  <div className="flex flex-col gap-2">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagem do Produto *
                    </Label>
                    <div className="mb-2">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D4AF37] transition-colors">
                        <div className="space-y-1 text-center">
                          {imagemPreview ? (
                            <div className="relative">
                              <img
                                src={imagemPreview}
                                alt="Preview"
                                className="mx-auto h-40 w-40 object-cover rounded-lg"
                              />
                              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                                <button
                                  type="button"
                                  onClick={handleRemoverImagem}
                                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                  disabled={criarProduto.isPending}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {imagem?.name}
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#D4AF37] hover:text-[#c19b2c] focus-within:outline-none"
                                >
                                  <span>Upload da imagem</span>
                                  <input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    name="imagem"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImagemChange}
                                    className="sr-only"
                                    disabled={criarProduto.isPending}
                                  />
                                </label>
                                <p className="pl-1">ou arraste até aqui</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, WebP até 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {imagem && !imagemPreview && (
                      <p className="mt-2 text-sm text-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-1" />
                        Arquivo selecionado: {imagem.name}
                      </p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div className="flex flex-col gap-2">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </Label>
                    <Textarea
                      name="descricao"
                      value={form.descricao}
                      onChange={handleChange}
                      disabled={criarProduto.isPending}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] min-h-[100px]"
                      placeholder="Descreva o produto em detalhes..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t gap-2">
                    <button
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={criarProduto.isPending}
                      onClick={() => {
                        if (!criarProduto.isPending) setOpen(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </button>
                    <Button
                      type="submit"
                      disabled={uploadProgress !== 0}
                      className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadProgress > 0  ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {"Processando..."}
                        </>
                      ) : (
                        "Criar Produto"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
