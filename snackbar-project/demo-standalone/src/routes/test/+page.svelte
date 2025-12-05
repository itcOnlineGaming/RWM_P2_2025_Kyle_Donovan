<script>
  import { onMount } from 'svelte';
  let permissionStatus = 'checking...';
  let testResult = '';

  async function checkPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      permissionStatus = '❌ Not supported';
      return;
    }
    permissionStatus = Notification.permission;
  }

  async function requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const result = await Notification.requestPermission();
    permissionStatus = result;
    testResult = `Permission: ${result}`;
  }

  async function sendTest() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'If you see this, notifications work!',
        vibrate: [200, 100, 200]
      });
      testResult = '✅ Sent! Check your notifications.';
    } else {
      testResult = `❌ Permission denied: ${Notification.permission}`;
    }
  }

  async function subscribeUser() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BB0mh7LqN9ykwQ6JehCD58ogN9Lphh3LVJ7QaFm6iUZJh5Hr_FfXt9ey4OOyU-BuJblIu2v2ycVShK7WSoy46vE'
      });
      await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
      testResult = '✅ Subscribed to push notifications!';
    } else {
      testResult = '❌ Push messaging not supported.';
    }
  }

  onMount(() => {
    checkPermission();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  });
</script>

<div style="padding: 20px; max-width: 600px; margin: 0 auto;">
  <h1>Notification Test</h1>
  
  <p><strong>Permission Status:</strong> {permissionStatus}</p>
  
  <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
    <button on:click={requestPermission} style="padding: 15px; font-size: 16px;">
      Request Permission
    </button>
    
    <button on:click={sendTest} style="padding: 15px; font-size: 16px;">
      Send Test Notification
    </button>
    
    <button on:click={subscribeUser} style="padding: 15px; font-size: 16px;">
      Subscribe to Push Notifications
    </button>
    <button on:click={async () => {
      await fetch('http://localhost:3000/notify', { method: 'POST' });
      testResult = 'Notification triggered from server!';
    }} style="padding: 15px; font-size: 16px;">
      Trigger Server Notification
    </button>
  </div>
  
  <p style="font-size: 18px; margin-top: 20px;">{testResult}</p>
  
  <hr style="margin: 30px 0;">
  
  <h2>Troubleshooting</h2>
  <ul style="line-height: 1.8;">
    <li>Make sure you're using Chrome or Safari</li>
    <li>Not in private/incognito mode</li>
    <li>Not in an in-app browser (Instagram, Facebook, etc.)</li>
    <li>iOS requires 16.4+ for web notifications</li>
  </ul>
</div>