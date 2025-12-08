// Simple Service Worker - no module syntax
(function() {
  'use strict';
  
  self.addEventListener('install', function(event) {
    console.log('[SW] Installing service worker');
    self.skipWaiting();
  });

  self.addEventListener('activate', function(event) {
    console.log('[SW] Activating service worker');
    event.waitUntil(clients.claim());
  });

  self.addEventListener('notificationclick', function(event) {
    console.log('[SW] Notification clicked:', event.notification.tag);
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/Team_4/');
        }
      })
    );
  });

  self.addEventListener('push', function(event) {
    console.log('[SW] Push notification received');
    
    var data = {};
    try {
      data = event.data.json();
    } catch(e) {
      data = {
        title: 'Notification',
        body: event.data.text()
      };
    }
    
    var options = {
      body: data.body || 'New notification',
      icon: data.icon || '📅',
      badge: data.badge || '📅',
      vibrate: data.vibrate || [200, 100, 200],
      tag: data.tag || 'notification',
      requireInteraction: !!data.requireInteraction,
      data: data
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Calendar Event', options)
    );
  });
})();