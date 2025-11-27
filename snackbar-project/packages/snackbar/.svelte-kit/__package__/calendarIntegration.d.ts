export interface CalendarEvent {
    title: string;
    date: Date;
    type?: 'meeting' | 'call' | 'review' | 'demo' | 'reminder';
    description?: string;
}
/**
 * Notify when an event is created
 */
export declare function notifyEventCreated(event: CalendarEvent, options?: {
    showDesktopNotification?: boolean;
    snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    snackbarDuration?: number;
}): void;
/**
 * Notify when an event is updated
 */
export declare function notifyEventUpdated(event: CalendarEvent, options?: {
    showDesktopNotification?: boolean;
    snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}): void;
/**
 * Notify when an event is cancelled
 */
export declare function notifyEventCancelled(event: CalendarEvent, options?: {
    showDesktopNotification?: boolean;
    snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}): void;
/**
 * Send a reminder notification
 */
export declare function notifyEventReminder(event: CalendarEvent, minutesBefore: number, options?: {
    showDesktopNotification?: boolean;
    snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}): void;
/**
 * Notify when calendar is synced
 */
export declare function notifyCalendarSynced(eventCount: number, options?: {
    showDesktopNotification?: boolean;
    snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}): void;
