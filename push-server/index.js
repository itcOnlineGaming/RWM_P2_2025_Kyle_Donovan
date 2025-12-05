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
  subscriptions.push(req.body);
  res.status(201).json({});
});

app.post('/notify', async (req, res) => {
  const payload = JSON.stringify({ title: 'Push Test', body: 'Hello from server!' });
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (e) {
      // Optionally remove invalid subscriptions
    }
  }
  res.send('Notifications sent');
});

app.get('/trigger', async (req, res) => {
  const payload = JSON.stringify({ title: 'Manual Trigger', body: 'This notification was sent from the server!' });
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (e) {
      // Optionally remove invalid subscriptions
    }
  }
  res.send('Manual notification sent');
});

app.listen(3000, () => console.log('Push server running on port 3000'));
