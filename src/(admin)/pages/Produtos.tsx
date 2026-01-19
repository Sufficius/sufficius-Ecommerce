"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Filter,
  AlertTriangle,
  X,
  Image as ImageIcon,
  AlertOctagon,
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { NovoProdutoModal } from "@/app/produtos/criarProduto";

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  precoDesconto?: number;
  percentualDesconto?: number;
  quantidade: number;
  criadoEm: string;
  categoria: string;
  id_categoria?: string;
  imagem?: string; // URL da imagem vinda do banco
  imagemAlt?: string;
  status: string;
}
interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

interface ImagemProdutoProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  version?: string | number;
}

const ImagemProduto = ({
  src,
  alt = "Produto",
  className = "",
  fallbackIcon = <Package className="h-full w-full text-gray-400" />,
}: ImagemProdutoProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "sufficius-commerce";

  const imageMap: Record<string, string> = {
    "7cfda493-0ca0-4da8-b351-904246affce6": "v1768212665/image7_qyn6if.jpg",
    "13bfe2cc-8364-45c6-b985-61ae58e40f0c": "v1768212665/image6_s6uyn9.jpg",
  };

  let publicId = "";

  if (!src) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }

  // Se é uma URL completa com "undefined"
  if (src.includes("undefined")) {
    // Extrai o UUID da URL
    const parts = src.split("/");
    const uuid = parts[parts.length - 1];
    publicId = imageMap[uuid] || uuid;
  }

  const getImageUrl = () => {
    if (!src) {
      return "";
    }

    let publicId = "";

    // Se é uma URL completa com "undefined"
    if (src.includes("undefined")) {
      // Extrai o UUID da URL
      const parts = src.split("/");
      const uuid = parts[parts.length - 1];
      publicId = imageMap[uuid] || uuid;
    }
    // Se é apenas um UUID
    else if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        src
      )
    ) {
      publicId = imageMap[src] || src;
    }
    // Se já é um publicId correto (com versão)
    else if (src.includes("v") && src.includes("/")) {
      publicId = src;
    }
    // Outros casos
    else {
      publicId = src;
    }

    // Se encontrou um mapeamento, usa o nome real
    if (imageMap[src] && publicId === src) {
      publicId = imageMap[src];
    }

    // Constrói URL correta
    // const transformations = "w_400,h_400,c_fill,q_auto:good";
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;

    return url;
  };

  const imageUrl = getImageUrl();

  useEffect(() => {
    if (src) {
      setError(false);
      // setLoading(true);
    }
  }, [src]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        onLoad={() => {
          setLoading(false);
        }}
        onError={() => {
          console.error("❌ Erro ao carregar:", imageUrl);
          setError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        loading="lazy"
      />
    </div>
  );
};

// Modal de Visualizar Produto (ATUALIZADO)
const VisualizarProdutoModal = ({
  isOpen,
  onClose,
  produto,
  imageVersion,
}: {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
  imageVersion?: number;
}) => {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Detalhes do Produto
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Imagem */}
              <div>
                <div className="bg-gray-100 rounded-lg h-64 overflow-hidden">
                  <ImagemProduto
                    src={produto.imagem}
                    alt={produto.imagemAlt || produto.nome}
                    className="h-full w-full"
                    version={imageVersion}
                  />
                </div>

                {/* Status */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      produto.status === "ACTIVO"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="text-sm font-medium">Status</div>
                    <div className="font-bold">
                      {produto.status === "ACTIVO" ? "Ativo" : "Inativo"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações */}
              <div>
                <h4 className="text-lg font-semibold mb-4">{produto.nome}</h4>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Categoria</label>
                    <p className="font-medium">{produto.categoria}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Preço</label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          produto.precoDesconto
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(produto.preco)}
                      </span>
                      {produto.precoDesconto && produto.precoDesconto > 0 && (
                        <>
                          <span className="font-bold text-green-600">
                            {formatCurrency(produto.precoDesconto)}
                          </span>
                          {produto.percentualDesconto && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              -{produto.percentualDesconto.toFixed(1)}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Estoque</label>
                    <p
                      className={`font-medium ${
                        produto.quantidade === 0
                          ? "text-red-600"
                          : produto.quantidade < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {produto.quantidade} unidades
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Descrição</label>
                    <p className="text-gray-700 mt-1 whitespace-pre-line">
                      {produto.descricao || "Sem descrição"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Data de Criação
                    </label>
                    <p className="font-medium">
                      {new Date(produto.criadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Confirmação de Exclusão
const ConfirmarExclusaoModal = ({
  isOpen,
  onClose,
  onConfirm,
  produto,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  produto: Produto | null;
}) => {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertOctagon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirmar Exclusão
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Tem certeza que deseja excluir o produto{" "}
                    <strong>{produto.nome}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Sim, Excluir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/// Modal de Editar Produto (CORRIGIDO)
const EditarProdutoModal = ({
  isOpen,
  onClose,
  produto,
  categorias,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
  categorias: Categoria[];
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    precoDesconto: "",
    percentualDesconto: "",
    quantidade: "",
    id_categoria: "",
    status: "ACTIVO",
    descontoAte: "",
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [deletarImagem, setDeletarImagem] = useState(false);

  // Inicializar form quando produto mudar
  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco: produto.preco.toString(),
        precoDesconto: produto.precoDesconto?.toString() || "",
        percentualDesconto: produto.percentualDesconto?.toString() || "",
        quantidade: produto.quantidade.toString(),
        id_categoria: produto.id_categoria || "",
        status: produto.status || "ACTIVO",
        descontoAte: "",
      });
      setImagemPreview(produto.imagem || null);
      setDeletarImagem(false);
      setImagem(null);
      setError(null);
    }
  }, [produto]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name === "status") {
        // Se for o checkbox de status
        setFormData(prev => ({
          ...prev,
          status: checkbox.checked ? "ACTIVO" : "INACTIVO"
        }));
      } else {
        // Outros checkboxes
        setFormData(prev => ({
          ...prev,
          [name]: checkbox.checked
        }));
      }
    } else {
      // Inputs normais
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho da imagem (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 10MB");
        return;
      }

      // Validar tipo da imagem
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Formato de imagem inválido. Use JPEG, PNG, GIF ou WebP");
        return;
      }

      setImagem(file);
      setDeletarImagem(false);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverImagem = () => {
    setImagem(null);
    setImagemPreview(null);
    setDeletarImagem(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!produto) {
      setError("Produto não selecionado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Campos obrigatórios
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("preco", formData.preco);
      formDataToSend.append("quantidade", formData.quantidade);

      // Campos opcionais
      if (formData.descricao) formDataToSend.append("descricao", formData.descricao);
      if (formData.precoDesconto) formDataToSend.append("precoDesconto", formData.precoDesconto);
      if (formData.percentualDesconto) formDataToSend.append("percentualDesconto", formData.percentualDesconto);
      if (formData.id_categoria) formDataToSend.append("id_categoria", formData.id_categoria);
      if (formData.descontoAte) formDataToSend.append("descontoAte", formData.descontoAte);

      // Status e destaque
      formDataToSend.append("status", formData.status);

      // Para deletar imagem existente
      if (deletarImagem) {
        formDataToSend.append("deletarImagem", "true");
      }

      // Adicionar nova imagem se houver
      if (imagem) {
        try {
          const imagemComprimida = await comprimirImagem(imagem);
          formDataToSend.append("imagem", imagemComprimida);
        } catch {
          formDataToSend.append("imagem", imagem);
        }
      }

      // IMPORTANTE: Usar PUT para atualização
      const response = await api.put(`/produtos/${produto.id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success) {
        toast.success("Produto atualizado com sucesso!");
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || "Erro ao atualizar produto");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Erro ao atualizar produto";
      
      console.error("❌ Erro ao atualizar produto:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para comprimir imagem (mantenha a mesma)
  const comprimirImagem = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (file.size < 500 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                if (compressedFile.size > 1024 * 1024) {
                  canvas.toBlob(
                    (blob2) => {
                      if (blob2) {
                        const moreCompressed = new File([blob2], file.name, {
                          type: "image/jpeg",
                          lastModified: Date.now(),
                        });
                        resolve(moreCompressed);
                      } else {
                        resolve(compressedFile);
                      }
                    },
                    "image/jpeg",
                    0.6
                  );
                } else {
                  resolve(compressedFile);
                }
              } else {
                reject(new Error("Falha ao comprimir imagem"));
              }
            },
            "image/jpeg",
            0.8
          );
        };

        img.onerror = () => {
          reject(new Error("Erro ao carregar imagem"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler arquivo"));
      };
    });
  };

  const resetForm = () => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco: produto.preco.toString(),
        precoDesconto: produto.precoDesconto?.toString() || "",
        percentualDesconto: produto.percentualDesconto?.toString() || "",
        quantidade: produto.quantidade.toString(),
        id_categoria: produto.id_categoria || "",
        status: produto.status || "ACTIVO",
        descontoAte: "",
      });
    }
    setImagem(null);
    setImagemPreview(produto?.imagem || null);
    setDeletarImagem(false);
    setError(null);
  };

  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Produto
              </h3>
              <button
                onClick={onClose}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="">Sem categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (KZ) *
                  </label>
                  <input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço com Desconto (KZ)
                  </label>
                  <input
                    type="number"
                    name="precoDesconto"
                    value={formData.precoDesconto}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Término Desconto
                  </label>
                  <input
                    type="datetime-local"
                    name="descontoAte"
                    value={formData.descontoAte}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status === "ACTIVO"}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            status: e.target.checked ? "ACTIVO" : "INACTIVO"
                          }));
                        }}
                        className="h-4 w-4 text-[#D4AF37] rounded"
                      />
                      <span className="ml-2 text-sm">Ativo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Produto
                </label>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-1 text-center">
                      {imagemPreview ? (
                        <div className="relative">
                          <img
                            src={imagemPreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <div className="flex justify-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={handleRemoverImagem}
                              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                            >
                              Remover Imagem
                            </button>
                            <label className="text-sm bg-[#D4AF37] text-white px-3 py-1 rounded hover:bg-[#c19b2c] cursor-pointer">
                              Alterar Imagem
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImagemChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#D4AF37] hover:text-[#c19b2c]">
                              <span>Enviar uma imagem</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImagemChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF até 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {deletarImagem && (
                    <p className="mt-2 text-sm text-yellow-600">
                      ⚠️ A imagem atual será removida ao salvar
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export default function AdminProdutos() {
  const token = useAuthStore((state) => state.token);

  const [busca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenar, setOrdenar] = useState("criadoEm_desc");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [imageVersion, setImageVersion] = useState<Record<string, number>>({});
  const [, setModalNovoProduto] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response?.data.data;
    },
  });

  const {
    data: produtosData,
    isLoading: produtosLoading,
    refetch: refetchProdutos,
    error: produtosError,
  } = useQuery({
    queryKey: [
      "produtos",
      paginaAtual,
      busca,
      filtroCategoria,
      filtroStatus,
      ordenar,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itensPorPagina.toString(),
        ordenar,
      });

      if (busca) params.append("busca", busca);
      if (filtroCategoria !== "todos")
        params.append("categoria", filtroCategoria);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      const response = await api.get(`/produtos?${params.toString()}`);
      if (!response.data.success) {
        throw new Error("Erro ao carregar produtos");
      }
      return response.data;
    },
    staleTime: 0,
    retry: 1,
  });

  const produtos = Array.isArray(produtosData?.data?.produtos)
    ? produtosData?.data
    : [];
  const paginacao = produtosData?.paginacao || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const {
    data: estatisticasData,
    isLoading: loadingEstatisticas,
    refetch: refetchEstatisticas,
  } = useQuery({
    queryKey: ["estatisticas_produtos"],
    queryFn: async () => {
      const response = await api.get("/produtos/estatisticas");
      if (!response.data.success) {
        throw new Error("Erro ao carregar estatísticas");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const estatisticas = estatisticasData || {
    totalProdutos: 0,
    totalAtivos: 0,
    totalEmPromocao: 0,
    baixoEstoque: 0,
    totalCategorias: 0,
  };

  const statusProdutos = {
    ativo: { label: "Ativo", cor: "bg-green-100 text-green-800" },
    inativo: { label: "Inativo", cor: "bg-gray-100 text-gray-800" },
    baixo_estoque: {
      label: "Baixo Estoque",
      cor: "bg-yellow-100 text-yellow-800",
    },
    sem_estoque: { label: "Sem Estoque", cor: "bg-red-100 text-red-800" },
  };

  // Função para atualizar a versão da imagem de um produto específico
  const updateImageVersion = (produtoId: string) => {
    setImageVersion((prev) => ({
      ...prev,
      [produtoId]: Date.now(),
    }));
  };

  const handleProdutoAtualizado = () => {
    refetchProdutos();
    refetchEstatisticas();

    if (produtoSelecionado) {
      updateImageVersion(produtoSelecionado.id);
    }
  };

  const handleVisualizarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalVisualizar(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalEditar(true);
  };

  const handleExcluirProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (!produtoSelecionado) return;

    try {
      const response = await api.delete(`/produtos/${produtoSelecionado.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Produto excluído com sucesso!");
        refetchProdutos();
        refetchEstatisticas();

        setModalExcluir(false);
        setProdutoSelecionado(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao excluir produto");
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    const icons: Record<string, string> = {
      Eletrônicos: "📱",
      Smartphones: "📱",
      Notebooks: "💻",
      Áudio: "🎧",
      Monitores: "🖥️",
      Games: "🎮",
      Wearables: "⌚",
      Periféricos: "⌨️",
      Eletrodomésticos: "🏠",
      Moda: "👕",
      Casa: "🛋️",
      Beleza: "💄",
      Livros: "📚",
      Brinquedos: "🧸",
      "Sem categoria": "📦",
    };
    return icons[categoria] || "📦";
  };

  if (produtosLoading && produtos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <VisualizarProdutoModal
        isOpen={modalVisualizar}
        onClose={() => {
          setModalVisualizar(false);
          setProdutoSelecionado(null);
        }}
        produto={produtoSelecionado}
        imageVersion={
          produtoSelecionado ? imageVersion[produtoSelecionado.id] : undefined
        }
      />

      <EditarProdutoModal
        isOpen={modalEditar}
        onClose={() => {
          setModalEditar(false);
          setProdutoSelecionado(null);
        }}
        produto={produtoSelecionado}
        categorias={categorias}
        onSuccess={handleProdutoAtualizado}
      />

      <ConfirmarExclusaoModal
        isOpen={modalExcluir}
        onClose={() => {
          setModalExcluir(false);
          setProdutoSelecionado(null);
        }}
        onConfirm={confirmarExclusao}
        produto={produtoSelecionado}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de Produtos
          </h1>
          <p className="text-gray-600">Gerencie todos os produtos da loja</p>
        </div>

        <div className="flex gap-3">
          <NovoProdutoModal
            onProdutoCriado={() => {
              refetchProdutos();
              refetchEstatisticas();
            }}
          >
            <Button
              onClick={() => setModalNovoProduto(true)}
              className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition"
            >
              <Plus className="h-5 w-5" />
              Novo Produto
            </Button>
          </NovoProdutoModal>
        </div>
      </div>

      {produtosError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">
              {produtosError.message || "Erro ao carregar produtos"}
            </p>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todas categorias</option>
                {categorias.map((categoria: Categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroStatus}
                onChange={(e) => {
                  setFiltroStatus(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="baixo_estoque">Baixo quantidade</option>
                <option value="sem_estoque">Sem quantidade</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <select
            value={ordenar}
            onChange={(e) => {
              setOrdenar(e.target.value);
              setPaginaAtual(1);
            }}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="criadoEm_desc">Mais recentes</option>
            <option value="criadoEm_asc">Mais antigos</option>
            <option value="nome_asc">Nome (A-Z)</option>
            <option value="nome_desc">Nome (Z-A)</option>
            <option value="preco_asc">Preço (menor)</option>
            <option value="preco_desc">Preço (maior)</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produtos</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalProdutos || 0
                )}
              </p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalCategorias || categorias?.length || 0
                )}
              </p>
            </div>
            <Tag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Promoção</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalEmPromocao || 0
                )}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.baixoEstoque || 0
                )}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {produtosLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37] mr-2" />
            <span>Carregando produtos...</span>
          </div>
        ) : produtos?.produtos?.length === 0 ? (
          <div className="text-center p-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {busca || filtroCategoria !== "todos" || filtroStatus !== "todos"
                ? "Tente ajustar seus filtros de busca"
                : "Comece adicionando seu primeiro produto!"}
            </p>
            <NovoProdutoModal>
              <button
                onClick={() => setModalNovoProduto(true)}
                className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]"
              >
                Adicionar Primeiro Produto
              </button>
            </NovoProdutoModal>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Produto
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Categoria
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Preço
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Estoque
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {produtos?.produtos?.map((produto: Produto) => (
                    <tr key={produto.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-lg mr-3 overflow-hidden">
                            <ImagemProduto
                              src={produto.imagem}
                              alt={produto.imagemAlt || produto.nome}
                              className="h-full w-full"
                              fallbackIcon={
                                <span>
                                  {getCategoriaIcon(produto.categoria)}
                                </span>
                              }
                              version={produto.id}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{produto.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {produto.categoria}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-bold">
                            {formatCurrency(produto.preco)}
                          </div>
                          {produto.precoDesconto &&
                            produto.precoDesconto > 0 && (
                              <>
                                <div className="text-sm text-green-600">
                                  {formatCurrency(produto.precoDesconto)}
                                </div>
                                {produto.percentualDesconto && (
                                  <div className="text-xs text-red-600">
                                    -{produto.percentualDesconto.toFixed(1)}%
                                  </div>
                                )}
                              </>
                            )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`font-medium ${
                            produto.quantidade === 0
                              ? "text-red-600"
                              : produto.quantidade < 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {produto.quantidade} unidades
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusProdutos[
                              produto.status as keyof typeof statusProdutos
                            ]?.cor || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusProdutos[
                            produto.status as keyof typeof statusProdutos
                          ]?.label || produto.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarProduto(produto)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditarProduto(produto)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluirProduto(produto)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {paginacao.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando {(paginacao.page - 1) * paginacao.limit + 1}-
                  {Math.min(paginacao.page * paginacao.limit, paginacao.total)}{" "}
                  de {paginacao.total} produtos
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    disabled={paginacao.page === 1}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from(
                    { length: Math.min(5, paginacao.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (paginacao.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (paginacao.page <= 3) {
                        pageNum = i + 1;
                      } else if (paginacao.page >= paginacao.totalPages - 2) {
                        pageNum = paginacao.totalPages - 4 + i;
                      } else {
                        pageNum = paginacao.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPaginaAtual(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded ${
                            paginacao.page === pageNum
                              ? "bg-[#D4AF37] text-white"
                              : "border hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setPaginaAtual((p) =>
                        Math.min(paginacao.totalPages, p + 1)
                      )
                    }
                    disabled={paginacao.page === paginacao.totalPages}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
