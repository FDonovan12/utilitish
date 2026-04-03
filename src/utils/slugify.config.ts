/**
 * Configuration class for the slugify functionality.
 * Provides comprehensive customization options for URL slug generation.
 */
export class SlugifyConfig {
    private readonly _customReplacements: Record<string, string>;
    private readonly _separator: string;
    private readonly _case: 'lower' | 'upper' | 'default';
    private readonly _removeAccents: boolean;
    private readonly _allowedChars?: RegExp;
    private readonly _maxLength?: number;
    private readonly _transformers: Array<(str: string) => string>;

    private constructor(builder: SlugifyConfigBuilder) {
        this._customReplacements = builder.customReplacements;
        this._separator = builder.separator;
        this._case = builder.case;
        this._removeAccents = builder.removeAccents;
        this._allowedChars = builder.allowedChars;
        this._maxLength = builder.maxLength;
        this._transformers = builder.transformers;
    }

    static builder(): SlugifyConfigBuilder {
        return new SlugifyConfigBuilder();
    }

    static default(): SlugifyConfig {
        return SlugifyConfig.builder().build();
    }

    static create(builder: SlugifyConfigBuilder): SlugifyConfig {
        assertSlugifyConfig(builder);
        const config = new SlugifyConfig(builder);
        return Object.freeze(config) as SlugifyConfig;
    }

    get customReplacements(): Record<string, string> {
        return { ...this._customReplacements };
    }

    get separator(): string {
        return this._separator;
    }

    get case(): 'lower' | 'upper' | 'default' {
        return this._case;
    }

    get removeAccents(): boolean {
        return this._removeAccents;
    }

    get allowedChars(): RegExp | undefined {
        return this._allowedChars;
    }

    get maxLength(): number | undefined {
        return this._maxLength;
    }

    get transformers(): Array<(str: string) => string> {
        return [...this._transformers];
    }

