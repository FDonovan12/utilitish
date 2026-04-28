import {
    assertValidSelector,
    defineIfNotExists,
    defineStaticIfNotExists,
    isNumberOrString,
    resolveSelector,
    utilitishError,
} from './core.utils';

describe('core.utils', () => {
    describe('defineIfNotExists()', () => {
        it('should define a new method on a prototype', () => {
            const proto = {};
            defineIfNotExists(proto, 'hello', () => 'world');
            expect((proto as any).hello()).toBe('world');
        });

        it('should not overwrite a non-configurable non-writable property', () => {
            const proto = {};
            Object.defineProperty(proto, 'locked', {
                value: () => 'original',
                writable: false,
                configurable: false,
            });
            defineIfNotExists(proto, 'locked', () => 'overwritten');
            expect((proto as any).locked()).toBe('original');
        });

        it('should overwrite a writable property', () => {
            const proto = {};
            Object.defineProperty(proto, 'flexible', {
                value: () => 'original',
                writable: true,
                configurable: false,
            });
            defineIfNotExists(proto, 'flexible', () => 'overwritten');
            expect((proto as any).flexible()).toBe('overwritten');
        });

        it('should overwrite a configurable property', () => {
            const proto = {};
            Object.defineProperty(proto, 'flexible', {
                value: () => 'original',
                writable: false,
                configurable: true,
            });
            defineIfNotExists(proto, 'flexible', () => 'overwritten');
            expect((proto as any).flexible()).toBe('overwritten');
        });

        it('should define the property as non-enumerable', () => {
            const proto = {};
            defineIfNotExists(proto, 'hidden', () => 'value');
            expect(Object.keys(proto)).not.toContain('hidden');
        });
    });

    describe('defineStaticIfNotExists()', () => {
        it('should define a new static method on a constructor', () => {
            const ctor = {} as any;
            defineStaticIfNotExists(ctor, 'create', () => 'created');
            expect(ctor.create()).toBe('created');
        });

        it('should not overwrite a non-configurable non-writable static property', () => {
            const ctor = {} as any;
            Object.defineProperty(ctor, 'locked', {
                value: () => 'original',
                writable: false,
                configurable: false,
            });
            defineStaticIfNotExists(ctor, 'locked', () => 'overwritten');
            expect(ctor.locked()).toBe('original');
        });

        it('should define the property as non-enumerable', () => {
            const ctor = {} as any;
            defineStaticIfNotExists(ctor, 'hidden', () => 'value');
            expect(Object.keys(ctor)).not.toContain('hidden');
        });
    });

    describe('resolveSelector()', () => {
        describe('with function selector', () => {
            it('should return a function that applies the selector', () => {
                const sel = resolveSelector<{ x: number }, number>((item) => item.x);
                expect(sel({ x: 42 })).toBe(42);
            });
        });

        describe('with string key selector', () => {
            it('should return a function that extracts the property', () => {
                const sel = resolveSelector<{ name: string }, string>('name');
                expect(sel({ name: 'Alice' })).toBe('Alice');
            });
        });

        describe('with fallback', () => {
            it('should return the fallback function when no selector is provided', () => {
                const sel = resolveSelector<number, string>(undefined, (item) => item.toString());
                expect(sel(42)).toBe('42');
            });
        });

        describe('error handling', () => {
            it('should throw TypeError when selector is invalid', () => {
                expect(() => resolveSelector(123 as any)).toThrow(TypeError);
            });

            it('should throw TypeError when no selector and no fallback', () => {
                expect(() => resolveSelector(undefined, undefined)).toThrow(TypeError);
            });
        });
    });

    describe('assertValidSelector()', () => {
        it('should not throw when selector is a function', () => {
            expect(() => assertValidSelector(() => {})).not.toThrow();
        });

        it('should not throw when selector is a string', () => {
            expect(() => assertValidSelector('name')).not.toThrow();
        });

        it('should not throw when selector is undefined', () => {
            expect(() => assertValidSelector(undefined)).not.toThrow();
        });

        describe('error handling', () => {
            it('should throw TypeError when selector is a number', () => {
                expect(() => assertValidSelector(123)).toThrow(TypeError);
            });

            it('should throw TypeError when selector is an object', () => {
                expect(() => assertValidSelector({})).toThrow(TypeError);
            });
        });
    });

    describe('isNumberOrString()', () => {
        it('should return true for a string', () => {
            expect(isNumberOrString('hello')).toBe(true);
        });

        it('should return true for a number', () => {
            expect(isNumberOrString(42)).toBe(true);
        });

        it('should return false for a boolean', () => {
            expect(isNumberOrString(true)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isNumberOrString(null)).toBe(false);
        });

        it('should return false for an object', () => {
            expect(isNumberOrString({})).toBe(false);
        });
    });

    describe('utilitishError()', () => {
        it('should throw a TypeError by default', () => {
            expect(() => utilitishError('method', 'message')).toThrow(TypeError);
        });

        it('should throw a RangeError when specified', () => {
            expect(() => utilitishError('method', 'message', undefined, RangeError)).toThrow(RangeError);
        });

        it('should include method and message in the error message', () => {
            expect(() => utilitishError('String.prototype.test', 'value must be a string')).toThrow(
                '[Utilitish] String.prototype.test: value must be a string',
            );
        });

        it('should include received type in the error message when provided', () => {
            expect(() => utilitishError('String.prototype.test', 'value must be a string', 42)).toThrow(
                '[Utilitish] String.prototype.test: value must be a string, received number',
            );
        });

        it('should not include received info when received is undefined', () => {
            expect(() => utilitishError('String.prototype.test', 'value must be a string', undefined)).toThrow(
                '[Utilitish] String.prototype.test: value must be a string',
            );
        });
    });
});
