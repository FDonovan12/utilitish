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
        // Ajoute ici les tests d’erreur si besoin
    });

    describe('average', () => {
        it('should work for number[] without callback', () => {
            expect([2, 4, 6].average()).toBe(4);
        });
        it('should work with callback', () => {
            const items = [{ x: 2 }, { x: 4 }];
            expect(items.average((item) => item.x)).toBe(3);
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

    describe('groupBy', () => {
        it('should group items by callback result', () => {
            const items = ['a', 'ab', 'abc'];
            const result = items.groupBy((item) => item.length);
            expect(result).toEqual({ 1: ['a'], 2: ['ab'], 3: ['abc'] });
        });
        it('should throw if callback is not a function', () => {
            expect(() => [1, 2, 3].groupBy(null as any)).toThrow(TypeError);
        });
        it('should throw if callback does not return string or number', () => {
            expect(() => [1, 2, 3].groupBy(() => ({} as any))).toThrow(TypeError);
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
        it('returns [] for an empty array', () => {
            expect([].sortAsc()).toEqual([]);
        });
        // it('throws if callback does not return a sortable type', () => {
        //     expect(() => [{ v: {} }].sortAsc((x) => x.v as any)).toThrow(TypeError);
        // });
        // it('throws if elements are not sortable without callback', () => {
        //     expect(() => [{ v: 1 } as any].sortAsc()).toThrow(TypeError);
        // });
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
        it('returns [] for an empty array', () => {
            expect([].sortDesc()).toEqual([]);
        });
        // it('throws if callback does not return a sortable type', () => {
        //     expect(() => [{ v: {} }].sortDesc((x) => x.v as any)).toThrow(TypeError);
        // });
        // it('throws if elements are not sortable without callback', () => {
        //     expect(() => [{ v: 1 } as any].sortDesc()).toThrow(TypeError);
        // });
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
});
