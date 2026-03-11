export function mapToObject<K extends PropertyKey, V>(map: Map<K, V>): Record<K, V> {
    const obj: Record<PropertyKey, any> = {};

    for (const [key, value] of map) {
        // Validate that key is not null or undefined
        if (key === null || key === undefined) {
            throw new TypeError(`Invalid key: key cannot be null or undefined. Key received: ${String(key)}`);
        }

        const keyType = typeof key;

        // Only allow string, number, or symbol
        if (keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
            throw new TypeError(
                `Invalid key type: keys must be string, number, or symbol, received ${keyType}. Key value: ${String(key)}`,
            );
        }

        obj[key as PropertyKey] = value;
    }

    return obj as Record<K, V>;
}
