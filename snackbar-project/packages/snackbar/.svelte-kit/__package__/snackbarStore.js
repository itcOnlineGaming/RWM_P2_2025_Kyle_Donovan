import { writable } from 'svelte/store';
function createSnackbarStore() {
    const { subscribe, update } = writable([]);
    return {
        subscribe,
        show: (config) => {
            const id = config.id || `snackbar-${Date.now()}-${Math.random()}`;
            const snackbar = {
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
        remove: (id) => {
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
    success: (message, options) => snackbarStore.show({ message, type: 'success', ...options }),
    error: (message, options) => snackbarStore.show({ message, type: 'error', ...options }),
    warning: (message, options) => snackbarStore.show({ message, type: 'warning', ...options }),
    info: (message, options) => snackbarStore.show({ message, type: 'info', ...options }),
    show: (message, options) => snackbarStore.show({ message, ...options })
};
