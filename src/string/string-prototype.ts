import { defineIfNotExists } from '../utils/core.utils';
import { SlugifyConfig } from '../utils/slugify.config';
import { slugifyString } from '../utils/slugify.utils';

declare global {
    interface String {
        /**
         * Capitalizes the first character of the string (uppercase) and keeps the rest unchanged.
         *
         * @this {string} The string to capitalize
         * @returns {string} A new string with the first character in uppercase
         *
         * @example
         * 'hello world'.capitalize(); // 'Hello world'
         * 'HELLO'.capitalize(); // 'HELLO'
         *
         * @remarks
         * - Only affects the first character
         * - Returns an empty string for empty input
         * - Does not normalize the rest of the string
         */
        capitalize(): string;

        /**
         * Splits the string into an array of words by detecting camelCase, kebab-case, snake_case, and spaces.
         * Useful as a foundation for case conversion methods.
         *
         * @this {string} The string to split
         * @returns {string[]} An array of individual words extracted from the string
         *
         * @example
         * 'helloWorld'.splitWords(); // ['hello', 'World']
         * 'hello-world'.splitWords(); // ['hello', 'world']
         * 'hello_world'.splitWords(); // ['hello', 'world']
         * 'HelloWorld'.splitWords(); // ['Hello', 'World']
         *
         * @remarks
         * - Handles transitions from lowercase to uppercase (camelCase)
         * - Handles consecutive uppercase letters (HTMLParser → HTML Parser)
         * - Treats spaces, hyphens, and underscores as word separators
         * - Filters out empty strings
         */
        splitWords(): string[];

        /**
         * Converts the string to camelCase format.
         *
         * @this {string} The string to convert
         * @returns {string} The camelCased version of the string
         *
         * @example
         * 'hello-world'.camelCase(); // 'helloWorld'
         * 'hello_world'.camelCase(); // 'helloWorld'
         * 'HelloWorld'.camelCase(); // 'helloWorld'
         *
         * @remarks
         * - First word is lowercase, subsequent words have uppercase first letter
         * - Uses `splitWords()` internally to handle various naming conventions
         */
        camelCase(): string;

        /**
         * Converts the string to kebab-case format.
         *
         * @this {string} The string to convert
         * @returns {string} The kebab-cased version of the string
         *
         * @example
         * 'helloWorld'.kebabCase(); // 'hello-world'
         * 'hello_world'.kebabCase(); // 'hello-world'
         * 'HelloWorld'.kebabCase(); // 'hello-world'
         *
         * @remarks
         * - All letters are lowercase
         * - Words are separated by hyphens
         * - Uses `splitWords()` internally
         */
        kebabCase(): string;

        /**
         * Converts the string to snake_case format.
         *
         * @this {string} The string to convert
         * @returns {string} The snake_cased version of the string
         *
         * @example
         * 'helloWorld'.snakeCase(); // 'hello_world'
         * 'hello-world'.snakeCase(); // 'hello_world'
         * 'HelloWorld'.snakeCase(); // 'hello_world'
         *
         * @remarks
         * - All letters are lowercase
         * - Words are separated by underscores
         * - Uses `splitWords()` internally
         */
        snakeCase(): string;

        /**
         * Truncates the string to a maximum number of characters, appending '...' if truncated.
         *
         * @this {string} The string to truncate
         * @param {number} n - Maximum length of the result (not including the '...')
         * @returns {string} The truncated string with '...' appended if truncated, otherwise the original string
         * @throws {TypeError} If n is not a non-negative integer
         *
         * @example
         * 'hello world'.truncate(5); // 'hello...'
         * 'hello'.truncate(10); // 'hello'
         *
         * @remarks
         * - The '...' is added after the truncated portion, so total length is n + 3
         * - Negative or non-integer values throw an error
         */
        truncate(n: number): string;

        /**
         * Reverses the characters in the string, properly handling Unicode surrogate pairs.
         *
         * @this {string} The string to reverse
         * @returns {string} The reversed string
         *
         * @example
         * 'hello'.reverse(); // 'olleh'
         * '👋world'.reverse(); // 'dlrow👋'
         *
         * @remarks
         * - Uses spread operator to properly handle Unicode characters
         * - Works correctly with emoji and other multi-byte characters
         */
        reverse(): string;

        /**
         * Checks if the string is empty or contains only whitespace characters.
         *
         * @this {string} The string to check
         * @returns {boolean} True if the string is empty or whitespace-only, false otherwise
         *
         * @example
         * ''.isEmpty(); // true
         * '   '.isEmpty(); // true
         * 'hello'.isEmpty(); // false
         * ' hello '.isEmpty(); // false
         *
         * @remarks
         * - Uses `trim()` internally, so handles all whitespace characters
         */
        isEmpty(): boolean;

        /**
         * Converts the string into a URL-friendly slug format.
         * Combines normalization, lowercasing, whitespace handling, and special character removal.
         * Can be customized using global configuration or per-call options.
         *
         * @this {string} The string to slugify
         * @param {SlugifyConfig} [config] - Optional configuration to override global settings
         * @returns {string} A URL-safe slug version of the string
         *
         * @example
         * // Basic usage (default config)
         * 'Hello World'.slugify(); // 'hello-world'
         * 'Héllo Wørld'.slugify(); // 'hello-world'
         * 'Hello  World!!!'.slugify(); // 'hello-world'
         *
         * @example
         * // Custom replacements
         * 'Test ♀'.slugify({ customReplacements: { "♀": "feminin" } }); // 'test-feminin'
         * 'User♂@domain.com'.slugify({ customReplacements: { "♂": "masculin", "@": "at" } }); // 'usermasculinatdomain-com'
         *
         * @example
         * // Custom separator
         * 'Hello World'.slugify({ separator: "_" }); // 'hello_world'
         * 'Hello World'.slugify({ separator: "--" }); // 'hello--world'
         *
         * @example
         * // Preserve accents
         * 'Éléphant'.slugify({ removeAccents: false }); // 'éléphant'
         *
         * @example
         * // Disable lowercasing
         * 'Hello World'.slugify({ lowercase: false }); // 'Hello-World'
         *
         * @example
         * // Max length
         * 'Very long string'.slugify({ maxLength: 8 }); // 'very-lon'
         *
         * @example
         * // Custom transformers
         * 'hello world'.slugify({
         *   transformers: [(str) => str.replace(/world/g, 'universe')]
         * }); // 'hello-universe'
         *
         * @remarks
         * - Uses global configuration by default (see setSlugifyConfig)
         * - Normalizes Unicode characters (NFD decomposition) by default
         * - Removes accents and diacritical marks by default
         * - Converts to lowercase by default
         * - Replaces spaces and special characters with separator (hyphen by default)
         * - Removes leading/trailing separators
         * - Collapses multiple consecutive separators into one
         *
         * @see setSlugifyConfig
         * @see getSlugifyConfig
         * @see resetSlugifyConfig
         */
        slugify(): string;
        slugify(config: SlugifyConfig): string;

        /**
         * Replaces a substring between `start` and `end` indices with a given string.
         * Provides precise control over which portion of the string to replace.
         *
         * @this {string} The string to modify
         * @param {number} start - Start index of the replacement range (inclusive)
         * @param {number} [end] - End index of the replacement range (exclusive); defaults to start + 1
         * @param {string} [replaceString=''] - The string to insert in place of the removed portion
         * @returns {string} A new string with the range replaced
         *
         * @example
         * 'hello world'.replaceRange(0, 5, 'goodbye'); // 'goodbye world'
         * 'hello'.replaceRange(2, 2, 'XX'); // 'heXXllo'
         * 'hello'.replaceRange(1, 4); // 'ho'
         *
         * @remarks
         * - If end is not provided, defaults to replacing only the character at start
         * - If replaceString is not provided, the range is simply removed
         * - Uses slice() internally for safe index handling
         */
        replaceRange(start: number, end: number, replaceString?: string): string;
    }
}