    merge(other: SlugifyConfig): SlugifyConfig {
        return SlugifyConfig.builder()
            .withCustomReplacements({ ...this.customReplacements, ...other.customReplacements })
            .withSeparator(other.separator || this.separator)
            .withCase(other.case || this.case)
            .withRemoveAccents(other.removeAccents !== undefined ? other.removeAccents : this.removeAccents)
            .withAllowedChars(other.allowedChars || this.allowedChars)
            .withMaxLength(other.maxLength || this.maxLength)
            .withTransformers([...this.transformers, ...other.transformers])
            .build();
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getCharClass(): RegExp {
        return this._allowedChars || (this._removeAccents ? /[a-zA-Z0-9]/ : /[a-zA-Z0-9\u00C0-\u017F]/);
    }

    applyCustomReplacements(str: string): string {
        let result = str;
        for (const [pattern, replacement] of Object.entries(this._customReplacements)) {
            const escapedPattern = this.escapeRegex(pattern);
            result = result.replace(new RegExp(escapedPattern, 'g'), replacement);
        }
        return result;
    }

    applyTransformers(str: string): string {
        return this._transformers.reduce((result, transformer) => transformer(result), str);
    }

    applyRemoveAccents(str: string): string {
        if (!this._removeAccents) return str;
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    replaceNonAllowedChars(str: string): string {
        const charClass = this.getCharClass().source;
        const safeCharClass = charClass.startsWith('[') && charClass.endsWith(']') ? charClass.slice(1, -1) : charClass;
        return str.replace(new RegExp(`[^${safeCharClass}]+`, 'g'), this._separator);
    }

    trimSeparators(str: string): string {
        const safeSeparator = this.escapeRegex(this._separator);
        return str.replace(new RegExp(`^${safeSeparator}+|${safeSeparator}+$`, 'g'), '');
    }

    applyCase(str: string): string {
        if (this._case === 'lower') return str.toLowerCase();
        if (this._case === 'upper') return str.toUpperCase();
        return str;
    }

    applyMaxLength(str: string): string {
        if (!this._maxLength || this._maxLength <= 0) return str;
        let result = str.slice(0, this._maxLength);
        const safeSeparator = this.escapeRegex(this._separator);
        return result.replace(new RegExp(`${safeSeparator}$`), '');
    }

    collapseSeparators(str: string): string {
        const safeSeparator = this.escapeRegex(this._separator);
        return str.replace(new RegExp(`${safeSeparator}+`, 'g'), this._separator);
    }

    /**
     * Applies the slugify transformations to the given string using this configuration.
     * @param str - The input string to slugify
     * @returns The slugified string
     */
    slugify(str: string): string {
        let result = str;
        result = this.applyCustomReplacements(result);
        result = this.applyTransformers(result);
        result = this.applyRemoveAccents(result);
        result = this.replaceNonAllowedChars(result);
        result = this.trimSeparators(result);
        result = this.applyCase(result);
        result = this.applyMaxLength(result);
        result = this.collapseSeparators(result);
        return result;
    }

    /**
     * Static method to slugify a string with a temporary configuration built from the builder.
     * @param str - The input string to slugify
     * @param builderFn - A function that configures the builder
     * @returns The slugified string
     */
    static slugifyWith(str: string, builderFn: (builder: SlugifyConfigBuilder) => SlugifyConfigBuilder): string {
        const config = builderFn(SlugifyConfig.builder()).build();
        return config.slugify(str);
    }
}

export class SlugifyConfigBuilder {
    customReplacements: Record<string, string> = {};
    separator: string = '-';
    case: 'lower' | 'upper' | 'default' = 'lower';
    removeAccents: boolean = true;
    allowedChars?: RegExp;
    maxLength?: number;
    transformers: Array<(str: string) => string> = [];

    withCustomReplacements(replacements: Record<string, string>): this {
        this.customReplacements = { ...replacements };
        return this;
    }

    withSeparator(separator: string): this {
        this.separator = separator;
        return this;
    }

    withCase(caseValue: 'lower' | 'upper' | 'default'): this {
        this.case = caseValue;
        return this;
    }

    withRemoveAccents(remove: boolean): this {
        this.removeAccents = remove;
        return this;
    }

    withAllowedChars(regex?: RegExp): this {
        this.allowedChars = regex;
        return this;
    }

    withMaxLength(length?: number): this {
        this.maxLength = length;
        return this;
    }

    withTransformers(transformers: Array<(str: string) => string>): this {
        this.transformers = [...transformers];
        return this;
    }

    build(): SlugifyConfig {
        const config = SlugifyConfig.create(this);
        return config;
    }
}

/**
 * Default configuration for slugify operations.
 * Provides sensible defaults that can be overridden by users.
 */
export function getDefaultSlugifyConfig(): SlugifyConfig {
    return SlugifyConfig.default();
}

/**
 * Global configuration instance that can be modified by users.
 * Starts with default values but can be updated via setSlugifyConfig().
 */
let globalSlugifyConfig: SlugifyConfig = getDefaultSlugifyConfig();

/**
 * Sets the global slugify configuration that will be used by default.
 * Replaces the current global config with the provided config.
 *
 * @param config - Configuration object to set as global config
 *
 * @example
 * setSlugifyConfig(
 *   SlugifyConfig.builder()
 *     .withCustomReplacements({ "♀": "feminin", "♂": "masculin" })
 *     .withSeparator("_")
 *     .build()
 * );
 */
export function assertCharClass(regex: RegExp): void {
    const src = regex.source;
    if (!src.startsWith('[') || !src.endsWith(']')) {
        throw new Error(`Invalid allowedChars: must be a character class like /[a-z]/, received ${regex}`);
    }
}

export function assertSlugifyConfig(builderOrConfig: SlugifyConfigBuilder | SlugifyConfig): void {
    const allowedChars = builderOrConfig.allowedChars;
    const separator = builderOrConfig.separator;
    const caseValue = builderOrConfig.case;
    const removeAccents = builderOrConfig.removeAccents;
    const maxLength = builderOrConfig.maxLength;
    const customReplacements = builderOrConfig.customReplacements;
    const transformers = builderOrConfig.transformers;

    if (allowedChars !== undefined) {
        if (!(allowedChars instanceof RegExp)) {
            throw new TypeError(`Invalid allowedChars: expected a RegExp, received ${typeof allowedChars}`);
        }
        assertCharClass(allowedChars);
    }

    if (typeof separator !== 'string') {
        throw new TypeError(`Invalid separator: expected a string, received ${typeof separator}`);
    }

    if (caseValue !== 'lower' && caseValue !== 'upper' && caseValue !== 'default') {
        throw new TypeError(`Invalid case value: expected 'lower' | 'upper' | 'default', received ${caseValue}`);
    }

    if (typeof removeAccents !== 'boolean') {
        throw new TypeError(`Invalid removeAccents: expected a boolean, received ${typeof removeAccents}`);
    }

    if (maxLength !== undefined) {
        if (typeof maxLength !== 'number' || !Number.isInteger(maxLength) || maxLength < 0) {
            throw new TypeError(`Invalid maxLength: expected a non-negative integer, received ${maxLength}`);
        }
    }

    if (typeof customReplacements !== 'object' || customReplacements === null) {
        throw new TypeError(`Invalid customReplacements: expected an object, received ${typeof customReplacements}`);
    }

    if (!Array.isArray(transformers) || !transformers.every((fn) => typeof fn === 'function')) {
        throw new TypeError(`Invalid transformers: expected an array of functions`);
    }
}

export function setSlugifyConfig(config: SlugifyConfig): void {
    globalSlugifyConfig = config;
}

/**
 * Gets the current global slugify configuration.
 * Returns the current global config instance.
 *
 * @returns Current global configuration object
 */
export function getSlugifyConfig(): SlugifyConfig {
    return globalSlugifyConfig;
}

/**
 * Resets the global slugify configuration to default values.
 */
export function resetSlugifyConfig(): void {
    globalSlugifyConfig = getDefaultSlugifyConfig();
}
