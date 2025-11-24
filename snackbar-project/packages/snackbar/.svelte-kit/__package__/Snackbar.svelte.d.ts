import { SvelteComponent } from "svelte";
import './snackbar.css';
declare const __propDef: {
    props: {
        message?: string;
        type?: "success" | "error" | "warning" | "info";
        duration?: number;
        position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
        showClose?: boolean;
        onClose?: (() => void) | null;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SnackbarProps = typeof __propDef.props;
export type SnackbarEvents = typeof __propDef.events;
export type SnackbarSlots = typeof __propDef.slots;
export default class Snackbar extends SvelteComponent<SnackbarProps, SnackbarEvents, SnackbarSlots> {
}
export {};
