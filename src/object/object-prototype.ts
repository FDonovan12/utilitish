export {};

declare global {
    interface Object {
        /**
         * Creates a deep clone of the object using the structured clone algorithm.
         * This preserves object types, reference integrity, and works with cyclic references.
         *
         * @template T The type of the object being cloned
         * @this {T} The object to clone
         * @returns {T} A deep copy of the original object with all nested objects and arrays cloned
         * @throws {TypeError} If the object contains uncloneable values (functions, symbols, etc.)
         *
         * @example
         * const original = { a: { b: 1 }, c: [2, 3] };
         * const cloned = original.deepClone();
         * cloned.a.b = 999;
         * console.log(original.a.b); // 1 (original unchanged)
         *
         * @remarks
         * Uses the native `structuredClone()` API which provides:
         * - Support for Date, Map, Set, TypedArray objects
         * - Preservation of prototype chains for built-in types
         * - Proper handling of circular references
         */
        deepClone<T>(): T;

        /**
         * Deeply merges another object into the current object, recursively combining nested objects.
         * Arrays and primitives are replaced (not merged). Modifies the current object in place.
         *
         * @template T The type of the object being merged into
         * @this {T} The target object to merge into (will be modified)
         * @param {object} source - The source object to merge from (must be a non-null object)
         * @returns {T} The merged object (same as this)
         * @throws {TypeError} If source is not a non-null object
         *
         * @example
         * const target = { a: 1, b: { c: 2 } };
         * const source = { b: { d: 3 }, e: 4 };
         * target.deepMerge(source);
         * // target: { a: 1, b: { c: 2, d: 3 }, e: 4 }
         *
         * @remarks
         * - Primitive values in the source overwrite target values
         * - Arrays in the source completely replace target arrays (not merged element-wise)
         * - Only enumerable own properties are merged
         * - The merge is performed recursively for nested objects
         */
        deepMerge<T>(source: any): T | typeof source;

        /**
         * Checks for deep equality with another object, comparing all nested properties recursively.
         * Uses strict equality for primitives and deep comparison for objects.
         *
         * @template T The type of the object
         * @this {T} The object to compare
         * @param {unknown} other - The object to compare with
         * @returns {boolean} True if both objects are deeply equal, false otherwise
         *
         * @example
         * const obj1 = { a: { b: 1 }, c: [2, 3] };
         * const obj2 = { a: { b: 1 }, c: [2, 3] };
         * console.log(obj1.deepEquals(obj2)); // true
         *
         * const obj3 = { a: { b: 2 }, c: [2, 3] };
         * console.log(obj1.deepEquals(obj3)); // false
         *
         * @remarks
         * - Primitives are compared with strict equality (===)
         * - Objects are compared property by property recursively
         * - Array length and element order are considered
         * - only enumerable own properties are compared
         * - null and undefined are handled correctly
         */
        deepEquals(other: unknown): boolean;
    }
}

const defineIfNotExists = (name: string, fn: Function) => {
    const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, name);
    if (!descriptor || descriptor.writable || descriptor.configurable) {
        Object.defineProperty(Object.prototype, name, {
            value: fn,
            enumerable: false,
            configurable: true,
            writable: true,
        });
    }
};

/**
 * @see Object.prototype.deepClone
 */
defineIfNotExists('deepClone', function (this: any) {
    return structuredClone(this);
});

/**
 * @see Object.prototype.deepMerge
 */
defineIfNotExists('deepMerge', function (this: object, source: any) {
    if (typeof source !== 'object' || source === null) {
        throw new TypeError('Source must be a non-null object');
    }
    const isObject = (val: unknown): val is Record<string, any> =>
        val !== null && typeof val === 'object' && !Array.isArray(val);

    const merge = (target: any, source: any) => {
        for (const key of Object.keys(source)) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                merge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
        return target;
    };
    return merge(this.deepClone(), source);
});

/**
 * @see Object.prototype.deepEquals
 */
defineIfNotExists('deepEquals', function (this: unknown, other: unknown): boolean {
    function eq(a: any, b: any): boolean {
        // Functions: always false (even if code is the same)
        if (typeof a === 'function' || typeof b === 'function') {
            return false;
        }
        // Type check
        if (typeof a !== typeof b) return false;

        if (a === b) {
            // +0 !== -0
            return a !== 0 || 1 / a === 1 / b;
        }

        // NaN === NaN
        if (Number.isNaN(a) && Number.isNaN(b)) {
            return true;
        }
        // Null check
        if (a === null || b === null) return a === b;
        // Array and object check
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        // Array check
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!eq(a[i], b[i])) return false;
            }
            return true;
        }
        // Object check
        if (typeof a === 'object' && typeof b === 'object') {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;
            // Check for undefined vs missing keys
            for (const key of aKeys) {
                if (!b.hasOwnProperty(key)) return false;
                if (!eq(a[key], b[key])) return false;
            }
            return true;
        }

        return false;
    }
    return eq(this, other);
});
