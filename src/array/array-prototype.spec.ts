import './array-prototype';

describe('Array prototype extensions', () => {
    describe('first', () => {
        it('should return the first element or undefined', () => {
            expect([1, 2, 3].first()).toBe(1);
            expect([].first()).toBeUndefined();
        });
    });

    describe('last', () => {
        it('should return the last element or undefined', () => {
            expect([1, 2, 3].last()).toBe(3);
            expect([].last()).toBeUndefined();
        });
    });

    describe('sum', () => {
        it('should work for number[] without callback', () => {
            expect([1, 2, 3].sum()).toBe(6);
        });
        it('should work with callback', () => {
            const items = [{ x: 1 }, { x: 2 }];
            expect(items.sum((item) => item.x)).toBe(3);
        });
        it('should work with callback', () => {
            const items = [{ x: 1 }, { x: 2 }];
            expect(items.sum('x')).toBe(3);
        });
        it('should throw without callback', () => {
            const items = [{ x: 2 }, { x: 4 }] as any;
            expect(() => items.sum()).toThrow(TypeError);
        });
        it('should return 0 for empty array', () => {
            expect([].sum()).toBe(0);
        });
    });

    describe('average', () => {
        it('should work for number[] without callback', () => {
            expect([2, 4, 6].average()).toBe(4);
        });
        it('should work with callback', () => {
            const items = [{ x: 2 }, { x: 4 }];
            expect(items.average((item) => item.x)).toBe(3);
        });
        it('should work with key', () => {
            const items = [{ x: 2 }, { x: 4 }];
            expect(items.average('x')).toBe(3);
        });
        it('should throw without callback', () => {
            const items = [{ x: 2 }, { x: 4 }] as any;
            expect(() => items.average()).toThrow(TypeError);
        });
        it('should return 0 for empty array', () => {
            expect([].average()).toBe(0);
        });
    });

    describe('unique', () => {
        it('should return array with unique values', () => {
            expect([1, 1, 2, 2, 3].unique()).toEqual([1, 2, 3]);
        });
    });

    describe('chunk', () => {
        it('should split array into chunks', () => {
            expect([1, 2, 3, 4].chunk(2)).toEqual([
                [1, 2],
                [3, 4],
            ]);
            expect([1, 2, 3].chunk(2)).toEqual([[1, 2], [3]]);
        });
        it('should throw if size is not a positive integer', () => {
            expect(() => [1, 2, 3].chunk(0)).toThrow(TypeError);
            expect(() => [1, 2, 3].chunk(-1)).toThrow(TypeError);
            expect(() => [1, 2, 3].chunk(1.5)).toThrow(TypeError);
            expect(() => [1, 2, 3].chunk('a' as any)).toThrow(TypeError);
        });
    });

    describe('Array.prototype.groupBy', () => {
        it('groups by a property key (string)', () => {
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

        it('groups by a selector function', () => {
            const arr = [1, 2, 3, 4, 5, 6];
            const map = arr.groupBy((x) => (x % 2 === 0 ? 'even' : 'odd'));
            expect(map instanceof Map).toBe(true);
            expect(map.get('even')).toEqual([2, 4, 6]);
            expect(map.get('odd')).toEqual([1, 3, 5]);
        });

        it('returns an empty Map for an empty array', () => {
            expect([].groupBy((x) => x)).toEqual(new Map());
        });
    });

    describe('compact', () => {
        it('should remove falsy values', () => {
            expect([0, 1, false, 2, '', 3, null].compact()).toEqual([1, 2, 3]);
        });
    });

    describe('swap', () => {
        it('should swap two elements in the array', () => {
            const arr = [1, 2, 3];
            arr.swap(0, 2);
            expect(arr).toEqual([3, 2, 1]);
        });
        it('should do nothing if indices are the same', () => {
            const arr = [1, 2, 3];
            arr.swap(1, 1);
            expect(arr).toEqual([1, 2, 3]);
        });
        it('should throw if an index is out of bounds', () => {
            const arr = [1, 2, 3];
            expect(() => arr.swap(-1, 2)).toThrow(RangeError);
            expect(() => arr.swap(0, 3)).toThrow(RangeError);
        });
        it('should throw if indices are not integers', () => {
            const arr = [1, 2, 3];
            expect(() => arr.swap(0.5, 2)).toThrow(TypeError);
            expect(() => arr.swap(0, 'a' as any)).toThrow(TypeError);
        });
    });

    describe('Array.prototype.sortAsc', () => {
        it('sorts a number array in ascending order', () => {
            expect([3, 1, 2].sortAsc()).toEqual([1, 2, 3]);
        });
        it('sorts a string array in ascending order', () => {
            expect(['b', 'a', 'c'].sortAsc()).toEqual(['a', 'b', 'c']);
        });
        it('sorts using a callback', () => {
            const arr = [{ v: 2 }, { v: 1 }];
            expect(arr.sortAsc((x) => x.v)).toEqual([{ v: 1 }, { v: 2 }]);
        });
        it('sorts using a key', () => {
            const arr = [{ v: 2 }, { v: 1 }];
            expect(arr.sortAsc('v')).toEqual([{ v: 1 }, { v: 2 }]);
        });
        it('returns [] for an empty array', () => {
            expect([].sortAsc()).toEqual([]);
        });
        // it('throws if callback does not return a sortable type', () => {
        //     expect(() => [{ v: {} }].sortAsc((x) => x.v as any)).toThrow(TypeError);
        // });
        it('throws if elements are not sortable without callback', () => {
            expect(() => [{ v: 1 } as any].sortAsc()).toThrow(TypeError);
        });
    });

    describe('Array.prototype.sortDesc', () => {
        it('sorts a number array in descending order', () => {
            expect([1, 3, 2, 4].sortDesc()).toEqual([4, 3, 2, 1]);
        });
        it('sorts a string array in descending order', () => {
            expect(['b', 'a', 'c'].sortDesc()).toEqual(['c', 'b', 'a']);
        });
        it('sorts using a callback', () => {
            const arr = [{ v: 1 }, { v: 2 }];
            expect(arr.sortDesc((x) => x.v)).toEqual([{ v: 2 }, { v: 1 }]);
        });
        it('sorts using a key', () => {
            const arr = [{ v: 1 }, { v: 2 }];
            expect(arr.sortDesc('v')).toEqual([{ v: 2 }, { v: 1 }]);
        });
        it('returns [] for an empty array', () => {
            expect([].sortDesc()).toEqual([]);
        });
        // it('throws if callback does not return a sortable type', () => {
        //     expect(() => [{ v: {} }].sortDesc((x) => x.v as any)).toThrow(TypeError);
        // });
        it('throws if elements are not sortable without callback', () => {
            expect(() => [{ v: 1 } as any].sortDesc()).toThrow(TypeError);
        });
    });

    describe('Array.prototype.shuffle', () => {
        it('returns a new array with the same elements in any order', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = arr.shuffle();
            expect(shuffled).toHaveLength(arr.length);
            expect(shuffled.sort()).toEqual(arr.sort());
            // Not a strict test for randomness, but should not always be equal
        });

        it('does not mutate the original array', () => {
            const arr = [1, 2, 3];
            const copy = arr.slice();
            arr.shuffle();
            expect(arr).toEqual(copy);
        });

        it('returns an empty array when called on an empty array', () => {
            expect([].shuffle()).toEqual([]);
        });

        it('returns a new array instance', () => {
            const arr = [1, 2, 3];
            const shuffled = arr.shuffle();
            expect(shuffled).not.toBe(arr);
        });
    });

    describe('Array.prototype.toMap', () => {
        it('converts array of pairs to Map', () => {
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

        it('converts array of objects to Map using key string', () => {
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

        it('converts array of objects to Map using key and value selectors', () => {
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

        it('converts array of objects to Map using key without value selectors', () => {
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

        it('converts array of objects to Map using no callback', () => {
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

        it('throws if arguments are invalid', () => {
            // expect(() => [{ id: 1 }].toMap()).toThrow(Error);
            expect(() => [{ id: 1 }].toMap(123 as any)).toThrow(Error);
        });
    });

    describe('Array.prototype.toSet', () => {
        it('returns a Set of unique elements', () => {
            expect([1, 2, 2, 3].toSet()).toEqual(new Set([1, 2, 3]));
        });
        it('returns a Set of selected values', () => {
            const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
            expect(arr.toSet((x) => x.id)).toEqual(new Set([1, 2]));
        });
        it('returns a Set of key values', () => {
            const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
            expect(arr.toSet('id')).toEqual(new Set([1, 2]));
        });
        it('returns an empty Set for an empty array', () => {
            expect([].toSet()).toEqual(new Set());
        });
    });

    describe('Array.prototype.countBy', () => {
        it('counts elements by selector', () => {
            const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
            expect(arr.countBy((x) => x)).toEqual(
                new Map([
                    ['a', 3],
                    ['b', 2],
                    ['c', 1],
                ]),
            );
        });
        it('counts elements whithout selector', () => {
            const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
            expect(arr.countBy()).toEqual(
                new Map([
                    ['a', 3],
                    ['b', 2],
                    ['c', 1],
                ]),
            );
        });
        it('counts objects by property', () => {
            const arr = [{ type: 'x' }, { type: 'y' }, { type: 'x' }];
            expect(arr.countBy((x) => x.type)).toEqual(
                new Map([
                    ['x', 2],
                    ['y', 1],
                ]),
            );
        });
        it('counts objects by property using a string key', () => {
            const arr = [{ type: 'x' }, { type: 'y' }, { type: 'x' }];
            expect(arr.countBy('type')).toEqual(
                new Map([
                    ['x', 2],
                    ['y', 1],
                ]),
            );
        });
        it('counts objects by property', () => {
            const arr = [{ type: 'x' }, { type: 'y' }, { type: 'x' }];
            expect(arr.countBy()).toEqual(
                new Map([
                    [{ type: 'y' }, 1],
                    [{ type: 'x' }, 1],
                    [{ type: 'x' }, 1],
                ]),
            );
        });
        it('returns an empty Map for an empty array', () => {
            expect([].countBy((x) => x)).toEqual(new Map());
        });
        it('throws if arguments are invalid', () => {
            expect(() => [{ id: 1 }].toMap(123 as any)).toThrow(Error);
        });
    });
});
