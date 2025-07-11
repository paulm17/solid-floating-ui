import { type FloatingElement, type Middleware, type MiddlewareData, type Placement, type ReferenceElement, type Strategy } from "@floating-ui/dom";
import { Accessor } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
import type { OpenChangeReason } from "../types";
interface FloatingElements {
    /**
     * The reference element.
     */
    reference?: ReferenceElement | null;
    /**
     * The floating element.
     */
    floating?: FloatingElement | null;
}
interface UseFloatingOptions {
    /**
     * Represents the open/close state of the floating element.
     * @default true
     */
    open?: Accessor<boolean> | boolean;
    /**
     * Callback that is called whenever the open state changes.
     */
    onOpenChange?: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
    /**
     * Where to place the floating element relative to its reference element.
     * @default 'bottom'
     */
    placement?: Accessor<Placement> | Placement;
    /**
     * The type of CSS position property to use.
     * @default 'absolute'
     */
    strategy?: Accessor<Strategy> | Strategy;
    /**
     * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
     * @default []
     */
    middleware?: Accessor<Array<Middleware | undefined | null | false>> | Array<Middleware | undefined | null | false>;
    /**
     * Whether to use `transform` instead of `top` and `left` styles to
     * position the floating element (`floatingStyles`).
     * @default true
     */
    transform?: Accessor<boolean> | boolean;
    /**
     * Object containing the floating and reference elements.
     * @default {}
     */
    elements?: Accessor<FloatingElements> | FloatingElements;
    /**
     * Callback to handle mounting/unmounting of the elements.
     * @default undefined
     */
    whileElementsMounted?: (reference: ReferenceElement, floating: FloatingElement, update: () => void) => () => void;
    /**
     * Unique node id when using `FloatingTree`.
     * @default undefined
     */
    nodeId?: Accessor<string | undefined> | string;
}
interface UseFloatingData {
    /**
     * The x-coordinate of the floating element.
     */
    x: number;
    /**
     * The y-coordinate of the floating element.
     */
    y: number;
    /**
     * The stateful placement, which can be different from the initial `placement` passed as options.
     */
    placement: Placement;
    /**
     * The stateful strategy, which can be different from the initial `strategy` passed as options.
     */
    strategy: Strategy;
    /**
     * Additional data from middleware.
     */
    middlewareData: MiddlewareData;
    /**
     * The boolean that let you know if the floating element has been positioned.
     */
    isPositioned: boolean;
}
interface FloatingEvents {
    emit<T extends string>(event: T, data?: any): void;
    on(event: string, handler: (data: any) => void): void;
    off(event: string, handler: (data: any) => void): void;
}
interface ContextData {
    /**
     * The latest even that caused the open state to change.
     */
    openEvent?: Event;
    /**
     * Arbitrary data produced and consumed by other hooks.
     */
    [key: string]: unknown;
}
interface FloatingContext extends UseFloatingData {
    /**
     * Represents the open/close state of the floating element.
     */
    open: boolean;
    /**
     * Callback that is called whenever the open state changes.
     */
    onOpenChange(open: boolean, event?: Event, reason?: OpenChangeReason): void;
    /**
     * Events for other hooks to consume.
     */
    events: FloatingEvents;
    /**
     * Arbitrary data produced and consumer by other hooks.
     */
    data: ContextData;
    /**
       * The setter for the data store.
       */
    setData: SetStoreFunction<ContextData>;
    /**
     * The id for the reference element
     */
    nodeId: string | undefined;
    /**
     * The id for the floating element
     */
    floatingId: string;
    /**
     * Object containing the floating and reference elements.
     */
    elements: FloatingElements;
}
interface UseFloatingReturn extends UseFloatingData {
    /**
     * Represents the open/close state of the floating element.
     */
    readonly open: boolean;
    /**
     * CSS styles to apply to the floating element to position it.
     */
    readonly floatingStyles: string;
    /**
     * The reference and floating elements.
     */
    readonly elements: FloatingElements;
    /**
     * Updates the floating element position.
     */
    readonly update: () => Promise<void>;
    /**
     * Additional context meant for other hooks to consume.
     */
    readonly context: FloatingContext;
}
/**
 * Hook for managing floating elements.
 */
declare function useFloating(options?: UseFloatingOptions): UseFloatingReturn;
export type { UseFloatingOptions, UseFloatingReturn, FloatingContext };
export { useFloating };
