import '../string/string-prototype';
import { resetSlugifyConfig, setSlugifyConfig } from '../utils/slugify.config';

describe('String.prototype', () => {
    describe('capitalize()', () => {
        it('should capitalize the first character', () => {
            expect('hello'.capitalize()).toBe('Hello');
            expect('Hello'.capitalize()).toBe('Hello');
            expect(''.capitalize()).toBe('');
        });
    });

    describe('splitWords()', () => {
        it('should split camelCase, kebab-case, snake_case, and spaces', () => {
            expect('helloWorld'.splitWords()).toEqual(['hello', 'World']);
            expect('hello-world'.splitWords()).toEqual(['hello', 'world']);
            expect('hello_world'.splitWords()).toEqual(['hello', 'world']);
            expect('hello world'.splitWords()).toEqual(['hello', 'world']);
            expect('HTMLParser'.splitWords()).toEqual(['HTML', 'Parser']);
        });
    });

    describe('camelCase()', () => {
        it('should convert to camelCase', () => {
            expect('hello world'.camelCase()).toBe('helloWorld');
            expect('Hello_world-test'.camelCase()).toBe('helloWorldTest');
            expect('helloWorldTest'.camelCase()).toBe('helloWorldTest');
        });
    });

    describe('kebabCase()', () => {
        it('should convert to kebab-case', () => {
            expect('hello world'.kebabCase()).toBe('hello-world');
            expect('Hello_worldTest'.kebabCase()).toBe('hello-world-test');
            expect('hello-world-test'.kebabCase()).toBe('hello-world-test');
        });
    });

    describe('snakeCase()', () => {
        it('should convert to snake_case', () => {
            expect('hello world'.snakeCase()).toBe('hello_world');
            expect('Hello-worldTest'.snakeCase()).toBe('hello_world_test');
            expect('hello_world_test'.snakeCase()).toBe('hello_world_test');
        });
    });

    describe('truncate()', () => {
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

    describe('reverse()', () => {
        it('should reverse the string', () => {
            expect('abc'.reverse()).toBe('cba');
            expect('été'.reverse()).toBe('été');
        });
    });

    describe('isEmpty()', () => {
        it('should return true for empty or whitespace strings', () => {
            expect(''.isEmpty()).toBe(true);
            expect('   '.isEmpty()).toBe(true);
        });

        it('should return false for non-empty strings', () => {
            expect('abc'.isEmpty()).toBe(false);
            expect(' a '.isEmpty()).toBe(false);
        });
    });

    describe('slugify()', () => {
        beforeEach(() => {
            resetSlugifyConfig(); // Reset to defaults before each test
        });

        it('should slugify a string with default config', () => {
            expect('Hello World!'.slugify()).toBe('hello-world');
            expect("Éléphant à l'été".slugify()).toBe('elephant-a-l-ete');
            expect('  --Hello__World--  '.slugify()).toBe('hello-world');
        });

        describe('custom replacements', () => {
            it('should apply custom replacements per call', () => {
                expect('Test ♀'.slugify({ customReplacements: { '♀': 'feminin' } })).toBe('test-feminin');
                expect('User♂@domain.com'.slugify({ customReplacements: { '♂': 'masculin', '@': 'at' } })).toBe(
                    'usermasculinatdomain-com',
                );
            });

            it('should handle special regex characters in replacements', () => {
                expect('Test [bracket]'.slugify({ customReplacements: { '[': 'left', ']': 'right' } })).toBe(
                    'test-leftbracketright',
                );
            });
        });

        describe('separator customization', () => {
            it('should use custom separator globally', () => {
                setSlugifyConfig({ separator: '_' });
                expect('Hello World'.slugify()).toBe('hello_world');
                expect('Test String'.slugify()).toBe('test_string');
            });

            it('should use custom separator per call', () => {
                expect('Hello World'.slugify({ separator: '_' })).toBe('hello_world');
                expect('Test String'.slugify({ separator: '__' })).toBe('test__string');
            });
        });

        describe('case transformation', () => {
            it('should respect lowercase setting globally', () => {
                setSlugifyConfig({ lowercase: false });
                expect('Hello World'.slugify()).toBe('Hello-World');
            });

            it('should respect lowercase setting per call', () => {
                expect('Hello World'.slugify({ lowercase: false })).toBe('Hello-World');
            });
        });

        describe('accent removal', () => {
            it('should respect removeAccents setting per call', () => {
                expect('Éléphant'.slugify({ removeAccents: false })).toBe('éléphant');
            });
        });

        describe('allowed characters', () => {
            it('should use custom allowed characters', () => {
                expect('Hello123!@#'.slugify({ allowedChars: /[a-zA-Z0-9_]/ })).toBe('hello123');
            });
        });

        describe('max length', () => {
            it('should truncate to max length', () => {
                expect('very-long-string-here'.slugify({ maxLength: 10 })).toBe('very-long');
                expect('short'.slugify({ maxLength: 10 })).toBe('short');
            });

            it('should remove trailing separator after truncation', () => {
                expect('hello-world-test'.slugify({ maxLength: 8 })).toBe('hello-wo');
            });
        });

        describe('custom transformers', () => {
            it('should apply custom transformers', () => {
                const config = {
                    transformers: [
                        (str: string) => str.replace(/test/g, 'example'),
                        (str: string) => str.toUpperCase(),
                    ],
                    lowercase: false,
                };
                expect('this is a test'.slugify(config)).toBe('THIS-IS-A-EXAMPLE');
            });
        });

        describe('configuration merging', () => {
            it('should merge global and local config correctly', () => {
                // Local config should override global defaults
                expect('Test ♀'.slugify({ separator: '_', customReplacements: { '♀': 'female' } })).toBe('test_female');
            });
        });
    });

    describe('replaceRange()', () => {
        it('should replace a single character at the given index', () => {
            expect('hello'.replaceRange(1, 2, 'a')).toBe('hallo');
        });

        it('should replace a range of characters', () => {
            expect('abcdef'.replaceRange(2, 5, 'Z')).toBe('abZf');
        });

        it('should remove a range if replaceString is omitted', () => {
            expect('abcdef'.replaceRange(1, 4)).toBe('aef');
        });

        it('should work when start > end (swaps automatically)', () => {
            expect('abcdef'.replaceRange(5, 2, 'X')).toBe('abXf');
        });

        it('should insert at the end if start and end are equal to length', () => {
            expect('abc'.replaceRange(3, 3, 'Z')).toBe('abcZ');
        });

        describe('error handling', () => {
            it('should throw if start or end is negative', () => {
                expect(() => 'abc'.replaceRange(-1, 2)).toThrow(RangeError);
                expect(() => 'abc'.replaceRange(1, -2)).toThrow(RangeError);
            });

            it('should throw if start or end is out of bounds', () => {
                expect(() => 'abc'.replaceRange(0, 4)).toThrow(RangeError);
                expect(() => 'abc'.replaceRange(5, 1)).toThrow(RangeError);
            });

            it('should throw if start or end is not an integer', () => {
                expect(() => 'abc'.replaceRange(1.5, 2)).toThrow(TypeError);
                expect(() => 'abc'.replaceRange(1, 2.2)).toThrow(TypeError);
            });
        });

        describe('edge cases', () => {
            it('should default replaceString to empty string', () => {
                expect('hello'.replaceRange(1, 4)).toBe('ho');
            });

            it('should support empty string', () => {
                expect(''.replaceRange(0, 0, 'x')).toBe('x');
            });
        });
    });
});
