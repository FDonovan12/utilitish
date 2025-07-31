import '../set/set-prototype';

describe('Set.prototype.toList', () => {
    it('returns an array with all values in insertion order', () => {
        const set = new Set([3, 1, 2]);
        expect(set.toList()).toEqual([3, 1, 2]);
    });
    it('returns an empty array for an empty set', () => {
        const set = new Set();
        expect(set.toList()).toEqual([]);
    });
    it('returns a new array instance', () => {
        const set = new Set([1, 2, 3]);
        const arr = set.toList();
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).not.toBe(set);
    });
});

describe('Set.prototype.hasAny', () => {
    it('returns true if at least one item is present', () => {
        const set = new Set([1, 2, 3]);
        expect(set.hasAny(0, 2)).toBe(true);
    });
    it('returns false if no items are present', () => {
        const set = new Set([1, 2, 3]);
        expect(set.hasAny(4, 5)).toBe(false);
    });
    it('returns false if called with no arguments', () => {
        const set = new Set([1, 2, 3]);
        expect(set.hasAny()).toBe(false);
    });
});

describe('Set.prototype.includes', () => {
    it('returns true if all items are present', () => {
        const set = new Set([1, 2, 3]);
        expect(set.includes(1, 2)).toBe(true);
    });
    it('returns false if at least one item is missing', () => {
        const set = new Set([1, 2, 3]);
        expect(set.includes(1, 4)).toBe(false);
    });
    it('returns true if called with no arguments', () => {
        const set = new Set([1, 2, 3]);
        expect(set.includes()).toBe(true);
    });
    it('works with a Set as argument', () => {
        const set = new Set([1, 2, 3]);
        expect(set.includes(new Set([1, 2]))).toBe(true);
        expect(set.includes(new Set([1, 4]))).toBe(false);
    });
});

describe('Set.prototype.union', () => {
    it('returns a new Set with all unique values', () => {
        const a = new Set([1, 2]);
        const b = new Set([2, 3]);
        expect(a.union(b)).toEqual(new Set([1, 2, 3]));
    });
    it('returns a copy if no arguments', () => {
        const a = new Set([1, 2]);
        expect(a.union()).toEqual(new Set([1, 2]));
    });
    it('throws if argument is not a Set', () => {
        const a = new Set([1, 2]);
        // @ts-expect-error
        expect(() => a.union([3, 4])).toThrow(TypeError);
    });
});

describe('Set.prototype.intersection', () => {
    it('returns a new Set with common values', () => {
        const a = new Set([1, 2, 3]);
        const b = new Set([2, 3, 4]);
        expect(a.intersection(b)).toEqual(new Set([2, 3]));
    });
    it('returns a copy if no arguments', () => {
        const a = new Set([1, 2]);
        expect(a.intersection()).toEqual(new Set([1, 2]));
    });
    it('returns an empty set if no values are common', () => {
        const a = new Set([1, 2]);
        const b = new Set([3, 4]);
        expect(a.intersection(b)).toEqual(new Set());
    });
    it('throws if argument is not a Set', () => {
        const a = new Set([1, 2]);
        // @ts-expect-error
        expect(() => a.intersection([2])).toThrow(TypeError);
    });
});
