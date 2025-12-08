<script>
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { snackbar } from '$lib/snackbar/index';
  import { 
    notifyEventCreated, 
    notifyEventCancelled, 
    notifyEventReminder
  } from '$lib/snackbar/index';
  import { 
    setupMobileNotifications 
  } from '$lib/snackbar/index';
  import {
    subscribeToPushNotifications,
    isPushSubscribed,
    triggerPushNotification
  } from '$lib/snackbar/index';
  import { onMount } from 'svelte';
  import './calendar.css';

  // Get current date
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  // Push notification state
  let pushEnabled = false;

  // Modal state
  let showModal = false;
  let isEditMode = false;
  let editingEventId = null;
  let newEventTitle = '';
  let newEventDate = today.toISOString().split('T')[0];
  let newEventTime = '14:00';
  let newEventType = 'meeting';

  // Events array - will be loaded from localStorage
  let events = [];

  // Generate unique ID for events
  function generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Load events from localStorage
  function loadEvents() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('calendar_events');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          events = parsed.map(e => ({
            ...e,
            date: new Date(e.date)
          }));
          console.log('📅 Loaded', events.length, 'events from storage');
        } catch (e) {
          console.error('Failed to load events:', e);
          events = [];
        }
      }
    }
  }

  // Save events to localStorage
  function saveEvents() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendar_events', JSON.stringify(events));
      console.log('💾 Saved', events.length, 'events to storage');
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $: calendar = generateCalendar(currentYear, currentMonth, events);
  $: monthYear = `${monthNames[currentMonth]} ${currentYear}`;

  onMount(async () => {
    // Load saved events first
    loadEvents();
    
    // Setup mobile notifications with service worker
    const { permission, registration } = await setupMobileNotifications();
    console.log('Notification permission:', permission);
    console.log('Service Worker registration:', registration);
    
    if (permission === 'granted' && registration) {
      console.log('✅ Mobile notifications ready!');
    }
    
    // Check if push notifications are already enabled
    pushEnabled = await isPushSubscribed();
    if (pushEnabled) {
      console.log('✅ Push notifications already subscribed');
    }
  });
  
  // Enable push notifications
  async function enablePushNotifications() {
    const success = await subscribeToPushNotifications();
    if (success) {
      pushEnabled = true;
      snackbar.success('Push notifications enabled! You\'ll receive reminders even when the app is closed.', {
        duration: 5000,
        position: 'top-center'
      });
    } else {
      snackbar.error('Failed to enable push notifications', {
        duration: 4000
      });
    }
  }

  function generateCalendar(year, month, eventsList) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false, events: [] });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = eventsList.filter(e => 
        e.date.getDate() === day && 
        e.date.getMonth() === month && 
        e.date.getFullYear() === year
      );
      
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        events: dayEvents
      });
    }
    
    return days;
  }

  function previousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }

  function goToToday() {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    snackbar.info('Jumped to today');
  }

  function openNewEventModal(day) {
    isEditMode = false;
    editingEventId = null;
    showModal = true;
    if (day) {
      const date = new Date(currentYear, currentMonth, day);
      newEventDate = date.toISOString().split('T')[0];
    } else {
      newEventDate = today.toISOString().split('T')[0];
    }
    newEventTitle = '';
    newEventTime = '14:00';
    newEventType = 'meeting';
  }

  function openEditEventModal(event) {
    isEditMode = true;
    editingEventId = event.id;
    showModal = true;
    newEventTitle = event.title;
    newEventDate = event.date.toISOString().split('T')[0];
    const hours = event.date.getHours().toString().padStart(2, '0');
    const minutes = event.date.getMinutes().toString().padStart(2, '0');
    newEventTime = `${hours}:${minutes}`;
    newEventType = event.type;
  }

  function closeModal() {
    showModal = false;
  }

  function createEvent() {
    if (!newEventTitle.trim()) {
      snackbar.error('Please enter an event title');
      return;
    }

    const [hours, minutes] = newEventTime.split(':').map(Number);
    const eventDate = new Date(newEventDate);
    eventDate.setHours(hours, minutes);

    if (isEditMode && editingEventId) {
      // Update existing event
      events = events.map(e => {
        if (e.id === editingEventId) {
          return {
            ...e,
            date: eventDate,
            title: newEventTitle,
            type: newEventType,
            description: `${newEventType.charAt(0).toUpperCase() + newEventType.slice(1)} scheduled`
          };
        }
        return e;
      });
      
      saveEvents();
      snackbar.success(`Event "${newEventTitle}" updated successfully`, {
        duration: 3000,
        position: 'bottom-right'
      });
    } else {
      // Create new event
      const newEvent = {
        id: generateEventId(),
        date: eventDate,
        title: newEventTitle,
        type: newEventType,
        description: `${newEventType.charAt(0).toUpperCase() + newEventType.slice(1)} scheduled`
      };

      events = [...events, newEvent];
      saveEvents();
      
      // Use the calendar integration helper - sends both in-app and mobile/desktop notification
      notifyEventCreated(newEvent, {
        showDesktopNotification: true,
        snackbarPosition: 'bottom-right',
        snackbarDuration: 4000
      });
    }
    
    closeModal();
  }

  function addEvent(day) {
    openNewEventModal(day);
  }

  function handleEventClick(event) {
    // Open edit modal when clicking on an event
    openEditEventModal(event);
  }

  async function sendReminder(event) {
    // Use the calendar integration helper - includes vibration on mobile
    notifyEventReminder(event, 15, {
      showDesktopNotification: true,
      snackbarPosition: 'top-right'
    });
    
    // Also send push notification if enabled (works when app is closed!)
    if (pushEnabled) {
      await triggerPushNotification(
        `📅 Reminder: ${event.title}`,
        `Your event starts in 15 minutes`,
        {
          icon: '📅',
          tag: `reminder-${event.date.getTime()}`,
          requireInteraction: true
        }
      );
    }
  }

  function deleteEvent(eventToDelete) {
    const eventTitle = eventToDelete.title;
    events = events.filter(e => e.id !== eventToDelete.id);
    saveEvents();
    
    // Use the calendar integration helper - includes vibration pattern on mobile
    notifyEventCancelled(eventToDelete, {
      showDesktopNotification: true,
      snackbarPosition: 'top-right',
      snackbarDuration: 4000
    });
    
    // Close modal if we're deleting the event being edited
    if (showModal && isEditMode && editingEventId === eventToDelete.id) {
      closeModal();
    }
  }

  let selectedDay = null;

  function selectDay(day) {
    if (day.isCurrentMonth) {
      selectedDay = day;
    }
  }
