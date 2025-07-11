import { isShadowRoot } from "@floating-ui/utils/dom";
import { isAndroid, isJSDOM } from "./environment";
function getDocument(element) {
    return element?.ownerDocument ?? document;
}
function activeElement(doc) {
    let activeElement = doc.activeElement;
    while (activeElement?.shadowRoot?.activeElement != null) {
        activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
}
function createAttribute(name) {
    return `data-floating-ui-${name}`;
}
function contains(parent, child) {
    if (!parent || !child) {
        return false;
    }
    const rootNode = child.getRootNode?.();
    // First, attempt with faster native method
    if (parent.contains(child)) {
        return true;
    }
    // then fallback to custom implementation with Shadow DOM support
    if (rootNode && isShadowRoot(rootNode)) {
        let next = child;
        while (next) {
            if (parent === next) {
                return true;
            }
            // @ts-expect-error - `host` can exist
            next = next.parentNode || next.host;
        }
    }
    // Give up, the result is false
    return false;
}
function isVirtualPointerEvent(event) {
    if (isJSDOM()) {
        return false;
    }
    return ((!isAndroid() && event.width === 0 && event.height === 0) ||
        (isAndroid() &&
            event.width === 1 &&
            event.height === 1 &&
            event.pressure === 0 &&
            event.detail === 0 &&
            event.pointerType === "mouse") ||
        // iOS VoiceOver returns 0.333• for width/height.
        (event.width < 1 &&
            event.height < 1 &&
            event.pressure === 0 &&
            event.detail === 0 &&
            event.pointerType === "touch"));
}
function getTarget(event) {
    if ("composedPath" in event) {
        return event.composedPath()[0];
    }
    // TS thinks `event` is of type never as it assumes all browsers support
    // `composedPath()`, but browsers without shadow DOM don't.
    return event.target;
}
function isEventTargetWithin(event, node) {
    if (node == null) {
        return false;
    }
    if ("composedPath" in event) {
        return event.composedPath().includes(node);
    }
    // TS thinks `event` is of type never as it assumes all browsers support composedPath, but browsers without shadow dom don't
    const e = event;
    return e.target != null && node.contains(e.target);
}
function isRootElement(element) {
    return element.matches("html,body");
}
function isMouseLikePointerType(pointerType, strict) {
    // On some Linux machines with Chromium, mouse inputs return a `pointerType`
    // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
    const values = ["mouse", "pen"];
    if (!strict) {
        values.push("", undefined);
    }
    return values.includes(pointerType);
}
export { getDocument, activeElement, createAttribute, contains, isVirtualPointerEvent, getTarget, isEventTargetWithin, isRootElement, isMouseLikePointerType, };
