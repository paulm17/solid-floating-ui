declare function createPubSub(): {
    emit(event: string, data: unknown): void;
    on(event: string, listener: (data: unknown) => void): void;
    off(event: string, listener: (data: unknown) => void): void;
};
export { createPubSub };
