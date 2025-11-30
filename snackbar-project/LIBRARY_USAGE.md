# Snackbar Notification Library - Usage Guide

This is a reusable notification library that can be integrated into any SvelteKit project. It provides both in-app notifications (snackbars) and desktop/mobile notifications with calendar event integration.

## Quick Start

### 1. Copy the Library to Your Project

Copy the entire `demo-standalone/src/lib/snackbar/` folder to your project's `src/lib/` directory:

```
your-project/
├── src/
│   └── lib/
│       └── snackbar/
│           ├── index.ts
│           ├── snackbarStore.ts
│           ├── Snackbar.svelte
│           ├── SnackbarContainer.svelte
│           ├── notifications.ts
│           ├── serviceWorkerNotifications.ts
│           ├── calendarIntegration.ts
│           ├── snackbar.css
│           └── container.css
```

### 2. Add Service Worker (Optional but Recommended)

Copy `demo-standalone/static/sw.js` to your project's `static/` folder for better mobile notification support.

### 3. Setup in Your App

In your root layout component (`src/routes/+layout.svelte`):

```svelte
<script>
  import { SnackbarContainer } from '$lib/snackbar';
</script>

<div class="app">
  <slot />
</div>

<SnackbarContainer />

<style>
  /* Your styles */
</style>
```

## Basic Usage

### Simple Notifications

```svelte
<script>
  import { snackbar } from '$lib/snackbar';

  function handleClick() {
    snackbar.success('Event created successfully!');
    snackbar.error('Something went wrong');
    snackbar.warning('Please be careful');
    snackbar.info('FYI: Your event is tomorrow');
  }
</script>

<button on:click={handleClick}>Show Notification</button>
```

### Calendar Event Notifications

Perfect for calendar applications! When an event is created, updated, or cancelled:

```svelte
<script>
  import {
    notifyEventCreated,
    notifyEventCancelled,
    notifyEventReminder,
    notifyEventUpdated
  } from '$lib/snackbar';

  const newEvent = {
    title: 'Team Meeting',
    date: new Date('2025-12-01T14:00:00'),
    type: 'meeting',
    description: 'Weekly sync'
  };

  // Notify when event is created
  notifyEventCreated(newEvent, {
    showDesktopNotification: true,
    snackbarPosition: 'bottom-right'
  });

  // Notify when event is cancelled
  notifyEventCancelled(newEvent, {
    showDesktopNotification: true,
    snackbarPosition: 'top-right'
  });

  // Send reminder 15 minutes before event
  notifyEventReminder(newEvent, 15, {
    showDesktopNotification: true,
    snackbarPosition: 'top-right'
  });

  // Notify when event is updated
  notifyEventUpdated(newEvent, {
    showDesktopNotification: true
  });
</script>
```

## Advanced Features

### Desktop/Mobile Notifications

Request permission and send desktop notifications:

```svelte
<script>
  import {
    requestNotificationPermission,
    sendNotification,
    setupMobileNotifications
  } from '$lib/snackbar';

  async function enableNotifications() {
    // Request permission from user
    const permission = await requestNotificationPermission();
    console.log('Permission:', permission);
  }

  async function sendCustomNotification() {
    await sendNotification('Hello!', 'This is a custom notification', {
      icon: '/path/to/icon.png',
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }

  async function setupMobile() {
    // Setup mobile notifications with Service Worker
    const { permission, registration } = await setupMobileNotifications();
    console.log('Service Worker registered:', registration);
  }
</script>

<button on:click={enableNotifications}>Enable Notifications</button>
<button on:click={sendCustomNotification}>Send Custom Notification</button>
<button on:click={setupMobile}>Setup Mobile Notifications</button>
```

### Custom Snackbar Notifications

```svelte
<script>
  import { snackbarStore } from '$lib/snackbar';

  function showCustom() {
    snackbarStore.show({
      message: 'Custom notification',
      type: 'info',
      duration: 5000,
      position: 'top-center',
      showClose: true
    });
  }

  function clearAll() {
    snackbarStore.clear();
  }
</script>

<button on:click={showCustom}>Show Custom</button>
<button on:click={clearAll}>Clear All</button>
```

## Calendar App Integration Example

Here's how to use this in a calendar application to notify when:
1. An event is created
2. An event comes within 1 hour of the current time

