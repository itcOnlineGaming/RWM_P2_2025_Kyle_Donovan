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

/**
 * Check if an event is coming up within a specified number of minutes
 * Returns the number of minutes until the event (or 0 if already started)
 */
export function getMinutesUntilEvent(event: CalendarEvent): number {
  const now = new Date();
  const timeUntilEvent = event.date.getTime() - now.getTime();
  const minutesUntil = Math.floor(timeUntilEvent / (1000 * 60));
  return Math.max(0, minutesUntil);
}

/**
 * Check if an event is within the specified time window
 */
export function isEventWithinWindow(event: CalendarEvent, minutesWindow: number = 60): boolean {
  const minutesUntil = getMinutesUntilEvent(event);
  return minutesUntil > 0 && minutesUntil <= minutesWindow;
}

/**
 * Filter events that are coming up within a time window
 */
export function getUpcomingEvents(events: CalendarEvent[], minutesWindow: number = 60): CalendarEvent[] {
  return events.filter(event => isEventWithinWindow(event, minutesWindow));
}

/**
 * Helper to automatically notify about upcoming events
 * Use this in a setInterval to periodically check for events within an hour
 */
export function checkAndNotifyUpcomingEvents(
  events: CalendarEvent[],
  notifiedEventIds: Set<string>,
  minutesThreshold: number = 60,
  minutesToNotify: number = 15
): void {
  const upcomingEvents = getUpcomingEvents(events, minutesThreshold);

  upcomingEvents.forEach(event => {
    const eventId = `${event.title}-${event.date.getTime()}`;

    if (!notifiedEventIds.has(eventId)) {
      const minutesUntil = getMinutesUntilEvent(event);

      if (minutesUntil <= minutesToNotify && minutesUntil > 0) {
        notifyEventReminder(event, minutesUntil, {
          showDesktopNotification: true
        });
        notifiedEventIds.add(eventId);
      }
    }
  });
}