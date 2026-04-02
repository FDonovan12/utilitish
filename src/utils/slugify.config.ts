/**
 * Configuration types and interfaces for the slugify functionality.
 * Provides comprehensive customization options for URL slug generation.
 */

export interface SlugifyConfig {
    /**
     * Custom character replacements applied before other transformations.
     * Useful for replacing special symbols with words or other characters.
     *
     * @example
     * { "♀": "feminin", "♂": "masculin", "@": "at" }
     */
    customReplacements?: Record<string, string>;

    /**
     * Character used to separate words in the slug.
     * @default "-"
     */
    separator?: string;

    /**
     * Whether to convert the result to lowercase.
     * @default true
     */
    lowercase?: boolean;

    /**
     * Whether to remove accents and diacritical marks.
     * @default true
     */
    removeAccents?: boolean;

    /**
     * Regular expression pattern for characters to keep.
     * Characters not matching this pattern will be replaced with the separator.
     * @default "/[a-zA-Z0-9]/"
     */
    allowedChars?: RegExp;

    /**
     * Maximum length of the resulting slug (excluding separator trimming).
     * If exceeded, the slug will be truncated.
     * @default undefined (no limit)
     */
    maxLength?: number;

    /**
     * Custom transformation functions applied in order.
     * Each function receives the current string state and should return the transformed string.
     *
     * @example
     * [(str) => str.replace(/custom-pattern/g, 'replacement')]
     */
    transformers?: Array<(str: string) => string>;
}

/**
 * Default configuration for slugify operations.
 * Provides sensible defaults that can be overridden by users.
 */
export const defaultSlugifyConfig: SlugifyConfig = {
    customReplacements: {},
    separator: '-',
    lowercase: true,
    removeAccents: true,
    allowedChars: undefined, // Will be determined dynamically based on removeAccents
    maxLength: undefined,
    transformers: [],
};

/**
 * Global configuration instance that can be modified by users.
 * Starts with default values but can be updated via setSlugifyConfig().
 */
let globalSlugifyConfig: SlugifyConfig = { ...defaultSlugifyConfig };

/**
 * Sets the global slugify configuration that will be used by default.
 * Merges the provided config with the existing global config.
 *
 * @param config - Partial configuration object to merge with current global config
 *
 * @example
 * setSlugifyConfig({
 *   customReplacements: { "♀": "feminin", "♂": "masculin" },
 *   separator: "_"
 * });
 */
export function setSlugifyConfig(config: SlugifyConfig): void {
    globalSlugifyConfig = { ...globalSlugifyConfig, ...config };
}

/**
 * Gets the current global slugify configuration.
 * Returns a copy to prevent external mutations.
 *
 * @returns Current global configuration object
 */
export function getSlugifyConfig(): SlugifyConfig {
    return { ...globalSlugifyConfig };
}

/**
 * Resets the global slugify configuration to default values.
 */
export function resetSlugifyConfig(): void {
    globalSlugifyConfig = { ...defaultSlugifyConfig };
}