</script>

<svelte:head>
  <title>Calendar - CalendarSync Pro</title>
</svelte:head>

<div class="calendar-page">
  <div class="calendar-header">
    <div>
      <h1 class="page-title">Calendar</h1>
      <p class="page-subtitle">Manage your schedule and events</p>
      <div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 14px;">
        <strong>Notification Status:</strong> 
        {#if typeof window !== 'undefined'}
          {#if !('Notification' in window)}
            ❌ Not supported in this browser
          {:else if Notification.permission === 'granted'}
            ✅ Enabled (notifications will appear)
          {:else if Notification.permission === 'denied'}
            ❌ Blocked (enable in browser settings)
          {:else}
            ⚠️ Not requested yet
          {/if}
        {/if}
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" on:click={goToToday}>
        <span>📅</span>
        Today
      </button>
      <button class="btn btn-primary" on:click={() => openNewEventModal()}>
        <span>➕</span>
        New Event
      </button>
    </div>
  </div>

  <div class="calendar-container">
    <div class="calendar-main">
      <div class="calendar-controls">
        <button class="control-btn" on:click={previousMonth}>
          <span>←</span>
        </button>
        <h2 class="month-year">{monthYear}</h2>
        <button class="control-btn" on:click={nextMonth}>
          <span>→</span>
        </button>
      </div>

      <div class="calendar-grid">
        {#each dayNames as dayName}
          <div class="day-name">{dayName}</div>
        {/each}

        {#each calendar as day}
          <div 
            class="calendar-day" 
            class:empty={!day.isCurrentMonth}
            class:today={day.isToday}
            class:has-events={day.events.length > 0}
            class:selected={selectedDay === day}
            role="button"
            tabindex="0"
            on:click={() => selectDay(day)}
            on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && selectDay(day)}
          >
            {#if day.isCurrentMonth}
              <div class="day-number">{day.day}</div>
              {#if day.events.length > 0}
                <div class="day-events-inline">
                  {#each day.events.slice(0, 2) as event}
                    <div
                      class="event-tag {event.type}"
                      role="button"
                      tabindex="0"
                      on:click|stopPropagation={() => handleEventClick(event)}
                      on:keydown|stopPropagation={(e) => (e.key === 'Enter' || e.key === ' ') && handleEventClick(event)}
                      title="{event.title} - Click to edit"
                    >
                      <span class="event-tag-icon">
                        {#if event.type === 'meeting'}📝
                        {:else if event.type === 'call'}📞
                        {:else if event.type === 'review'}👁️
                        {:else}🎯
                        {/if}
                      </span>
                      <span class="event-tag-title">{event.title}</span>
                    </div>
                  {/each}
                  {#if day.events.length > 2}
                    <div class="event-more-tag">+{day.events.length - 2} more</div>
                  {/if}
                </div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="calendar-sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">
          {#if selectedDay}
            {monthNames[currentMonth]} {selectedDay.day}
          {:else}
            Upcoming Events
          {/if}
        </h3>

        {#if selectedDay && selectedDay.events.length > 0}
          <div class="event-list">
            {#each selectedDay.events as event}
              <div class="event-card">
                <div class="event-header">
                  <div class="event-icon {event.type}">
                    {#if event.type === 'meeting'}📝
                    {:else if event.type === 'call'}📞
                    {:else if event.type === 'review'}👁️
                    {:else}🎯
                    {/if}
                  </div>
                  <div class="event-info">
                    <div class="event-title">{event.title}</div>
                    <div class="event-time">
                      {event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
                <div class="event-actions">
                  <button class="event-btn" on:click={() => handleEventClick(event)} title="Edit event">
                    <span>✏️</span>
                  </button>
                  <button class="event-btn" on:click={() => sendReminder(event)} title="Send reminder (vibrates on mobile)">
                    <span>🔔</span>
                  </button>
                  <button class="event-btn danger" on:click={() => deleteEvent(event)} title="Delete event">
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {:else if selectedDay}
          <p class="no-events">No events scheduled</p>
          <button class="btn btn-primary btn-block" on:click={() => addEvent(selectedDay.day)}>
            <span>➕</span>
            Add Event
          </button>
        {:else}
          <div class="event-list">
            {#each events.slice(0, 5) as event}
              <div class="event-card small">
                <div class="event-header">
                  <div class="event-icon {event.type}">
                    {#if event.type === 'meeting'}📝
                    {:else if event.type === 'call'}📞
                    {:else if event.type === 'review'}👁️
                    {:else}🎯
                    {/if}
                  </div>
                  <div class="event-info">
                    <div class="event-title">{event.title}</div>
                    <div class="event-time">
                      {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">Quick Actions</h3>
        <div class="quick-actions">
          <button class="quick-action-btn" on:click={() => snackbar.success('Calendar synced successfully')}>
            <span>🔄</span>
            Sync Calendar
          </button>
          <button class="quick-action-btn" on:click={() => snackbar.info('Showing today\'s events', { position: 'top-center' })}>
            <span>📊</span>
            View Today
          </button>
          <button class="quick-action-btn" on:click={() => snackbar.warning('You have 3 meetings this week')}>
            <span>📈</span>
            Weekly View
          </button>
          <button 
            class="quick-action-btn {pushEnabled ? 'push-enabled' : ''}" 
            on:click={enablePushNotifications}
            disabled={pushEnabled}
          >
            <span>{pushEnabled ? '✅' : '🔔'}</span>
            {pushEnabled ? 'Push Enabled' : 'Enable Push'}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Event Modal (Create/Edit) -->
{#if showModal}
  <div
    class="modal-overlay"
    role="button"
    tabindex="0"
    aria-label="Close modal"
    on:click|self={closeModal}
    on:keydown={(e) => e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ') && closeModal()}
  >
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 class="modal-title">{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
        <button class="modal-close" on:click={closeModal}>✕</button>
      </div>

      <div class="modal-body">
        <div class="form-field">
          <label for="event-title">Event Title</label>
          <input 
            id="event-title"
            type="text" 
            bind:value={newEventTitle}
            placeholder="e.g., Team Meeting"
          />
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="event-date">Date</label>
            <input 
              id="event-date"
              type="date" 
              bind:value={newEventDate}
            />
          </div>

          <div class="form-field">
            <label for="event-time">Time</label>
            <input 
              id="event-time"
              type="time" 
              bind:value={newEventTime}
            />
          </div>
        </div>

        <div class="form-field">
          <label for="event-type">Event Type</label>
          <select id="event-type" bind:value={newEventType}>
            <option value="meeting">📝 Meeting</option>
            <option value="call">📞 Call</option>
            <option value="review">👁️ Review</option>
            <option value="demo">🎯 Demo</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        {#if isEditMode}
          <button class="btn btn-danger" on:click={() => {
            const eventToDelete = events.find(e => e.id === editingEventId);
            if (eventToDelete) deleteEvent(eventToDelete);
          }}>
            <span>🗑️</span>
            Delete
          </button>
        {/if}
        <button class="btn btn-secondary" on:click={closeModal}>
          Cancel
        </button>
        <button class="btn btn-primary" on:click={createEvent}>
          <span>{isEditMode ? '💾' : '➕'}</span>
          {isEditMode ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </div>
  </div>
{/if}