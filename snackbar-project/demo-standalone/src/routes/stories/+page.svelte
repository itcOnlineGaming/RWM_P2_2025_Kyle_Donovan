<script>
  import Snackbar from '../../stories/Snackbar.stories.svelte';
  import CalendarIntegration from '../../stories/CalendarIntegration.stories.svelte';
  
  let activeStory = 'snackbar';
</script>

<div class="stories-container">
  <nav class="stories-nav">
    <h2>Component Stories</h2>
    <button 
      class:active={activeStory === 'snackbar'}
      on:click={() => activeStory = 'snackbar'}
    >
      📢 Snackbar Components
    </button>
    <button 
      class:active={activeStory === 'calendar'}
      on:click={() => activeStory = 'calendar'}
    >
      📅 Calendar Integration
    </button>
    
    <div class="nav-divider"></div>
    
    <div class="nav-info">
      <h3>About</h3>
      <p>Interactive documentation and component showcase for the notification system.</p>
    </div>
  </nav>

  <main class="stories-content">
    {#if activeStory === 'snackbar'}
      <Snackbar />
    {:else if activeStory === 'calendar'}
      <CalendarIntegration />
    {/if}
  </main>
</div>

<style>
  .stories-container {
    display: flex;
    height: 100vh;
    background: #fafafa;
  }
  
  .stories-nav {
    width: 280px;
    background: white;
    border-right: 1px solid #e0e0e0;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .stories-nav h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
    font-weight: 600;
  }
  
  .stories-nav button {
    padding: 14px 16px;
    border: 2px solid transparent;
    background: #f5f5f5;
    cursor: pointer;
    border-radius: 8px;
    text-align: left;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }
  
  .stories-nav button:hover {
    background: #efefef;
    color: #333;
  }
  
  .stories-nav button.active {
    background: #7a5de6;
    color: white;
    border-color: #7a5de6;
    box-shadow: 0 4px 12px rgba(122, 93, 230, 0.3);
  }
  
  .nav-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 15px 0;
  }
  
  .nav-info {
    margin-top: 10px;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
    border-left: 3px solid #7a5de6;
  }
  
  .nav-info h3 {
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #7a5de6;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .nav-info p {
    margin: 0;
    font-size: 12px;
    color: #777;
    line-height: 1.4;
  }
  
  .stories-content {
    flex: 1;
    overflow-y: auto;
    padding: 40px;
    background: #fafafa;
  }
  
  @media (max-width: 768px) {
    .stories-container {
      flex-direction: column;
    }
    
    .stories-nav {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
      padding: 15px;
    }
    
    .stories-nav h2 {
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .stories-content {
      padding: 20px;
    }
  }
</style>
