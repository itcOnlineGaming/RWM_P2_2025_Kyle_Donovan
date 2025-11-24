<script lang="ts">
  import { snackbarStore } from './snackbarStore';
  import Snackbar from './Snackbar.svelte';
  import './container.css';

  $: snackbars = $snackbarStore;
  
  // Group snackbar by position
  $: snackbarsByPosition = snackbars.reduce((acc, snackbar) => {
    const pos = snackbar.position || 'bottom-left';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(snackbar);
    return acc;
  }, {} as Record<string, typeof snackbars>);
</script>

{#each Object.entries(snackbarsByPosition) as [position, positionSnackbars]}
  <div class="snackbar-stack snackbar-stack-{position}">
    {#each positionSnackbars as snackbar (snackbar.id)}
      <div class="snackbar-wrapper">
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          duration={snackbar.duration}
          position={snackbar.position}
          showClose={snackbar.showClose}
          onClose={() => snackbarStore.remove(snackbar.id)}
        />
      </div>
    {/each}
  </div>
{/each}