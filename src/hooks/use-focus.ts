import { getWindow, isElement, isHTMLElement } from "@floating-ui/utils/dom";
import {
	activeElement,
	contains,
	createAttribute,
	getDocument,
	getTarget,
	isVirtualPointerEvent,
} from "../internal/dom";
import { isMac, isSafari } from "../internal/environment";
import { isTypeableElement } from "../internal/is-typable-element";
import { createEffect, onCleanup, createMemo } from "solid-js";
import type { OpenChangeReason } from "../types";
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

function useFocus(context: FloatingContext, options: UseFocusOptions = {}) {
	const contextMemo = createMemo(() => context);
	const {
		open,
		onOpenChange,
		events,
		elements: { reference, floating },
	} = contextMemo();

	const optionsMemo = createMemo(() => options);
	const { enabled = true, visibleOnly = true } = optionsMemo();

	let blockFocus = false;
	let timeout = -1;
	let keyboardModality = true;

	// Window blur and keydown listeners
	createEffect(() => {
		if (!enabled) {
			return;
		}

		const win = getWindow(reference);

		// If the reference was focused and the user left the tab/window, and the
		// floating element was not open, the focus should be blocked when they
		// return to the tab/window.
		function onBlur() {
			if (
				!open &&
				isHTMLElement(reference) &&
				reference === activeElement(getDocument(reference))
			) {
				blockFocus = true;
			}
		}

		function onKeyDown() {
			keyboardModality = true;
		}

		win.addEventListener("blur", onBlur);
		win.addEventListener("keydown", onKeyDown, true);

		onCleanup(() => {
			win.removeEventListener("blur", onBlur);
			win.removeEventListener("keydown", onKeyDown, true);
		});
	});

	// Open change event listener
	createEffect(() => {
		if (!enabled) {
			return;
		}

		function onOpenChangeHandler({ reason }: { reason: OpenChangeReason }) {
			if (reason === "reference-press" || reason === "escape-key") {
				blockFocus = true;
			}
		}

		events.on("openchange", onOpenChangeHandler);

		onCleanup(() => {
			events.off("openchange", onOpenChangeHandler);
		});
	});

	// Cleanup timeout on unmount
	createEffect(() => {
		onCleanup(() => {
			clearTimeout(timeout);
		});
	});

	return createMemo(() => ({
		get reference() {
			if (!enabled) {
				return {};
			}
			return {
				onPointerDown: (event: PointerEvent) => {
					if (isVirtualPointerEvent(event)) return;
					keyboardModality = false;
				},
				onMouseLeave() {
					blockFocus = false;
				},
				onFocus: (event: FocusEvent) => {
					if (blockFocus) {
						return;
					}

					const target = getTarget(event);

					if (visibleOnly && isElement(target)) {
						try {
							// Mac Safari unreliably matches `:focus-visible` on the reference
							// if focus was outside the page initially - use the fallback
							// instead.
							if (isSafari() && isMac()) throw Error();
							if (!target.matches(":focus-visible")) return;
						} catch {
							// Old browsers will throw an error when using `:focus-visible`.
							if (!keyboardModality && !isTypeableElement(target)) {
								return;
							}
						}
					}

					onOpenChange(true, event, "focus");
				},
				onBlur: (event: FocusEvent) => {
					blockFocus = false;
					const relatedTarget = event.relatedTarget;

					// Hit the non-modal focus management portal guard. Focus will be
					// moved into the floating element immediately after.
					const movedToFocusGuard =
						isElement(relatedTarget) &&
						relatedTarget.hasAttribute(createAttribute("focus-guard")) &&
						relatedTarget.getAttribute("data-type") === "outside";

					// Wait for the window blur listener to fire.
					timeout = window.setTimeout(() => {
						const activeEl = activeElement(
							// @ts-expect-error - FIXME
							reference ? reference.ownerDocument : document,
						);

						// Focus left the page, keep it open.
						if (!relatedTarget && activeEl === reference) return;

						// When focusing the reference element (e.g. regular click), then
						// clicking into the floating element, prevent it from hiding.
						// Note: it must be focusable, e.g. `tabindex="-1"`.
						// We can not rely on relatedTarget to point to the correct element
						// as it will only point to the shadow host of the newly focused element
						// and not the element that actually has received focus if it is located
						// inside a shadow root.
						if (
							contains(floating, activeEl) ||
							// @ts-expect-error FIXME
							contains(reference, activeEl) ||
							movedToFocusGuard
						) {
							return;
						}

						onOpenChange(false, event, "focus");
					});
				},
			};
		},
	}));
}

export type { UseFocusOptions };
export { useFocus };
