/**
 * Request permission for desktop/mobile notifications
 * @returns Promise with the permission status
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
 * Send a desktop/mobile notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param options - Additional notification options
 * @returns The notification instance if successful, null otherwise
 */
export function sendNotification(
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
): Notification | null {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  // Create notification options, handling vibrate separately for TypeScript
  const notificationOptions: NotificationOptions = {
    body: body,
    icon: options?.icon || '📅',
    badge: options?.badge || '📅',
    tag: options?.tag || 'calendar-notification',
    requireInteraction: options?.requireInteraction || false,
    silent: options?.silent || false,
  };

  // Add vibrate if supported (TypeScript doesn't have it in types)
  if (options?.vibrate && 'vibrate' in navigator) {
    (notificationOptions as any).vibrate = options.vibrate;
  }

  const notification = new Notification(title, notificationOptions);

  return notification;
}

/**
 * Check if notifications are supported and granted
 * @returns true if notifications are available and permission is granted
 */
export function isNotificationGranted(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Get current notification permission status
 * @returns The current permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}