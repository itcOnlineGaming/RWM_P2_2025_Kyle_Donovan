# Snackbar Notification System

A reusable notification library for SvelteKit applications. It provides in-app snackbars plus optional desktop and mobile notifications, calendar integration helpers, and a small service-worker helper for push-style mobile notifications.

This package ships the source (.svelte + .ts) so SvelteKit/Vite consumers can compile it with their app. If you prefer prebuilt outputs, add a build step and publish `main`/`module` artifacts.

Key features
- In-app snackbar toasts: `success`, `info`, `warning`, `error`
- Desktop notifications using the browser Notification API
- Optional mobile support via a small `sw.js` service worker
- Calendar helpers: event-created, event-updated, reminders, and utilities to find upcoming events

Installation
----------

Install from npm (after publishing):

```bash
npm install @rwm-p2-2025-kyle-donovan/snackbar
```

Or install directly from GitHub (repo root must contain `package.json` and exports):

```bash
npm install git+https://github.com/itcOnlineGaming/RWM_P2_2025_Kyle_Donovan.git#main
```

Local development
-----------------
During development you can work with the local files or use `npm link`:

```bash
# in snackbar repo
npm link
# in your app
npm link @rwm-p2-2025-kyle-donovan/snackbar
```

Usage (quick)
-------------
Add the snackbar container to your root layout so snackbars render globally:

```svelte
<script>
  import { SnackbarContainer } from '@rwm-p2-2025-kyle-donovan/snackbar';
  let { children } = $props();
</script>

<slot />
<SnackbarContainer />
```

Show a simple in-app toast:

```svelte
<script>
  import { snackbar } from '@rwm-p2-2025-kyle-donovan/snackbar';
  function notify(){ snackbar.success('Event created'); }
</script>

<button on:click={notify}>Notify</button>
```

Calendar helpers (example):

```ts
import { notifyEventCreated } from '@rwm-p2-2025-kyle-donovan/snackbar';

notifyEventCreated({ title: 'Team Sync', date: new Date(), type: 'meeting' });
```

Desktop & mobile notifications
------------------------------
This package exports several helpers around the Notification API and a tiny service-worker helper. Consumers will need to obtain Notification permission from the user. See `notifications.ts` and `serviceWorkerNotifications.ts` for the APIs.

Publishing notes
----------------
- This repo contains a root `package.json` with `exports.svelte` pointing to the library entry, so npm/git installs will work.
- We publish the source Svelte files so consumers compile them.
- If you want to publish a prebuilt package instead, add a `build` step and set `main`/`module` fields accordingly.

Contributing
------------
Contributions welcome — open a PR with any fixes or improvements. Keep changes focused on the library code under `demo-standalone/src/lib/snackbar` so the package contents remain clean.

License
-------
This project is licensed under the MIT License — see the `LICENSE` file for details.

Files included in the package
-----------------------------
- `demo-standalone/src/lib/snackbar/*` — library source (Svelte + TS)
- `demo-standalone/static/sw.js` — optional service worker for mobile notifications

Example
-------
See `demo-standalone` for a working demo app and usage examples.

Support
-------
If you run into issues, check the browser console for errors and ensure Notification permissions are granted for desktop/mobile notifications. Open an issue in this repo if you need help.