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
export declare const snackbarStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<SnackbarItem[]>, invalidate?: import("svelte/store").Invalidator<SnackbarItem[]> | undefined) => import("svelte/store").Unsubscriber;
    show: (config: SnackbarConfig) => string;
    remove: (id: string) => void;
    clear: () => void;
};
export declare const snackbar: {
    success: (message: string, options?: Partial<SnackbarConfig>) => string;
    error: (message: string, options?: Partial<SnackbarConfig>) => string;
    warning: (message: string, options?: Partial<SnackbarConfig>) => string;
    info: (message: string, options?: Partial<SnackbarConfig>) => string;
    show: (message: string, options?: Partial<SnackbarConfig>) => string;
};
export {};
