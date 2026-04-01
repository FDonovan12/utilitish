import { Selector, isNumberOrString, resolveSelector } from './core.utils';

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
