import './array-prototype';

describe('Array.prototype', () => {
    describe('first()', () => {
        it('should return first element of non-empty array', () => {
            expect([1, 2, 3].first()).toBe(1);
        });

        it('should return undefined for empty array', () => {
            expect([].first()).toBe(undefined);
        });
    });

    describe('last()', () => {
        it('should return last element of non-empty array', () => {
            expect([1, 2, 3].last()).toBe(3);
        });

        it('should return undefined for empty array', () => {
            expect([].last()).toBe(undefined);
        });
    });

    describe('sum()', () => {
        describe('with number arrays', () => {
            it('should return sum of all numbers', () => {
                expect([1, 2, 3].sum()).toBe(6);
            });

            it('should return 0 for empty array', () => {
                expect([].sum()).toBe(0);
            });

            it('should return 0 when array contains only 0', () => {
                expect([0].sum()).toBe(0);
            });
        });

        describe('with selector function', () => {
            it('should return the sum when using selector function', () => {
                const items = [{ x: 1 }, { x: 2 }];
                expect(items.sum((item) => item.x)).toBe(3);
            });
        });

        describe('with selector string key', () => {
            it('should return the sum when using property key', () => {
                const items = [{ x: 1 }, { x: 2 }];
                expect(items.sum('x')).toBe(3);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when called on non-number array without selector', () => {
                const items = [{ x: 2 }, { x: 4 }] as any;
                expect(() => items.sum()).toThrow(TypeError);
            });
        });
    });

    describe('average()', () => {
        describe('with number arrays', () => {
            it('should return average of all numbers', () => {
                expect([2, 4, 6].average()).toBe(4);
            });

            it('should return 0 for empty array', () => {
                expect([].average()).toBe(0);
            });
        });

        describe('with selector function', () => {
            it('should return the average when using selector function', () => {
                const items = [{ x: 2 }, { x: 4 }];
                expect(items.average((item) => item.x)).toBe(3);
            });
        });

        describe('with selector string key', () => {
            it('should return the average when using property key', () => {
                const items = [{ x: 2 }, { x: 4 }];
                expect(items.average('x')).toBe(3);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when called on non-number array without selector', () => {
                const items = [{ x: 2 }, { x: 4 }] as any;
                expect(() => items.average()).toThrow(TypeError);
            });
        });
    });

    describe('unique()', () => {
        it('should return array with unique values', () => {
            expect([1, 1, 2, 2, 3].unique()).toEqual([1, 2, 3]);
        });
    });

    describe('chunk()', () => {
        describe('with valid size', () => {
            it('should split array into chunks of even elements', () => {
                expect([1, 2, 3, 4].chunk(2)).toEqual([
                    [1, 2],
                    [3, 4],
                ]);
            });

            it('should include partial chunk at end when array does not divide evenly', () => {
                expect([1, 2, 3].chunk(2)).toEqual([[1, 2], [3]]);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when size is not a positive integer', () => {
                const arr = [1, 2, 3];
                expect(() => arr.chunk(0)).toThrow(TypeError);
                expect(() => arr.chunk(-1)).toThrow(TypeError);
                expect(() => arr.chunk(1.5)).toThrow(TypeError);
                expect(() => arr.chunk('a' as any)).toThrow(TypeError);
            });
        });
    });

    describe('groupBy()', () => {
        it('should group by property key', () => {
            const arr = [
                { type: 'a', value: 1 },
                { type: 'b', value: 2 },
                { type: 'a', value: 3 },
            ];
            const map = arr.groupBy('type');
            expect(map instanceof Map).toBe(true);
            expect(map.get('a')).toEqual([
                { type: 'a', value: 1 },
                { type: 'a', value: 3 },
            ]);
            expect(map.get('b')).toEqual([{ type: 'b', value: 2 }]);
        });

        it('should group by selector function', () => {
            const arr = [1, 2, 3, 4, 5, 6];
            const map = arr.groupBy((x) => (x % 2 === 0 ? 'even' : 'odd'));
            expect(map instanceof Map).toBe(true);
            expect(map.get('even')).toEqual([2, 4, 6]);
            expect(map.get('odd')).toEqual([1, 3, 5]);
        });

        it('should return an empty Map when array is empty', () => {
            expect([].groupBy((x) => x)).toEqual(new Map());
        });
    });

    describe('compact()', () => {
        it('should remove all falsy values', () => {
            expect([0, 1, false, 2, '', 3, null].compact()).toEqual([1, 2, 3]);
        });
    });

    describe('enumerate()', () => {
        it('should return array of [value, index] tuples', () => {
            const result = ['a', 'b', 'c'].enumerate();
            expect(result).toEqual([
                ['a', 0],
                ['b', 1],
                ['c', 2],
            ]);
        });
    });

    describe('sortAsc()', () => {
        describe('with primitive arrays', () => {
            it('should sort numbers in ascending order', () => {
                expect([3, 1, 2].sortAsc()).toEqual([1, 2, 3]);
            });

            it('should sort strings in ascending order', () => {
                expect(['b', 'a', 'c'].sortAsc()).toEqual(['a', 'b', 'c']);
            });

            it('should return empty array when empty', () => {
                expect([].sortAsc()).toEqual([]);
            });
        });

        describe('with selector function', () => {
            it('should sort using selector function', () => {
                const arr = [{ v: 2 }, { v: 1 }];
                expect(arr.sortAsc((x) => x.v)).toEqual([{ v: 1 }, { v: 2 }]);
            });
        });

        describe('with selector string key', () => {
            it('should sort using property key', () => {
                const arr = [{ v: 2 }, { v: 1 }];
                expect(arr.sortAsc('v')).toEqual([{ v: 1 }, { v: 2 }]);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when selector returns non-sortable type', () => {
                expect(() => [{ v: {} }, { v: {} }].sortAsc((x) => x.v as any)).toThrow(TypeError);
            });

            it('should throw TypeError when elements are not sortable without selector', () => {
                expect(() => [{ v: 1 } as any].sortAsc()).toThrow(TypeError);
            });
        });
    });

    describe('sortDesc()', () => {
        describe('with primitive arrays', () => {
            it('should sort numbers in descending order', () => {
                expect([1, 3, 2, 4].sortDesc()).toEqual([4, 3, 2, 1]);
            });

            it('should sort strings in descending order', () => {
                expect(['b', 'a', 'c'].sortDesc()).toEqual(['c', 'b', 'a']);
            });

            it('should return empty array when empty', () => {
                expect([].sortDesc()).toEqual([]);
            });
        });

        describe('with selector function', () => {
            it('should sort using selector function', () => {
                const arr = [{ v: 1 }, { v: 2 }];
                expect(arr.sortDesc((x) => x.v)).toEqual([{ v: 2 }, { v: 1 }]);
            });
        });

        describe('with selector string key', () => {
            it('should sort using property key', () => {
                const arr = [{ v: 1 }, { v: 2 }];
                expect(arr.sortDesc('v')).toEqual([{ v: 2 }, { v: 1 }]);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when selector returns non-sortable type', () => {
                expect(() => [{ v: {} }, { v: {} }].sortDesc((x) => x.v as any)).toThrow(TypeError);
            });

            it('should throw TypeError when elements are not sortable without selector', () => {
                expect(() => [{ v: 1 } as any].sortDesc()).toThrow(TypeError);
            });
        });
    });

    describe('swap()', () => {
        describe('with valid indices', () => {
            it('should swap two elements at given indices', () => {
                const arr = [1, 2, 3];
                arr.swap(0, 2);
                expect(arr).toEqual([3, 2, 1]);
            });

            it('should do nothing when indices are identical', () => {
                const arr = [1, 2, 3];
                arr.swap(1, 1);
                expect(arr).toEqual([1, 2, 3]);
            });
        });

        describe('error handling', () => {
            it('should throw RangeError when index is out of bounds', () => {
                const arr = [1, 2, 3];
                expect(() => arr.swap(-1, 2)).toThrow(RangeError);
                expect(() => arr.swap(0, 3)).toThrow(RangeError);
            });

            it('should throw TypeError when indices are not integers', () => {
                const arr = [1, 2, 3];
                expect(() => arr.swap(0.5, 2)).toThrow(TypeError);
                expect(() => arr.swap(0, 'a' as any)).toThrow(TypeError);
            });
        });
    });

    describe('shuffle()', () => {
        it('should return a new array with same elements in different order', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = arr.shuffle();
            expect(shuffled).toHaveLength(arr.length);
            expect(shuffled.sort()).toEqual(arr.sort());
        });

        it('should not mutate the original array', () => {
            const arr = [1, 2, 3];
            const copy = arr.slice();
            arr.shuffle();
            expect(arr).toEqual(copy);
        });

        it('should return a new array instance', () => {
            const arr = [1, 2, 3];
            const shuffled = arr.shuffle();
            expect(shuffled).not.toBe(arr);
        });

        it('should return an empty array when called on empty array', () => {
            expect([].shuffle()).toEqual([]);
        });
    });

    describe('toMap()', () => {
        describe('with pairs array', () => {
            it('should convert array of pairs to Map', () => {
                const arr: [string, number][] = [
                    ['a', 1],
                    ['b', 2],
                ];
                const map = arr.toMap();
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get('a')).toBe(1);
                expect(map.get('b')).toBe(2);
            });
        });

        describe('with selector string key and no value selector', () => {
            it('should convert array of objects using property key', () => {
                const arr = [
                    { id: 1, name: 'foo' },
                    { id: 2, name: 'bar' },
                ];
                const map = arr.toMap('id');
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get(1)).toEqual({ id: 1, name: 'foo' });
                expect(map.get(2)).toEqual({ id: 2, name: 'bar' });
            });
        });

        describe('with selector functions', () => {
            it('should convert array using key and value selectors', () => {
                const arr = [
                    { id: 1, name: 'foo' },
                    { id: 2, name: 'bar' },
                ];
                const map = arr.toMap(
                    (x) => x.id,
                    (x) => x.name,
                );
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get(1)).toBe('foo');
                expect(map.get(2)).toBe('bar');
            });

            it('should convert array using key selector only', () => {
                const arr = [
                    { id: 1, name: 'foo' },
                    { id: 2, name: 'bar' },
                ];
                const map = arr.toMap((x) => x.id);
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get(1)).toEqual({ id: 1, name: 'foo' });
                expect(map.get(2)).toEqual({ id: 2, name: 'bar' });
            });

            it('should convert array using string key and value selector', () => {
                const arr = [
                    { id: 1, name: 'foo' },
                    { id: 2, name: 'bar' },
                ];
                const map = arr.toMap('id', (x) => x.name);
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get(1)).toBe('foo');
                expect(map.get(2)).toBe('bar');
            });
        });

        describe('with no selectors', () => {
            it('should use index as key', () => {
                const arr = [
                    { id: 1, name: 'foo' },
                    { id: 2, name: 'bar' },
                ];
                const map = arr.toMap();
                expect(map instanceof Map).toBe(true);
                expect(map.size).toBe(2);
                expect(map.get(0)).toEqual({ id: 1, name: 'foo' });
                expect(map.get(1)).toEqual({ id: 2, name: 'bar' });
            });
        });

        describe('error handling', () => {
            it('should throw Error when key selector is invalid', () => {
                expect(() => [{ id: 1 }].toMap(123 as any)).toThrow(Error);
            });
        });
    });

    describe('toSet()', () => {
        describe('without selector', () => {
            it('should return Set of unique elements', () => {
                expect([1, 2, 2, 3].toSet()).toEqual(new Set([1, 2, 3]));
            });

            it('should return empty Set when array is empty', () => {
                expect([].toSet()).toEqual(new Set());
            });
        });

        describe('with selector function', () => {
            it('should return Set of selected values', () => {
                const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
                expect(arr.toSet((x) => x.id)).toEqual(new Set([1, 2]));
            });
        });

        describe('with selector string key', () => {
            it('should return Set of property key values', () => {
                const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
                expect(arr.toSet('id')).toEqual(new Set([1, 2]));
            });
        });
    });

    describe('countBy()', () => {
        describe('without selector', () => {
            it('should count elements directly', () => {
                const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
                expect(arr.countBy()).toEqual(
                    new Map([
                        ['a', 3],
                        ['b', 2],
                        ['c', 1],
                    ]),
                );
            });

            it('should return empty Map when array is empty', () => {
                expect([].countBy((x) => x)).toEqual(new Map());
            });
        });

        describe('with selector function', () => {
            it('should count elements by selector result', () => {
                const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
                expect(arr.countBy((x) => x)).toEqual(
                    new Map([
                        ['a', 3],
                        ['b', 2],
                        ['c', 1],
                    ]),
                );
            });

            it('should count objects by extracted value', () => {
                const arr = [{ type: 'x' }, { type: 'y' }, { type: 'x' }];
                expect(arr.countBy((x) => x.type)).toEqual(
                    new Map([
                        ['x', 2],
                        ['y', 1],
                    ]),
                );
            });
        });

        describe('with selector string key', () => {
            it('should count objects by property key', () => {
                const arr = [{ type: 'x' }, { type: 'y' }, { type: 'x' }];
                expect(arr.countBy('type')).toEqual(
                    new Map([
                        ['x', 2],
                        ['y', 1],
                    ]),
                );
            });
        });

        describe('error handling', () => {
            it('should throw Error for invalid selector', () => {
                expect(() => [{ id: 1 }].toMap(123 as any)).toThrow(Error);
            });
        });
    });

    describe('Array.prototype.toObject', () => {
        it('should converts array of pairs to object', () => {
            const arr: [string, number][] = [
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ];
            const obj = arr.toObject();
            expect(obj).toEqual({ a: 1, b: 2, c: 3 });
            expect(typeof obj).toBe('object');
        });

        it('should converts array of pairs with numeric keys to object', () => {
            const arr: [number, string][] = [
                [1, 'a'],
                [2, 'b'],
                [3, 'c'],
            ];
            const obj = arr.toObject();
            expect(obj).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
        });

        it('should converts array of objects to object using key string', () => {
            const arr = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' },
            ];
            const obj = arr.toObject('id');
            expect(obj).toEqual({
                1: { id: 1, name: 'foo' },
                2: { id: 2, name: 'bar' },
            });
        });

        it('should converts array of objects to object using key callback', () => {
            const arr = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' },
            ];
            const obj = arr.toObject((x) => x.id);
            expect(obj).toEqual({
                1: { id: 1, name: 'foo' },
                2: { id: 2, name: 'bar' },
            });
        });

        it('should converts array of objects using key callback and value callback', () => {
            const arr = [
                { id: 1, name: 'foo' },
                { id: 2, name: 'bar' },
            ];
            const obj = arr.toObject(
                (x) => x.id,
                (x) => x.name,
            );
            expect(obj).toEqual({
                1: 'foo',
                2: 'bar',
            });
        });

        it('should converts array without selector (uses index as key)', () => {
            const arr = ['a', 'b', 'c'];
            const obj = arr.toObject();
            expect(obj).toEqual({
                0: 'a',
                1: 'b',
                2: 'c',
            });
        });

        it('should converts empty array to empty object', () => {
            const arr: any[] = [];
            const obj = arr.toObject();
            expect(obj).toEqual({});
        });

        it('should handles objects with string and numeric keys', () => {
            const arr = [
                { key: 'name', value: 'Alice' },
                { key: 'age', value: 30 },
            ];
            const obj = arr.toObject(
                (x) => x.key,
                (x) => x.value,
            );
            expect(obj).toEqual({
                name: 'Alice',
                age: 30,
            });
        });

        it('should throws error when key selector returns null', () => {
            const arr = [{ id: 1, name: 'foo' }];
            expect(() =>
                arr.toObject(
                    (x) => null as any,
                    (x) => x.name,
                ),
            ).toThrow(TypeError);
        });

        it('should throws error when key selector returns undefined', () => {
            const arr = [{ id: 1, name: 'foo' }];
            expect(() =>
                arr.toObject(
                    (x) => undefined as any,
                    (x) => x.name,
                ),
            ).toThrow(TypeError);
        });

        it('should throws error when key is not a string or number', () => {
            const arr = [{ id: { nested: 1 }, name: 'foo' }];
            expect(() => arr.toObject((x) => x.id as any)).toThrow(TypeError);
        });

        it('should overwrites duplicate keys with the last value', () => {
            const arr = [
                { id: 1, value: 'first' },
                { id: 1, value: 'second' },
            ];
            const obj = arr.toObject(
                (x) => x.id,
                (x) => x.value,
            );
            expect(obj).toEqual({
                1: 'second',
            });
        });

        it('should handles mixed types in array', () => {
            const arr = [
                { id: 'x', value: 10 },
                { id: 'y', value: 20 },
            ];
            const obj = arr.toObject(
                (x) => x.id,
                (x) => x.value,
            );
            expect(obj).toEqual({
                x: 10,
                y: 20,
            });
        });

        it('should converts with string key and different value types', () => {
            const arr = [
                { id: 1, data: 'text' },
                { id: 2, data: 42 },
                { id: 3, data: null },
            ];
            const obj = arr.toObject('id', (x) => x.data);
            expect(obj).toEqual({
                1: 'text',
                2: 42,
                3: null,
            });
        });
    });
});
