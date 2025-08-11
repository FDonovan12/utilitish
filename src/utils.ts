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

/**
 * Defines a **static** property on a constructor if it does not already exist
 * (or if the existing property is writable **or** configurable).
 *
 * - Does **not** affect instance prototypes (use `defineIfNotExists` for `Foo.prototype`).
 * - The property is created with: { enumerable: false, configurable: false, writable: false }
 *   making it non-enumerable and immutable after definition.
 * - If an existing property is non-configurable AND non-writable, it will **not** be replaced.
 *
 * @template T
 * @param {T} constructor The constructor object (e.g., `Array`, `String`, `Map`, ...)
 * @param {string} name The name of the static method to define (e.g., `'create'`, `'range'`)
 * @param {Function} fn The function to attach as a static property
 *
 * @example
 * // Define Array.range if possible
 * defineStaticIfNotExists(Array, 'range', function(start: number, end?: number) { ... });
 *
 * @remarks
 * - To force replacement, delete the property first or use Object.defineProperty directly.
 * - This function is meant to standardize the addition of static methods in utilitish.
 */
export const defineStaticIfNotExists = <T extends object>(constructor: T, name: string, fn: Function): void => {
    const descriptor = Object.getOwnPropertyDescriptor(constructor, name);
    if (!descriptor || descriptor.writable || descriptor.configurable) {
        Object.defineProperty(constructor, name, {
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
