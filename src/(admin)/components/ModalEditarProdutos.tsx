// components/ModalEditarProduto.tsx
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/modules/services/api/axios';
import { useAuthStore } from '@/modules/services/store/auth-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  id_categoria: string;
  categoria?: string;
  Categoria?: { id: string; nome: string };
  status: string;
  foto?: string | null;
}

interface ModalEditarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
  categorias: any[];
  onProdutoAtualizado: () => void;
}

export const ModalEditarProduto = ({
  isOpen,
  onClose,
  produto,
  categorias,
  onProdutoAtualizado
}: ModalEditarProdutoProps) => {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    id_categoria: '',
    status: 'ATIVO',
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    id_categoria: '',
  });

  const token = useAuthStore((state) => state.token);

  // Carregar dados do produto quando o modal abrir
  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        preco: produto.preco?.toString() || '',
        quantidade: produto.quantidade?.toString() || '',
        id_categoria: produto.id_categoria || produto.Categoria?.id || '',
        status: produto.status || 'ATIVO',
      });
      setImagemAtual(produto.foto || null);
      setImagemPreview(produto.foto || null);
      setImagem(null);
    }
  }, [produto]);

  if (!isOpen || !produto) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 10MB');
        return;
      }

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Formato inválido. Use JPEG, PNG ou WebP');
        return;
      }

      setImagem(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverImagem = () => {
    setImagem(null);
    setImagemPreview(imagemAtual);
    setImagemAtual(null);

    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const uploadImagem = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagem', file);

    const response = await api.post('/upload/supabase', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      },
    });

    if (response.data?.success) {
      return response.data.url;
    }
    throw new Error(response.data?.message || 'Erro no upload');
  };

  const validate = () => {
    const newErrors = {
      nome: '',
      descricao: '',
      preco: '',
      quantidade: '',
      id_categoria: '',
    };
    let isValid = true;

    if (!form.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    if (!form.preco || parseFloat(form.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
      isValid = false;
    }

    if (!form.quantidade || parseInt(form.quantidade) < 0) {
      newErrors.quantidade = 'Quantidade deve ser zero ou maior';
      isValid = false;
    }

    if (!form.id_categoria) {
      newErrors.id_categoria = 'Categoria é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let fotoUrl = imagemAtual;

      // Se houver nova imagem, fazer upload
      if (imagem) {
        setUploadProgress(30);
        fotoUrl = await uploadImagem(imagem);
        setUploadProgress(70);
      }

        // Se não tem imagem atual E não tem imagem nova, enviar null
      if (!imagemAtual && !imagem) {
        fotoUrl = null;
      }

      // Dados para atualização
      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        quantidade: parseInt(form.quantidade),
        id_categoria: form.id_categoria,
        status: form.status,
        foto: fotoUrl,
      };

      setUploadProgress(90);

      const response = await api.put(`/produtos/${produto.id}`, produtoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUploadProgress(100);

      if (response.data.success || response.data.id) {
        toast.success('Produto atualizado com sucesso!');
        onProdutoAtualizado();
        onClose();
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar produto');
      }
    } catch (error: any) {
      console.error('❌ Erro ao atualizar produto:', error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao atualizar produto');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg w-full max-w-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Produto
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progresso do upload */}
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
                />
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <Label>Nome do Produto *</Label>
                <Input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={errors.nome ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Categoria */}
              <div>
                <Label>Categoria *</Label>
                <Select
                  value={form.id_categoria}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, id_categoria: value }));
                    setErrors((prev) => ({ ...prev, id_categoria: '' }));
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.id_categoria ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecionar categoria" />
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
                  <p className="text-red-500 text-xs mt-1">{errors.id_categoria}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço */}
              <div>
                <Label>Preço (KZ) *</Label>
                <Input
                  type="number"
                  name="preco"
                  value={form.preco}
                  onChange={handleChange}
                  className={errors.preco ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  min="0"
                  step="1"
                />
                {errors.preco && (
                  <p className="text-red-500 text-xs mt-1">{errors.preco}</p>
                )}
              </div>

              {/* Quantidade */}
              <div>
                <Label>Quantidade *</Label>
                <Input
                  type="number"
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleChange}
                  className={errors.quantidade ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  min="0"
                />
                {errors.quantidade && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>
                )}
              </div>

              {/* Imagem */}
              <div className="md:col-span-2">
                <Label>Imagem do Produto</Label>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-1 text-center">
                      {imagemPreview ? (
                        <div className="relative">
                          <img
                            src={imagemPreview}
                            alt="Preview"
                            className="mx-auto h-40 w-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoverImagem}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#D4AF37] hover:text-[#c19b2c]"
                            >
                              <span>Upload da imagem</span>
                              <input
                                id="file-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleImagemChange}
                                className="sr-only"
                                disabled={isSubmitting}
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
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <Label>Descrição</Label>
                <Textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#D4AF37] hover:bg-[#c19b2c] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};