const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// VAPID configuration
const VAPID_PUBLIC_KEY = 'BB0mh7LqN9ykwQ6JehCD58ogN9Lphh3LVJ7QaFm6iUZJh5Hr_FfXt9ey4OOyU-BuJblIu2v2ycVShK7WSoy46vE';
const VAPID_PRIVATE_KEY = 'k5bDlRuDpEm80XeNj3Z1s9ULtTds4bjIKl28qnVp3X4';

webpush.setVapidDetails(
  'mailto:your@email.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

let subscriptions = [];

// Routes
app.post('/subscribe', (req, res) => {
  console.log('New subscription received');
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
  console.log(`Manual trigger requested. Subscriptions: ${subscriptions.length}`);
  
  if (subscriptions.length === 0) {
    return res.send('No subscriptions found. Please subscribe first from the app.');
  }
  
  const payload = JSON.stringify({ 
    title: 'Manual Trigger', 
    body: 'This notification was sent from the HTTPS server!',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      successCount++;
      console.log('Notification sent successfully');
    } catch (e) {
      failCount++;
      console.error('Failed to send notification:', e.message);
    }
  }
  
  res.send(`Sent to ${successCount} subscribers. Failed: ${failCount}`);
});

app.get('/status', (req, res) => {
  res.json({
    subscriptions: subscriptions.length,
    secure: true,
    message: subscriptions.length === 0 ? 'No subscriptions yet' : `${subscriptions.length} active subscription(s)`
  });
});

// HTTPS Server Setup
const PORT = process.env.PORT || 3001;  // Use 3001 for HTTPS (3000 is for HTTP)
const HOST = '0.0.0.0';

// Check if certificates exist
const certPath = path.join(__dirname, 'localhost+4.pem');
const keyPath = path.join(__dirname, 'localhost+4-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('\n❌ SSL Certificates not found!\n');
  console.log('Please run the following commands first:\n');
  console.log('1. Install mkcert:');
  console.log('   choco install mkcert\n');
  console.log('2. Install local CA:');
  console.log('   mkcert -install\n');
  console.log('3. Generate certificates (in push-server folder):');
  console.log('   mkcert localhost 127.0.0.1 YOUR_IP ::1\n');
  console.log('Replace YOUR_IP with your actual IP address from ipconfig\n');
  process.exit(1);
}

// Load SSL certificates
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

https.createServer(options, app).listen(PORT, HOST, () => {
  console.log(`\n🔒 HTTPS Push Server running on port ${PORT}\n`);
  
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('Server accessible at (HTTPS):');
  console.log(`  - Local:   https://localhost:${PORT}`);
  
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  - Network: https://${iface.address}:${PORT}`);
      }
    });
  });
  
  console.log('\n✅ All connections are secure (HTTPS)!');
  console.log('📱 Mobile devices need to trust the mkcert CA certificate');
  console.log('   See HTTPS_SETUP_GUIDE.md for mobile setup instructions\n');
});
