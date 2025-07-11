import { isHTMLElement } from "@floating-ui/utils/dom";
import { isMouseLikePointerType } from "../internal/dom";
import { isTypeableElement } from "../internal/is-typable-element";
import { createMemo } from "solid-js";
function isButtonTarget(event) {
    return isHTMLElement(event.target) && event.target.tagName === "BUTTON";
}
function isSpaceIgnored(element) {
    return isTypeableElement(element);
}
function useClick(context, options = {}) {
    const contextMemo = createMemo(() => context);
    const optionsMemo = createMemo(() => options);
    const { open, onOpenChange, data, elements: { reference }, } = contextMemo();
    const { enabled = true, event: eventOption = "click", toggle = true, ignoreMouse = false, keyboardHandlers = true, } = optionsMemo();
    let pointerType = undefined;
    let didKeyDown = false;
    return createMemo(() => ({
        get reference() {
            if (!enabled) {
                return {};
            }
            return {
                onPointerDown: (event) => {
                    pointerType = event.pointerType;
                },
                onMouseDown: (event) => {
                    if (event.button !== 0) {
                        return;
                    }
                    if (isMouseLikePointerType(pointerType, true) && ignoreMouse) {
                        return;
                    }
                    if (eventOption === "click") {
                        return;
                    }
                    if (open &&
                        toggle &&
                        (data.openEvent ? data.openEvent.type === "mousedown" : true)) {
                        onOpenChange(false, event, "click");
                    }
                    else {
                        // Prevent stealing focus from the floating element
                        event.preventDefault();
                        onOpenChange(true, event, "click");
                    }
                },
                onClick: (event) => {
                    if (eventOption === "mousedown" && pointerType) {
                        pointerType = undefined;
                        return;
                    }
                    if (isMouseLikePointerType(pointerType, true) && ignoreMouse) {
                        return;
                    }
                    const currentOpen = contextMemo().open;
                    if (currentOpen &&
                        toggle &&
                        (data.openEvent ? data.openEvent.type === "click" : true)) {
                        onOpenChange(false, event, "click");
                    }
                    else {
                        onOpenChange(true, event, "click");
                    }
                },
                onKeyDown: (event) => {
                    pointerType = undefined;
                    if (event.defaultPrevented ||
                        !keyboardHandlers ||
                        isButtonTarget(event)) {
                        return;
                    }
                    // only treat it as “space click” if reference is a real HTMLElement
                    const el = isHTMLElement(reference) ? reference : null;
                    if (event.key === " " && !isSpaceIgnored(el)) {
                        // Prevent scrolling
                        event.preventDefault();
                        didKeyDown = true;
                    }
                    const currentOpen = contextMemo().open;
                    if (event.key === "Enter") {
                        if (currentOpen && toggle) {
                            onOpenChange(false, event, "click");
                        }
                        else {
                            onOpenChange(true, event, "click");
                        }
                    }
                },
                onKeyUp: (event) => {
                    const el = isHTMLElement(reference) ? reference : null;
                    if (event.defaultPrevented ||
                        !keyboardHandlers ||
                        isButtonTarget(event) ||
                        isSpaceIgnored(el)) {
                        return;
                    }
                    const currentOpen = contextMemo().open;
                    if (event.key === " " && didKeyDown) {
                        didKeyDown = false;
                        if (currentOpen && toggle) {
                            onOpenChange(false, event, "click");
                        }
                        else {
                            onOpenChange(true, event, "click");
                        }
                    }
                },
            };
        },
    }));
}
export { useClick };
