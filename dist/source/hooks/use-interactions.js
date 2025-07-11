import { createMemo } from "solid-js";
const ACTIVE_KEY = "active";
const SELECTED_KEY = "selected";
function mergeProps(userProps, propsList, elementKey) {
    const map = new Map();
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
            .reduce((acc, props) => {
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
                        acc[key] = (...args) => {
                            return map
                                .get(key)
                                ?.map((fn) => fn(...args))
                                .find((val) => val !== undefined);
                        };
                    }
                }
                else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {}),
    };
}
function useInteractions(propsList = []) {
    const getReferenceProps = createMemo(() => (userProps) => {
        return mergeProps(userProps, propsList, "reference");
    });
    const getFloatingProps = createMemo(() => (userProps) => {
        return mergeProps(userProps, propsList, "floating");
    });
    const getItemProps = createMemo(() => (userProps) => {
        return mergeProps(userProps, propsList, "item");
    });
    return {
        getReferenceProps: getReferenceProps(),
        getFloatingProps: getFloatingProps(),
        getItemProps: getItemProps()
    };
}
export { useInteractions };
