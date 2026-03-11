/**
 * Defines a **non-enumerable, non-writable, non-configurable** property on a prototype
 * if it does not already exist, or if the existing property is writable or configurable.
 *
 * - Intended for instance prototype methods (e.g., `Array.prototype`, `String.prototype`).
 * - Does **not** overwrite non-configurable and non-writable properties.
 * - Ensures immutability and hides the property from enumeration.
 *
 * @example
 * defineIfNotExists(Array.prototype, 'last', function() {
 *   return this[this.length - 1];
 * });
 *
 * @template T The prototype object type (e.g., `Array.prototype`).
 * @param {T} prototype The prototype on which to define the method.
 * @param {string} name The name of the method to define.
 * @param {Function} fn The function to assign as the method.
 *
 * @remarks
 * Use this function to safely add prototype methods without overwriting stable or built-in ones.
 */
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
 * Defines a **static** property on a constructor if it does not already exist,
 * or if the existing property is writable or configurable.
 *
 * - Only affects static properties on constructors (e.g., `Array`, `Map`).
 * - The property is created as non-enumerable, immutable, and non-configurable.
 * - Does **not** overwrite existing properties that are non-configurable and non-writable.
 *
 * @example
 * defineStaticIfNotExists(Array, 'range', function(start: number, end?: number) {
 *   // implementation
 * });
 *
 * @template T The constructor type (e.g., `typeof Array`).
 * @param {T} constructor The constructor object on which to define the static method.
 * @param {string} name The name of the static method to define.
 * @param {Function} fn The function to assign as the static method.
 *
 * @remarks
 * To forcefully replace an existing property, delete it first or use `Object.defineProperty` directly.
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

/**
 * Resolves a selector parameter into a function that extracts a value from an item.
 *
 * The selector can be:
 * - a key string of the object (returns the value at that key),
 * - a function transforming the item to the desired value,
 * - or undefined, in which case a fallback function must be provided.
 *
 * @example
 * const sel1 = resolveSelector<{name: string}, string>('name');
 * sel1({name: 'Alice'}); // 'Alice'
 *
 * const sel2 = resolveSelector<{value: number}, number>(item => item.value * 2);
 * sel2({value: 5}); // 10
 *
 * const sel3 = resolveSelector(undefined, (item) => item.toString());
 * sel3(42); // '42'
 *
 * @template T The type of the input items.
 * @template R The type of the selected value.
 * @param {keyof T | ((item: T) => R) | undefined} selector The selector key or function.
 * @param {(item: T, index?: number) => R} [fallback] A fallback function if no selector is provided.
 * @param {string} [name='selector'] Name used in error messages.
 * @returns {(item: T, index?: number) => R} The resolved selector function.
 *
 * @throws {TypeError} If the selector is not a function or string key.
 * @throws {TypeError} If no selector is provided and no fallback is given.
 */
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

/**
 * Asserts that a selector parameter is valid, i.e., a function or a string.
 *
 * @template T The type of the input items.
 * @template R The type of the selected value.
 * @param {any} selector The selector to validate.
 * @param {string} [name='selector'] The name to use in error messages.
 *
 * @throws {TypeError} If the selector is neither a function nor a string.
 *
 * @remarks
 * Used internally by `resolveSelector` to provide clearer type safety and errors.
 */
export function assertValidSelector<T, R>(
    selector: any,
    name: string = 'selector',
): asserts selector is Selector<T, R> {
    const isValid = typeof selector === 'function' || typeof selector === 'string';
    if (selector !== undefined && !isValid) {
        throw new TypeError(`${name} must be a function or a string key`);
    }
}

/**
 * Type guard to check if a value is a string or number.
 *
 * @example
 * isNumberOrString('hello'); // true
 * isNumberOrString(42);      // true
 * isNumberOrString(true);    // false
 *
 * @param {unknown} value The value to test.
 * @returns {value is string | number} True if the value is a string or number, else false.
 */
export function isNumberOrString(value: unknown): value is string | number {
    return typeof value === 'string' || typeof value === 'number';
}

/**
 * Type for a selector: either a key of T or a function from T to K.
 */
export type Selector<T, K> = keyof T | ((item: T) => K);
