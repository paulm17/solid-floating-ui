import { Accessor, JSX } from 'solid-js';
import type { FloatingContext } from '../hooks/use-floating';
type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare const useDelayGroupContext: () => any;
export interface FloatingDelayGroupProps {
    children?: JSX.Element;
    delay: Delay;
    timeoutMs?: number;
}
/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 */
export declare const FloatingDelayGroup: (props: FloatingDelayGroupProps) => JSX.Element;
interface UseGroupOptions {
    id: any;
}
/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 */
export declare const useDelayGroup: (floatingContext: Accessor<FloatingContext>, props: UseGroupOptions) => any;
export {};
