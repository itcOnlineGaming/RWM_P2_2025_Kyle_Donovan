# Integration Guide - Using Snackbar Notifications in Your Calendar App

This guide shows how to integrate the snackbar notification library into your existing calendar application.

## Prerequisites

- SvelteKit project
- Node.js and npm installed
- Basic understanding of Svelte and TypeScript

## Installation

### Option 1: Using the Installation Script (Recommended)

```bash
# From the snackbar-project directory
bash install-snackbar.sh /path/to/your/calendar/app
```

### Option 2: Manual Installation

1. Copy the library folder:
```bash
cp -r demo-standalone/src/lib/snackbar your-app/src/lib/
cp demo-standalone/static/sw.js your-app/static/
```

2. Ensure your `src/lib` folder exists:
```bash
mkdir -p your-app/src/lib
```

## Setup Your App

### Step 1: Add SnackbarContainer to Your Root Layout

Edit `src/routes/+layout.svelte`:

```svelte
<script>
  import { SnackbarContainer } from '$lib/snackbar';
  // ... your other imports
</script>

<!-- Your existing layout content -->
<main>
  <slot />
</main>

<!-- Add the snackbar container at the end -->
<SnackbarContainer />

<style>
  /* Your styles */
</style>
```

This container manages all notification displays. Place it once in your root layout to work across your entire app.

### Step 2: Import Notification Functions

In any component, import what you need:

```svelte
<script>
  // Basic snackbar notifications
  import { snackbar } from '$lib/snackbar';
  
  // Calendar-specific functions
  import {
    notifyEventCreated,
    notifyEventReminder,
    notifyEventCancelled,
    notifyEventUpdated,
    getUpcomingEvents,
    checkAndNotifyUpcomingEvents,
    type CalendarEvent
  } from '$lib/snackbar';
</script>
```

## Common Use Cases

### 1. Notify When an Event is Created

When a user creates a new calendar event:

```svelte
<script>
  import { notifyEventCreated } from '$lib/snackbar';

  async function handleCreateEvent(title: string, date: Date) {
    // Create the event in your calendar
    const event = await calendarAPI.createEvent({
      title,
      date,
      type: 'meeting'
    });

    // Notify the user
    notifyEventCreated(event, {
      showDesktopNotification: true,
      snackbarPosition: 'bottom-right'
    });
  }
</script>
```

### 2. Notify When Events Come Within 1 Hour

Set up automatic reminders for upcoming events:

```svelte
<script>
  import {
    checkAndNotifyUpcomingEvents,
    getUpcomingEvents,
    type CalendarEvent
  } from '$lib/snackbar';
  import { onMount } from 'svelte';

  let events: CalendarEvent[] = [];
  const notifiedEventIds = new Set<string>();

  onMount(() => {
    // Check for upcoming events every minute
    const interval = setInterval(() => {
      checkAndNotifyUpcomingEvents(
        events,
        notifiedEventIds,
        60,  // Check events within 60 minutes
        15   // Notify when 15 minutes away
      );
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  });

  // Also show upcoming events in UI
  $: upcoming = getUpcomingEvents(events, 60); // Events within 1 hour
</script>

<div>
  {#if upcoming.length > 0}
    <div class="upcoming-alert">
      <h3>⚠️ Events Coming Up</h3>
      <ul>
        {#each upcoming as event}
          <li>{event.title} at {event.date.toLocaleTimeString()}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
```

### 3. Notify on Event Update

When a user modifies an event:

```svelte
<script>
  import { notifyEventUpdated } from '$lib/snackbar';

  async function handleUpdateEvent(event: CalendarEvent) {
    await calendarAPI.updateEvent(event);
    
    notifyEventUpdated(event, {
      showDesktopNotification: true,
      snackbarPosition: 'bottom-right'
    });
  }
</script>
```

### 4. Notify on Event Cancellation

When a user deletes an event:

```svelte
<script>
  import { notifyEventCancelled } from '$lib/snackbar';

  async function handleDeleteEvent(event: CalendarEvent) {
    await calendarAPI.deleteEvent(event.id);
    
    notifyEventCancelled(event, {
      showDesktopNotification: true,
      snackbarPosition: 'top-right'
    });
  }
</script>
```

### 5. Basic In-App Notifications

For non-calendar events:

```svelte
<script>
  import { snackbar } from '$lib/snackbar';

  function handleAction() {
    // Success notification
    snackbar.success('Changes saved!');
    
    // Error notification
    snackbar.error('Failed to save. Please try again.');
    
    // Warning notification
    snackbar.warning('This will delete all events permanently.');
    
    // Info notification
    snackbar.info('New calendar shared with you.');
  }
</script>
```

