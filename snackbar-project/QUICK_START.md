# Quick Reference - Snackbar Notification Library

## Installation (30 seconds)

```bash
# Copy library to your project
bash install-snackbar.sh /path/to/your/calendar/app
```

## Setup (2 minutes)

Add to `src/routes/+layout.svelte`:
```svelte
<script>
  import { SnackbarContainer } from '$lib/snackbar';
</script>

<slot />
<SnackbarContainer />
```

## Use in Your Components (5 seconds)

### Event Created
```svelte
<script>
  import { notifyEventCreated } from '$lib/snackbar';
  
  const event = { title: 'Meeting', date: new Date(), type: 'meeting' };
  notifyEventCreated(event);
</script>
```

### Event Reminder (within 1 hour)
```svelte
<script>
  import { checkAndNotifyUpcomingEvents } from '$lib/snackbar';
  import { onMount } from 'svelte';
  
  let events = [];
  const notified = new Set();
  
  onMount(() => {
    setInterval(() => {
      checkAndNotifyUpcomingEvents(events, notified, 60, 15);
    }, 60000);
  });
</script>
```

### Basic Notifications
```svelte
<script>
  import { snackbar } from '$lib/snackbar';
  
  snackbar.success('Done!');
  snackbar.error('Oops!');
  snackbar.warning('Be careful!');
  snackbar.info('FYI...');
</script>
```

### Event Cancelled
```svelte
<script>
  import { notifyEventCancelled } from '$lib/snackbar';
  
  notifyEventCancelled(event);
</script>
```

### Event Updated
```svelte
<script>
  import { notifyEventUpdated } from '$lib/snackbar';
  
  notifyEventUpdated(event);
</script>
```

## Key Functions

| Function | Use Case |
|----------|----------|
| `notifyEventCreated(event)` | User creates a calendar event |
| `notifyEventReminder(event, mins)` | Send reminder X minutes before |
| `notifyEventCancelled(event)` | Event is deleted |
| `notifyEventUpdated(event)` | Event details changed |
| `checkAndNotifyUpcomingEvents(events, notifiedIds, windowMins, notifyMins)` | Auto-check for upcoming events |
| `getUpcomingEvents(events, mins)` | Get events within X minutes |
| `snackbar.success/error/warning/info(msg)` | Show in-app notification |
| `requestNotificationPermission()` | Ask user for desktop notifications |

## CalendarEvent Type

```typescript
{
  title: string;              // "Team Meeting"
  date: Date;                 // new Date('2025-12-01T14:00')
  type?: 'meeting' | 'call' | 'review' | 'demo' | 'reminder';
  description?: string;       // "Weekly sync"
}
```

## Real-World Example: Calendar App

```svelte
<script>
  import { onMount } from 'svelte';
  import {
    notifyEventCreated,
    notifyEventCancelled,
    checkAndNotifyUpcomingEvents,
    getUpcomingEvents,
    snackbar,
    type CalendarEvent
  } from '$lib/snackbar';

  let events: CalendarEvent[] = [];
  let title = '';
  let dateTime = '';
  const notified = new Set();

  function createEvent() {
    const event = {
      title,
      date: new Date(dateTime),
      type: 'meeting'
    };
    events = [...events, event];
    notifyEventCreated(event);
    title = '';
    dateTime = '';
  }

  function deleteEvent(event) {
    events = events.filter(e => e !== event);
    notifyEventCancelled(event);
  }

  onMount(() => {
    const check = setInterval(() => {
      checkAndNotifyUpcomingEvents(events, notified, 60, 15);
    }, 60000);
    return () => clearInterval(check);
  });

  $: upcoming = getUpcomingEvents(events, 60);
</script>

<input bind:value={title} placeholder="Title" />
<input bind:value={dateTime} type="datetime-local" />
<button on:click={createEvent}>Create</button>

{#if upcoming.length > 0}
  <div class="alert">Events in next hour:
    <ul>
      {#each upcoming as event}
        <li>{event.title}</li>
      {/each}
    </ul>
  </div>
{/if}

<div>
  {#each events as event}
    <div>
      {event.title}
      <button on:click={() => deleteEvent(event)}>Delete</button>
    </div>
  {/each}
</div>
```

## Documentation Files

- **README.md** - Overview and features
- **LIBRARY_USAGE.md** - Complete API documentation with examples
- **INTEGRATION_GUIDE.md** - Step-by-step integration instructions
- **install-snackbar.sh** - Installation script
- **demo-standalone/** - Full working example app

## Browser Support

✅ Chrome, Firefox, Safari, Edge (desktop & mobile)
⚠️ iOS limited support (16.4+)

## Need Help?

1. Check INTEGRATION_GUIDE.md for setup steps
2. Read LIBRARY_USAGE.md for detailed API docs
3. Look at demo-standalone/ for working examples
4. Check browser console for error messages
