<script>
  import { onMount } from 'svelte';
  import { snackbar } from '$lib/snackbar';
  import { 
    subscribeToPushNotifications, 
    isPushSubscribed 
  } from '$lib/snackbar';
  import { config } from '$lib/config';

  let notificationPermission = 'checking...';
  let pushEnabled = false;
  let loading = false;

  onMount(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      notificationPermission = Notification.permission;
      pushEnabled = await isPushSubscribed();
    } else {
      notificationPermission = 'not-supported';
    }
  });

  async function requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    loading = true;
    const result = await Notification.requestPermission();
    notificationPermission = result;
    loading = false;

    if (result === 'granted') {
      snackbar.success('Notification permission granted! ✅');
    } else {
      snackbar.error('Notification permission denied ❌');
    }
  }

  async function enablePush() {
    loading = true;
    const success = await subscribeToPushNotifications();
    loading = false;

    if (success) {
      pushEnabled = true;
      snackbar.success('Push notifications enabled! You\'ll receive alerts even when the app is closed. 🔔', {
        duration: 5000,
        position: 'top-center'
      });
    } else {
      snackbar.error('Failed to enable push notifications', {
        duration: 4000
      });
    }
  }

  function testNotification() {
    if (Notification.permission === 'granted') {
      new Notification('Test Notification 🔔', {
        body: 'If you see this, notifications are working!',
        icon: '📅',
        vibrate: [200, 100, 200]
      });
      snackbar.success('Test notification sent!');
    } else {
      snackbar.error('Please grant notification permission first');
    }
  }

  async function triggerServerNotification() {
    loading = true;
    try {
      const pushServerUrl = config.getPushServerUrl();
      const response = await fetch(`${pushServerUrl}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        snackbar.success('Push notification sent from server! 🚀', {
          duration: 4000,
          position: 'top-center'
        });
      } else {
        snackbar.error('Failed to send notification from server');
      }
    } catch (error) {
      snackbar.error(`Error: ${error.message}`);
    } finally {
      loading = false;
    }
  }
</script>

<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
  <h1 style="margin-bottom: 10px;">🔔 Notification Settings</h1>
  <p style="color: #666; margin-bottom: 40px;">Configure how you receive calendar alerts</p>

  <!-- Status Card -->
  <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; font-size: 18px;">Current Status</h2>
    
    <div style="display: grid; gap: 15px; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div>
          <strong>Browser Notifications</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Show alerts in your browser</p>
        </div>
        <span style="padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; background: {notificationPermission === 'granted' ? '#d4edda' : '#f8d7da'}; color: {notificationPermission === 'granted' ? '#155724' : '#721c24'};">
          {notificationPermission === 'granted' ? '✅ Enabled' : notificationPermission === 'denied' ? '❌ Denied' : '⏳ Not Set'}
        </span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <div>
          <strong>Push Notifications</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Receive alerts even when app is closed</p>
        </div>
        <span style="padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; background: {pushEnabled ? '#d4edda' : '#fff3cd'}; color: {pushEnabled ? '#155724' : '#856404'};">
          {pushEnabled ? '✅ Active' : '⏳ Not Active'}
        </span>
      </div>
    </div>
  </div>

  <!-- Setup Steps -->
  <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; font-size: 18px;">Setup Steps</h2>

    <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 20px;">
      <!-- Step 1 -->
      <div style="display: flex; gap: 15px;">
        <div style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: {notificationPermission === 'granted' ? '#7a5de6' : '#e0e0e0'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
          1
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Grant Browser Permission</h3>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">Allow this website to show notifications</p>
          <button 
            on:click={requestPermission}
            disabled={loading || notificationPermission === 'granted'}
            style="padding: 10px 20px; background: {notificationPermission === 'granted' ? '#e0e0e0' : '#7a5de6'}; color: white; border: none; border-radius: 6px; cursor: {loading || notificationPermission === 'granted' ? 'not-allowed' : 'pointer'}; font-size: 14px; font-weight: 600;"
          >
            {notificationPermission === 'granted' ? '✅ Permission Granted' : 'Request Permission'}
          </button>
        </div>
      </div>

      <!-- Step 2 -->
      <div style="display: flex; gap: 15px; opacity: {notificationPermission === 'granted' ? 1 : 0.5};">
        <div style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: {pushEnabled ? '#7a5de6' : '#e0e0e0'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
          2
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Enable Push Notifications</h3>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">Subscribe to receive alerts even when the app is closed</p>
          <button 
            on:click={enablePush}
            disabled={loading || notificationPermission !== 'granted' || pushEnabled}
            style="padding: 10px 20px; background: {pushEnabled ? '#4caf50' : '#7a5de6'}; color: white; border: none; border-radius: 6px; cursor: {loading || notificationPermission !== 'granted' || pushEnabled ? 'not-allowed' : 'pointer'}; font-size: 14px; font-weight: 600;"
          >
            {loading ? '⏳ Loading...' : pushEnabled ? '✅ Push Enabled' : 'Enable Push Notifications'}
          </button>
        </div>
      </div>

      <!-- Step 3 -->
      <div style="display: flex; gap: 15px; opacity: {notificationPermission === 'granted' ? 1 : 0.5};">
        <div style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: #e0e0e0; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
          3
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Test Your Notifications</h3>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">Send a test notification to verify everything works</p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button 
              on:click={testNotification}
              disabled={notificationPermission !== 'granted'}
              style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 6px; cursor: {notificationPermission !== 'granted' ? 'not-allowed' : 'pointer'}; font-size: 14px; font-weight: 600;"
            >
              Send Test Notification
            </button>
            <button 
              on:click={triggerServerNotification}
              disabled={loading || notificationPermission !== 'granted' || !pushEnabled}
              style="padding: 10px 20px; background: #ff9800; color: white; border: none; border-radius: 6px; cursor: {loading || notificationPermission !== 'granted' || !pushEnabled ? 'not-allowed' : 'pointer'}; font-size: 14px; font-weight: 600;"
            >
              {loading ? '⏳ Sending...' : 'Trigger from Server'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Info Card -->
  <div style="background: #e8f4f8; border-left: 4px solid #2196f3; border-radius: 8px; padding: 20px;">
    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1976d2;">💡 Why enable notifications?</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555;">
      <li>Get reminders for upcoming events</li>
      <li>Stay informed about schedule changes</li>
      <li>Receive alerts even when the app is closed</li>
      <li>Never miss an important meeting or deadline</li>
    </ul>
  </div>
</div>
