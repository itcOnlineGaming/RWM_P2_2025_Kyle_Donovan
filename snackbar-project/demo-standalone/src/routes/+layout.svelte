<script>
  import { base } from '$app/paths';
	import { goto } from '$app/navigation';
  import { SnackbarContainer } from '$lib/snackbar/index';
  import { page } from '$app/stores';
</script>

<div class="app-wrapper">
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-icon">📅</div>
      <div class="logo-text">
        <div class="logo-title">CalendarSync</div>
        <div class="logo-subtitle">Pro</div>
      </div>
    </div>

    <nav class="nav-menu">
      <a href="{base}/" class="nav-item" class:active={$page.url.pathname === base + '/'}>
        <span class="nav-icon">🔔</span>
        <span class="nav-label">Notifications</span>
      </a>
      <a href="{base}/calendar" class="nav-item" class:active={$page.url.pathname === base + '/calendar'}>
        <span class="nav-icon">📆</span>
        <span class="nav-label">Calendar</span>
      </a>
      <a href="{base}/stories" class="nav-item" class:active={$page.url.pathname === base + '/stories'}>
        <span class="nav-icon">📚</span>
        <span class="nav-label">Stories</span>
      </a>
    </nav>

    <div class="demo-section">
      <div class="demo-title">Demo Pages</div>
      <a href="{base}/test" class="demo-link" class:active={$page.url.pathname === base + '/test'}>
        <span class="demo-icon">🧪</span>
        <span class="demo-label">Test Page</span>
      </a>
    </div>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">KD</div>
        <div class="user-details">
          <div class="user-name">Kyle Donovan</div>
          <div class="user-role">Administrator</div>
        </div>
      </div>
    </div>
  </aside>

  <main class="main-content">
    <slot />
  </main>
</div>

<SnackbarContainer />

<style>
  .app-wrapper {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 260px;
    background: linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    border-right: 1px solid rgba(255,255,255,0.1);
    box-shadow: 4px 0 12px rgba(124, 58, 237, 0.15);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
  }

  .logo-icon {
    font-size: 32px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
  }

  .logo-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .logo-subtitle {
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
  }

  .nav-menu {
    flex: 1;
    padding: 20px 12px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: rgba(255,255,255,0.8);
    transition: all 0.2s;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .nav-item:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }

  .nav-item.active {
    background: rgba(255,255,255,0.2);
    color: white;
  }

  .nav-icon {
    font-size: 20px;
  }

  .nav-label {
    font-size: 14px;
  }

  .demo-section {
    padding: 16px 12px;
    margin: 20px 16px;
    border-radius: 8px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .demo-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 8px;
    padding: 0 8px;
  }

  .demo-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 6px;
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    transition: all 0.2s;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .demo-link:hover {
    background: rgba(255,255,255,0.15);
    color: white;
  }

  .demo-link.active {
    background: rgba(255,255,255,0.2);
    color: white;
  }

  .demo-icon {
    font-size: 16px;
  }

  .demo-label {
    font-size: 13px;
  }

  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.15);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    border: 2px solid rgba(255,255,255,0.3);
  }

  .user-details {
    flex: 1;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
  }

  .user-role {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
  }

  .main-content {
    margin-left: 260px;
    flex: 1;
    padding: 32px;
    max-width: calc(100vw - 260px);
    background: #e9e4f0;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }

    .main-content {
      margin-left: 0;
      max-width: 100vw;
      padding: 20px;
    }
  }
</style>