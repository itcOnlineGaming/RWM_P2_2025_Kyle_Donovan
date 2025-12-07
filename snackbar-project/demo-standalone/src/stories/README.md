# Snackbar Notification System - Storybook

Interactive documentation and component showcase for the notification system used in the calendar task management app.

## Accessing the Stories

The stories are located in `/src/stories/` and can be accessed by adding routes to view them:

1. **Snackbar.stories.svelte** - Main notification component showcase
   - Interactive controls for all notification types
   - Position options (6 positions)
   - Type demonstrations (Success, Error, Warning, Info)
   - Live preview with custom messages

2. **CalendarIntegration.stories.svelte** - Calendar-specific notification patterns
   - Event creation notifications
   - Event deletion notifications
   - Reminder notifications
   - Design pattern explanations

## Notification Types

### ✅ Success
- **Use Case**: Confirms successful action completion
- **Color**: Green (#4caf50)
- **Duration**: 4 seconds
- **Example**: "Event created successfully!"

### ❌ Error
- **Use Case**: Indicates failed operations
- **Color**: Red (#f44336)
- **Duration**: 4 seconds
- **Example**: "Failed to save event"

### ⚠️ Warning
- **Use Case**: Alerts user to potential issues
- **Color**: Orange (#ff9800)
- **Duration**: 4 seconds
- **Example**: "This action cannot be undone"

### ℹ️ Info
- **Use Case**: Provides general information
- **Color**: Blue (#2196f3)
- **Duration**: 4 seconds
- **Example**: "Calendar synced successfully"

## Position Options

Notifications can appear in 6 positions:

- **top-left** - Alerts and critical information
- **top-center** - Reminders and time-sensitive notifications
- **top-right** - General updates
- **bottom-left** - Subtle confirmations
- **bottom-center** - Important confirmations
- **bottom-right** - Non-urgent feedback (default)

## Calendar Integration Patterns

### Event Creation
```javascript
notifyEventCreated(event, {
  showDesktopNotification: true,
  snackbarPosition: 'bottom-right',
  snackbarDuration: 4000
});
```

### Event Deletion
```javascript
notifyEventCancelled(event, {
  showDesktopNotification: true,
  snackbarPosition: 'top-right',
  snackbarDuration: 4000
});
```

### Event Reminder
```javascript
notifyEventReminder(event, 15, {
  showDesktopNotification: true,
  snackbarPosition: 'top-center',
  snackbarDuration: 5000
});
```

## Design Principles

### Non-Intrusive Feedback
Notifications appear briefly without blocking the calendar view, allowing users to continue working while being informed of action results.

### Mobile Support
Desktop notifications can be sent for important events to keep users informed even when the app isn't in focus. Mobile browsers receive haptic feedback (vibration) on supported devices.

### Contextual Positioning
Different positions are used based on context:
- Bottom-right for creation (non-urgent background action)
- Top-center for reminders (time-sensitive)
- Top-right for deletions (attention-required)

### Accessibility
- Clear visual indicators with colors
- Text-based messages for clarity
- Icons for quick recognition
- Sufficient duration for reading

## Features Demonstrated

✅ Multiple notification types with distinct visual styles
✅ Customizable positions and durations
✅ Desktop/mobile notification support
✅ Calendar event integration examples
✅ Interactive demo with live controls
✅ Reusable pattern documentation
✅ Responsive design
✅ Smooth animations

## SRL Connection

This notification system demonstrates:

- **Self-Awareness**: Users are aware of their actions and outcomes
- **Metacognition**: Clear feedback helps users understand what happened and why
- **Self-Regulation**: Notifications help users adjust behavior (e.g., "action cannot be undone" warning)

The non-intrusive design allows users to regulate their own attention and workflow.

## Integration in Our P1

To use the notification system in our calendar:

1. Import the notification functions from `$lib/snackbar`
2. Call the appropriate function when actions occur
3. Pass optional configuration for position and duration
4. Notifications will automatically display with proper styling

Example:
```svelte
<script>
  import { notifyEventCreated } from '$lib/snackbar';
  
  function handleEventCreate(event) {
    // ... create event logic
    notifyEventCreated(event, {
      showDesktopNotification: true,
      snackbarPosition: 'bottom-right'
    });
  }
</script>
```
