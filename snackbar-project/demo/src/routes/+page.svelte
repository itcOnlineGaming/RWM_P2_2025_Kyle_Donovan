<script>
  import { snackbar } from '@srl/snackbar';
  import { onMount } from 'svelte';
  import './page.css';

  let customMessage = 'Meeting scheduled for 3:00 PM';
  let customDuration = 3000;
  let selectedType = 'info';
  let selectedPosition = 'bottom-left';
  let notificationPermission = 'default';
  
  let desktopTitle = 'Meeting Reminder';
  let desktopBody = 'Team standup in 15 minutes';

  onMount(() => {
    if ('Notification' in window) {
      notificationPermission = Notification.permission;
    }
  });

  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      notificationPermission = permission;
      
      if (permission === 'granted') {
        snackbar.success('Desktop notifications enabled!');
      } else if (permission === 'denied') {
        snackbar.error('Desktop notifications blocked');
      }
    } else {
      snackbar.error('Browser does not support notifications');
    }
  }

  function sendDesktopNotification(title, body, icon) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: icon || '📅',
        badge: '📅',
        tag: 'calendar-notification',
        requireInteraction: false
      });
      snackbar.info('Desktop notification sent!');
    } else {
      snackbar.warning('Please enable desktop notifications first');
    }
  }

  function sendMeetingNotification() {
    sendDesktopNotification(
      'Meeting Reminder',
      'Team standup starts in 5 minutes',
      '⏰'
    );
  }

  function sendEventNotification() {
    sendDesktopNotification(
      'New Event',
      'Dr. Smith added you to "Project Review" at 3:00 PM',
      '📅'
    );
  }

  function sendUrgentNotification() {
    sendDesktopNotification(
      'Urgent: Meeting Starting Now',
      'Join the call with client - Meeting ID: 123-456-789',
      '🔴'
    );
  }

  function sendCustomDesktopNotification() {
    sendDesktopNotification(desktopTitle, desktopBody, '📅');
  }

  function sendBothNotifications() {
    sendDesktopNotification(
      'Meeting Scheduled',
      'Weekly team sync added to your calendar for tomorrow at 10 AM',
      '📅'
    );
    
    snackbar.success('Meeting scheduled: Weekly team sync tomorrow at 10 AM');
  }

  function showMeetingScheduled() {
    snackbar.success('Meeting with Dr. Smith scheduled for 2:00 PM');
  }

  function showMeetingCancelled() {
    snackbar.error('Meeting cancelled: Client unavailable');
  }

  function showMeetingReminder() {
    snackbar.warning('Reminder: Team standup in 15 minutes');
  }

  function showEventUpdate() {
    snackbar.info('Calendar synced with 3 new events');
  }

  function showMultipleNotifications() {
    snackbar.info('You have 3 upcoming meetings today');
    setTimeout(() => snackbar.warning('Meeting with Sarah in 30 minutes'), 500);
    setTimeout(() => snackbar.success('Calendar reminder: Project deadline tomorrow'), 1000);
  }

  function showAllPositions() {
    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ];
    
    const messages = [
      'Meeting reminder (Top Left)',
      'Event scheduled (Top Center)',
      'Calendar synced (Top Right)',
      'New invitation (Bottom Left)',
      'Time change notification (Bottom Center)',
      'RSVP confirmed (Bottom Right)'
    ];
    
    positions.forEach((pos, idx) => {
      setTimeout(() => {
        snackbar.info(messages[idx], { position: pos, duration: 3000 });
      }, idx * 400);
    });
  }

  function showCustom() {
    snackbar.show(customMessage, {
      type: selectedType,
      duration: customDuration,
      position: selectedPosition
    });
  }
</script>

<svelte:head>
  <title>Notification Center - CalendarSync Pro</title>
</svelte:head>

<header class="page-header">
  <div>
    <h1 class="page-title">Notification Center</h1>
    <p class="page-description">Manage calendar events and system alerts</p>
  </div>
  <div class="header-actions">
    <button class="header-btn">
      <span>📊</span>
      Analytics
    </button>
    <button class="header-btn primary">
      <span>➕</span>
      New Event
    </button>
  </div>
</header>

