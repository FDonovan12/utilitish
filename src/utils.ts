export const defineIfNotExists = <T extends object>(prototype: T, name: string, fn: Function): void => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (!descriptor || descriptor.writable || descriptor.configurable) {
        Object.defineProperty(prototype, name, {
            value: fn,
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }
};

export function resolveSelector<T, R>(
    selector?: keyof T | ((item: T) => R),
    fallback?: (item: T, index?: number) => R,
    name = 'selector',
): (item: T, index?: number) => R {
    assertValidSelector<T, R>(selector);

    if (typeof selector === 'function') {
        return selector;
    }

    if (typeof selector === 'string') {
        return (item: T) => item[selector] as unknown as R;
    }

    if (selector) {
        throw new TypeError(`${name} must be a function or a string key`);
    }

    if (fallback) {
        if (typeof fallback === 'function') {
            return fallback;
        }
        throw new TypeError(`fallback must be a function`);
    }
    throw new TypeError(`fallback must be given if no selector`);
}

export function assertValidSelector<T, R>(
    selector: any,
    name: string = 'selector',
): asserts selector is Selector<T, R> {
    const isValid = typeof selector === 'function' || typeof selector === 'string';
    if (selector !== undefined && !isValid) {
        throw new TypeError(`${name} must be a function or a string key`);
    }
}

export function isNumberOrString(value: unknown): value is string | number {
    return typeof value === 'string' || typeof value === 'number';
}

export type Selector<T, K> = keyof T | ((item: T) => K);
