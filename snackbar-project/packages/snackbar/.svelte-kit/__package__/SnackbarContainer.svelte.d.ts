import { SvelteComponent } from "svelte";
import './container.css';
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SnackbarContainerProps = typeof __propDef.props;
export type SnackbarContainerEvents = typeof __propDef.events;
export type SnackbarContainerSlots = typeof __propDef.slots;
export default class SnackbarContainer extends SvelteComponent<SnackbarContainerProps, SnackbarContainerEvents, SnackbarContainerSlots> {
}
export {};
