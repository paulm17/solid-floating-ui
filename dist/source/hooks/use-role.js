import { createMemo } from "solid-js";
import { useId } from "./use-id";
const componentRoleToAriaRoleMap = new Map([
    ["select", "listbox"],
    ["combobox", "listbox"],
    ["label", false],
]);
function useRole(context, options = {}) {
    const contextData = createMemo(() => context);
    const { open, floatingId } = contextData();
    const optionsData = createMemo(() => options);
    const { enabled = true, role = "dialog" } = optionsData();
    const ariaRole = createMemo(() => (componentRoleToAriaRoleMap.get(role) ?? role));
    // FIXME: Uncomment the commented code once useId and useFloatingParentNodeId are implemented.
    const referenceId = useId();
    const parentId = undefined;
    // const parentId = useFloatingParentNodeId();
    const isNested = parentId != null;
    const floatingProps = createMemo(() => ({
        id: floatingId,
        ...(ariaRole() && { role: ariaRole() }),
    }));
    return {
        get reference() {
            if (!enabled) {
                return {};
            }
            if (ariaRole() === "tooltip" || role === "label") {
                return {
                    [`aria-${role === "label" ? "labelledby" : "describedby"}`]: open ? floatingId : undefined,
                };
            }
            return {
                "aria-expanded": open ? "true" : "false",
                "aria-haspopup": ariaRole() === "alertdialog" ? "dialog" : ariaRole(),
                "aria-controls": open ? floatingId : undefined,
                ...(ariaRole() === "listbox" && { role: "combobox" }),
                ...(ariaRole() === "menu" && { id: referenceId }),
                ...(ariaRole() === "menu" && isNested && { role: "menuitem" }),
                ...(role === "select" && { "aria-autocomplete": "none" }),
                ...(role === "combobox" && { "aria-autocomplete": "list" }),
            };
        },
        get floating() {
            if (!enabled) {
                return {};
            }
            if (ariaRole() === "tooltip" || role === "label") {
                return floatingProps();
            }
            return {
                ...floatingProps(),
                ...(ariaRole() === "menu" && { "aria-labelledby": referenceId }),
            };
        },
        get item() {
            if (!enabled) {
                return {};
            }
            return ({ active, selected }) => {
                const commonProps = {
                    role: "option",
                    ...(active && { id: `${context.floatingId}-option` }),
                };
                // For `menu`, we are unable to tell if the item is a `menuitemradio`
                // or `menuitemcheckbox`. For backwards-compatibility reasons, also
                // avoid defaulting to `menuitem` as it may overwrite custom role props.
                switch (role) {
                    case "select":
                        return {
                            ...commonProps,
                            "aria-selected": active && selected,
                        };
                    case "combobox": {
                        return {
                            ...commonProps,
                            ...(active && { "aria-selected": true }),
                        };
                    }
                }
                return {};
            };
        },
    };
}
export { useRole };
