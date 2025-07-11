import { computePosition, } from "@floating-ui/dom";
import { createMemo, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { createPubSub } from "../internal/create-pub-sub";
import { getDPR, roundByDPR } from "../internal/dpr";
import { noop } from "../internal/noop";
import { styleObjectToString } from "../internal/style-object-to-string";
import { useId } from "./use-id";
// Helper function to resolve accessor or value
function resolveAccessor(value) {
    return typeof value === 'function' ? value() : value;
}
/**
 * Hook for managing floating elements.
 */
function useFloating(options = {}) {
    const [elements, setElements] = createStore(resolveAccessor(options.elements) ?? {});
    // Create reactive getters for options
    const placement = createMemo(() => resolveAccessor(options.placement) ?? "bottom");
    const strategy = createMemo(() => resolveAccessor(options.strategy) ?? "absolute");
    const middleware = createMemo(() => resolveAccessor(options.middleware) ?? []);
    const transform = createMemo(() => resolveAccessor(options.transform) ?? true);
    const open = createMemo(() => resolveAccessor(options.open) ?? true);
    const nodeId = createMemo(() => resolveAccessor(options.nodeId));
    const onOpenChange = options.onOpenChange ?? noop;
    const whileElementsMounted = options.whileElementsMounted;
    const [state, setState] = createStore({
        x: 0,
        y: 0,
        strategy: strategy(),
        placement: placement(),
        middlewareData: {},
        isPositioned: false,
    });
    const floatingStyles = createMemo(() => {
        const initialStyles = {
            position: strategy(),
            left: "0px",
            top: "0px",
        };
        if (!elements.floating) {
            return styleObjectToString(initialStyles);
        }
        const x = roundByDPR(elements.floating, state.x);
        const y = roundByDPR(elements.floating, state.y);
        if (transform()) {
            return styleObjectToString({
                ...initialStyles,
                transform: `translate(${x}px, ${y}px)`,
                ...(getDPR(elements.floating) >= 1.5 && { willChange: "transform" }),
            });
        }
        return styleObjectToString({
            position: strategy(),
            left: `${x}px`,
            top: `${y}px`,
        });
    });
    const events = createPubSub();
    const [data, setData] = createStore({});
    const handleOpenChange = (open, event, reason) => {
        setData("openEvent", open ? event : undefined);
        events.emit("openchange", { open, event, reason });
        onOpenChange(open, event, reason);
    };
    const update = async () => {
        if (!elements.floating || !elements.reference) {
            return;
        }
        const config = {
            placement: placement(),
            strategy: strategy(),
            middleware: middleware(),
        };
        const position = await computePosition(elements.reference, elements.floating, config);
        setState({
            x: position.x,
            y: position.y,
            placement: position.placement,
            strategy: position.strategy,
            middlewareData: position.middlewareData,
            isPositioned: true,
        });
    };
    const context = {
        get data() { return data; },
        setData: setData,
        events,
        get elements() { return elements; },
        onOpenChange: handleOpenChange,
        floatingId: useId(),
        get nodeId() { return nodeId(); },
        get x() { return state.x; },
        get y() { return state.y; },
        get placement() { return state.placement; },
        get strategy() { return state.strategy; },
        get middlewareData() { return state.middlewareData; },
        get isPositioned() { return state.isPositioned; },
        get open() { return open(); },
    };
    // Effects to handle element updates
    createEffect(() => {
        const optionsElements = resolveAccessor(options.elements);
        if (optionsElements?.reference) {
            setElements("reference", optionsElements.reference);
        }
    });
    createEffect(() => {
        const optionsElements = resolveAccessor(options.elements);
        if (optionsElements?.floating) {
            setElements("floating", optionsElements.floating);
        }
    });
    // Effect to handle positioning state
    createEffect(() => {
        if (open() || !state.isPositioned) {
            return;
        }
        setState("isPositioned", false);
    });
    // Effect to handle mounting and updates
    createEffect(() => {
        if (!elements.floating || !elements.reference) {
            return;
        }
        if (!whileElementsMounted) {
            update();
            return;
        }
        const cleanup = whileElementsMounted(elements.reference, elements.floating, update);
        return cleanup;
    });
    return {
        update,
        context,
        get elements() { return elements; },
        get x() { return state.x; },
        get y() { return state.y; },
        get placement() { return state.placement; },
        get strategy() { return state.strategy; },
        get middlewareData() { return state.middlewareData; },
        get isPositioned() { return state.isPositioned; },
        get open() { return open(); },
        get floatingStyles() { return floatingStyles(); },
    };
}
export { useFloating };
