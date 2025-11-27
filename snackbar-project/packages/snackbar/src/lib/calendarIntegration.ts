import { snackbar } from './snackbarStore';
import { sendNotification, isNotificationGranted } from './notifications';

export interface CalendarEvent {
  title: string;
  date: Date;
  type?: 'meeting' | 'call' | 'review' | 'demo' | 'reminder';
  description?: string;
}

/**
 * Notify when an event is created
 */
export function notifyEventCreated(event: CalendarEvent, options?: {
  showDesktopNotification?: boolean;
  snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  snackbarDuration?: number;
}) {
  const dateStr = event.date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  // In-app notification
  snackbar.success(`Event created: ${event.title} on ${dateStr}`, {
    position: options?.snackbarPosition || 'bottom-right',
    duration: options?.snackbarDuration || 4000
  });

  // Desktop/mobile notification
  if (options?.showDesktopNotification !== false && isNotificationGranted()) {
    sendNotification(
      'Event Created',
      `${event.title} scheduled for ${dateStr}`,
      {
        icon: getEventIcon(event.type),
        tag: `event-created-${event.date.getTime()}`
      }
    );
  }
}

/**
 * Notify when an event is updated
 */
export function notifyEventUpdated(event: CalendarEvent, options?: {
  showDesktopNotification?: boolean;
  snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}) {
  const dateStr = event.date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  snackbar.info(`Event updated: ${event.title} on ${dateStr}`, {
    position: options?.snackbarPosition || 'bottom-right',
    duration: 4000
  });

  if (options?.showDesktopNotification !== false && isNotificationGranted()) {
    sendNotification(
      'Event Updated',
      `${event.title} has been updated`,
      {
        icon: '🔄',
        tag: `event-updated-${event.date.getTime()}`
      }
    );
  }
}

/**
 * Notify when an event is cancelled
 */
export function notifyEventCancelled(event: CalendarEvent, options?: {
  showDesktopNotification?: boolean;
  snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}) {
  snackbar.error(`Event cancelled: ${event.title}`, {
    position: options?.snackbarPosition || 'bottom-right',
    duration: 5000
  });

  if (options?.showDesktopNotification !== false && isNotificationGranted()) {
    sendNotification(
      'Event Cancelled',
      `${event.title} has been cancelled`,
      {
        icon: '❌',
        tag: `event-cancelled-${event.date.getTime()}`,
        vibrate: [200, 100, 200, 100, 200]
      }
    );
  }
}

/**
 * Send a reminder notification
 */
export function notifyEventReminder(event: CalendarEvent, minutesBefore: number, options?: {
  showDesktopNotification?: boolean;
  snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}) {
  const timeStr = event.date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit'
  });

  snackbar.warning(`Reminder: ${event.title} starts in ${minutesBefore} minutes`, {
    position: options?.snackbarPosition || 'top-right',
    duration: 6000
  });

  if (options?.showDesktopNotification !== false && isNotificationGranted()) {
    sendNotification(
      'Meeting Reminder',
      `${event.title} starts at ${timeStr} (in ${minutesBefore} minutes)`,
      {
        icon: '⏰',
        tag: `event-reminder-${event.date.getTime()}`,
        requireInteraction: true,
        vibrate: [300, 100, 300]
      }
    );
  }
}

/**
 * Notify when calendar is synced
 */
export function notifyCalendarSynced(eventCount: number, options?: {
  showDesktopNotification?: boolean;
  snackbarPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}) {
  snackbar.success(`Calendar synced with ${eventCount} events`, {
    position: options?.snackbarPosition || 'bottom-center',
    duration: 3000
  });

  if (options?.showDesktopNotification !== false && isNotificationGranted()) {
    sendNotification(
      'Calendar Synced',
      `${eventCount} events updated`,
      {
        icon: '🔄',
        tag: 'calendar-sync',
        silent: true
      }
    );
  }
}

function getEventIcon(type?: string): string {
  switch (type) {
    case 'meeting': return '📝';
    case 'call': return '📞';
    case 'review': return '👁️';
    case 'demo': return '🎯';
    case 'reminder': return '⏰';
    default: return '📅';
  }
}