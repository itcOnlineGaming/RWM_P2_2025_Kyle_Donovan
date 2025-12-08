/**
 * Push Notifications - Background notifications via push server
 */

const PUSH_SERVER_URL = 'http://localhost:3000';
const VAPID_PUBLIC_KEY = 'BB0mh7LqN9ykwQ6JehCD58ogN9Lphh3LVJ7QaFm6iUZJh5Hr_FfXt9ey4OOyU-BuJblIu2v2ycVShK7WSoy46vE';

/**
 * Convert VAPID key to Uint8Array for push subscription
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
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

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return false;
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Send subscription to server
    const response = await fetch(`${PUSH_SERVER_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });

    if (response.ok) {
      console.log('✅ Subscribed to push notifications');
      console.log('Subscription:', subscription);
      return true;
    } else {
      console.error('Server response status:', response.status, response.statusText);
      return false;
    }
      console.error('Failed to subscribe on server');
      return false;
    }
  } catch (error) {
    console.error('Push subscription error:', error);
    return false;
  }
}

/**
 * Check if user is subscribed to push notifications
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Trigger a push notification from the server
 * This works even when the app is closed!
 */
export async function triggerPushNotification(
  title: string,
  body: string,
  options?: {
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
  }
): Promise<boolean> {
  try {
    const payload = {
      title,
      body,
      icon: options?.icon || '📅',
      badge: options?.badge || '📅',
      tag: options?.tag || 'notification',
      requireInteraction: options?.requireInteraction || false
    };

    const response = await fetch(`${PUSH_SERVER_URL}/notify`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to trigger push notification:', error);
    return false;
  }
}

/**
 * Schedule a push notification for later (requires server enhancement)
 * For demo purposes, this will send immediately
 */
export async function schedulePushNotification(
  title: string,
  body: string,
  delayMs: number,
  options?: {
    icon?: string;
    badge?: string;
    tag?: string;
  }
): Promise<void> {
  // For demo: schedule on client side
  setTimeout(async () => {
    await triggerPushNotification(title, body, options);
  }, delayMs);
}
