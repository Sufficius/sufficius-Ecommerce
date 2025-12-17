import { Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Tipos para as notificações
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  icon?: string;
}

interface NotificationIndicatorProps {
  className?: string;
  showPreview?: boolean;
}

// Dados mockados de notificações
const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: "1",
    title: "Novo pedido recebido",
    message: "Pedido #ORD-00123 foi realizado",
    timestamp: "Há 5 minutos",
    read: false,
    type: "info",
    icon: "🛒",
  },
  {
    id: "2",
    title: "Pagamento confirmado",
    message: "Pagamento do pedido #ORD-00122 foi confirmado",
    timestamp: "Há 1 hora",
    read: false,
    type: "success",
    icon: "💰",
  },
  {
    id: "3",
    title: "Produto com estoque baixo",
    message: "Smartphone XYZ Pro está com apenas 3 unidades",
    timestamp: "Há 2 horas",
    read: true,
    type: "warning",
    icon: "⚠️",
  },
  {
    id: "4",
    title: "Cliente novo registrado",
    message: "Ana Silva se cadastrou na loja",
    timestamp: "Hoje às 09:30",
    read: true,
    type: "info",
    icon: "👤",
  },
  {
    id: "5",
    title: "Review recebida",
    message: "João Santos avaliou seu produto com 5 estrelas",
    timestamp: "Ontem",
    read: true,
    type: "success",
    icon: "⭐",
  },
];

// Função para pegar notificações do localStorage
const getStoredNotifications = (): NotificationData[] => {
  if (typeof window === "undefined") return MOCK_NOTIFICATIONS;
  
  try {
    const stored = localStorage.getItem("akin-notifications");
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não tem no localStorage, salva as mockadas
    localStorage.setItem("akin-notifications", JSON.stringify(MOCK_NOTIFICATIONS));
    return MOCK_NOTIFICATIONS;
  } catch {
    return MOCK_NOTIFICATIONS;
  }
};

// Função para salvar notificações no localStorage
const saveNotifications = (notifications: NotificationData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("akin-notifications", JSON.stringify(notifications));
  }
};

// Componente de preview de notificações
function NotificationPreview({ 
  notifications, 
  unreadCount, 
  onMarkAsRead,
  className 
}: { 
  notifications: NotificationData[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleMarkAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.read) {
        onMarkAsRead(notif.id);
      }
    });
  };

  const getTypeColor = (type: NotificationData["type"]) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-full hover:bg-gray-100",
            className
          )}
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-white"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 sm:w-96 p-0" 
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col max-h-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              <p className="text-sm text-gray-500">
                {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Check className="h-3 w-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Lista de notificações */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors relative",
                      !notification.read && "bg-blue-50/50"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Ícone */}
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                          getTypeColor(notification.type)
                        )}>
                          {notification.icon || "🔔"}
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Marcar como lida
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => {
                // Aqui você pode navegar para página completa de notificações
                console.log("Ver todas as notificações");
                setOpen(false);
              }}
            >
              Ver todas as notificações
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function NotificationIndicator({ 
  className = "", 
  showPreview = true 
}: NotificationIndicatorProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Carrega notificações do localStorage
    const storedNotifications = getStoredNotifications();
    setNotifications(storedNotifications);
    
    // Calcula não lidas
    const unread = storedNotifications.filter(n => !n.read);
    setUnreadCount(unread.length);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      // Salva no localStorage
      saveNotifications(updated);
      
      // Atualiza contador
      const unread = updated.filter(n => !n.read);
      setUnreadCount(unread.length);
      
      return updated;
    });
  };

  // Adiciona uma nova notificação mock (para testes)
  const addMockNotification = () => {
    const newNotification: NotificationData = {
      id: Date.now().toString(),
      title: "Notificação de teste",
      message: "Esta é uma notificação gerada para teste",
      timestamp: "Agora mesmo",
      read: false,
      type: "info",
      icon: "🧪",
    };

    const updated = [newNotification, ...notifications.slice(0, 9)]; // Mantém apenas as 10 mais recentes
    setNotifications(updated);
    saveNotifications(updated);
    
    const unread = updated.filter(n => !n.read);
    setUnreadCount(unread.length);
  };

  if (!showPreview) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationPreview
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        className={className}
      />
      
      {/* Botão para adicionar notificação de teste (remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          size="sm"
          onClick={addMockNotification}
          className="h-8 text-xs"
        >
          + Teste
        </Button>
      )}
    </div>
  );
}

export default NotificationIndicator;