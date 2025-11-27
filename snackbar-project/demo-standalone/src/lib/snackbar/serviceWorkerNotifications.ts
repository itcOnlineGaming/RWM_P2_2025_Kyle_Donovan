/**
 * Register service worker for mobile notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Request notification permission and register service worker
 */
export async function setupMobileNotifications(): Promise<{
  permission: NotificationPermission;
  registration: ServiceWorkerRegistration | null;
}> {
  // Register service worker first
  const registration = await registerServiceWorker();

  // Request notification permission
  let permission: NotificationPermission = 'default';
  
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      permission = 'granted';
    } else if (Notification.permission !== 'denied') {
      permission = await Notification.requestPermission();
    } else {
      permission = 'denied';
    }
  }

  return { permission, registration };
}

/**
 * Send notification using Service Worker (works better on mobile)
 */
export async function sendMobileNotification(
  title: string,
  body: string,
  options?: {
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    vibrate?: number[];
    silent?: boolean;
  }
): Promise<void> {
  // Make sure service worker is ready
  if (!navigator.serviceWorker.controller) {
    console.warn('Service Worker not controlling the page yet');
    // Fallback to regular notification
    if (Notification.permission === 'granted') {
      const notifOptions: any = {
        body,
        icon: options?.icon || '📅',
        badge: options?.badge || '📅',
        tag: options?.tag || 'notification',
        vibrate: options?.vibrate || [200, 100, 200],
        requireInteraction: options?.requireInteraction || false,
        silent: options?.silent || false
      };
      new Notification(title, notifOptions);
    }
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const swNotifOptions: any = {
      body,
      icon: options?.icon || '📅',
      badge: options?.badge || '📅',
      tag: options?.tag || 'notification',
      vibrate: options?.vibrate || [200, 100, 200],
      requireInteraction: options?.requireInteraction || false,
      silent: options?.silent || false,
      data: {
        dateTime: new Date().toISOString(),
        url: '/'
      }
    };
    
    await registration.showNotification(title, swNotifOptions);
    
    console.log('Mobile notification sent via Service Worker');
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}