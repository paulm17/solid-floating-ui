function createPubSub() {
    const map = new Map();
    return {
        emit(event, data) {
            const handlers = map.get(event);
            if (!handlers) {
                return;
            }
            for (const handler of handlers) {
                handler(data);
            }
        },
        on(event, listener) {
            map.set(event, [...(map.get(event) || []), listener]);
        },
        off(event, listener) {
            map.set(event, map.get(event)?.filter((l) => l !== listener) || []);
        },
    };
}
export { createPubSub };
