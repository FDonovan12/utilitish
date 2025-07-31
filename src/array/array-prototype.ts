import { defineIfNotExists, isNumberOrString, resolveSelector, Selector } from '../utils';

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
        sum<K extends keyof T>(this: T[], key: K): number;
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
        average<K extends keyof T>(this: T[], key: K): number;
        average(this: T[], callback: (item: T) => number): number;

        /**
         * Groups the array elements based on a key returned by the selector.
         * The selector can be a function or a string key.
         * @param selector Function or string key to group by.
         * @returns A Map where keys are group values and values are arrays of grouped items.
         */
        groupBy<K extends keyof T>(this: T[], key: K): Map<T[K], T[]>;
        groupBy<K>(this: T[], selector: (item: T) => K): Map<K, T[]>;

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
        countBy<K extends keyof T>(this: T[], key: K): Map<T[K], number>;
        countBy<K>(this: T[], selector: (item: T) => K): Map<K, number>;
    }
}

defineIfNotExists(Array.prototype, 'first', function <T>(this: T[]): T | undefined {
    return this[0];
});

defineIfNotExists(Array.prototype, 'last', function <T>(this: T[]): T | undefined {
    return this[this.length - 1];
});

defineIfNotExists(Array.prototype, 'sum', function <T>(this: T[], selector?: Selector<T, number>): number {
    if (this.length === 0) return 0;
    const getValue = resolveSelector(selector, (item: T) => item as number);
    if (this.every((item) => typeof getValue(item) === 'number')) {
        return this.reduce((acc: number, item: T) => getValue(item) + acc, 0);
    }
    throw new TypeError('Array.prototype.sum() requires a callback who return a number unless array is number[]');
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

defineIfNotExists(Array.prototype, 'average', function <T>(this: T[], selector?: Selector<T, number>): number {
    if (this.length === 0) return 0;
    const getValue = resolveSelector(selector, (item: T) => item as number);
    if (this.every((item) => typeof getValue(item) === 'number')) {
        return this.reduce((acc: number, item: T) => getValue(item) + acc, 0) / this.length;
    }
    throw new TypeError('Array.prototype.average() requires a callback who return a number unless array is number[]');
});

defineIfNotExists(Array.prototype, 'groupBy', function <T, K>(this: T[], selector?: Selector<T, K>): Map<K, T[]> {
    const getKey = resolveSelector(selector, (item: T) => item as unknown as K);

    const map = new Map<K, T[]>();
    for (const item of this) {
        const key = getKey(item);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(item);
    }
    return map;
});

defineIfNotExists(Array.prototype, 'compact', function <T>(this: T[]): T[] {
    return this.filter(Boolean);
});

defineIfNotExists(Array.prototype, 'enumerate', function <T>(this: T[]): [T, number][] {
    return this.map((value, index) => [value, index]);
});

defineIfNotExists(Array.prototype, 'sortBy', function <
    T,
>(this: T[], direction: 'asc' | 'desc', selector?: Selector<T, number | string>): T[] {
    if (this.length === 0) return this.slice();

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !this.every((item) => isNumberOrString(item))) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return this.slice().sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (!isNumberOrString(valA) || !isNumberOrString(valB)) {
            throw new TypeError('Callback must return number or string');
        }

        if (valA > valB) return direction === 'asc' ? 1 : -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        return 0;
    });
});

defineIfNotExists(Array.prototype, 'sortAsc', function <T>(this: T[], selector?: Selector<T, number | string>): T[] {
    return sortBy(this, 'asc', selector);
});

defineIfNotExists(Array.prototype, 'sortDesc', function <T>(this: T[], selector?: Selector<T, number | string>): T[] {
    return sortBy(this, 'desc', selector);
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
>(this: T[] | [K, V][], keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>): Map<number | K, V | T> {
    if (!keySelector && this.length && this.every((item) => Array.isArray(item) && item.length === 2)) {
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

defineIfNotExists(Array.prototype, 'toSet', function <T, K>(this: T[], selector?: Selector<T, K>): Set<T | K> {
    const getValue = resolveSelector(selector, (item: T) => item as K | T);
    return new Set(this.map(getValue));
});

defineIfNotExists(Array.prototype, 'countBy', function <T, K>(this: T[], selector?: Selector<T, K>): Map<
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

function sortBy<T>(arr: T[], direction: 'asc' | 'desc', selector?: Selector<T, number | string>): T[] {
    if (arr.length === 0) return arr.slice();

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !arr.every((item) => isNumberOrString(item))) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return arr.slice().sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (!isNumberOrString(valA) || !isNumberOrString(valB)) {
            throw new TypeError('Callback must return number or string');
        }

        if (valA > valB) return direction === 'asc' ? 1 : -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        return 0;
    });
}
