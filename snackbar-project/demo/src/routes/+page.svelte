<script lang="ts">
  import { snackbar } from '@srl/snackbar';

  let customMessage = 'Custom message here!';
  let customDuration = 3000;
  let selectedType: 'success' | 'error' | 'warning' | 'info' = 'info';
  let selectedPosition: any = 'bottom-center';

  function showSuccess() {
    snackbar.success('Operation completed successfully!');
  }

  function showError() {
    snackbar.error('An error occurred!');
  }

  function showWarning() {
    snackbar.warning('Warning: Please check your input.');
  }

  function showInfo() {
    snackbar.info('Here is some information for you.');
  }

  function showCustom() {
    snackbar.show(customMessage, {
      type: selectedType,
      duration: customDuration,
      position: selectedPosition
    });
  }

  function showMultiple() {
    snackbar.info('First notification');
    setTimeout(() => snackbar.warning('Second notification'), 500);
    setTimeout(() => snackbar.success('Third notification'), 1000);
  }

  function showAllPositions() {
    const positions: any[] = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ];
    
    positions.forEach((pos, idx) => {
      setTimeout(() => {
        snackbar.info(`Position: ${pos}`, { position: pos, duration: 2000 });
      }, idx * 300);
    });
  }
</script>

<svelte:head>
  <title>Snackbar Demo</title>
</svelte:head>

<div class="container">
  <header>
    <h1>🍿 Snackbar Component Demo</h1>
    <p>A customizable Svelte snackbar/toast notification component</p>
  </header>

  <section class="demo-section">
    <h2>Quick Actions</h2>
    <div class="button-grid">
      <button class="btn btn-success" on:click={showSuccess}>
        ✓ Success
      </button>
      <button class="btn btn-error" on:click={showError}>
        ✗ Error
      </button>
      <button class="btn btn-warning" on:click={showWarning}>
        ⚠ Warning
      </button>
      <button class="btn btn-info" on:click={showInfo}>
        ℹ Info
      </button>
    </div>
  </section>

  <section class="demo-section">
    <h2>Advanced Features</h2>
    <div class="button-grid">
      <button class="btn" on:click={showMultiple}>
        Multiple Snackbars
      </button>
      <button class="btn" on:click={showAllPositions}>
        All Positions
      </button>
      <button class="btn" on:click={() => snackbar.show('Manual close only', { duration: 0 })}>
        No Auto-Dismiss
      </button>
    </div>
  </section>

  <section class="demo-section custom-section">
    <h2>Custom Snackbar</h2>
    
    <div class="form-group">
      <label for="message">Message:</label>
      <input 
        id="message"
        type="text" 
        bind:value={customMessage}
        placeholder="Enter your message"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="type">Type:</label>
        <select id="type" bind:value={selectedType}>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      <div class="form-group">
        <label for="position">Position:</label>
        <select id="position" bind:value={selectedPosition}>
          <option value="top-left">Top Left</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      <div class="form-group">
        <label for="duration">Duration (ms):</label>
        <input 
          id="duration"
          type="number" 
          bind:value={customDuration}
          min="0"
          step="1000"
        />
      </div>
    </div>

    <button class="btn btn-primary" on:click={showCustom}>
      Show Custom Snackbar
    </button>
  </section>

  <section class="demo-section code-section">
    <h2>Usage Example</h2>
    <pre><code>{`import { snackbar } from '@srl/snackbar';

// Simple usage
snackbar.success('Success!');
snackbar.error('Error!');

// With options
snackbar.show('Custom', {
  type: 'warning',
  duration: 5000,
  position: 'top-right'
});`}</code></pre>
  </section>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  header p {
    color: #666;
    font-size: 1.1rem;
  }

  .demo-section {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    background: #3b82f6;
    color: white;
    transition: all 0.2s;
    font-weight: 500;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn-success {
    background: #22c55e;
  }

  .btn-error {
    background: #ef4444;
  }

  .btn-warning {
    background: #f59e0b;
  }

  .btn-info {
    background: #3b82f6;
  }

  .btn-primary {
    background: #8b5cf6;
    width: 100%;
    margin-top: 1rem;
  }

  .custom-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .custom-section h2 {
    color: white;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    font-size: 1rem;
    background: rgba(255,255,255,0.9);
    box-sizing: border-box;
  }

  input:focus, select:focus {
    outline: none;
    border-color: white;
  }

  .code-section {
    background: #1e293b;
    color: #e2e8f0;
  }

  .code-section h2 {
    color: #e2e8f0;
  }

  pre {
    background: #0f172a;
    padding: 1.5rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0;
  }

  code {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .button-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
