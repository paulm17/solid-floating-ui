// import { Accessor, JSX } from "solid-js";
// import { ComputePositionReturn, VirtualElement } from "@floating-ui/dom";
// import {DismissPayload} from './hooks/use-dismiss';

// export type Prettify<T> = {
//   [K in keyof T]: T[K];
//   // eslint-disable-next-line @typescript-eslint/ban-types
// } & unknown;

type OpenChangeReason =
	| "outside-press"
	| "escape-key"
	| "ancestor-scroll"
	| "reference-press"
	| "click"
	| "hover"
	| "focus"
	| "list-navigation"
	| "safe-polygon";

export type { OpenChangeReason };

// export type UseFloatingData = Prettify<
//   ComputePositionReturn & {isPositioned: boolean}
// >;

// export type ReferenceType = Element | VirtualElement;

// export type UseFloatingReturn<R extends ReferenceType = ReferenceType> =
//   Prettify<
//     UseFloatingData & {
//       /**
//        * Update the position of the floating element, re-rendering the component
//        * if required.
//        */
//       update: () => void;
//       /**
//        * Pre-configured positioning styles to apply to the floating element.
//        */
//       floatingStyles: Accessor<JSX.CSSProperties>;
//       /**
//        * Object containing the reference and floating refs and reactive setters.
//        */
//       refs: ExtendedRefs<R>;
//       context: Accessor<FloatingContext<R>>;
//       elements: ExtendedElements<R>;
//     }
//   >;

// export type FloatingContext<R extends ReferenceType = ReferenceType> = Omit<
//   UseFloatingReturn<R>,
//   'elements' | 'context'
// > & {
//   open: Accessor<boolean>;
//   onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
//   events: FloatingEvents;
//   dataRef: ContextData; //React.MutableRefObject<ContextData>;
//   nodeId: string | undefined;
//   floatingId: string;
//   refs: ExtendedRefs<R>;
//   elements: ExtendedElements<R>;
// };

// export type NarrowedElement<T> = T extends Element ? T : Element;

// export type ExtendedRefs<R> = {
//   reference: Accessor<R | null>;
//   floating: Accessor<HTMLElement | null>;
//   domReference: NarrowedElement<R> | null;
//   setReference: (node: R | null) => void;
//   setFloating: (node: HTMLElement | null) => void;
//   setPositionReference: (node: ReferenceType | null) => void;
// };

// export interface ExtendedElements<R extends ReferenceType = ReferenceType> {
//   reference: Accessor<R | null>;
//   floating: Accessor<HTMLElement | null>;
//   domReference: Accessor<NarrowedElement<R> | null>;
// }

// export interface FloatingEvents {
//   emit<T extends string>(
//     event: T,
//     data?: T extends 'dismiss' ? DismissPayload : any,
//   ): void;
//   on(event: string, handler: (data: any) => void): void;
//   off(event: string, handler: (data: any) => void): void;
// }

// export interface ContextData {
//   openEvent?: Event;
//   [key: string]: any;
// }
