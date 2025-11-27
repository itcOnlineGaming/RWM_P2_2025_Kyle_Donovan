export { default as Snackbar } from './Snackbar.svelte';
export { default as SnackbarContainer } from './SnackbarContainer.svelte';
export { snackbarStore, snackbar } from './snackbarStore';
export type { SnackbarConfig } from './snackbarStore';

// Notification utilities
export { 
  requestNotificationPermission, 
  sendNotification,
  isNotificationGranted,
  getNotificationPermission
} from './notifications';

// Service Worker mobile notifications
export {
  setupMobileNotifications,
  registerServiceWorker,
  sendMobileNotification
} from './serviceWorkerNotifications';

// Calendar integration helpers
export {
  notifyEventCreated,
  notifyEventUpdated,
  notifyEventCancelled,
  notifyEventReminder,
  notifyCalendarSynced
} from './calendarIntegration';

export type { CalendarEvent } from './calendarIntegration';