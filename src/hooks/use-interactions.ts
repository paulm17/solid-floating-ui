import { createMemo } from "solid-js";
import type { JSX } from "solid-js";

const ACTIVE_KEY = "active";
const SELECTED_KEY = "selected";

interface ExtendedUserProps {
	[ACTIVE_KEY]?: boolean;
	[SELECTED_KEY]?: boolean;
}

interface ElementProps {
	reference?: JSX.HTMLAttributes<Element>;
	floating?: JSX.HTMLAttributes<Element>;
	item?:
		| JSX.HTMLAttributes<Element>
		| ((props: ExtendedUserProps) => JSX.HTMLAttributes<Element>);
}

interface UseInteractionsReturn {
	getReferenceProps: (
		userProps?: JSX.HTMLAttributes<Element>,
	) => Record<string, unknown>;
	getFloatingProps: (
		userProps?: JSX.HTMLAttributes<Element>,
	) => Record<string, unknown>;
	getItemProps: (
		userProps?: Omit<JSX.HTMLAttributes<Element>, "selected" | "active"> &
			ExtendedUserProps,
	) => Record<string, unknown>;
}

function mergeProps<Key extends keyof ElementProps>(
	userProps: (JSX.HTMLAttributes<Element> & ExtendedUserProps) | undefined,
	propsList: Array<ElementProps>,
	elementKey: Key,
): Record<string, unknown> {
	const map = new Map<string, Array<(...args: unknown[]) => void>>();
	const isItem = elementKey === "item";

	let domUserProps = userProps;
	if (isItem && userProps) {
		const { [ACTIVE_KEY]: _, [SELECTED_KEY]: __, ...validProps } = userProps;
		domUserProps = validProps;
	}

	return {
		...(elementKey === "floating" && { tabIndex: -1 }),
		...domUserProps,
		...propsList
			.map((value) => {
				const propsOrGetProps = value ? value[elementKey] : null;
				if (typeof propsOrGetProps === "function") {
					return userProps ? propsOrGetProps(userProps) : null;
				}
				return propsOrGetProps;
			})
			.concat(userProps)
			.reduce((acc: Record<string, unknown>, props) => {
				if (!props) {
					return acc;
				}
				for (const [key, value] of Object.entries(props)) {
					if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
						continue;
					}
					if (key.indexOf("on") === 0) {
						if (!map.has(key)) {
							map.set(key, []);
						}

						if (typeof value === "function") {
							map.get(key)?.push(value);

							acc[key] = (...args: unknown[]) => {
								return map
									.get(key)
									?.map((fn) => fn(...args))
									.find((val) => val !== undefined);
							};
						}
					} else {
						acc[key] = value;
					}
				}
				return acc;
			}, {}),
	};
}

function useInteractions(
	propsList: Array<ElementProps> = [],
): UseInteractionsReturn {
	const getReferenceProps = createMemo(() =>
		(userProps?: JSX.HTMLAttributes<Element>) => {
			return mergeProps(userProps, propsList, "reference");
		}
	);

	const getFloatingProps = createMemo(() =>
		(userProps?: JSX.HTMLAttributes<Element>) => {
			return mergeProps(userProps, propsList, "floating");
		}
	);

	const getItemProps = createMemo(() =>
		(
			userProps?: Omit<JSX.HTMLAttributes<Element>, "selected" | "active"> &
				ExtendedUserProps,
		) => {
			return mergeProps(userProps, propsList, "item");
		}
	);

	return {
		getReferenceProps: getReferenceProps(),
		getFloatingProps: getFloatingProps(),
		getItemProps: getItemProps()
	};
}

export type { UseInteractionsReturn, ElementProps, ExtendedUserProps };
export { useInteractions };