/**
 * @see String.prototype.splitWords
 */
defineIfNotExists(String.prototype, 'splitWords', function (this: string): string[] {
    return this.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // helloWorld → hello World
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // HTMLParser → HTML Parser
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
});

/**
 * @see String.prototype.camelCase
 */
defineIfNotExists(String.prototype, 'camelCase', function (this: string): string {
    const words = this.splitWords().map((w: string) => w.toLowerCase());
    return words
        .map((word: string, i: number) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('');
});

/**
 * @see String.prototype.kebabCase
 */
defineIfNotExists(String.prototype, 'kebabCase', function (this: string): string {
    return this.splitWords()
        .map((w: string) => w.toLowerCase())
        .join('-');
});

/**
 * @see String.prototype.snakeCase
 */
defineIfNotExists(String.prototype, 'snakeCase', function (this: string): string {
    return this.splitWords()
        .map((w: string) => w.toLowerCase())
        .join('_');
});

/**
 * @see String.prototype.truncate
 */
defineIfNotExists(String.prototype, 'truncate', function (this: string, n: number): string {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
        throw new TypeError('Truncate length must be a non-negative integer');
    }
    return this.length > n ? this.slice(0, n) + '...' : this.toString();
});

/**
 * @see String.prototype.reverse
 */
defineIfNotExists(String.prototype, 'reverse', function (this: string): string {
    return [...this].reverse().join('');
});

/**
 * @see String.prototype.isEmpty
 */
defineIfNotExists(String.prototype, 'isEmpty', function (this: string): boolean {
    return this.trim().length === 0;
});

/**
 * @see String.prototype.slugify
 */
defineIfNotExists(String.prototype, 'slugify', function (this: string, config?: SlugifyConfig): string {
    return slugifyString(this, config);
});

/**
 * @see String.prototype.capitalize
 */
defineIfNotExists(String.prototype, 'capitalize', function (this: string): string {
    if (this.length === 0) return '';
    return this.charAt(0).toUpperCase() + this.slice(1);
});

/**
 * @see String.prototype.replaceRange
 */
defineIfNotExists(
    String.prototype,
    'replaceRange',
    function (this: string, start: number, end: number, replaceString: string = ''): string {
        if (!Number.isInteger(start) || !Number.isInteger(end)) {
            throw new TypeError('start and end must be integers');
        }
        if (start < 0 || end < 0) {
            throw new RangeError('start or end cannot be negative');
        }
        if (start > this.length || end > this.length) {
            throw new RangeError('start or end is out of bounds');
        }
        if (start > end) [start, end] = [end, start];
        return this.slice(0, start) + (replaceString ?? '') + this.slice(end);
    },
);
