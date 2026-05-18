// public/service-worker.js
self.addEventListener('push', function(event) {
  if (!event.data) {
    console.warn('Push event but no data');
    return;
  }

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova atualização do seu pedido',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      data: data.data || {},
      vibrate: [200, 100, 200],
      tag: data.tag || 'pedido-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Pedido'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Sufficius', options)
    );
  } catch (error) {
    console.error('Erro ao processar notificação push:', error);
    
    // Fallback: mostrar notificação simples
    const options = {
      body: 'Nova atualização disponível',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    };
    
    event.waitUntil(
      self.registration.showNotification('Sufficius', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/pedidos';

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        // Verificar se já existe uma janela aberta
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // Abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Instalação do Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', function(event) {
  console.log('Service Worker ativado');
  event.waitUntil(clients.claim());
});