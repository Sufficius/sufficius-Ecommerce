"use client";

import { useState } from "react";
import { X,  Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";

interface ModalNovoEstoqueProps {
  children: React.ReactNode;
  onProdutoCriado: () => void;
}

export function ModalNovoEstoque({ children, onProdutoCriado }: ModalNovoEstoqueProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    quantidade: 0,
    id_categoria: "",
    status: "ATIVO",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/estoque", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item adicionado ao estoque!");
      setIsOpen(false);
      onProdutoCriado();
      setFormData({ nome: "", descricao: "", preco: 0, quantidade: 0, id_categoria: "", status: "ATIVO" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao adicionar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsOpen(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Novo Item no Estoque</h3>
                    <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <textarea
                      placeholder="Descrição"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Preço"
                        value={formData.preco || ""}
                        onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantidade"
                        value={formData.quantidade || ""}
                        onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}