## Calendar Event Interface

The `CalendarEvent` type matches this structure:

```typescript
interface CalendarEvent {
  title: string;              // Event name
  date: Date;                 // Event date/time
  type?: 'meeting' | 'call' | 'review' | 'demo' | 'reminder';
  description?: string;       // Optional description
}
```

## Enabling Desktop Notifications

Users must grant permission for desktop notifications:

```svelte
<script>
  import { setupMobileNotifications } from '$lib/snackbar';

  async function enableNotifications() {
    const { permission, registration } = await setupMobileNotifications();
    
    if (permission === 'granted') {
      console.log('✅ Notifications enabled!');
      console.log('Service Worker:', registration);
    } else if (permission === 'denied') {
      console.log('❌ User denied notification permission');
    } else {
      console.log('⏳ Awaiting user response...');
    }
  }
</script>

<button on:click={enableNotifications}>
  Enable Desktop Notifications
</button>
```

## Customization

### Custom Notification Positions

Available positions:
- `'top-left'`
- `'top-center'`
- `'top-right'`
- `'bottom-left'`
- `'bottom-center'`
- `'bottom-right'`

```svelte
<script>
  import { snackbar } from '$lib/snackbar';

  snackbar.success('Event created!', {
    position: 'top-center',
    duration: 3000
  });
</script>
```

### Custom Styling

The library uses CSS classes that you can override. Edit `src/lib/snackbar/snackbar.css`:

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

## Complete Example Component

Here's a complete calendar event management component:

```svelte
<script>
  import { onMount } from 'svelte';
  import {
    notifyEventCreated,
    notifyEventReminder,
    notifyEventCancelled,
    checkAndNotifyUpcomingEvents,
    getUpcomingEvents,
    type CalendarEvent
  } from '$lib/snackbar';

  let events: CalendarEvent[] = [];
  let eventTitle = '';
  let eventDateTime = '';
  const notifiedIds = new Set<string>();

  function createEvent() {
    if (!eventTitle || !eventDateTime) return;

    const event: CalendarEvent = {
      title: eventTitle,
      date: new Date(eventDateTime),
      type: 'meeting'
    };

    events = [...events, event];
    notifyEventCreated(event);
    
    eventTitle = '';
    eventDateTime = '';
  }

  function deleteEvent(event: CalendarEvent) {
    events = events.filter(e => e !== event);
    notifyEventCancelled(event);
    notifiedIds.delete(`${event.title}-${event.date.getTime()}`);
  }

  onMount(() => {
    const interval = setInterval(() => {
      checkAndNotifyUpcomingEvents(events, notifiedIds, 60, 15);
    }, 60000);

    return () => clearInterval(interval);
  });

  $: upcomingEvents = getUpcomingEvents(events, 60);
</script>

<div class="calendar">
  <div class="create-form">
    <input bind:value={eventTitle} placeholder="Event title" />
    <input bind:value={eventDateTime} type="datetime-local" />
    <button on:click={createEvent}>Create Event</button>
  </div>

  {#if upcomingEvents.length > 0}
    <div class="upcoming-alert">
      <h3>⏰ Events in next hour:</h3>
      <ul>
        {#each upcomingEvents as event}
          <li>{event.title} at {event.date.toLocaleTimeString()}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="events-list">
    {#each events as event}
      <div class="event-item">
        <span>{event.title} - {event.date.toLocaleString()}</span>
        <button on:click={() => deleteEvent(event)}>Delete</button>
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .create-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }

  .upcoming-alert {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 20px;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .event-item button {
    padding: 4px 12px;
    font-size: 12px;
  }
</style>
```

## Troubleshooting

### Notifications not showing
1. Ensure `SnackbarContainer` is in your root layout
2. Check that you've imported the notification functions correctly
3. Verify CSS is not being overridden by other styles

### Desktop notifications not working
1. User must grant permission (check browser permissions)
2. Ensure `sw.js` is in your `static/` folder
3. Only works on HTTPS (or localhost for development)

### Events not reminding at 1 hour
1. Ensure the `checkAndNotifyUpcomingEvents` interval is set up in `onMount`
2. Check browser console for errors
3. Verify event dates are correct `new Date()` objects

## Next Steps

- Read [LIBRARY_USAGE.md](./LIBRARY_USAGE.md) for complete API documentation
- Check [demo-standalone](./demo-standalone) for a working example app
- Customize styling to match your app's design
- Deploy with confidence!

## Support

For issues or questions, refer to:
- [LIBRARY_USAGE.md](./LIBRARY_USAGE.md) - Complete API reference
- [demo-standalone/src/routes/calendar](./demo-standalone/src/routes/calendar) - Working example
- Browser DevTools console for error messages
