import { defineIfNotExists, resolveSelector } from '../utils';

export {};

declare global {
    interface Array<T> {
        /**
         * Returns the first element of the array, or `undefined` if the array is empty.
         */
        first(): T | undefined;

        /**
         * Returns the last element of the array, or `undefined` if the array is empty.
         */
        last(): T | undefined;

        /**
         * Calculates the sum of the array values.
         * - If the array is of type `number[]`, no callback is required.
         * - Otherwise, a callback must be provided to extract a numeric value.
         *
         * @param callback - Optional function that returns a `number` from an item.
         * @throws {Error} If no callback is provided for a non-number array.
         * @returns The sum of the values.
         */
        sum(this: number[]): number;
        sum(this: T[], callback: (item: T) => number): number;

        /**
         * Returns a new array with only unique elements (based on strict equality).
         */
        unique(): T[];

        /**
         * Splits the array into chunks of the given size.
         * @param size - Maximum size of each chunk.
         */
        chunk(size: number): T[][];

        /**
         * Calculates the average of the array values.
         * - If the array is of type `number[]`, no callback is required.
         * - Otherwise, a callback must be provided to extract a numeric value.
         *
         * @param callback - Optional function that returns a `number` from an item.
         * @throws {Error} If no callback is provided for a non-number array.
         * @returns The average of the values.
         */
        average(this: number[]): number;
        average(this: T[], callback: (item: T) => number): number;

        /**
         * Groups the array elements based on a key returned by the callback function.
         * @param callback - Function that returns a key to group by.
         * @returns An object where keys are the group names and values are arrays of grouped items.
         */
        groupBy(callback: (item: T) => string | number): Record<string | number, T[]>;

        /**
         * Removes all falsy values (`false`, `null`, `0`, `""`, `undefined`, and `NaN`) from the array.
         * @returns A new array with all falsy values removed.
         */
        compact(): T[];

        /**
         * Enumerates the array into tuples [value, index].
         * Similar to Python's enumerate but returns value first.
         * @returns An array of [value, index] pairs.
         */
        enumerate(): [T, number][];

        /**
         * Returns a sorted copy of the array in ascending order.
         * - If no callback is provided, all elements must be of type `number` or `string`.
         * - If a callback is provided, it must return a `number` or `string` for each element.
         * @param callback Optional function to extract the value to sort by.
         * @throws {TypeError} If elements are not sortable or the callback returns an invalid type.
         * @returns A new array sorted in ascending order.
         */
        sortAsc(this: number[] | string[]): T[];
        sortAsc<K extends keyof T>(this: T[], key: K): T[];
        sortAsc(this: T[], callback: (item: T) => number | string): T[];

        /**
         * Returns a sorted copy of the array in descending order.
         * - If no callback is provided, all elements must be of type `number` or `string`.
         * - If a callback is provided, it must return a `number` or `string` for each element.
         * @param callback Optional function to extract the value to sort by.
         * @throws {TypeError} If elements are not sortable or the callback returns an invalid type.
         * @returns A new array sorted in descending order.
         */
        sortDesc(this: number[] | string[]): T[];
        sortDesc<K extends keyof T>(this: T[], key: K): T[];
        sortDesc(this: T[], callback: (item: T) => number | string): T[];

        /**
         * Swaps the values at two indices in the array.
         * @param i First index
         * @param j Second index
         * @returns The array itself after swapping
         */
        swap(i: number, j: number): this;

        /**
         * Returns a new array with the elements shuffled in random order.
         * Uses the Fisher-Yates shuffle algorithm.
         * @returns A new shuffled array.
         */
        shuffle(): T[];

        /**
         * Converts an array to a Map.
         * - If the array is of pairs [K, V], returns Map<K, V>.
         * - If a key is provided, returns Map<T[K], T>.
         * - If keySelector and valueSelector are provided, returns Map<K, V>.
         * @param keyOrKeySelector Key name or key selector function.
         * @param valueSelector Value selector function.
         */
        toMap<K, V>(this: [K, V][]): Map<K, V>;
        toMap<K extends keyof T>(this: T[], key: K): Map<T[K], T>;
        toMap<K, V>(): Map<number, T>;
        toMap<K, V>(this: T[], keyCallback: (item: T) => K): Map<K, T>;
        toMap<K, V>(this: T[], keyCallback: (item: T) => K, valueCallback: (item: T) => V): Map<K, V>;

        /**
         * Returns a Set containing the unique elements of the array.
         * If a selector is provided, it can be a function or a string key.
         * - If a function, it is called for each element.
         * - If a string, it is used as a property key of each element.
         * @param selector Optional function or string key to select the value to store in the Set.
         * @returns A Set of unique elements or selected values.
         */
        toSet(): Set<T>;
        toSet<K extends keyof T>(this: T[], key: K): Set<T[K]>;
        toSet<K>(this: T[], selector: (item: T) => K): Set<K>;

        /**
         * Returns a Map where the keys are the result of the selector (function or string key) and the values are the counts of each key.
         * @param selector Function or string key to select the key for counting.
         * @returns A Map with the count of each key.
         */
        countBy(): Map<T, number>;
        countBy<K extends keyof T>(this: T[], key: K): Set<T[K]>;
        countBy<K>(this: T[], selector: (item: T) => K): Set<K>;
    }
}

defineIfNotExists(Array.prototype, 'first', function <T>(this: T[]): T | undefined {
    return this[0];
});

defineIfNotExists(Array.prototype, 'last', function <T>(this: T[]): T | undefined {
    return this[this.length - 1];
});

