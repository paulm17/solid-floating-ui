import { JSX } from 'solid-js';
import type { FloatingContext } from "../hooks/use-floating.js";
type SVGAttrs = JSX.SvgSVGAttributes<SVGSVGElement>;
type CleanSVGProps = Omit<SVGAttrs, Extract<keyof SVGAttrs, `aria-${string}`> | Extract<keyof SVGAttrs, `on${string}`>>;
export interface FloatingArrowProps extends CleanSVGProps {
    /** The bound HTML element reference. */
    ref?: (el: SVGSVGElement) => void;
    /** The floating context. */
    context: FloatingContext;
    /**
     * Width of the arrow.
     * @default 14
     */
    width?: number;
    /**
     * Height of the arrow.
     * @default 7
     */
    height?: number;
    /**
     * The corner radius (rounding) of the arrow tip.
     * @default 0 (sharp)
     */
    tipRadius?: number;
    /**
     * Forces a static offset over dynamic positioning under a certain condition.
     * @default undefined (use dynamic position)
     */
    staticOffset?: string | number | null;
    /**
     * Custom path string.
     * @default undefined (use dynamic path)
     */
    d?: string;
    /**
     * Stroke (border) color of the arrow.
     * @default "none"
     */
    stroke?: string;
    /**
     * Stroke (border) width of the arrow.
     * @default 0
     */
    strokeWidth?: number;
    /** Set transform styles. */
    transform?: string;
    /** Set fill styles. */
    fill?: string;
}
export default function FloatingArrow(props: FloatingArrowProps): any;
export {};
