import { SlugifyConfig, getSlugifyConfig } from './slugify.config';

/**
 * Applies slugify transformations to a string based on the provided configuration.
 * This is the core logic for converting strings to URL-friendly slugs.
 *
 * @param str - The input string to slugify
 * @param config - Configuration object (uses global config if not provided)
 * @returns The slugified string
 */
export function slugifyString(str: string, config?: SlugifyConfig): string {
    // Merge provided config with global config
    const globalConfig = getSlugifyConfig();
    const finalConfig = config ? globalConfig.merge(config) : globalConfig;

    return finalConfig.slugify(str);
}
