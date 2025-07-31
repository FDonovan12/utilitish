import '../string/string-prototype';

describe('String prototype extensions', () => {
    describe('capitalize', () => {
        it('should capitalize the first character', () => {
            expect('hello'.capitalize()).toBe('Hello');
            expect('Hello'.capitalize()).toBe('Hello');
            expect(''.capitalize()).toBe('');
        });
    });

    describe('splitWords', () => {
        it('should split camelCase, kebab-case, snake_case, and spaces', () => {
            expect('helloWorld'.splitWords()).toEqual(['hello', 'World']);
            expect('hello-world'.splitWords()).toEqual(['hello', 'world']);
            expect('hello_world'.splitWords()).toEqual(['hello', 'world']);
            expect('hello world'.splitWords()).toEqual(['hello', 'world']);
            expect('HTMLParser'.splitWords()).toEqual(['HTML', 'Parser']);
        });
    });

    describe('camelCase', () => {
        it('should convert to camelCase', () => {
            expect('hello world'.camelCase()).toBe('helloWorld');
            expect('Hello_world-test'.camelCase()).toBe('helloWorldTest');
            expect('helloWorldTest'.camelCase()).toBe('helloWorldTest');
        });
    });

    describe('kebabCase', () => {
        it('should convert to kebab-case', () => {
            expect('hello world'.kebabCase()).toBe('hello-world');
            expect('Hello_worldTest'.kebabCase()).toBe('hello-world-test');
            expect('hello-world-test'.kebabCase()).toBe('hello-world-test');
        });
    });

    describe('snakeCase', () => {
        it('should convert to snake_case', () => {
            expect('hello world'.snakeCase()).toBe('hello_world');
            expect('Hello-worldTest'.snakeCase()).toBe('hello_world_test');
            expect('hello_world_test'.snakeCase()).toBe('hello_world_test');
        });
    });

    describe('truncate', () => {
        it('should truncate and add ... if needed', () => {
            expect('hello world'.truncate(5)).toBe('hello...');
            expect('hello'.truncate(10)).toBe('hello');
        });
        it('should throw if n is not a non-negative integer', () => {
            expect(() => 'abc'.truncate(-1)).toThrowError(TypeError);
            expect(() => 'abc'.truncate(1.5)).toThrowError(TypeError);
            expect(() => 'abc'.truncate('a' as any)).toThrowError(TypeError);
        });
    });

    describe('reverse', () => {
        it('should reverse the string', () => {
            expect('abc'.reverse()).toBe('cba');
            expect('été'.reverse()).toBe('été');
        });
    });

    describe('isEmpty', () => {
        it('should return true for empty or whitespace strings', () => {
            expect(''.isEmpty()).toBe(true);
            expect('   '.isEmpty()).toBe(true);
        });
        it('should return false for non-empty strings', () => {
            expect('abc'.isEmpty()).toBe(false);
            expect(' a '.isEmpty()).toBe(false);
        });
    });

    describe('slugify', () => {
        it('should slugify a string', () => {
            expect('Hello World!'.slugify()).toBe('hello-world');
            expect("Éléphant à l'été".slugify()).toBe('elephant-a-l-ete');
            expect('  --Hello__World--  '.slugify()).toBe('hello-world');
        });
    });

    describe('String.prototype.replaceRange', () => {
        it('replaces a single character at the given index', () => {
            expect('hello'.replaceRange(1, 2, 'a')).toBe('hallo');
        });

        it('replaces a range of characters', () => {
            expect('abcdef'.replaceRange(2, 5, 'Z')).toBe('abZf');
        });

        it('removes a range if replaceString is omitted', () => {
            expect('abcdef'.replaceRange(1, 4)).toBe('aef');
        });

        it('works when start > end (swaps automatically)', () => {
            expect('abcdef'.replaceRange(5, 2, 'X')).toBe('abXf');
        });

        it('inserts at the end if start and end are equal to length', () => {
            expect('abc'.replaceRange(3, 3, 'Z')).toBe('abcZ');
        });

        it('throws if start or end is negative', () => {
            expect(() => 'abc'.replaceRange(-1, 2)).toThrow(RangeError);
            expect(() => 'abc'.replaceRange(1, -2)).toThrow(RangeError);
        });

        it('throws if start or end is out of bounds', () => {
            expect(() => 'abc'.replaceRange(0, 4)).toThrow(RangeError);
            expect(() => 'abc'.replaceRange(5, 1)).toThrow(RangeError);
        });

        it('throws if start or end is not an integer', () => {
            expect(() => 'abc'.replaceRange(1.5, 2)).toThrow(TypeError);
            expect(() => 'abc'.replaceRange(1, 2.2)).toThrow(TypeError);
        });

        it('defaults replaceString to empty string', () => {
            expect('hello'.replaceRange(1, 4)).toBe('ho');
        });

        it('supports empty string', () => {
            expect(''.replaceRange(0, 0, 'x')).toBe('x');
        });
    });
});
