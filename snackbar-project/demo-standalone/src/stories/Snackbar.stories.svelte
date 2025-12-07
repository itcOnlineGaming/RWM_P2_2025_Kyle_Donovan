<script>
  import Snackbar from '../lib/snackbar/Snackbar.svelte';
  import { snackbarStore } from '../lib/snackbar/snackbarStore';

  let selectedType = 'success';
  let selectedPosition = 'bottom-right';
  let message = 'This is a notification message';

  function showNotification() {
    snackbarStore.show({
      message,
      type: selectedType,
      position: selectedPosition,
      duration: 4000
    });
  }
</script>

<div style="padding: 40px; background: #f5f5f5; min-height: 100vh;">
  <h1>Snackbar Notifications</h1>
  <p>Interactive component showcase for the notification system</p>

  <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
    <h2>Controls</h2>
    
    <div style="margin-bottom: 20px;">
      <label>
        <strong>Message:</strong><br />
        <input
          type="text"
          bind:value={message}
          style="width: 100%; padding: 8px; margin-top: 5px; font-size: 14px;"
        />
      </label>
    </div>

    <div style="margin-bottom: 20px;">
      <label>
        <strong>Type:</strong><br />
        <select bind:value={selectedType} style="width: 100%; padding: 8px; margin-top: 5px;">
          <option value="success">✅ Success</option>
          <option value="error">❌ Error</option>
          <option value="warning">⚠️ Warning</option>
          <option value="info">ℹ️ Info</option>
        </select>
      </label>
    </div>

    <div style="margin-bottom: 20px;">
      <label>
        <strong>Position:</strong><br />
        <select bind:value={selectedPosition} style="width: 100%; padding: 8px; margin-top: 5px;">
          <option value="top-left">Top Left</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </label>
    </div>

    <button
      on:click={showNotification}
      style="padding: 12px 24px; background: #7a5de6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"
    >
      Show Notification
    </button>
  </div>

  <div style="background: white; padding: 30px; border-radius: 8px;">
    <h2>Notification Types</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
      <div style="border: 2px solid #4caf50; border-radius: 6px; padding: 15px;">
        <h3 style="margin-top: 0; color: #4caf50;">✅ Success</h3>
        <p style="font-size: 13px; color: #666; margin: 0;">Confirms successful action completion</p>
        <button
          on:click={() => {
            selectedType = 'success';
            message = 'Event created successfully!';
            showNotification();
          }}
          style="margin-top: 10px; padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
        >
          Demo
        </button>
      </div>

      <div style="border: 2px solid #f44336; border-radius: 6px; padding: 15px;">
        <h3 style="margin-top: 0; color: #f44336;">❌ Error</h3>
        <p style="font-size: 13px; color: #666; margin: 0;">Indicates failed operations</p>
        <button
          on:click={() => {
            selectedType = 'error';
            message = 'Failed to save event';
            showNotification();
          }}
          style="margin-top: 10px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
        >
          Demo
        </button>
      </div>

      <div style="border: 2px solid #ff9800; border-radius: 6px; padding: 15px;">
        <h3 style="margin-top: 0; color: #ff9800;">⚠️ Warning</h3>
        <p style="font-size: 13px; color: #666; margin: 0;">Alerts user to potential issues</p>
        <button
          on:click={() => {
            selectedType = 'warning';
            message = 'This action cannot be undone';
            showNotification();
          }}
          style="margin-top: 10px; padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
        >
          Demo
        </button>
      </div>

      <div style="border: 2px solid #2196f3; border-radius: 6px; padding: 15px;">
        <h3 style="margin-top: 0; color: #2196f3;">ℹ️ Info</h3>
        <p style="font-size: 13px; color: #666; margin: 0;">Provides general information</p>
        <button
          on:click={() => {
            selectedType = 'info';
            message = 'Calendar synced successfully';
            showNotification();
          }}
          style="margin-top: 10px; padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
        >
          Demo
        </button>
      </div>
    </div>
  </div>
</div>
