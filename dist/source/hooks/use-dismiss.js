import { createEffect, createMemo, onCleanup } from "solid-js";
import { getOverflowAncestors, getParentNode, isElement, isHTMLElement, isLastTraversableNode, } from "@floating-ui/utils/dom";
import { contains, createAttribute, getDocument, getTarget, isEventTargetWithin, isRootElement, } from "../internal/dom";
const bubbleHandlerKeys = {
    pointerdown: "onPointerDown",
    mousedown: "onMouseDown",
    click: "onClick",
};
const captureHandlerKeys = {
    pointerdown: "onPointerDownCapture",
    mousedown: "onMouseDownCapture",
    click: "onClickCapture",
};
const normalizeProp = (normalizable) => {
    return {
        escapeKey: typeof normalizable === "boolean"
            ? normalizable
            : (normalizable?.escapeKey ?? false),
        outsidePress: typeof normalizable === "boolean"
            ? normalizable
            : (normalizable?.outsidePress ?? true),
    };
};
function useDismiss(context, options = {}) {
    const contextData = createMemo(() => context());
    const { enabled = true, escapeKey = true, outsidePress: unstable_outsidePress = true, outsidePressEvent = "pointerdown", referencePress = false, referencePressEvent = "pointerdown", ancestorScroll = false, bubbles, capture, } = options;
    const outsidePressFn = createMemo(() => typeof unstable_outsidePress === "function"
        ? unstable_outsidePress
        : () => false);
    const outsidePress = createMemo(() => typeof unstable_outsidePress === "function"
        ? outsidePressFn()
        : unstable_outsidePress);
    let insideReactTree = false;
    let endedOrStartedInside = false;
    const { escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles } = normalizeProp(bubbles);
    const { escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture } = normalizeProp(capture);
    const closeOnEscapeKeyDown = (event) => {
        const { open, onOpenChange } = contextData();
        if (!open || !enabled || !escapeKey || event.key !== "Escape") {
            return;
        }
        if (!escapeKeyBubbles) {
            event.stopPropagation();
        }
        onOpenChange(false, event, "escape-key");
    };
    const closeOnEscapeKeyDownCapture = (event) => {
        const callback = () => {
            closeOnEscapeKeyDown(event);
            getTarget(event)?.removeEventListener("keydown", callback);
        };
        getTarget(event)?.addEventListener("keydown", callback);
    };
    const closeOnPressOutside = (event) => {
        const { open, onOpenChange, elements: { reference, floating } } = contextData();
        // Given developers can stop the propagation of the synthetic event,
        // we can only be confident with a positive value.
        const insideReactTreeLocal = insideReactTree;
        insideReactTree = false;
        // When click outside is lazy (`click` event), handle dragging.
        // Don't close if:
        // - The click started inside the floating element.
        // - The click ended inside the floating element.
        const endedOrStartedInsideLocal = endedOrStartedInside;
        endedOrStartedInside = false;
        if (outsidePressEvent === "click" && endedOrStartedInsideLocal) {
            return;
        }
        if (insideReactTreeLocal) {
            return;
        }
        const outsidePressValue = outsidePress();
        if (typeof outsidePressValue === "function" && !outsidePressValue(event)) {
            return;
        }
        const target = getTarget(event);
        const inertSelector = `[${createAttribute("inert")}]`;
        const markers = getDocument(floating).querySelectorAll(inertSelector);
        let targetRootAncestor = isElement(target) ? target : null;
        while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
            const nextParent = getParentNode(targetRootAncestor);
            if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
                break;
            }
            targetRootAncestor = nextParent;
        }
        // Check if the click occurred on a third-party element injected after the
        // floating element rendered.
        if (markers.length &&
            isElement(target) &&
            !isRootElement(target) &&
            // Clicked on a direct ancestor (e.g. FloatingOverlay).
            !contains(target, floating) &&
            // If the target root element contains none of the markers, then the
            // element was injected after the floating element rendered.
            Array.from(markers).every((marker) => !contains(targetRootAncestor, marker))) {
            return;
        }
        // Check if the click occurred on the scrollbar
        if (isHTMLElement(target) && floating) {
            // In Firefox, `target.scrollWidth > target.clientWidth` for inline
            // elements.
            const canScrollX = target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
            const canScrollY = target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
            let xCond = canScrollY && event.offsetX > target.clientWidth;
            // In some browsers it is possible to change the <body> (or window)
            // scrollbar to the left side, but is very rare and is difficult to
            // check for. Plus, for modal dialogs with backdrops, it is more
            // important that the backdrop is checked but not so much the window.
            if (canScrollY) {
                const isRTL = getComputedStyle(target).direction === "rtl";
                if (isRTL) {
                    xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
                }
            }
            if (xCond || (canScrollX && event.offsetY > target.clientHeight)) {
                return;
            }
        }
        if (isEventTargetWithin(event, floating) ||
            // @ts-expect-error - FIXME
            isEventTargetWithin(event, reference)) {
            return;
        }
        onOpenChange(false, event, "outside-press");
    };
    const closeOnPressOutsideCapture = (event) => {
        const callback = () => {
            closeOnPressOutside(event);
            getTarget(event)?.removeEventListener(outsidePressEvent, callback);
        };
        getTarget(event)?.addEventListener(outsidePressEvent, callback);
    };
    createEffect(() => {
        const { open, elements: { reference, floating }, setData } = contextData();
        if (!open || !enabled) {
            return;
        }
        setData("__escapeKeyBubbles", escapeKeyBubbles);
        setData("__outsidePressBubbles", outsidePressBubbles);
        function onScroll(event) {
            const { onOpenChange } = contextData();
            onOpenChange(false, event, "ancestor-scroll");
        }
        const doc = getDocument(floating);
        escapeKey &&
            doc.addEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
        outsidePress() &&
            doc.addEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
        let ancestors = [];
        if (ancestorScroll) {
            if (isElement(reference)) {
                ancestors = getOverflowAncestors(reference);
            }
            if (isElement(floating)) {
                ancestors = ancestors.concat(getOverflowAncestors(floating));
            }
            if (!isElement(reference) && reference && reference.contextElement) {
                ancestors = ancestors.concat(getOverflowAncestors(reference.contextElement));
            }
        }
        // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
        ancestors = ancestors.filter((ancestor) => ancestor !== doc.defaultView?.visualViewport);
        for (const ancestor of ancestors) {
            ancestor.addEventListener("scroll", onScroll, { passive: true });
        }
        onCleanup(() => {
            escapeKey &&
                doc.removeEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
            outsidePress() &&
                doc.removeEventListener(outsidePressEvent, outsidePressCapture
                    ? closeOnPressOutsideCapture
                    : closeOnPressOutside, outsidePressCapture);
            for (const ancestor of ancestors) {
                ancestor.removeEventListener("scroll", onScroll);
            }
        });
    });
    createEffect(() => {
        // Track dependencies for reactive updates
        outsidePress();
        outsidePressEvent;
        insideReactTree = false;
    });
    const referenceHandlers = createMemo(() => {
        if (!enabled) {
            return {};
        }
        return {
            onKeyDown: closeOnEscapeKeyDown,
            [bubbleHandlerKeys[referencePressEvent]]: (event) => {
                if (referencePress) {
                    const { onOpenChange } = contextData();
                    onOpenChange(false, event, "reference-press");
                }
            },
        };
    });
    const floatingHandlers = createMemo(() => {
        if (!enabled) {
            return {};
        }
        return {
            onKeyDown: closeOnEscapeKeyDown,
            onMouseDown() {
                endedOrStartedInside = true;
            },
            onMouseUp() {
                endedOrStartedInside = true;
            },
            [captureHandlerKeys[outsidePressEvent]]: () => {
                insideReactTree = true;
            },
        };
    });
    return {
        get reference() {
            return referenceHandlers();
        },
        get floating() {
            return floatingHandlers();
        },
    };
}
export { useDismiss };
