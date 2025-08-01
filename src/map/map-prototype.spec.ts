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

describe('Map.prototype.ensureArray', () => {
    it('returns an empty array if the key does not exist', () => {
        const map = new Map<string, number[]>();
        const arr = map.ensureArray('foo');
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).toEqual([]);
        expect(map.get('foo')).toBe(arr);
    });

    it('returns the existing array for the key', () => {
        const map = new Map<string, number[]>();
        map.set('bar', [1, 2]);
        const arr = map.ensureArray('bar');
        expect(arr).toEqual([1, 2]);
        expect(map.get('bar')).toBe(arr);
    });

    it('throws if the key is null or undefined', () => {
        const map = new Map<any, any[]>();
        expect(() => map.ensureArray(null)).toThrow(TypeError);
        expect(() => map.ensureArray(undefined)).toThrow(TypeError);
    });

    it('throws if the value for the key is not an array', () => {
        const map = new Map<string, any>();
        map.set('baz', 123);
        expect(() => map.ensureArray('baz')).toThrow(TypeError);
    });

    it('works with non-string keys', () => {
        const key = { id: 1 };
        const map = new Map<object, any[]>();
        const arr = map.ensureArray(key);
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).toEqual([]);
        expect(map.get(key)).toBe(arr);
    });
});
