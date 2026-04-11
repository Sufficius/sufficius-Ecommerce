"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  Tag,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  criadoEm: string;
  atualizadoEm: string;
  Produto?: Array<{ id: string; nome: string }>;
}

export default function AdminCategorias() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  // Buscar categorias
  const { data: categoriasData, isLoading, error } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data as Categoria[];
    },
    enabled: !!token,
  });

  // Criar categoria
  const createMutation = useMutation({
    mutationFn: async (data: { nome: string; descricao: string;}) => {
      const response = await api.post("/categorias", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao criar categoria");
    },
  });

  // Atualizar categoria
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { nome: string; descricao: string;} }) => {
      const response = await api.put(`/categorias/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar categoria");
    },
  });

  // Deletar categoria
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIsDeleteAlertOpen(false);
      setSelectedCategoria(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao deletar categoria");
    },
  });

  const resetForm = () => {
    setFormData({ nome: "", descricao: "" });
    setSelectedCategoria(null);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsDeleteAlertOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!formData.nome.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = () => {
    if (!selectedCategoria) return;
    if (!formData.nome.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }
    updateMutation.mutate({ id: selectedCategoria.id, data: formData });
  };

  const handleConfirmDelete = () => {
    if (selectedCategoria) {
      deleteMutation.mutate(selectedCategoria.id);
    }
  };

  // Filtrar categorias
  const filteredCategorias = categoriasData?.filter((cat) =>
    cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasProducts = (categoria: Categoria) => {
    return categoria?.Produto && categoria?.Produto?.length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Erro ao carregar categorias</h2>
        <p className="text-red-600">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias dos produtos</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de Categorias */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-left">Nome</TableHead>
              <TableHead className="text-left">Descrição</TableHead>
              <TableHead className="text-center">Produtos</TableHead>
              <TableHead className="text-center">Criado em</TableHead>
              <TableHead className="text-center w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategorias && filteredCategorias.length > 0 ? (
              filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-amber-500" />
                      {categoria.nome}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {categoria.descricao || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {categoria.Produto?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {new Date(categoria.criadoEm).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(categoria)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(categoria)}
                        disabled={hasProducts(categoria)}
                        className={`h-8 w-8 ${
                          hasProducts(categoria)
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-600 hover:text-red-700"
                        }`}
                        title={
                          hasProducts(categoria)
                            ? "Não é possível excluir categoria com produtos"
                            : "Excluir categoria"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "Nenhuma categoria encontrada com este termo"
                    : "Nenhuma categoria cadastrada"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Criar Categoria */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova categoria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Eletrônicos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição da categoria (opcional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={createMutation.isPending}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Categoria */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Altere os dados da categoria</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={updateMutation.isPending}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{selectedCategoria?.nome}"?
              {selectedCategoria?.Produto && selectedCategoria.Produto.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ Atenção: Esta categoria possui {selectedCategoria.Produto.length} produto(s) associado(s). 
                  Não é possível excluir categorias com produtos.
                </span>
              )}
              {(!selectedCategoria?.Produto || selectedCategoria.Produto.length === 0) && (
                <span className="block mt-2">
                  Esta ação não pode ser desfeita.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={hasProducts(selectedCategoria as Categoria)}
              className={
                hasProducts(selectedCategoria as Categoria)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Sim, excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}