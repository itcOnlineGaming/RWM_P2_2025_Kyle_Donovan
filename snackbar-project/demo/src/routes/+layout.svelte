<script lang="ts">
  import { SnackbarContainer } from '@srl/snackbar';
</script>

<div class="app">
  <slot />
  <SnackbarContainer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f5f5f5;
  }

  .app {
    min-height: 100vh;
  }
</style>
