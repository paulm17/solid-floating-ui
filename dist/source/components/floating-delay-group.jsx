// FloatingDelayGroup.solid.tsx
/* eslint-disable solid/reactivity */
import { createContext, createEffect, mergeProps, onCleanup, useContext, } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getDelay } from '../hooks/use-hover';
const FloatingDelayGroupContext = createContext({
    delay: 0,
    initialDelay: 0,
    currentId: null,
    timeoutMs: 0,
    isInstantPhase: false,
    setState: () => undefined,
    setCurrentId: () => undefined,
});
export const useDelayGroupContext = () => useContext(FloatingDelayGroupContext);
/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 */
export const FloatingDelayGroup = (props) => {
    const [state, setState] = createStore({
        delay: props.delay,
        initialDelay: props.delay,
        currentId: null,
        timeoutMs: props.timeoutMs ?? 0,
        isInstantPhase: false,
    });
    let initialCurrentIdRef = null;
    const setCurrentId = (id) => {
        setState({ currentId: id });
    };
    // Mirror React’s useModernLayoutEffect for tracking `isInstantPhase` & `currentId`
    createEffect(() => {
        if (state.currentId) {
            if (initialCurrentIdRef === null) {
                initialCurrentIdRef = state.currentId;
            }
            else if (!state.isInstantPhase) {
                setState({ isInstantPhase: true });
            }
        }
        else {
            if (state.isInstantPhase) {
                setState({ isInstantPhase: false });
            }
            initialCurrentIdRef = null;
        }
    });
    // Build a stable context object (including both setState and setCurrentId)
    const context = mergeProps({ setState, setCurrentId }, state);
    return (<FloatingDelayGroupContext.Provider value={context}>
      {props.children}
    </FloatingDelayGroupContext.Provider>);
};
/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 */
export const useDelayGroup = (floatingContext, props) => {
    const group = useDelayGroupContext();
    // 1. Add this effect to handle OPENING a tooltip
    createEffect(() => {
        if (floatingContext().open) {
            // When this tooltip opens, it immediately sets the fast-opening delay
            // for the rest of the group.
            group.setState({
                delay: {
                    open: 1,
                    close: getDelay(group.initialDelay, 'close'),
                },
            });
            // It also sets itself as the "current" active tooltip.
            group.setCurrentId(props.id);
        }
    });
    // 2. Add this effect to handle CLOSING OTHER tooltips
    createEffect(() => {
        const currentId = group.currentId;
        // This runs for all tooltips. If an active tooltip exists (`currentId`)
        // and it's not me (`currentId !== props.id`), I should close.
        if (currentId && currentId !== props.id) {
            floatingContext().onOpenChange(false);
        }
    });
    // 3. Add this effect to handle the group TIMEOUT AND RESET
    createEffect(() => {
        // When the currently active tooltip closes...
        if (!floatingContext().open && group.currentId === props.id) {
            const unset = () => {
                // ...reset the group state back to the initial slow delay.
                // The check ensures we don't accidentally reset if another
                // tooltip became active during the timeout period.
                if (group.currentId === props.id) {
                    group.setState({ delay: group.initialDelay, currentId: null });
                }
            };
            // Use the timeout if provided, otherwise reset instantly.
            if (group.timeoutMs > 0) {
                const t = window.setTimeout(unset, group.timeoutMs);
                onCleanup(() => {
                    clearTimeout(t);
                });
            }
            else {
                unset();
            }
        }
    });
    return group;
};
