import './object-prototype';

describe('Object.prototype', () => {
    describe('deepClone()', () => {
        it('should deeply clone a plain object', () => {
            const obj = { a: 1, b: { c: 2 } };
            const clone = structuredClone(obj);
            expect(clone).toEqual(obj);
            expect(clone).not.toBe(obj);
            expect(clone.b).not.toBe(obj.b);
        });

        it('should deeply clone an array', () => {
            const arr = [{ a: 1 }, { b: 2 }];
            const clone = arr.deepClone<typeof arr>();
            expect(clone).toEqual(arr);
            expect(clone).not.toBe(arr);
            expect(clone[0]).not.toBe(arr[0]);
        });
    });

    describe('deepMerge()', () => {
        it('should deeply merge two objects', () => {
            const obj = { a: 1, b: { c: 2 } };
            const source = { b: { d: 3 }, e: 4 };
            const merged = obj.deepMerge<typeof obj>(source);
            expect(merged).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
        });

        it('should overwrite primitive values', () => {
            const obj = { a: 1, b: 2 };
            const merged = obj.deepMerge({ b: 3 });
            expect(merged).toEqual({ a: 1, b: 3 });
        });

        describe('error handling', () => {
            it('should throw if source is not an object', () => {
                expect(() => (({}) as any).deepMerge(null)).toThrowError(TypeError);
                expect(() => (({}) as any).deepMerge(42 as any)).toThrowError(TypeError);
            });
        });
    });

    describe('deepEquals()', () => {
        describe('with objects', () => {
            it('should return true for objects with same keys and values, regardless of key order', () => {
                expect({ a: 2, b: 3 }.deepEquals({ b: 3, a: 2 })).toBe(true);
                expect({ a: 2, b: { c: 4 } }.deepEquals({ b: { c: 4 }, a: 2 })).toBe(true);
            });

            it('should return false for objects with different values', () => {
                expect({ a: 2, b: 3 }.deepEquals({ a: 2, b: 4 })).toBe(false);
                expect({ a: 2, b: { c: 4 } }.deepEquals({ a: 2, b: { c: 5 } })).toBe(false);
            });

            it('should return false for objects with different keys', () => {
                expect({ a: 2 }.deepEquals({ b: 2 })).toBe(false);
            });

            it('should return true for empty objects', () => {
                expect({}.deepEquals({})).toBe(true);
            });

            it('should return false for objects with different key counts', () => {
                expect({ a: 1 }.deepEquals({ a: 1, b: 2 })).toBe(false);
            });
        });

        describe('with arrays', () => {
            it('should return true for arrays with same elements in same order', () => {
                expect([1, 2, 3].deepEquals([1, 2, 3])).toBe(true);
                expect([1, [2, 3]].deepEquals([1, [2, 3]])).toBe(true);
            });

            it('should return false for arrays with different elements or order', () => {
                expect([1, 2, 3].deepEquals([1, 3, 2])).toBe(false);
                expect([1, [2, 3]].deepEquals([1, [3, 2]])).toBe(false);
            });

            it('should return true for empty arrays', () => {
                expect([].deepEquals([])).toBe(true);
            });

            it('should return false for arrays with different lengths', () => {
                expect([1].deepEquals([1, 2])).toBe(false);
            });
        });

        describe('with special values', () => {
            it('should return true for NaN deepEquals NaN', () => {
                expect({ a: NaN }.deepEquals({ a: NaN })).toBe(true);
                expect([NaN].deepEquals([NaN])).toBe(true);
            });

            it('should return false for +0 and -0', () => {
                expect({ a: +0 }.deepEquals({ a: -0 })).toBe(false);
                expect([+0].deepEquals([-0])).toBe(false);
            });

            it('should return false for objects with undefined vs missing keys', () => {
                expect({ a: undefined }.deepEquals({})).toBe(false);
                expect({}.deepEquals({ a: undefined })).toBe(false);
            });

            it('should return false for objects with functions, even if functions are equal', () => {
                expect({ a: () => 1 }.deepEquals({ a: () => 1 })).toBe(false);
            });
        });

        describe('with nested structures', () => {
            it('should return true for nested structures deeply equal', () => {
                expect({ a: [1, { b: 2 }] }.deepEquals({ a: [1, { b: 2 }] })).toBe(true);
            });

            it('should return false for nested structures not deeply equal', () => {
                expect({ a: [1, { b: 2 }] }.deepEquals({ a: [1, { b: 3 }] })).toBe(false);
            });
        });

        describe('type mismatches', () => {
            it('should return false for array vs object', () => {
                expect([].deepEquals({})).toBe(false);
                expect({}.deepEquals([])).toBe(false);
            });
        });
    });

    describe('stableStringify()', () => {
        it('should stringify plain objects with sorted keys', () => {
            const obj = { b: 2, a: 1 };
            expect(obj.stableStringify()).toBe('{"a":1,"b":2}');
        });

        it('should produce same string regardless of key order', () => {
            const obj1 = { b: 2, a: 1, c: 3 };
            const obj2 = { c: 3, a: 1, b: 2 };
            expect(obj1.stableStringify()).toBe(obj2.stableStringify());
        });

        it('should stringify arrays with element order preserved', () => {
            const arr = [1, 2, 3];
            expect(arr.stableStringify()).toBe('[1,2,3]');
        });

        it('should handle nested objects', () => {
            const obj = { b: { d: 4, c: 3 }, a: 1 };
            expect(obj.stableStringify()).toBe('{"a":1,"b":{"c":3,"d":4}}');
        });

        it('should handle arrays within objects', () => {
            const obj = { a: [1, 2], b: 2 };
            expect(obj.stableStringify()).toBe('{"a":[1,2],"b":2}');
        });

        it('should handle empty objects and arrays', () => {
            expect({}.stableStringify()).toBe('{}');
            expect([].stableStringify()).toBe('[]');
        });

        it('should handle undefined values in objects', () => {
            const obj = { a: undefined, b: 1 };
            expect(obj.stableStringify()).toBe('{"a":undefined,"b":1}');
        });
    });

    describe('stableHash()', () => {
        it('should generate same hash for objects with different key order', () => {
            const obj1 = { b: 2, a: 1 };
            const obj2 = { a: 1, b: 2 };
            expect(obj1.stableHash()).toBe(obj2.stableHash());
        });

        it('should generate different hashes for different objects', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { a: 1, b: 3 };
            expect(obj1.stableHash()).not.toBe(obj2.stableHash());
        });

        it('should generate consistent hashes', () => {
            const obj = { a: 1, b: 2 };
            const hash1 = obj.stableHash();
            const hash2 = obj.stableHash();
            expect(hash1).toBe(hash2);
        });

        it('should generate hex string', () => {
            const obj = { a: 1 };
            const hash = obj.stableHash();
            expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
        });

        it('should handle arrays', () => {
            const arr1 = [1, 2, 3];
            const arr2 = [1, 2, 3];
            expect(arr1.stableHash()).toBe(arr2.stableHash());
        });

        it('should handle different arrays', () => {
            const arr1 = [1, 2, 3];
            const arr2 = [3, 2, 1];
            expect(arr1.stableHash()).not.toBe(arr2.stableHash());
        });

        it('should handle nested structures', () => {
            const obj1 = { a: [1, { b: 2 }], c: 3 };
            const obj2 = { c: 3, a: [1, { b: 2 }] };
            expect(obj1.stableHash()).toBe(obj2.stableHash());
        });

        it('should handle empty objects', () => {
            const obj1 = {};
            const obj2 = {};
            expect(obj1.stableHash()).toBe(obj2.stableHash());
        });
    });
});
