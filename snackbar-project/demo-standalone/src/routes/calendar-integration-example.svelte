<script>
  /**
   * CALENDAR APP INTEGRATION EXAMPLE
   * 
   * This example shows how to integrate the snackbar notification library
   * into a calendar application to notify when:
   * 1. An event is created
   * 2. An event comes within 1 hour of the current time
   */

  import { onMount } from 'svelte';
  import {
    notifyEventCreated,
    notifyEventCancelled,
    notifyEventReminder,
    checkAndNotifyUpcomingEvents,
    getUpcomingEvents,
    type CalendarEvent
  } from '$lib/snackbar';

  let events: CalendarEvent[] = [];
  let eventTitle = '';
  let eventDateTime = '';
  const notifiedEventIds = new Set<string>();

  /**
   * Create a new event and notify
   */
  function createEvent() {
    if (!eventTitle || !eventDateTime) return;

    const newEvent: CalendarEvent = {
      title: eventTitle,
      date: new Date(eventDateTime),
      type: 'meeting',
      description: 'Calendar event'
    };

    events = [...events, newEvent];

    // Notify that event was created
    notifyEventCreated(newEvent, {
      showDesktopNotification: true,
      snackbarPosition: 'bottom-right',
      snackbarDuration: 4000
    });

    // Clear form
    eventTitle = '';
    eventDateTime = '';
  }

  /**
   * Cancel an event
   */
  function cancelEvent(event: CalendarEvent) {
    events = events.filter(e => e !== event);

    notifyEventCancelled(event, {
      showDesktopNotification: true,
      snackbarPosition: 'top-right'
    });

    // Remove from notified set
    const eventId = `${event.title}-${event.date.getTime()}`;
    notifiedEventIds.delete(eventId);
  }

  /**
   * Check for upcoming events every minute
   * This will notify when events are coming up within 15 minutes
   */
  onMount(() => {
    // Initial check
    checkAndNotifyUpcomingEvents(events, notifiedEventIds, 60, 15);

    // Check every minute for upcoming events
    const checkInterval = setInterval(() => {
      checkAndNotifyUpcomingEvents(events, notifiedEventIds, 60, 15);
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  });

  /**
   * Reactive: Get events that are coming up within 1 hour
   */
  $: upcomingEvents = getUpcomingEvents(events, 60);
</script>

<div class="calendar-app">
  <h1>Calendar with Notifications</h1>

  <!-- Create Event Form -->
  <div class="create-event-section">
    <h2>Create Event</h2>
    <div class="form-group">
      <input
        type="text"
        placeholder="Event title"
        bind:value={eventTitle}
        on:keydown={(e) => e.key === 'Enter' && createEvent()}
      />
      <input
        type="datetime-local"
        bind:value={eventDateTime}
      />
      <button on:click={createEvent}>
        Create Event
      </button>
    </div>
  </div>

  <!-- Upcoming Events Alert -->
  {#if upcomingEvents.length > 0}
    <div class="upcoming-alert">
      <h3>⚠️ Events Coming Up (within 1 hour)</h3>
      <ul>
        {#each upcomingEvents as event}
          <li>
            <strong>{event.title}</strong> at {event.date.toLocaleTimeString()}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- All Events List -->
  <div class="events-section">
    <h2>Your Events</h2>
    {#if events.length === 0}
      <p class="no-events">No events scheduled yet</p>
    {:else}
      <div class="events-grid">
        {#each events as event (event.date.getTime())}
          <div class="event-card">
            <div class="event-header">
              <h3>{event.title}</h3>
              <button
                class="delete-btn"
                on:click={() => cancelEvent(event)}
                title="Cancel event"
              >
                ✕
              </button>
            </div>
            <p class="event-date">
              📅 {event.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {#if event.description}
              <p class="event-description">{event.description}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .calendar-app {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  h1 {
    color: #333;
    margin-bottom: 30px;
  }

  h2 {
    color: #555;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .create-event-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
  }

  .form-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    min-width: 200px;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  button:hover {
    background: #0056b3;
  }

  .upcoming-alert {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 30px;
  }

  .upcoming-alert h3 {
    margin: 0 0 10px 0;
    color: #856404;
  }

  .upcoming-alert ul {
    margin: 0;
    padding-left: 20px;
  }

  .upcoming-alert li {
    color: #856404;
    margin-bottom: 5px;
  }

  .events-section {
    margin-bottom: 40px;
  }

  .no-events {
    color: #999;
    font-style: italic;
    padding: 20px;
    text-align: center;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
  }

  .event-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.2s ease;
  }

  .event-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .event-header h3 {
    margin: 0;
    color: #333;
    flex: 1;
  }

  .delete-btn {
    padding: 5px 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: auto;
  }

  .delete-btn:hover {
    background: #c82333;
  }

  .event-date {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
  }

  .event-description {
    margin: 8px 0 0 0;
    color: #999;
    font-size: 13px;
    font-style: italic;
  }
</style>
