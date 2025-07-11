import type { FloatingContext } from "./use-floating";
import type { ElementProps } from "./use-interactions";
type AriaRole = "tooltip" | "dialog" | "alertdialog" | "menu" | "listbox" | "grid" | "tree";
type ComponentRole = "select" | "label" | "combobox";
interface UseRoleOptions {
    /**
     * Whether the Hook is enabled, including all internal Effects and event
     * handlers.
     * @default true
     */
    enabled?: boolean;
    /**
     * The role of the floating element.
     * @default 'dialog'
     */
    role?: AriaRole | ComponentRole;
}
declare function useRole(context: FloatingContext, options?: UseRoleOptions): ElementProps;
export type { UseRoleOptions };
export { useRole };
