import '../set/set-prototype';

describe('Set.prototype', () => {
    describe('toList()', () => {
        it('should return array with all values in insertion order', () => {
            const set = new Set([3, 1, 2]);
            expect(set.toList()).toEqual([3, 1, 2]);
        });

        it('should return empty array when set is empty', () => {
            const set = new Set();
            expect(set.toList()).toEqual([]);
        });

        it('should return a new array instance (not same reference)', () => {
            const set = new Set([1, 2, 3]);
            const arr = set.toList();
            expect(Array.isArray(arr)).toBe(true);
            expect(arr).not.toBe(set);
        });
    });

    describe('hasAny()', () => {
        describe('with multiple items', () => {
            it('should return true when at least one item is present', () => {
                const set = new Set([1, 2, 3]);
                expect(set.hasAny(0, 2)).toBe(true);
            });

            it('should return false when no items are present', () => {
                const set = new Set([1, 2, 3]);
                expect(set.hasAny(4, 5)).toBe(false);
            });
        });

        describe('with edge cases', () => {
            it('should return false when called with no arguments', () => {
                const set = new Set([1, 2, 3]);
                expect(set.hasAny()).toBe(false);
            });
        });
    });

    describe('includes()', () => {
        describe('with multiple items as arguments', () => {
            it('should return true when all items are present', () => {
                const set = new Set([1, 2, 3]);
                expect(set.includes(1, 2)).toBe(true);
            });

            it('should return false when at least one item is missing', () => {
                const set = new Set([1, 2, 3]);
                expect(set.includes(1, 4)).toBe(false);
            });
        });

        describe('with Set as argument', () => {
            it('should return true when all items from Set are present', () => {
                const set = new Set([1, 2, 3]);
                expect(set.includes(new Set([1, 2]))).toBe(true);
            });

            it('should return false when some items from Set are missing', () => {
                const set = new Set([1, 2, 3]);
                expect(set.includes(new Set([1, 4]))).toBe(false);
            });
        });

        describe('with edge cases', () => {
            it('should return true when called with no arguments', () => {
                const set = new Set([1, 2, 3]);
                expect(set.includes()).toBe(true);
            });
        });
    });

    describe('union()', () => {
        describe('with multiple Sets', () => {
            it('should return a new Set with all unique values', () => {
                const a = new Set([1, 2]);
                const b = new Set([2, 3]);
                expect(a.union(b)).toEqual(new Set([1, 2, 3]));
            });
        });

        describe('with no arguments', () => {
            it('should return a copy of the Set when no arguments provided', () => {
                const a = new Set([1, 2]);
                expect(a.union()).toEqual(new Set([1, 2]));
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when argument is not a Set', () => {
                const a = new Set([1, 2]);
                // @ts-expect-error
                expect(() => a.union([3, 4])).toThrow(TypeError);
            });
        });
    });

    describe('intersection()', () => {
        describe('with multiple Sets', () => {
            it('should return a new Set with only common values', () => {
                const a = new Set([1, 2, 3]);
                const b = new Set([2, 3, 4]);
                expect(a.intersection(b)).toEqual(new Set([2, 3]));
            });

            it('should return empty Set when no common values exist', () => {
                const a = new Set([1, 2]);
                const b = new Set([3, 4]);
                expect(a.intersection(b)).toEqual(new Set());
            });

            it('should work with multiple Sets at once', () => {
                const a = new Set([1, 2, 3, 4]);
                const b = new Set([2, 3, 5]);
                const c = new Set([3, 6]);
                expect(a.intersection(b, c)).toEqual(new Set([3]));
            });
        });

        describe('with no arguments', () => {
            it('should return a copy of the Set when no arguments provided', () => {
                const a = new Set([1, 2]);
                expect(a.intersection()).toEqual(new Set([1, 2]));
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when argument is not a Set', () => {
                const a = new Set([1, 2]);
                // @ts-expect-error
                expect(() => a.intersection([2])).toThrow(TypeError);
            });
        });
    });
});
