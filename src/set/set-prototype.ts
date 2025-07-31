import { defineIfNotExists } from '../utils';

export {};

declare global {
    interface Set<T> {
        /**
         * Converts the Set into an array, preserving insertion order.
         * @returns An array of all values in the Set.
         */
        toList<T>(): T[];

        /**
         * Returns true if at least one of the given items is present in the set.
         */
        hasAny(...items: T[]): boolean;

        /**
         * Returns true if all of the given items are present in the set.
         */
        includes(...items: T[]): boolean;
        includes(items: Set<T>): boolean;

        /**
         * Returns a new Set that is the union of this set and all given sets.
         */
        union(...others: Set<T>[]): Set<T>;

        /**
         * Returns a new Set that is the intersection of this set and all given sets.
         */
        intersection(...others: Set<T>[]): Set<T>;
    }
}

defineIfNotExists(Set.prototype, 'toList', function <T>(this: Set<T>): T[] {
    // Always returns a new array, even for empty sets
    return Array.from(this);
});

defineIfNotExists(Set.prototype, 'hasAny', function <T>(this: Set<T>, ...items: T[]): boolean {
    if (!Array.isArray(items)) throw new TypeError('Arguments must be an array');
    if (items.length === 0) return false;
    return items.some((item) => this.has(item));
});

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
