import { sendMobileNotification } from './serviceWorkerNotifications';

/**
 * Request permission for desktop/mobile notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Send a desktop/mobile notification (uses Service Worker on mobile)
 */
export async function sendNotification(
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
): Promise<Notification | null> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  // Use Service Worker for mobile (better support)
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    await sendMobileNotification(title, body, options);
    return null;
  }

  // Fallback to regular notifications for desktop
  const notificationOptions: NotificationOptions = {
    body: body,
    icon: options?.icon || '📅',
    badge: options?.badge || '📅',
    tag: options?.tag || 'calendar-notification',
    requireInteraction: options?.requireInteraction || false,
    silent: options?.silent || false,
  };

  // Add vibrate if supported
  if (options?.vibrate && 'vibrate' in navigator) {
    (notificationOptions as any).vibrate = options.vibrate;
  }

  const notification = new Notification(title, notificationOptions);
  return notification;
}

/**
 * Check if notifications are supported and granted
 */
export function isNotificationGranted(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}