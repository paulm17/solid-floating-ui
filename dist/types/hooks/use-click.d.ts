import type { FloatingContext } from "./use-floating";
import type { ElementProps } from "./use-interactions";
interface UseClickOptions {
    /**
     * Whether the Hook is enabled, including all internal Effects and event
     * handlers.
     * @default true
     */
    enabled?: boolean;
    /**
     * The type of event to use to determine a "click" with mouse input.
     * Keyboard clicks work as normal.
     * @default 'click'
     */
    event?: "click" | "mousedown";
    /**
     * Whether to toggle the open state with repeated clicks.
     * @default true
     */
    toggle?: boolean;
    /**
     * Whether to ignore the logic for mouse input (for example, if `useHover()`
     * is also being used).
     * When `useHover()` and `useClick()` are used together, clicking the
     * reference element after hovering it will keep the floating element open
     * even once the cursor leaves. This may be not be desirable in some cases.
     * @default false
     */
    ignoreMouse?: boolean;
    /**
     * Whether to add keyboard handlers (Enter and Space key functionality) for
     * non-button elements (to open/close the floating element via keyboard
     * "click").
     * @default true
     */
    keyboardHandlers?: boolean;
}
declare function useClick(context: FloatingContext, options?: UseClickOptions): () => ElementProps;
export type { UseClickOptions };
export { useClick };
