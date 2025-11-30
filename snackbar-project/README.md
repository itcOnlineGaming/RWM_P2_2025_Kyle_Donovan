# Snackbar Notification System

A reusable, production-ready notification library for SvelteKit applications with built-in calendar event integration. Perfect for calendar apps, project management tools, and any app that needs user-friendly notifications.

## Features

✨ **In-app Notifications** - Beautiful snackbar notifications with customizable positions and durations

🔔 **Desktop Notifications** - Native browser notifications with vibration support

📱 **Mobile Notifications** - Service Worker integration for mobile-optimized notifications

📅 **Calendar Integration** - Pre-built helpers for event creation, reminders, and updates

⚡ **Easy Integration** - Drop into any SvelteKit project, zero dependencies

🎨 **Customizable** - Full CSS control, TypeScript support, flexible configuration

## Quick Start

### 1. Copy the Library

Copy the `demo-standalone/src/lib/snackbar/` folder to your SvelteKit project:

```bash
cp -r demo-standalone/src/lib/snackbar your-project/src/lib/
cp -r demo-standalone/static/sw.js your-project/static/
```

### 2. Setup in Your Layout

Add to `src/routes/+layout.svelte`:

```svelte
<script>
  import { SnackbarContainer } from '$lib/snackbar';
</script>

<slot />
<SnackbarContainer />
```

### 3. Use in Your Components

```svelte
<script>
  import { snackbar, notifyEventCreated } from '$lib/snackbar';

  function handleClick() {
    snackbar.success('Event created!');
    
    const event = {
      title: 'Team Meeting',
      date: new Date(),
      type: 'meeting'
    };
    notifyEventCreated(event);
  }
</script>

<button on:click={handleClick}>Create Event</button>
```

## Documentation

Full documentation with examples and API reference: [LIBRARY_USAGE.md](./LIBRARY_USAGE.md)

## Calendar App Example

For calendar applications, automatically notify users about:
- **Event Creation** - Immediate notification when an event is created
- **Event Reminders** - Notification when an event comes within 1 hour
- **Event Updates** - Alert when an event is modified
- **Event Cancellation** - Notification when an event is cancelled

See `src/routes/calendar-integration-example.svelte` for a complete working example.

### Setup Event Reminders

```typescript
import { checkAndNotifyUpcomingEvents, type CalendarEvent } from '$lib/snackbar';

let events: CalendarEvent[] = [];
const notifiedIds = new Set<string>();

// Check every minute for upcoming events
setInterval(() => {
  checkAndNotifyUpcomingEvents(events, notifiedIds, 60, 15);
}, 60000);
```

## API Overview

### Snackbar Notifications

```typescript
import { snackbar } from '$lib/snackbar';

snackbar.success(message, options)
snackbar.error(message, options)
snackbar.warning(message, options)
snackbar.info(message, options)
```

### Calendar Events

```typescript
import {
  notifyEventCreated,
  notifyEventReminder,
  checkAndNotifyUpcomingEvents,
  getUpcomingEvents
} from '$lib/snackbar';

notifyEventCreated(event)
notifyEventReminder(event, minutesBefore)
checkAndNotifyUpcomingEvents(events, notifiedIds)
getUpcomingEvents(events, minuteWindow)
```

### Desktop/Mobile Notifications

```typescript
import {
  requestNotificationPermission,
  sendNotification,
  setupMobileNotifications
} from '$lib/snackbar';

await requestNotificationPermission()
await sendNotification(title, body, options)
await setupMobileNotifications()
```

## Browser Support

| Browser | Desktop Notifications | Mobile Notifications |
|---------|----------------------|----------------------|
| Chrome  | ✅ Yes               | ✅ Yes               |
| Firefox | ✅ Yes               | ✅ Yes               |
| Safari  | ✅ Yes               | ⚠️ Limited (iOS 16.4+) |
| Edge    | ✅ Yes               | ✅ Yes               |

## Project Structure

```
snackbar-project/
├── demo-standalone/          # Full SvelteKit demo application
│   ├── src/
│   │   ├── lib/snackbar/     # 📦 The reusable library
│   │   └── routes/           # Example pages and usage
│   ├── build/                # Production build output
│   └── static/               # Static assets (includes sw.js)
├── LIBRARY_USAGE.md          # Complete usage documentation
└── README.md                 # This file
```

## Development

### Run Demo Locally

```bash
npm run dev
# Visit http://localhost:5173/Team_4
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
# Visit http://localhost:4173/Team_4
```

## License

MIT