import '../map/map-prototype';

describe('Map.prototype', () => {
    describe('toList()', () => {
        describe('type: entries', () => {
            it('should return array of entries by default', () => {
                const map = new Map([
                    ['a', 1],
                    ['b', 2],
                ]);
                expect(map.toList()).toEqual([
                    ['a', 1],
                    ['b', 2],
                ]);
            });

            it('should return entries when type is "entries"', () => {
                const map = new Map([['x', 42]]);
                expect(map.toList('entries')).toEqual([['x', 42]]);
            });

            it('should return empty array when map is empty', () => {
                const map = new Map();
                expect(map.toList()).toEqual([]);
            });
        });

        describe('type: keys', () => {
            it('should return array of keys when type is "keys"', () => {
                const map = new Map([
                    ['a', 1],
                    ['b', 2],
                ]);
                expect(map.toList('keys')).toEqual(['a', 'b']);
            });

            it('should return empty array of keys when map is empty', () => {
                const map = new Map();
                expect(map.toList('keys')).toEqual([]);
            });
        });

        describe('type: values', () => {
            it('should return array of values when type is "values"', () => {
                const map = new Map([
                    ['a', 1],
                    ['b', 2],
                ]);
                expect(map.toList('values')).toEqual([1, 2]);
            });

            it('should return empty array of values when map is empty', () => {
                const map = new Map();
                expect(map.toList('values')).toEqual([]);
            });
        });

        describe('type: object', () => {
            it('should return object when type is "object" with string keys', () => {
                const map = new Map([
                    ['a', 1],
                    ['b', 2],
                ]);
                expect(map.toList('object')).toEqual({ a: 1, b: 2 });
            });

            it('should return object with numeric keys converted to strings', () => {
                const map = new Map([
                    [1, 'x'],
                    [2, 'y'],
                ]);
                expect(map.toList('object')).toEqual({ '1': 'x', '2': 'y' });
            });

            it('should return empty object when map is empty', () => {
                const map = new Map();
                expect(map.toList('object')).toEqual({});
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when key is not string/number/symbol for object conversion', () => {
                const map = new Map<any, number>();
                const key = { foo: 1 };
                map.set(key, 42);
                expect(() => map.toList('object')).toThrow(TypeError);
            });

            it('should throw TypeError on unknown type', () => {
                const map = new Map();
                // @ts-expect-error
                expect(() => map.toList('unknown')).toThrow(TypeError);
            });
        });
    });

    describe('ensureArray()', () => {
        describe('with non-existing keys', () => {
            it('should return empty array and set it in map when key does not exist', () => {
                const map = new Map<string, number[]>();
                const arr = map.ensureArray('foo');
                expect(Array.isArray(arr)).toBe(true);
                expect(arr).toEqual([]);
                expect(map.get('foo')).toBe(arr);
            });

            it('should work with non-string keys', () => {
                const key = { id: 1 };
                const map = new Map<object, any[]>();
                const arr = map.ensureArray(key);
                expect(Array.isArray(arr)).toBe(true);
                expect(arr).toEqual([]);
                expect(map.get(key)).toBe(arr);
            });
        });

        describe('with existing array values', () => {
            it('should return existing array for existing key', () => {
                const map = new Map<string, number[]>();
                map.set('bar', [1, 2]);
                const arr = map.ensureArray('bar');
                expect(arr).toEqual([1, 2]);
                expect(map.get('bar')).toBe(arr);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when key is null or undefined', () => {
                const map = new Map<any, any[]>();
                expect(() => map.ensureArray(null)).toThrow(TypeError);
                expect(() => map.ensureArray(undefined)).toThrow(TypeError);
            });

            it('should throw TypeError when value for key is not an array', () => {
                const map = new Map<string, any>();
                map.set('baz', 123);
                expect(() => map.ensureArray('baz')).toThrow(TypeError);
            });
        });
    });

    describe('toObject()', () => {
        describe('with string keys', () => {
            it('should convert Map with string keys to object', () => {
                const map = new Map<string, number>([
                    ['a', 1],
                    ['b', 2],
                    ['c', 3],
                ]);
                const obj = map.toObject();
                expect(obj).toEqual({ a: 1, b: 2, c: 3 });
                expect(typeof obj).toBe('object');
            });

            it('should preserve insertion order for string keys', () => {
                const map = new Map<string, number>([
                    ['z', 26],
                    ['a', 1],
                    ['m', 13],
                ]);
                const obj = map.toObject();
                const keys = Object.keys(obj);
                expect(keys).toEqual(['z', 'a', 'm']);
            });
        });

        describe('with numeric keys', () => {
            it('should convert Map with numeric keys to object', () => {
                const map = new Map<number, string>([
                    [1, 'a'],
                    [2, 'b'],
                    [3, 'c'],
                ]);
                const obj = map.toObject();
                expect(obj).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
            });

            it('should convert Map with only numeric string keys', () => {
                const map = new Map<string, string>([
                    ['1', 'one'],
                    ['2', 'two'],
                    ['3', 'three'],
                ]);
                const obj = map.toObject();
                expect(obj).toEqual({ 1: 'one', 2: 'two', 3: 'three' });
            });
        });

        describe('with mixed key types', () => {
            it('should convert Map with mixed string and numeric keys', () => {
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
        });

        describe('with symbol keys', () => {
            it('should convert Map with symbol keys to object', () => {
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
        });

        describe('with various value types', () => {
            it('should convert Map with various value types', () => {
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
        });

        describe('with empty map', () => {
            it('should convert empty Map to empty object', () => {
                const map = new Map();
                const obj = map.toObject();
                expect(obj).toEqual({});
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when key is null', () => {
                const map = new Map<any, number>();
                map.set('valid', 1);
                map.set(null, 2);
                expect(() => map.toObject()).toThrow(TypeError);
            });

            it('should throw TypeError when key is undefined', () => {
                const map = new Map<any, number>();
                map.set('valid', 1);
                map.set(undefined, 3);
                expect(() => map.toObject()).toThrow(TypeError);
            });

            it('should throw TypeError when key is an object type', () => {
                const map = new Map<any, number>();
                map.set({ invalid: 'key' }, 1);
                expect(() => map.toObject()).toThrow(TypeError);
            });

            it('should throw TypeError when key is an array type', () => {
                const map = new Map<any, string>();
                map.set(['invalid'], 'value');
                expect(() => map.toObject()).toThrow(TypeError);
            });
        });

        describe('with duplicate keys', () => {
            it('should overwrite earlier keys with the same name', () => {
                const map = new Map<string, number>();
                map.set('key', 1);
                map.set('key', 2);
                const obj = map.toObject();
                expect(obj).toEqual({ key: 2 });
            });
        });
    });
});
