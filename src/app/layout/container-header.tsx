import { ChevronLeft, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Se estiver usando shadcn/ui

interface IContainerHeader {
  label: string;
  goBack?: boolean;
  backTo?: string; // Rota específica para voltar
  onBack?: () => void; // Callback personalizado
  noBottomLine?: boolean;
  showIcon?: boolean; // Mostrar ou não o ícone
  variant?: "default" | "minimal";
  children?: React.ReactNode; // Ações adicionais à direita
}

export default function ContainerHeader({ 
  label, 
  goBack, 
  backTo,
  onBack,
  noBottomLine = false,
  showIcon = true,
  variant = "default",
  children
}: IContainerHeader) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else if (goBack) {
      navigate(-1);
    }
  };

  const hasBackAction = goBack || backTo || onBack;

  return (
    <div className={`${variant === "default" && !noBottomLine ? 'mb-6 pb-4 border-b' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          {hasBackAction && showIcon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            {hasBackAction && !showIcon && (
              <button
                onClick={handleBack}
                className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block"
              >
                ← Voltar
              </button>
            )}
            <h1 className="font-bold text-2xl text-gray-900">{label}</h1>
          </div>
        </div>
        
        {children && (
          <div className="flex items-center gap-x-2">
            {children}
          </div>
        )}
      </div>
      
      {variant === "minimal" && !noBottomLine && (
        <hr className="border-gray-200 mt-4" />
      )}
    </div>
  );
}