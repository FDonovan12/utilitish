import { sortBy } from './logic.utils';

describe('logic.utils', () => {
    describe('sortBy()', () => {
        describe('with primitive arrays', () => {
            it('should sort numbers in ascending order', () => {
                expect(sortBy([3, 1, 2], 'asc')).toEqual([1, 2, 3]);
            });

            it('should sort numbers in descending order', () => {
                expect(sortBy([1, 3, 2], 'desc')).toEqual([3, 2, 1]);
            });

            it('should sort strings in ascending order', () => {
                expect(sortBy(['b', 'a', 'c'], 'asc')).toEqual(['a', 'b', 'c']);
            });

            it('should sort strings in descending order', () => {
                expect(sortBy(['b', 'a', 'c'], 'desc')).toEqual(['c', 'b', 'a']);
            });

            it('should return empty array when input is empty', () => {
                expect(sortBy([], 'asc')).toEqual([]);
            });

            it('should not mutate the original array', () => {
                const arr = [3, 1, 2];
                sortBy(arr, 'asc');
                expect(arr).toEqual([3, 1, 2]);
            });
        });

        describe('with selector function', () => {
            it('should sort in ascending order using selector', () => {
                const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
                expect(sortBy(arr, 'asc', (x) => x.v)).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
            });

            it('should sort in descending order using selector', () => {
                const arr = [{ v: 1 }, { v: 3 }, { v: 2 }];
                expect(sortBy(arr, 'desc', (x) => x.v)).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }]);
            });
        });

        describe('with selector string key', () => {
            it('should sort in ascending order using property key', () => {
                const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
                expect(sortBy(arr, 'asc', 'v')).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
            });

            it('should sort in descending order using property key', () => {
                const arr = [{ v: 1 }, { v: 3 }, { v: 2 }];
                expect(sortBy(arr, 'desc', 'v')).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }]);
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when elements are not sortable without selector', () => {
                expect(() => sortBy([{ v: 1 }] as any, 'asc')).toThrow(TypeError);
            });

            it('should throw TypeError when selector returns non-sortable value', () => {
                expect(() => sortBy([{ v: {} }] as any, 'asc', (x: any) => x.v)).toThrow(TypeError);
            });
        });
    });
});
