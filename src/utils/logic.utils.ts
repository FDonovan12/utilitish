import { Selector, resolveSelector, isNumberOrString } from './core.utils';

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

export function sortBy<T>(arr: T[], direction: 'asc' | 'desc', selector?: Selector<T, number | string>): T[] {
    if (arr.length === 0) return arr.slice();

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !arr.every((item) => isNumberOrString(item))) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return arr.slice().sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (!isNumberOrString(valA) || !isNumberOrString(valB)) {
            throw new TypeError('Selector must return number or string');
        }

        if (valA > valB) return direction === 'asc' ? 1 : -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        return 0;
    });
}