<div class="content-grid">
  <!-- Desktop Notifications Card -->
  <div class="card featured-card">
    <div class="card-header">
      <div>
        <h2 class="card-title">
          <span class="title-icon">🖥️</span>
          Desktop Notifications
        </h2>
        <p class="card-subtitle">System-level alerts for your desktop</p>
      </div>
      {#if notificationPermission === 'granted'}
        <span class="status-badge success">Active</span>
      {:else if notificationPermission === 'denied'}
        <span class="status-badge error">Blocked</span>
      {:else}
        <span class="status-badge warning">Inactive</span>
      {/if}
    </div>

    <div class="card-body">
      {#if notificationPermission === 'default'}
        <div class="permission-box">
          <div class="permission-icon">🔐</div>
          <h3>Permission Required</h3>
          <p>Allow desktop notifications to receive alerts even when the app is in the background</p>
          <button class="btn btn-primary btn-lg" on:click={requestNotificationPermission}>
            <span>🔔</span>
            Enable Notifications
          </button>
        </div>
      {:else if notificationPermission === 'denied'}
        <div class="permission-box error">
          <div class="permission-icon">🚫</div>
          <h3>Notifications Blocked</h3>
          <p>Please enable notifications in your browser settings to receive desktop alerts</p>
        </div>
      {:else}
        <div class="notification-controls">
          <p class="permission-granted">✅ Desktop notifications enabled!</p>
          
          <div class="notification-grid">
            <button class="notification-card" on:click={sendMeetingNotification}>
              <div class="notification-icon info">⏰</div>
              <div class="notification-content">
                <div class="notification-title">Meeting Reminder</div>
                <div class="notification-desc">5 minute warning</div>
              </div>
            </button>

            <button class="notification-card" on:click={sendEventNotification}>
              <div class="notification-icon success">📅</div>
              <div class="notification-content">
                <div class="notification-title">New Event</div>
                <div class="notification-desc">Added to calendar</div>
              </div>
            </button>

            <button class="notification-card" on:click={sendUrgentNotification}>
              <div class="notification-icon error">🔴</div>
              <div class="notification-content">
                <div class="notification-title">Urgent Alert</div>
                <div class="notification-desc">Immediate action</div>
              </div>
            </button>

            <button class="notification-card" on:click={sendBothNotifications}>
              <div class="notification-icon warning">📲</div>
              <div class="notification-content">
                <div class="notification-title">Dual Mode</div>
                <div class="notification-desc">Desktop + In-app</div>
              </div>
            </button>
          </div>

          <div class="custom-notification-form">
            <h3 class="form-title">Custom Desktop Alert</h3>
            <div class="form-grid">
              <div class="form-field">
                <label for="desktop-title">Title</label>
                <input 
                  id="desktop-title"
                  type="text" 
                  bind:value={desktopTitle}
                  placeholder="Meeting Reminder"
                />
              </div>
              <div class="form-field full-width">
                <label for="desktop-body">Message</label>
                <textarea 
                  id="desktop-body"
                  bind:value={desktopBody}
                  placeholder="Your meeting starts in 15 minutes"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button class="btn btn-primary" on:click={sendCustomDesktopNotification}>
              <span>📤</span>
              Send Desktop Notification
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- In-App Notifications Card -->
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">
          <span class="title-icon">📱</span>
          In-App Notifications
        </h2>
        <p class="card-subtitle">Snackbar alerts within the application</p>
      </div>
    </div>

    <div class="card-body">
      <div class="notification-grid">
        <button class="notification-card" on:click={showMeetingScheduled}>
          <div class="notification-icon success">✓</div>
          <div class="notification-content">
            <div class="notification-title">Meeting Scheduled</div>
            <div class="notification-desc">Confirmation alert</div>
          </div>
        </button>

        <button class="notification-card" on:click={showMeetingCancelled}>
          <div class="notification-icon error">✗</div>
          <div class="notification-content">
            <div class="notification-title">Meeting Cancelled</div>
            <div class="notification-desc">Cancellation notice</div>
          </div>
        </button>

        <button class="notification-card" on:click={showMeetingReminder}>
          <div class="notification-icon warning">⚠</div>
          <div class="notification-content">
            <div class="notification-title">Meeting Reminder</div>
            <div class="notification-desc">Upcoming event</div>
          </div>
        </button>

        <button class="notification-card" on:click={showEventUpdate}>
          <div class="notification-icon info">ℹ</div>
          <div class="notification-content">
            <div class="notification-title">Calendar Synced</div>
            <div class="notification-desc">Update notification</div>
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- Advanced Features Card -->
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">
          <span class="title-icon">⚡</span>
          Advanced Features
        </h2>
        <p class="card-subtitle">Test notification behaviors</p>
      </div>
    </div>

    <div class="card-body">
      <div class="feature-list">
        <button class="feature-item" on:click={showMultipleNotifications}>
          <div class="feature-icon">📊</div>
          <div class="feature-content">
            <div class="feature-title">Multiple Notifications</div>
            <div class="feature-desc">Stack 3 sequential alerts</div>
          </div>
          <div class="feature-arrow">→</div>
        </button>

        <button class="feature-item" on:click={showAllPositions}>
          <div class="feature-icon">📍</div>
          <div class="feature-content">
            <div class="feature-title">Position Test</div>
            <div class="feature-desc">Display in all 6 positions</div>
          </div>
          <div class="feature-arrow">→</div>
        </button>

        <button class="feature-item" on:click={() => snackbar.show('All-day event created', { duration: 0 })}>
          <div class="feature-icon">🔔</div>
          <div class="feature-content">
            <div class="feature-title">Persistent Alert</div>
            <div class="feature-desc">Manual dismiss only</div>
          </div>
          <div class="feature-arrow">→</div>
        </button>
      </div>
    </div>
  </div>

  <!-- Custom Configuration Card -->
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">
          <span class="title-icon">🎨</span>
          Custom Configuration
        </h2>
        <p class="card-subtitle">Build your own notification</p>
      </div>
    </div>

    <div class="card-body">
      <div class="form-grid">
        <div class="form-field full-width">
          <label for="message">Message Content</label>
          <input 
            id="message"
            type="text" 
            bind:value={customMessage}
            placeholder="Meeting with John at 3 PM"
          />
        </div>

        <div class="form-field">
          <label for="type">Type</label>
          <select id="type" bind:value={selectedType}>
            <option value="success">✓ Success</option>
            <option value="error">✗ Error</option>
            <option value="warning">⚠ Warning</option>
            <option value="info">ℹ Info</option>
          </select>
        </div>

        <div class="form-field">
          <label for="position">Position</label>
          <select id="position" bind:value={selectedPosition}>
            <option value="top-left">Top Left</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>

        <div class="form-field">
          <label for="duration">Duration (ms)</label>
          <input 
            id="duration"
            type="number" 
            bind:value={customDuration}
            min="0"
            step="1000"
          />
        </div>
      </div>

      <button class="btn btn-primary" on:click={showCustom}>
        <span>🚀</span>
        Send Notification
      </button>
    </div>
  </div>
</div>