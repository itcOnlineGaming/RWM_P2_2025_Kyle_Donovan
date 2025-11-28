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

  onMount(() => {
    checkPermission();
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