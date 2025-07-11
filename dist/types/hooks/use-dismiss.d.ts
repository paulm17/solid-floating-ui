import type { FloatingContext } from "./use-floating";
export interface DismissPayload {
    type: 'outsidePress' | 'referencePress' | 'escapeKey' | 'mouseLeave';
    data: {
        returnFocus: boolean | {
            preventScroll: boolean;
        };
    };
}
interface UseDismissOptions {
    /**
     * Whether the Hook is enabled, including all internal Effects and event
     * handlers.
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to dismiss the floating element upon pressing the `esc` key.
     * @default true
     */
    escapeKey?: boolean;
    /**
     * Whether to dismiss the floating element upon pressing the reference
     * element. You likely want to ensure the `move` option in the `useHover()`
     * Hook has been disabled when this is in use.
     * @default false
     */
    referencePress?: boolean;
    /**
     * The type of event to use to determine a "press".
     * - `pointerdown` is eager on both mouse + touch input.
     * - `mousedown` is eager on mouse input, but lazy on touch input.
     * - `click` is lazy on both mouse + touch input.
     * @default 'pointerdown'
     */
    referencePressEvent?: "pointerdown" | "mousedown" | "click";
    /**
     * Whether to dismiss the floating element upon pressing outside of the
     * floating element.
     * If you have another element, like a toast, that is rendered outside the
     * floating element's React tree and don't want the floating element to close
     * when pressing it, you can guard the check like so:
     * ```jsx
     * useDismiss(context, {
     *   outsidePress: (event) => !event.target.closest('.toast'),
     * });
     * ```
     * @default true
     */
    outsidePress?: boolean | ((event: MouseEvent) => boolean);
    /**
     * The type of event to use to determine an outside "press".
     * - `pointerdown` is eager on both mouse + touch input.
     * - `mousedown` is eager on mouse input, but lazy on touch input.
     * - `click` is lazy on both mouse + touch input.
     * @default 'pointerdown'
     */
    outsidePressEvent?: "pointerdown" | "mousedown" | "click";
    /**
     * Whether to dismiss the floating element upon scrolling an overflow
     * ancestor.
     * @default false
     */
    ancestorScroll?: boolean;
    /**
     * Determines whether event listeners bubble upwards through a tree of
     * floating elements.
     */
    bubbles?: boolean | {
        escapeKey?: boolean;
        outsidePress?: boolean;
    };
    /**
     * Determines whether to use capture phase event listeners.
     */
    capture?: boolean | {
        escapeKey?: boolean;
        outsidePress?: boolean;
    };
}
declare function useDismiss(context: () => FloatingContext, options?: UseDismissOptions): {
    readonly reference: any;
    readonly floating: any;
};
export type { UseDismissOptions };
export { useDismiss };