```svelte
<script>
  import { onMount } from 'svelte';
  import { notifyEventCreated, notifyEventReminder } from '$lib/snackbar';

  let events = [];

  function createEvent(title, date) {
    const newEvent = {
      title,
      date: new Date(date),
      type: 'meeting'
    };

    events.push(newEvent);

    // Notify event was created
    notifyEventCreated(newEvent);
  }

  function checkForUpcomingEvents() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    events.forEach(event => {
      const timeUntilEvent = event.date.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeUntilEvent / (1000 * 60));

      // Notify if event is within 1 hour and hasn't been notified yet
      if (minutesUntil > 0 && minutesUntil <= 60 && !event.notified) {
        notifyEventReminder(event, minutesUntil, {
          showDesktopNotification: true
        });
        event.notified = true;
      }
    });
  }

  onMount(() => {
    // Check for upcoming events every minute
    const interval = setInterval(checkForUpcomingEvents, 60000);
    return () => clearInterval(interval);
  });
</script>

<input type="text" placeholder="Event title" bind:value={eventTitle} />
<input type="datetime-local" bind:value={eventDateTime} />
<button on:click={() => createEvent(eventTitle, eventDateTime)}>
  Create Event
</button>

<div>
  {#each events as event}
    <div>
      {event.title} at {event.date.toLocaleString()}
    </div>
  {/each}
</div>
```

## API Reference

### Snackbar Store

```typescript
import { snackbar, snackbarStore } from '$lib/snackbar';

// Quick methods
snackbar.success(message: string, options?: Partial<SnackbarConfig>)
snackbar.error(message: string, options?: Partial<SnackbarConfig>)
snackbar.warning(message: string, options?: Partial<SnackbarConfig>)
snackbar.info(message: string, options?: Partial<SnackbarConfig>)

// Advanced
snackbarStore.show(config: SnackbarConfig) -> string (id)
snackbarStore.remove(id: string)
snackbarStore.clear()
```

### Calendar Integration

```typescript
import {
  notifyEventCreated,
  notifyEventUpdated,
  notifyEventCancelled,
  notifyEventReminder,
  notifyCalendarSynced,
  type CalendarEvent
} from '$lib/snackbar';

interface CalendarEvent {
  title: string;
  date: Date;
  type?: 'meeting' | 'call' | 'review' | 'demo' | 'reminder';
  description?: string;
}

notifyEventCreated(event: CalendarEvent, options?)
notifyEventUpdated(event: CalendarEvent, options?)
notifyEventCancelled(event: CalendarEvent, options?)
notifyEventReminder(event: CalendarEvent, minutesBefore: number, options?)
notifyCalendarSynced(eventCount: number, options?)
```

### Desktop/Mobile Notifications

```typescript
import {
  requestNotificationPermission,
  sendNotification,
  isNotificationGranted,
  getNotificationPermission,
  setupMobileNotifications,
  registerServiceWorker,
  sendMobileNotification
} from '$lib/snackbar';

requestNotificationPermission() -> Promise<NotificationPermission>
sendNotification(title: string, body: string, options?) -> Promise<Notification | null>
isNotificationGranted() -> boolean
getNotificationPermission() -> NotificationPermission
setupMobileNotifications() -> Promise<{ permission, registration }>
registerServiceWorker() -> Promise<ServiceWorkerRegistration | null>
sendMobileNotification(title: string, body: string, options?) -> Promise<void>
```

## Styling

The library comes with default styles in `snackbar.css` and `container.css`. You can customize the appearance by modifying these files or overriding CSS variables:

```css
:root {
  --snackbar-bg-success: #10b981;
  --snackbar-bg-error: #ef4444;
  --snackbar-bg-warning: #f59e0b;
  --snackbar-bg-info: #3b82f6;
  --snackbar-text-color: #ffffff;
  --snackbar-font-size: 14px;
  --snackbar-border-radius: 8px;
}
```

## Permissions Required

For desktop/mobile notifications to work, users must grant permission. You can request this with:

```svelte
<script>
  import { setupMobileNotifications } from '$lib/snackbar';

  async function askForPermission() {
    const { permission } = await setupMobileNotifications();
    if (permission === 'granted') {
      console.log('Notifications enabled!');
    }
  }
</script>

<button on:click={askForPermission}>Enable Notifications</button>
```

## Browser Support

- ✅ Desktop notifications: Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile notifications: Android Chrome, Firefox
- ⚠️ iOS: Limited support (requires iOS 16.4+)

## License

MIT
