import '../map/map-prototype';

describe('Map.prototype.toList', () => {
    it('returns entries by default', () => {
        const map = new Map([
            ['a', 1],
            ['b', 2],
        ]);
        expect(map.toList()).toEqual([
            ['a', 1],
            ['b', 2],
        ]);
    });

    it('returns keys when type is "keys"', () => {
        const map = new Map([
            ['a', 1],
            ['b', 2],
        ]);
        expect(map.toList('keys')).toEqual(['a', 'b']);
    });

    it('returns values when type is "values"', () => {
        const map = new Map([
            ['a', 1],
            ['b', 2],
        ]);
        expect(map.toList('values')).toEqual([1, 2]);
    });

    it('returns an object when type is "object" with string keys', () => {
        const map = new Map([
            ['a', 1],
            ['b', 2],
        ]);
        expect(map.toList('object')).toEqual({ a: 1, b: 2 });
    });

    it('returns an object when type is "object" with number keys', () => {
        const map = new Map([
            [1, 'x'],
            [2, 'y'],
        ]);
        expect(map.toList('object')).toEqual({ '1': 'x', '2': 'y' });
    });

    it('throws if a key is not string/number/symbol for object', () => {
        const map = new Map<any, number>();
        const key = { foo: 1 };
        map.set(key, 42);
        expect(() => map.toList('object')).toThrow(TypeError);
    });

    it('returns an empty array/object for an empty map', () => {
        const map = new Map();
        expect(map.toList()).toEqual([]);
        expect(map.toList('keys')).toEqual([]);
        expect(map.toList('values')).toEqual([]);
        expect(map.toList('object')).toEqual({});
    });

    it('returns entries when type is "entries"', () => {
        const map = new Map([['x', 42]]);
        expect(map.toList('entries')).toEqual([['x', 42]]);
    });

    it('throws on unknown type', () => {
        const map = new Map();
        // @ts-expect-error
        expect(() => map.toList('unknown')).toThrow(TypeError);
    });
});
