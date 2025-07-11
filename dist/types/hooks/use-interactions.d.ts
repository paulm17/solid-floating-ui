import type { JSX } from "solid-js";
declare const ACTIVE_KEY = "active";
declare const SELECTED_KEY = "selected";
interface ExtendedUserProps {
    [ACTIVE_KEY]?: boolean;
    [SELECTED_KEY]?: boolean;
}
interface ElementProps {
    reference?: JSX.HTMLAttributes<Element>;
    floating?: JSX.HTMLAttributes<Element>;
    item?: JSX.HTMLAttributes<Element> | ((props: ExtendedUserProps) => JSX.HTMLAttributes<Element>);
}
interface UseInteractionsReturn {
    getReferenceProps: (userProps?: JSX.HTMLAttributes<Element>) => Record<string, unknown>;
    getFloatingProps: (userProps?: JSX.HTMLAttributes<Element>) => Record<string, unknown>;
    getItemProps: (userProps?: Omit<JSX.HTMLAttributes<Element>, "selected" | "active"> & ExtendedUserProps) => Record<string, unknown>;
}
declare function useInteractions(propsList?: Array<ElementProps>): UseInteractionsReturn;
export type { UseInteractionsReturn, ElementProps, ExtendedUserProps };
export { useInteractions };
