/**
 * Request permission for desktop/mobile notifications
 * @returns Promise with the permission status
 */
export declare function requestNotificationPermission(): Promise<NotificationPermission>;
/**
 * Send a desktop/mobile notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param options - Additional notification options
 * @returns The notification instance if successful, null otherwise
 */
export declare function sendNotification(title: string, body: string, options?: {
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    vibrate?: number[];
    silent?: boolean;
}): Notification | null;
/**
 * Check if notifications are supported and granted
 * @returns true if notifications are available and permission is granted
 */
export declare function isNotificationGranted(): boolean;
/**
 * Get current notification permission status
 * @returns The current permission status
 */
export declare function getNotificationPermission(): NotificationPermission;
