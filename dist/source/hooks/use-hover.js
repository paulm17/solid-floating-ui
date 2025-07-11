import { createEffect, createMemo, onCleanup } from "solid-js";
import { isElement } from "@floating-ui/utils/dom";
import { contains, createAttribute, getDocument, isMouseLikePointerType, } from "../internal/dom";
import { noop } from "../internal/noop";
const safePolygonIdentifier = createAttribute("safe-polygon");
export function getDelay(value, prop, pointerType) {
    if (pointerType && !isMouseLikePointerType(pointerType)) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return value?.[prop];
}
function useHover(context, options = () => ({})) {
    const memoizedOptions = createMemo(options);
    return createMemo(() => {
        const ctx = context();
        const opts = options();
        const { open, onOpenChange, data, events, elements: { reference, floating }, } = ctx;
        const { enabled = true, mouseOnly = false, delay = 0, restMs = 0, move = true, handleClose = null, } = memoizedOptions();
        // const tree = useFloatingTree();
        // const parentId = useFloatingParentNodeId();
        let pointerType = undefined;
        let timeout = -1;
        let handler = undefined;
        let restTimeout = -1;
        let blockMouseMove = true;
        let performedPointerEventsMutation = false;
        let unbindMouseMove = noop;
        const isHoverOpen = createMemo(() => {
            const type = data.openEvent?.type;
            return type?.includes("mouse") && type !== "mousedown";
        });
        const isClickLikeOpenEvent = createMemo(() => data.openEvent
            ? ["click", "mousedown"].includes(data.openEvent.type)
            : false);
        createEffect(() => {
            if (!enabled) {
                return;
            }
            const onOpenChangeHandler = ({ open }) => {
                if (!open) {
                    clearTimeout(timeout);
                    clearTimeout(restTimeout);
                    blockMouseMove = true;
                }
            };
            events.on("openchange", onOpenChangeHandler);
            onCleanup(() => {
                events.off("openchange", onOpenChangeHandler);
            });
        });
        createEffect(() => {
            if (enabled || !handleClose || !open) {
                return;
            }
            const onLeave = (event) => {
                if (!isHoverOpen()) {
                    return;
                }
                onOpenChange(false, event, "hover");
            };
            const document = getDocument(floating);
            document.addEventListener("mouseleave", onLeave);
            onCleanup(() => {
                document.removeEventListener("mouseleave", onLeave);
            });
        });
        const closeWithDelay = (event, runElseBranch = true, reason = "hover") => {
            const closeDelay = getDelay(memoizedOptions().delay, "close", pointerType);
            if (closeDelay && !handler) {
                clearTimeout(timeout);
                timeout = window.setTimeout(() => onOpenChange(false, event, reason), closeDelay);
            }
            else if (runElseBranch) {
                clearTimeout(timeout);
                onOpenChange(false, event, reason);
            }
        };
        const cleanupMouseMoveHandler = () => {
            unbindMouseMove();
            handler = undefined;
        };
        const clearPointerEvents = () => {
            if (!performedPointerEventsMutation) {
                return;
            }
            const body = getDocument(floating).body;
            body.style.pointerEvents = "";
            body.removeAttribute(safePolygonIdentifier);
            performedPointerEventsMutation = false;
        };
        // Block pointer-events of every element other than the reference and floating
        // while the floating element is open and has a `handleClose` handler. Also
        // handles nested floating elements.
        // https://github.com/floating-ui/floating-ui/issues/1722
        createEffect(() => {
            if (!enabled) {
                return;
            }
            if (open && handleClose?.__options.blockPointerEvents && isHoverOpen()) {
                const body = getDocument(floating).body;
                body.setAttribute(safePolygonIdentifier, "");
                body.style.pointerEvents = "none";
                performedPointerEventsMutation = true;
                if (isElement(reference) && floating) {
                    const ref = reference;
                    // const parentFloating = tree?.nodesRef.current.find((node) => node.id === parentId)?.context
                    // 	?.elements.floating;
                    // if (parentFloating) {
                    // 	parentFloating.style.pointerEvents = '';
                    // }
                    ref.style.pointerEvents = "auto";
                    floating.style.pointerEvents = "auto";
                    onCleanup(() => {
                        ref.style.pointerEvents = "";
                        floating.style.pointerEvents = "";
                    });
                }
            }
        });
        createEffect(() => {
            if (!open) {
                pointerType = undefined;
                cleanupMouseMoveHandler();
                clearPointerEvents();
            }
        });
        onCleanup(() => {
            cleanupMouseMoveHandler();
            clearTimeout(timeout);
            clearTimeout(restTimeout);
            clearPointerEvents();
        });
        return {
            get reference() {
                if (!enabled) {
                    return {};
                }
                const onmouseenter = (event) => {
                    clearTimeout(timeout);
                    blockMouseMove = false;
                    if ((mouseOnly && !isMouseLikePointerType(pointerType)) ||
                        (restMs > 0 && !getDelay(delay, "open"))) {
                        return;
                    }
                    const openDelay = getDelay(memoizedOptions().delay, "open", pointerType);
                    if (openDelay) {
                        timeout = window.setTimeout(() => {
                            onOpenChange(true, event, "hover");
                        }, openDelay);
                    }
                    else {
                        onOpenChange(true, event, "hover");
                    }
                };
                return {
                    onpointerdown: (event) => {
                        pointerType = event.pointerType;
                    },
                    onpointerenter: (event) => {
                        pointerType = event.pointerType;
                    },
                    onmouseenter,
                    onmousemove: (event) => {
                        if (move) {
                            onmouseenter(event);
                        }
                        function handleMouseMove() {
                            if (!blockMouseMove) {
                                onOpenChange(true, event, "hover");
                            }
                        }
                        if (mouseOnly && !isMouseLikePointerType(pointerType)) {
                            return;
                        }
                        if (open || restMs === 0) {
                            return;
                        }
                        clearTimeout(restTimeout);
                        if (pointerType === "touch") {
                            handleMouseMove();
                        }
                        else {
                            restTimeout = window.setTimeout(handleMouseMove, restMs);
                        }
                    },
                    onmouseleave: (event) => {
                        if (!isClickLikeOpenEvent()) {
                            unbindMouseMove();
                            const doc = getDocument(floating);
                            clearTimeout(restTimeout);
                            if (handleClose) {
                                // Prevent clearing `onScrollMouseLeave` timeout.
                                if (!open) {
                                    clearTimeout(timeout);
                                }
                                handler = handleClose({
                                    ...ctx,
                                    // tree,
                                    x: event.clientX,
                                    y: event.clientY,
                                    onClose() {
                                        clearPointerEvents();
                                        cleanupMouseMoveHandler();
                                        closeWithDelay(event, true, "safe-polygon");
                                    },
                                });
                                const localHandler = handler;
                                doc.addEventListener("mousemove", localHandler);
                                unbindMouseMove = () => {
                                    doc.removeEventListener("mousemove", localHandler);
                                };
                                return;
                            }
                            // Allow interactivity without `safePolygon` on touch devices. With a
                            // pointer, a short close delay is an alternative, so it should work
                            // consistently.
                            const shouldClose = pointerType === "touch"
                                ? !contains(floating, event.relatedTarget)
                                : true;
                            if (shouldClose) {
                                closeWithDelay(event);
                            }
                        }
                        if (open && !isClickLikeOpenEvent()) {
                            handleClose?.({
                                ...ctx,
                                // tree,
                                x: event.clientX,
                                y: event.clientY,
                                onClose() {
                                    clearPointerEvents();
                                    cleanupMouseMoveHandler();
                                    closeWithDelay(event);
                                },
                            })(event);
                        }
                    },
                };
            },
            get floating() {
                if (!enabled) {
                    return {};
                }
                return {
                    onmouseenter() {
                        clearTimeout(timeout);
                    },
                    onmouseleave(event) {
                        if (!isClickLikeOpenEvent()) {
                            handleClose?.({
                                ...ctx,
                                // tree,
                                x: event.clientX,
                                y: event.clientY,
                                onClose() {
                                    clearPointerEvents();
                                    cleanupMouseMoveHandler();
                                    closeWithDelay(event);
                                },
                            })(event);
                        }
                        closeWithDelay(event, false);
                    },
                };
            },
        };
    });
}
export { useHover };
