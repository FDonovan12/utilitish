import { defineIfNotExists } from '../utils/core.utils';

export {};

declare global {
    interface Set<T> {
        /**
         * Converts the Set into an array, preserving insertion order.
         *
         * @template T The type of elements in the Set
         * @this {Set<T>} The Set to convert
         * @returns {T[]} An array containing all values in the Set in insertion order
         *
         * @example
         * const set = new Set([1, 2, 3]);
         * const arr = set.toList(); // [1, 2, 3]
         *
         * @remarks
         * - Returns a new array instance each time; modifying it does not affect the Set
         * - Empty sets return an empty array
         */
        toList<T>(): T[];

        /**
         * Returns true if at least one of the given items is present in the Set.
         *
         * @template T The type of elements in the Set
         * @this {Set<T>} The Set to check
         * @param {...T[]} items - Variable number of items to check
         * @returns {boolean} True if any item is in the Set, false if no items or Set is empty
         * @throws {TypeError} If arguments are not in array-like form
         *
         * @example
         * const set = new Set(['a', 'b', 'c']);
         * set.hasAny('d', 'a'); // true
         * set.hasAny('d', 'e'); // false
         *
         * @remarks
         * - Returns false if no items are provided (empty arguments)
         * - Uses strict equality (===) to check for item presence
         */
        hasAny(...items: T[]): boolean;

        /**
         * Returns true if all of the given items are present in the Set.
         * Can accept items as separate arguments or as a single Set parameter.
         *
         * @template T The type of elements in the Set
         * @this {Set<T>} The Set to check
         * @param {...(T[] | Set<T>)} args - Items to check (varargs or single Set)
         * @returns {boolean} True if all items are in the Set, false otherwise
         * @throws {TypeError} If arguments are not in a valid format or not all Sets
         *
         * @example
         * const set = new Set(['a', 'b', 'c']);
         * set.includes('a', 'b'); // true
         * set.includes('a', 'd'); // false
         * set.includes(new Set(['a', 'b'])); // true
         *
         * @remarks
         * - Returns true if no arguments are provided (like Array's every())
         * - Can check against another Set by passing it as the single argument
         * - Uses strict equality (===) for item comparison
         */
        includes(...items: T[]): boolean;
        includes(items: Set<T>): boolean;

        /**
         * Returns a new Set that is the union (combination) of this Set and all given Sets.
         *
         * @template T The type of elements in the Sets
         * @this {Set<T>} The Set to start with
         * @param {...Set<T>[]} others - Sets to union with
         * @returns {Set<T>} A new Set containing all unique elements from this Set and all given Sets
         * @throws {TypeError} If any argument is not a Set instance
         *
         * @example
         * const set1 = new Set([1, 2, 3]);
         * const set2 = new Set([3, 4, 5]);
         * const result = set1.union(set2); // Set(5) { 1, 2, 3, 4, 5 }
         *
         * @remarks
         * - Does not modify the original Set
         * - Duplicate values across sets are automatically deduplicated (Set behavior)
         * - Returns a new Set instance each time
         */
        union(...others: Set<T>[]): Set<T>;

        /**
         * Returns a new Set that is the intersection of this Set and all given Sets.
         * Contains only elements that are present in all Sets (this + all given Sets).
         *
         * @template T The type of elements in the Sets
         * @this {Set<T>} The Set to start with
         * @param {...Set<T>[]} others - Sets to intersect with
         * @returns {Set<T>} A new Set containing only elements that exist in all Sets
         * @throws {TypeError} If any argument is not a Set instance
         *
         * @example
         * const set1 = new Set([1, 2, 3, 4]);
         * const set2 = new Set([2, 3, 5]);
         * const set3 = new Set([3, 6]);
         * const result = set1.intersection(set2, set3); // Set(1) { 3 }
         *
         * @remarks
         * - Does not modify the original Set
         * - Returns an empty Set if no elements are common to all Sets
         * - Returns a new Set instance each time
         */
        intersection(...others: Set<T>[]): Set<T>;
    }
}

/**
 * @see Set.prototype.toList
 */
defineIfNotExists(Set.prototype, 'toList', function <T>(this: Set<T>): T[] {
    // Always returns a new array, even for empty sets
    return Array.from(this);
});

/**
 * @see Set.prototype.hasAny
 */
defineIfNotExists(Set.prototype, 'hasAny', function <T>(this: Set<T>, ...items: T[]): boolean {
    if (!Array.isArray(items)) throw new TypeError('Arguments must be an array');
    if (items.length === 0) return false;
    return items.some((item) => this.has(item));
});

/**
 * @see Set.prototype.includes
 */
defineIfNotExists(Set.prototype, 'includes', function <T>(this: Set<T>, ...args: T[]): boolean {
    let values: T[];

    if (args.length === 0) return true; // empty means "all included" (like [].every)
    if (args.length === 1 && args[0] instanceof Set) {
        values = Array.from(args[0]);
    } else {
        values = args;
    }
    if (!Array.isArray(values)) throw new TypeError('Arguments must be an array or a Set');
    return values.every((item) => this.has(item));
});

/**
 * @see Set.prototype.union
 */
defineIfNotExists(Set.prototype, 'union', function <T>(this: Set<T>, ...others: Set<T>[]): Set<T> {
    const result = new Set(this);
    for (const other of others) {
        if (!(other instanceof Set)) throw new TypeError('Arguments must be Sets');
        for (const item of other) {
            result.add(item);
        }
    }
    return result;
});

/**
 * @see Set.prototype.intersection
 */
defineIfNotExists(Set.prototype, 'intersection', function <T>(this: Set<T>, ...others: Set<T>[]): Set<T> {
    if (others.some((s) => !(s instanceof Set))) throw new TypeError('Arguments must be Sets');
    const result = new Set<T>();
    for (const item of this) {
        if (others.every((set) => set.has(item))) {
            result.add(item);
        }
    }
    return result;
});
