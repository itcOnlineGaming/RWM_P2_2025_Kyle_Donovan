/**
 * Push Notifications - Background notifications via push server
 */

/**
 * Automatically determine push server URL based on environment
 * - Development: uses localhost
 * - Production/Network: uses same host as the app
 * - Can be overridden with VITE_PUSH_SERVER_URL environment variable
 */
function getPushServerUrl(): string {
  // Check for environment variable override
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUSH_SERVER_URL) {
    return import.meta.env.VITE_PUSH_SERVER_URL;
  }
  
  // In browser environment
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If we're on localhost, use localhost for push server
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    
    // Otherwise, use the same host with port 3000
    // This works when deployed on SETU server or any network
    return `${protocol}//${currentHost}:3000`;
  }
  
  // Fallback
  return 'http://localhost:3000';
}

const PUSH_SERVER_URL = getPushServerUrl();
const VAPID_PUBLIC_KEY = 'BB0mh7LqN9ykwQ6JehCD58ogN9Lphh3LVJ7QaFm6iUZJh5Hr_FfXt9ey4OOyU-BuJblIu2v2ycVShK7WSoy46vE';

// Log the push server URL for debugging
console.log('Push Server URL:', PUSH_SERVER_URL);

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
import { registerServiceWorker } from './serviceWorkerNotifications';

export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return false;
  }

  try {
    console.log('Starting push notification subscription...');

    // Ensure service worker is registered before waiting for ready
    const registrationInit = await registerServiceWorker();
    if (!registrationInit) {
      console.error('Service worker registration failed before push subscription');
      return false;
    }
    
    // Wait for service worker to be ready with a timeout
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<ServiceWorkerRegistration>((_, reject) => 
        setTimeout(() => reject(new Error('Service worker timeout')), 10000)
      )
    ]);
    
    console.log('Service worker ready:', registration);
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log('No existing subscription, creating new one...');
      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('New subscription created:', subscription);
    } else {
      console.log('Using existing subscription:', subscription);
    }

    // Send subscription to server
    console.log('Sending subscription to server...');
    const response = await fetch(`${PUSH_SERVER_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });

    if (response.ok) {
      console.log('✅ Subscribed to push notifications');
      const data = await response.json();
      console.log('Server response:', data);
      return true;
    } else {
      console.error('Server response status:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Push subscription error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
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
