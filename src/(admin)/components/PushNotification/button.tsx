// src/components/PushNotificationButton.tsx
import { usePushNotifications } from '@/(admin)/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PushNotificationButton() {
  const { isSubscribed, loading, error, subscribe, unsubscribe } = usePushNotifications();
    
  const handleToggle = async () => {
    if (loading) return;

    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success('Notificações desativadas');
      } else {
        toast.error('Erro ao desativar notificações');
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast.success('Notificações ativadas! Você receberá atualizações dos seus pedidos.');
      } else if (error) {
        toast.error(error);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
      title={isSubscribed ? 'Desativar notificações' : 'Ativar notificações'}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isSubscribed ? (
        <>
          <Bell className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-sm">Notificações ativas</span>
        </>
      ) : (
        <>
          <BellOff className="h-5 w-5 text-gray-500" />
          <span className="text-sm">Ativar notificações</span>
        </>
      )}
    </button>
  );
}