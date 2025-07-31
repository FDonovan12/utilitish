import { defineIfNotExists } from '../utils';

export {};

declare global {
    interface Map<K, V> {
        /**
         * Converts the Map into a list or object, depending on the selected type.
         * - `entries` (default): returns `[K, V][]`
         * - `keys`: returns `K[]`
         * - `values`: returns `V[]`
         * - `object`: returns `{ [key: string]: V }`
         */
        toList(type: 'keys'): K[];
        toList(type: 'values'): V[];
        toList(type: 'object'): Record<string, V>;
        toList(type: 'entries'): [K, V][];
        toList(): [K, V][];

        /**
         * Ensures that the value for the given key is an array.
         * If the key does not exist, it sets it to an empty array.
         *
         * @param key - The key to look up in the map.
         * @returns The array associated with the key.
         */
        ensureArray(this: Map<K, V[]>, key: K): V[];
    }
}

defineIfNotExists(Map.prototype, 'toList', function <
    K,
    V,
>(this: Map<K, V>, type: 'entries' | 'keys' | 'values' | 'object' = 'entries'):
    | [K, V][]
    | K[]
    | V[]
    | Record<string, V> {
    switch (type) {
        case 'keys':
            return Array.from(this.keys());
        case 'values':
            return Array.from(this.values());
        case 'object': {
            const obj: Record<string, V> = {};
            for (const [key, value] of this) {
                if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') {
                    // For number keys, convert to string (object keys are always strings or symbols)
                    obj[String(key)] = value;
                } else {
                    throw new TypeError(
                        `Map.prototype.toList('object') only supports string, number, or symbol keys. Got: ${typeof key}`,
                    );
                }
            }
            return obj;
        }
        case 'entries':
            return Array.from(this.entries());
        default:
            throw new TypeError(`Unknown type "${type}" for Map.prototype.toList`);
    }
});

defineIfNotExists(Map.prototype, 'ensureArray', function <K, V>(this: Map<K, V[]>, key: K): V[] {
    if (!this.has(key)) {
        this.set(key, []);
    }
    return this.get(key)!;
});
