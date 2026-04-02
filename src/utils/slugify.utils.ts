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
    const finalConfig = { ...getSlugifyConfig(), ...config };

    let result = str;

    // 1. Apply custom replacements first
    if (finalConfig.customReplacements && Object.keys(finalConfig.customReplacements).length > 0) {
        for (const [pattern, replacement] of Object.entries(finalConfig.customReplacements)) {
            // Escape special regex characters in the pattern
            const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = result.replace(new RegExp(escapedPattern, 'g'), replacement);
        }
    }

    // 2. Apply custom transformers
    if (finalConfig.transformers && finalConfig.transformers.length > 0) {
        for (const transformer of finalConfig.transformers) {
            result = transformer(result);
        }
    }

    // 3. Remove accents if configured
    if (finalConfig.removeAccents) {
        result = result.normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    // 4. Replace non-allowed characters with separator
    const separator = finalConfig.separator || '-';
    // Determine allowed characters based on removeAccents setting
    const defaultAllowedChars = finalConfig.removeAccents ? /[a-zA-Z0-9]/ : /[a-zA-Z0-9\u00C0-\u017F]/; // Include accented Latin characters if accents are preserved
    const allowedRegex = finalConfig.allowedChars || defaultAllowedChars;
    const allowedPattern = allowedRegex.source;
    // Extract the character class content (remove surrounding brackets if present)
    const charClass =
        allowedPattern.startsWith('[') && allowedPattern.endsWith(']') ? allowedPattern.slice(1, -1) : allowedPattern;
    result = result.replace(new RegExp(`[^${charClass}]+`, 'g'), separator);

    // 5. Remove leading/trailing separators
    result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

    // 6. Convert to lowercase if configured
    if (finalConfig.lowercase) {
        result = result.toLowerCase();
    }

    // 7. Apply max length if configured
    if (finalConfig.maxLength && finalConfig.maxLength > 0) {
        result = result.slice(0, finalConfig.maxLength);
        // Remove trailing separator after truncation
        result = result.replace(new RegExp(`${separator}$`), '');
    }

    // 8. Collapse multiple consecutive separators
    result = result.replace(new RegExp(`${separator}+`, 'g'), separator);

    return result;
}
