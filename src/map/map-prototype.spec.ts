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

describe('Map.prototype.toObject', () => {
    it('converts Map with string keys to object', () => {
        const map = new Map<string, number>([
            ['a', 1],
            ['b', 2],
            ['c', 3],
        ]);
        const obj = map.toObject();
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        expect(typeof obj).toBe('object');
    });

    it('converts Map with numeric keys to object', () => {
        const map = new Map<number, string>([
            [1, 'a'],
            [2, 'b'],
            [3, 'c'],
        ]);
        const obj = map.toObject();
        expect(obj).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
    });

    it('converts Map with mixed string and numeric keys', () => {
        const map = new Map<string | number, string>([
            ['name', 'Alice'],
            [1, 'one'],
            ['age', '30'],
            [2, 'two'],
        ]);
        const obj = map.toObject();
        expect(obj).toEqual({
            name: 'Alice',
            1: 'one',
            age: '30',
            2: 'two',
        });
    });

    it('converts empty Map to empty object', () => {
        const map = new Map();
        const obj = map.toObject();
        expect(obj).toEqual({});
    });

    it('converts Map with various value types', () => {
        const map = new Map<string, any>([
            ['string', 'hello'],
            ['number', 42],
            ['boolean', true],
            ['null', null],
            ['array', [1, 2, 3]],
            ['object', { nested: 'value' }],
        ]);
        const obj = map.toObject();
        expect(obj).toEqual({
            string: 'hello',
            number: 42,
            boolean: true,
            null: null,
            array: [1, 2, 3],
            object: { nested: 'value' },
        });
    });

    it('converts Map with symbol keys to object', () => {
        const sym1 = Symbol('key1');
        const sym2 = Symbol('key2');
        const map = new Map<symbol, string>([
            [sym1, 'value1'],
            [sym2, 'value2'],
        ]);
        const obj = map.toObject();
        expect(obj[sym1]).toBe('value1');
        expect(obj[sym2]).toBe('value2');
    });

    it('throws error when key is null', () => {
        const map = new Map<any, number>();
        map.set('valid', 1);
        map.set(null, 2);
        expect(() => map.toObject()).toThrow(TypeError);
    });

    it('throws error when key is undefined', () => {
        const map = new Map<any, number>();
        map.set('valid', 1);
        map.set(undefined, 3);
        expect(() => map.toObject()).toThrow(TypeError);
    });

    it('throws error when key is an object type', () => {
        const map = new Map<any, number>();
        map.set({ invalid: 'key' }, 1);
        expect(() => map.toObject()).toThrow(TypeError);
    });

    it('throws error when key is an array type', () => {
        const map = new Map<any, string>();
        map.set(['invalid'], 'value');
        expect(() => map.toObject()).toThrow(TypeError);
    });

    it('overwrites earlier keys with the same name', () => {
        const map = new Map<string, number>();
        map.set('key', 1);
        // Maps don't allow duplicate keys, so this just updates the value
        map.set('key', 2);
        const obj = map.toObject();
        expect(obj).toEqual({ key: 2 });
    });

    it('preserves insertion order for string keys', () => {
        const map = new Map<string, number>([
            ['z', 26],
            ['a', 1],
            ['m', 13],
        ]);
        const obj = map.toObject();
        const keys = Object.keys(obj);
        expect(keys).toEqual(['z', 'a', 'm']);
    });

    it('converts Map with only numeric string keys', () => {
        const map = new Map<string, string>([
            ['1', 'one'],
            ['2', 'two'],
            ['3', 'three'],
        ]);
        const obj = map.toObject();
        expect(obj).toEqual({ 1: 'one', 2: 'two', 3: 'three' });
    });

    // it('works with Map subclass', () => {
    //     class CustomMap extends Map {}
    //     const map = new CustomMap([
    //         ['key1', 'value1'],
    //         ['key2', 'value2'],
    //     ]);
    //     const obj = map.toObject();
    //     expect(obj).toEqual({ key1: 'value1', key2: 'value2' });
    // });
});
