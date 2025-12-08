# RWM_P2_2025_Kyle_Donovan

## CalendarSync Pro - Team 4

A SvelteKit-based calendar application with push notification support.

---

## 📦 Project Structure

```
RWM_P2_2025_Kyle_Donovan/
├── snackbar-project/
│   └── demo-standalone/          # Main web application
│       ├── src/                  # Source code
│       ├── build/                # Production build (ready for SETU)
│       └── package.json
├── push-server/                  # Push notification server
│   ├── index.js                  # Main server file
│   └── package.json
├── READY_FOR_SETU.md            # Quick deployment summary
├── DEPLOY_TO_SETU.md            # Detailed deployment guide
└── BUILD_FOR_SETU.md            # Build command reference
```

---

## 🚀 Quick Start - Deploy to SETU Server

### 1. Build the App

The app is already built and ready in the `build/` folder. To rebuild:

```powershell
cd snackbar-project/demo-standalone
$env:PUBLIC_BASE_PATH="/11/calendar"; npm run build
```

### 2. Upload to SETU Server

**Web App:**
- Upload contents of `snackbar-project/demo-standalone/build/` 
- To: `/path/to/web/root/11/calendar/`

**Push Server:**
- Upload entire `push-server/` folder to SETU server
- Run: `npm install`
- Start: `node index.js` (on port 3000)

### 3. Access the App

- **Web App**: https://compucore.itcarlow.ie/11/calendar/
- **Push Server**: https://compucore.itcarlow.ie:3000

---

## 📚 Documentation

- **READY_FOR_SETU.md** - Quick summary and status
- **DEPLOY_TO_SETU.md** - Complete deployment instructions
- **BUILD_FOR_SETU.md** - Build commands for different environments

---

## 🛠️ Local Development

### Run the Web App
```powershell
cd snackbar-project/demo-standalone
npm install
npm run dev
```

### Run the Push Server
```powershell
cd push-server
npm install
node index.js
```

Access at: http://localhost:5173

---

## ✨ Features

- 📅 Interactive calendar interface
- 🔔 Push notification support
- 📱 Mobile-optimized
- 🌐 Works on HTTPS (SETU server)
- 🚀 Auto-detects environment for push server URLs

---

## 🔧 Configuration

The app automatically detects its environment:
- **On SETU server**: Uses `https://compucore.itcarlow.ie:3000`
- **On localhost**: Uses `http://localhost:3000`

Configuration is in: `src/lib/config.ts`

---

## 📝 License

See LICENSE file for details.
