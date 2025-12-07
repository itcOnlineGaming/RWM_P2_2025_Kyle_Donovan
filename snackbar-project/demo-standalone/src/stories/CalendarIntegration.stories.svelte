<script>
  import {
    notifyEventCreated,
    notifyEventCancelled,
    notifyEventReminder
  } from '../lib/snackbar';

  let demoEvent = {
    title: 'Team Meeting',
    date: new Date(Date.now() + 3600000), // 1 hour from now
    type: 'meeting',
    description: 'Weekly sync'
  };

  let reminderMinutes = 15;

  function testEventCreation() {
    notifyEventCreated(demoEvent, {
      showDesktopNotification: true,
      snackbarPosition: 'bottom-right',
      snackbarDuration: 4000
    });
  }

  function testEventDeletion() {
    notifyEventCancelled(demoEvent, {
      showDesktopNotification: true,
      snackbarPosition: 'top-right',
      snackbarDuration: 4000
    });
  }

  function testReminder() {
    notifyEventReminder(demoEvent, reminderMinutes, {
      showDesktopNotification: true,
      snackbarPosition: 'top-center',
      snackbarDuration: 5000
    });
  }
</script>

<div style="padding: 40px; background: #f5f5f5; min-height: 100vh;">
  <h1>Calendar Integration</h1>
  <p>Notification patterns for calendar event management</p>

  <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
    <h2>Event Information</h2>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
      <p><strong>Title:</strong> {demoEvent.title}</p>
      <p><strong>Date:</strong> {demoEvent.date.toLocaleString()}</p>
      <p><strong>Type:</strong> {demoEvent.type}</p>
      <p><strong>Description:</strong> {demoEvent.description}</p>
    </div>

    <h3>Notification Scenarios</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
      <div style="border: 2px solid #4caf50; border-radius: 6px; padding: 20px;">
        <h4 style="margin-top: 0; color: #4caf50;">✅ Event Created</h4>
        <p style="font-size: 13px; color: #666;">Triggered when user creates a new event</p>
        <button
          on:click={testEventCreation}
          style="width: 100%; padding: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"
        >
          Test Creation
        </button>
      </div>

      <div style="border: 2px solid #2196f3; border-radius: 6px; padding: 20px;">
        <h4 style="margin-top: 0; color: #2196f3;">🔔 Reminder</h4>
        <p style="font-size: 13px; color: #666;">Minutes before event starts</p>
        <input
          type="number"
          bind:value={reminderMinutes}
          min="1"
          max="60"
          style="width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px;"
        />
        <button
          on:click={testReminder}
          style="width: 100%; padding: 10px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"
        >
          Test Reminder ({reminderMinutes} min)
        </button>
      </div>

      <div style="border: 2px solid #f44336; border-radius: 6px; padding: 20px;">
        <h4 style="margin-top: 0; color: #f44336;">❌ Event Deleted</h4>
        <p style="font-size: 13px; color: #666;">When event is cancelled or removed</p>
        <button
          on:click={testEventDeletion}
          style="width: 100%; padding: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;"
        >
          Test Deletion
        </button>
      </div>
    </div>
  </div>

  <div style="background: white; padding: 30px; border-radius: 8px;">
    <h2>Design Patterns</h2>
    
    <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin-bottom: 15px;">
      <h4 style="margin-top: 0; color: #1976d2;">Non-Intrusive Feedback</h4>
      <p>Notifications appear briefly without blocking the calendar view, allowing users to continue working while being informed of action results.</p>
    </div>

    <div style="background: #f3e5f5; padding: 15px; border-left: 4px solid #9c27b0; margin-bottom: 15px;">
      <h4 style="margin-top: 0; color: #7b1fa2;">Mobile Support</h4>
      <p>Desktop notifications can be sent for important events (creation, reminders) to keep users informed even when the app isn't in focus.</p>
    </div>

    <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin-bottom: 15px;">
      <h4 style="margin-top: 0; color: #e65100;">Contextual Positioning</h4>
      <p>Different positions (top, bottom) are used based on context: bottom-right for creation (non-urgent), top-center for reminders (time-sensitive).</p>
    </div>

    <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50;">
      <h4 style="margin-top: 0; color: #2e7d32;">Undo Patterns</h4>
      <p>Event deletion notifications can include undo actions for critical operations, allowing users to reverse accidental deletions.</p>
    </div>
  </div>
</div>
