<script lang="ts">
  import { snackbar } from '@srl/snackbar';
  import './calendar.css';

  // Get current date
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Sample events
  let events = [
    { date: new Date(2024, 10, 22, 10, 0), title: 'Team Standup', type: 'meeting' },
    { date: new Date(2024, 10, 22, 14, 0), title: 'Project Review', type: 'review' },
    { date: new Date(2024, 10, 23, 9, 0), title: 'Client Call', type: 'call' },
    { date: new Date(2024, 10, 25, 15, 30), title: 'Code Review', type: 'review' },
    { date: new Date(2024, 10, 26, 11, 0), title: 'Sprint Planning', type: 'meeting' },
    { date: new Date(2024, 10, 27, 13, 0), title: 'Demo Day', type: 'demo' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $: calendar = generateCalendar(currentYear, currentMonth);
  $: monthYear = `${monthNames[currentMonth]} ${currentYear}`;

  function generateCalendar(year: number, month: number) {
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
      const dayEvents = events.filter(e => 
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

  function addEvent(day: number) {
    const date = new Date(currentYear, currentMonth, day, 14, 0);
    const newEvent = {
      date,
      title: 'New Meeting',
      type: 'meeting'
    };
    events = [...events, newEvent];
    snackbar.success(`Event added for ${monthNames[currentMonth]} ${day}`);
  }

  function handleEventClick(event: any) {
    const timeStr = event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    snackbar.info(`${event.title} - ${dateStr} at ${timeStr}`, {
      duration: 5000,
      position: 'top-right'
    });
  }

  function sendReminder(event: any) {
    const timeStr = event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    snackbar.warning(`Reminder: ${event.title} at ${timeStr}`, {
      duration: 6000,
      position: 'bottom-right'
    });

    if (Notification.permission === 'granted') {
      new Notification('Meeting Reminder', {
        body: `${event.title} starts at ${timeStr}`,
        icon: '📅'
      });
    }
  }

  function deleteEvent(eventToDelete: any) {
    events = events.filter(e => e !== eventToDelete);
    snackbar.error('Event cancelled');
  }

  let selectedDay: any = null;

  function selectDay(day: any) {
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
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" on:click={goToToday}>
        <span>📅</span>
        Today
      </button>
      <button class="btn btn-primary" on:click={() => addEvent(today.getDate())}>
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
            on:click={() => selectDay(day)}
          >
            {#if day.isCurrentMonth}
              <div class="day-number">{day.day}</div>
              {#if day.events.length > 0}
                <div class="event-dots">
                  {#each day.events.slice(0, 3) as event}
                    <div class="event-dot {event.type}" title={event.title}></div>
                  {/each}
                  {#if day.events.length > 3}
                    <div class="event-more">+{day.events.length - 3}</div>
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
                  <button class="event-btn" on:click={() => handleEventClick(event)}>
                    <span>ℹ️</span>
                  </button>
                  <button class="event-btn" on:click={() => sendReminder(event)}>
                    <span>🔔</span>
                  </button>
                  <button class="event-btn danger" on:click={() => deleteEvent(event)}>
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
        </div>
      </div>
    </div>
  </div>
</div>