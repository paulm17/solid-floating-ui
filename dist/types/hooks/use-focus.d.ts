import type { FloatingContext } from "./use-floating";
interface UseFocusOptions {
    /**
     * Whether the Hook is enabled, including all internal Effects and event
     * handlers.
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether the open state only changes if the focus event is considered
     * visible (`:focus-visible` CSS selector).
     * @default true
     */
    visibleOnly?: boolean;
}
declare function useFocus(context: FloatingContext, options?: UseFocusOptions): any;
export type { UseFocusOptions };
export { useFocus };