defineIfNotExists(Array.prototype, 'sum', function <T>(this: T[], callback?: (item: T) => number): number {
    if (typeof callback === 'function') {
        return this.reduce((acc: number, item: T) => acc + callback(item), 0);
    }
    if (this.every((item) => typeof item === 'number')) {
        return (this as number[]).reduce((acc: number, item: number) => acc + item, 0);
    }
    throw new Error('Array.prototype.sum() requires a callback unless array is number[]');
});

defineIfNotExists(Array.prototype, 'unique', function <T>(this: T[]): T[] {
    return [...new Set(this)];
});

defineIfNotExists(Array.prototype, 'chunk', function <T>(this: T[], size: number): T[][] {
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
        throw new TypeError('Chunk size must be a positive integer');
    }
    const result: T[][] = [];
    for (let i = 0; i < this.length; i += size) {
        result.push(this.slice(i, i + size));
    }
    return result;
});

defineIfNotExists(Array.prototype, 'average', function <T>(this: T[], callback?: (item: T) => number): number {
    if (this.length === 0) return 0;
    if (typeof callback === 'function') {
        return this.reduce((acc: number, item: T) => acc + callback(item), 0) / this.length;
    }
    if (this.every((item) => typeof item === 'number')) {
        return (this as number[]).reduce((acc: number, item: number) => acc + item, 0) / this.length;
    }
    throw new Error('Array.prototype.average() requires a callback unless array is number[]');
});

defineIfNotExists(Array.prototype, 'groupBy', function <T>(this: T[], callback: (item: T) => string | number): Record<
    string | number,
    T[]
> {
    if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
    }
    const result: Record<string, T[]> = {};
    this.forEach((item: T) => {
        const key = callback(item);
        if (typeof key !== 'string' && typeof key !== 'number') {
            throw new TypeError('groupBy callback must return a string or number');
        }
        if (!result[key]) result[key] = [];
        result[key].push(item);
    });
    return result;
});

defineIfNotExists(Array.prototype, 'compact', function <T>(this: T[]): T[] {
    return this.filter(Boolean);
});

defineIfNotExists(Array.prototype, 'enumerate', function <T>(this: T[]): [T, number][] {
    return this.map((value, index) => [value, index]);
});

defineIfNotExists(Array.prototype, 'sortAsc', function <T>(this: T[], selector?: (item: T) => number | string): T[] {
    const arr = this.slice();
    if (arr.length === 0) return arr;

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !arr.every((item) => typeof item === 'number' || typeof item === 'string')) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return arr.sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (
            (typeof valA !== 'number' && typeof valA !== 'string') ||
            (typeof valB !== 'number' && typeof valB !== 'string')
        ) {
            throw new TypeError('Callback must return number or string');
        }

        if (valA > valB) return 1;
        if (valA < valB) return -1;
        return 0;
    });
});

defineIfNotExists(Array.prototype, 'sortDesc', function <
    T,
>(this: T[], selector?: keyof T | ((item: T) => number | string)): T[] {
    const arr = this.slice();
    if (arr.length === 0) return arr;

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !arr.every((item) => typeof item === 'number' || typeof item === 'string')) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return arr.sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (
            (typeof valA !== 'number' && typeof valA !== 'string') ||
            (typeof valB !== 'number' && typeof valB !== 'string')
        ) {
            throw new TypeError('Selector must return number or string');
        }

        if (valA > valB) return -1;
        if (valA < valB) return 1;
        return 0;
    });
});

defineIfNotExists(Array.prototype, 'swap', function <T>(this: T[], i: number, j: number): T[] {
    if (typeof i !== 'number' || typeof j !== 'number' || !Number.isInteger(i) || !Number.isInteger(j)) {
        throw new TypeError('Indices must be integers');
    }
    if (i < 0 || i >= this.length || j < 0 || j >= this.length) {
        throw new RangeError('Index out of bounds');
    }
    if (i !== j) {
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
});

defineIfNotExists(Array.prototype, 'shuffle', function <T>(this: T[]): T[] {
    const arr = this.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
});

defineIfNotExists(Array.prototype, 'toMap', function <
    T,
    K,
    V,
>(this: T[] | [K, V][], keySelector?: keyof T | ((item: T) => K), valueSelector?: keyof T | ((item: T) => V)): Map<
    number | K,
    V | T
> {
    if (this.length && Array.isArray(this[0]) && this[0].length === 2) {
        return new Map(this as [K, V][]);
    }

    const map = new Map<number | K, V | T>();

    const getKey = resolveSelector(keySelector, (_: T, index?: number) => index as number | K);
    const getValue = resolveSelector(valueSelector, (item: T) => item as V | T);

    for (let i = 0; i < this.length; i++) {
        const item = this[i] as T;
        const key = getKey(item, i);
        const value = getValue(item);
        map.set(key, value);
    }
    return map;
});

defineIfNotExists(Array.prototype, 'toSet', function <T, K>(this: T[], selector?: ((item: T) => K) | keyof T): Set<
    T | K
> {
    const getValue = resolveSelector(selector, (item: T) => item as K | T);
    return new Set(this.map(getValue));
});

defineIfNotExists(Array.prototype, 'countBy', function <T, K>(this: T[], selector?: ((item: T) => K) | keyof T): Map<
    K | T,
    number
> {
    const getKey = resolveSelector(selector, (item: T) => item as K | T);
    const map = new Map<K | T, number>();
    for (const item of this) {
        const key = getKey(item);
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
});
