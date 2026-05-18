// src/hooks/usePushNotifications.ts
import { useState, useEffect } from 'react';
import { api } from '@/modules/services/api/axios';
import { useAuthStore } from '@/modules/services/store/auth-store';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  // Verificar permissão atual
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker não suportado neste navegador');
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      throw error;
    }
  };

  // Solicitar permissão e inscrever
  const subscribe = async () => {
    if (!token) {
      setError('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Verificar suporte
      if (!('Notification' in window)) {
        throw new Error('Notificações não suportadas neste navegador');
      }

      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker não suportado');
      }

      // 2. Solicitar permissão
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        throw new Error('Permissão de notificação negada');
      }

      // 3. Registrar Service Worker
      const registration = await registerServiceWorker();

      // 4. Buscar chave pública VAPID
      const vapidResponse = await api.get('/notifications/vapid-public-key');
      const vapidPublicKey = vapidResponse.data.publicKey;

      if (!vapidPublicKey) {
        throw new Error('Chave VAPID não encontrada');
      }

      // 5. Inscrever no Push
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      console.log('✅ Push Subscription:', subscription);

      // 6. Enviar subscription para o backend
      await api.post('/notifications/subscribe', subscription, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setIsSubscribed(true);
      console.log('✅ Inscrito com sucesso!');
      
      // Salvar no localStorage
      localStorage.setItem('pushSubscribed', 'true');
      
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao inscrever:', error);
      setError(error.message || 'Erro ao ativar notificações');
      setIsSubscribed(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar inscrição
  const unsubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Remover do backend
        await api.delete('/notifications/unsubscribe', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { endpoint: subscription.endpoint },
        });

        // Cancelar inscrição
        await subscription.unsubscribe();
        console.log('✅ Inscrição cancelada');
      }

      setIsSubscribed(false);
      localStorage.removeItem('pushSubscribed');
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao cancelar:', error);
      setError(error.message || 'Erro ao cancelar notificações');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar se já está inscrito ao carregar
  useEffect(() => {
    const checkSubscription = async () => {
      if (!token) return;

      const wasSubscribed = localStorage.getItem('pushSubscribed') === 'true';
      
      if (wasSubscribed && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          
          if (subscription) {
            setIsSubscribed(true);
            console.log('✅ Usuário já inscrito');
          } else {
            // Inscrição expirada ou inválida
            localStorage.removeItem('pushSubscribed');
          }
        } catch (error) {
          console.error('Erro ao verificar inscrição:', error);
        }
      }
    };

    checkSubscription();
  }, [token]);

  return {
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
  };
}