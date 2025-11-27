<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import './snackbar.css';

  export let message: string = '';
  export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
  export let duration: number = 3000;
  export let position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' = 'bottom-left';
  export let showClose: boolean = true;
  export let onClose: (() => void) | null = null;

  let visible = true;
  let timeoutId: number;

  onMount(() => {
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        close();
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  });

  function close() {
    visible = false;
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  }

  // Styling
  const typeStyles = {
    success: 'snackbar-success',
    error: 'snackbar-error',
    warning: 'snackbar-warning',
    info: 'snackbar-info'
  };

  // Fly direction based on position
  $: flyDirection = position.includes('left') ? { x: -100 } : 
                    position.includes('right') ? { x: 100 } : 
                    { y: position.includes('top') ? -100 : 100 };
</script>

{#if visible}
  <div
    class="snackbar {typeStyles[type]}"
    transition:fly={{ ...flyDirection, duration: 300 }}
    role="alert"
  >
    <div class="snackbar-content">
      <span class="snackbar-message">{message}</span>
      {#if showClose}
        <button
          on:click={close}
          class="snackbar-close"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      {/if}
    </div>
  </div>
{/if}