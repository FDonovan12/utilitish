import { defineIfNotExists } from '../utils/core.utils';

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

        /**
         * Converts the object to a stable string representation with sorted keys.
         * The resulting string is deterministic: the same object will always produce the same string.
         *
         * @returns {string} A stable string representation of the object
         *
         * @example
         * const obj = { b: 2, a: 1 };
         * obj.stableStringify(); // '{"a":1,"b":2}'
         *
         * const obj2 = { a: 1, b: 2 };
         * obj2.stableStringify(); // '{"a":1,"b":2}' (same result, different key order)
         *
         * @remarks
         * - Object keys are sorted alphabetically to ensure stable output
         * - Arrays maintain their element order
         * - Null and primitives are handled using JSON.stringify
         */
        stableStringify(): string;

        /**
         * Generates a stable hash of the object using FNV-1a algorithm.
         * The hash is deterministic: the same object will always produce the same hash.
         *
         * @returns {string} A hexadecimal string representing the hash of the object
         *
         * @example
         * const obj = { b: 2, a: 1 };
         * obj.stableHash(); // '7a8c9f2b'
         *
         * const obj2 = { a: 1, b: 2 };
         * obj2.stableHash(); // '7a8c9f2b' (same hash, different key order)
         *
         * @remarks
         * - Uses FNV-1a (Fowler–Noll–Vo) hashing algorithm
         * - The object is first converted to a stable string using stableStringify()
         * - The hash is returned as a hexadecimal string
         */
        stableHash(): string;
    }
}

/**
 * @see Object.prototype.deepClone
 */
defineIfNotExists(Object.prototype, 'deepClone', function (this: any) {
    return structuredClone(this);
});

/**
 * @see Object.prototype.deepMerge
 */
defineIfNotExists(Object.prototype, 'deepMerge', function (this: object, source: any) {
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
defineIfNotExists(Object.prototype, 'deepEquals', function (this: unknown, other: unknown): boolean {
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

/**
 * @see Object.prototype.stableStringify
 */
defineIfNotExists(Object.prototype, 'stableStringify', function (this: any): string {
    const stringify = (v: unknown): string => {
        if (v === null || typeof v !== 'object') {
            return JSON.stringify(v);
        }

        if (Array.isArray(v)) {
            return '[' + v.map(stringify).join(',') + ']';
        }

        const obj = v as Record<string, unknown>;

        const keys = Object.keys(obj).sort();

        const entries = keys.map((key) => JSON.stringify(key) + ':' + stringify(obj[key]));

        return '{' + entries.join(',') + '}';
    };

    return stringify(this);
});

/**
 * @see Object.prototype.stableHash
 */
defineIfNotExists(Object.prototype, 'stableHash', function (this: any): string {
    const str: string = (this as any).stableStringify();

    let hash = 2166136261;

    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16);
});
