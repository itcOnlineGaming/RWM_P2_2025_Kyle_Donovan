import { writable } from 'svelte/store';

export interface SnackbarConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  showClose?: boolean;
  id?: string;
}

interface SnackbarItem extends SnackbarConfig {
  id: string;
}

function createSnackbarStore() {
  const { subscribe, update } = writable<SnackbarItem[]>([]);

  return {
    subscribe,
    show: (config: SnackbarConfig) => {
      const id = config.id || `snackbar-${Date.now()}-${Math.random()}`;
      const snackbar: SnackbarItem = {
        type: 'info',
        duration: 3000,
        position: 'bottom-left',
        showClose: true,
        ...config,
        id
      };

      update(items => [...items, snackbar]);
      return id;
    },
    remove: (id: string) => {
      update(items => items.filter(item => item.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const snackbarStore = createSnackbarStore();

// Helper functions for quick access
export const snackbar = {
  success: (message: string, options?: Partial<SnackbarConfig>) => 
    snackbarStore.show({ message, type: 'success', ...options }),
  error: (message: string, options?: Partial<SnackbarConfig>) => 
    snackbarStore.show({ message, type: 'error', ...options }),
  warning: (message: string, options?: Partial<SnackbarConfig>) => 
    snackbarStore.show({ message, type: 'warning', ...options }),
  info: (message: string, options?: Partial<SnackbarConfig>) => 
    snackbarStore.show({ message, type: 'info', ...options }),
  show: (message: string, options?: Partial<SnackbarConfig>) => 
    snackbarStore.show({ message, ...options })
};