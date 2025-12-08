const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your VAPID keys (generate with: npx web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = 'BB0mh7LqN9ykwQ6JehCD58ogN9Lphh3LVJ7QaFm6iUZJh5Hr_FfXt9ey4OOyU-BuJblIu2v2ycVShK7WSoy46vE';
const VAPID_PRIVATE_KEY = 'k5bDlRuDpEm80XeNj3Z1s9ULtTds4bjIKl28qnVp3X4';

webpush.setVapidDetails(
  'mailto:your@email.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
  console.log('📝 New subscription received');
  subscriptions.push(req.body);
  console.log(`Total subscriptions: ${subscriptions.length}`);
  res.status(201).json({ message: 'Subscribed successfully' });
});

app.post('/notify', async (req, res) => {
  const payload = JSON.stringify(req.body || { title: 'Push Test', body: 'Hello from server!' });
  let successCount = 0;
  let failCount = 0;
  
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      successCount++;
    } catch (e) {
      failCount++;
      console.error('Failed to send to subscription:', e.message);
    }
  }
  res.json({ 
    message: 'Notifications sent',
    success: successCount,
    failed: failCount
  });
});

app.get('/trigger', async (req, res) => {
  console.log(`🔔 Manual trigger requested. Subscriptions: ${subscriptions.length}`);
  
  if (subscriptions.length === 0) {
    return res.send('⚠️ No subscriptions found. Please subscribe first from the app.');
  }
  
  const payload = JSON.stringify({ 
    title: 'Manual Trigger', 
    body: 'This notification was sent from the server!',
    icon: '📅',
    badge: '📅'
  });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      successCount++;
      console.log('✅ Notification sent successfully');
    } catch (e) {
      failCount++;
      console.error('❌ Failed to send notification:', e.message);
    }
  }
  
  res.send(`✅ Sent to ${successCount} subscribers. Failed: ${failCount}`);
});

app.get('/status', (req, res) => {
  res.json({
    subscriptions: subscriptions.length,
    message: subscriptions.length === 0 ? 'No subscriptions yet' : `${subscriptions.length} active subscription(s)`
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Push server running on port ${PORT}`);
  
  // Get all network interfaces to show available IPs
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('\nServer accessible at:');
  console.log(`  - Local: http://localhost:${PORT}`);
  
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(iface => {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  - Network: http://${iface.address}:${PORT}`);
      }
    });
  });
  
  console.log('\nUse the Network URL to access from other devices on the same network.');
});
