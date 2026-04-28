import {
    SlugifyConfig,
    assertCharClass,
    assertSlugifyConfig,
    getDefaultSlugifyConfig,
    getSlugifyConfig,
    resetSlugifyConfig,
    setSlugifyConfig,
} from './slugify.config';

describe('slugify.config', () => {
    afterEach(() => {
        resetSlugifyConfig();
    });

    describe('SlugifyConfig.default()', () => {
        it('should return a config with default separator', () => {
            expect(getDefaultSlugifyConfig().separator).toBe('-');
        });

        it('should return a config with lowercase case', () => {
            expect(getDefaultSlugifyConfig().case).toBe('lower');
        });

        it('should return a config with removeAccents enabled', () => {
            expect(getDefaultSlugifyConfig().removeAccents).toBe(true);
        });
    });

    describe('SlugifyConfig.slugify()', () => {
        describe('with default config', () => {
            it('should convert to lowercase', () => {
                expect(SlugifyConfig.default().slugify('Hello World')).toBe('hello-world');
            });

            it('should replace spaces with separator', () => {
                expect(SlugifyConfig.default().slugify('foo bar')).toBe('foo-bar');
            });

            it('should remove accents', () => {
                expect(SlugifyConfig.default().slugify('Héllo')).toBe('hello');
            });

            it('should collapse multiple separators', () => {
                expect(SlugifyConfig.default().slugify('foo  bar')).toBe('foo-bar');
            });

            it('should trim leading and trailing separators', () => {
                expect(SlugifyConfig.default().slugify(' foo ')).toBe('foo');
            });
        });

        describe('with custom separator', () => {
            it('should use custom separator', () => {
                const config = SlugifyConfig.builder().withSeparator('_').build();
                expect(config.slugify('hello world')).toBe('hello_world');
            });
        });

        describe('with maxLength', () => {
            it('should truncate to maxLength', () => {
                const config = SlugifyConfig.builder().withMaxLength(5).build();
                expect(config.slugify('hello world').length).toBeLessThanOrEqual(5);
            });
        });

        describe('with custom replacements', () => {
            it('should apply custom replacements before slugifying', () => {
                const config = SlugifyConfig.builder().withCustomReplacements({ '&': 'and' }).build();
                expect(config.slugify('cats & dogs')).toBe('cats-and-dogs');
            });
        });

        describe('with transformers', () => {
            it('should apply transformers before slugifying', () => {
                const config = SlugifyConfig.builder()
                    .withTransformers([(s) => s.replace('foo', 'bar')])
                    .build();
                expect(config.slugify('foo baz')).toBe('bar-baz');
            });
        });
    });

    describe('SlugifyConfig.slugifyWith()', () => {
        it('should slugify with a temporary configuration', () => {
            const result = SlugifyConfig.slugifyWith('hello world', (b) => b.withSeparator('_'));
            expect(result).toBe('hello_world');
        });
    });

    describe('SlugifyConfig.merge()', () => {
        it('should merge two configs with the other taking precedence', () => {
            const base = SlugifyConfig.builder().withSeparator('-').build();
            const other = SlugifyConfig.builder().withSeparator('_').build();
            expect(base.merge(other).separator).toBe('_');
        });
    });

    describe('assertCharClass()', () => {
        it('should not throw for a valid character class', () => {
            expect(() => assertCharClass(/[a-z]/)).not.toThrow();
        });

        describe('error handling', () => {
            it('should throw Error for a regex that is not a character class', () => {
                expect(() => assertCharClass(/a-z/)).toThrow(Error);
            });
        });
    });

    describe('assertSlugifyConfig()', () => {
        it('should not throw for a valid builder', () => {
            expect(() => assertSlugifyConfig(SlugifyConfig.builder())).not.toThrow();
        });

        describe('error handling', () => {
            it('should throw TypeError for invalid separator', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).separator = 123;
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });

            it('should throw TypeError for invalid case value', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).case = 'invalid';
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });

            it('should throw TypeError for invalid removeAccents', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).removeAccents = 'yes';
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });

            it('should throw TypeError for invalid maxLength', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).maxLength = -1;
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });

            it('should throw TypeError for invalid allowedChars', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).allowedChars = 'not-a-regex';
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });

            it('should throw TypeError for invalid transformers', () => {
                const builder = SlugifyConfig.builder();
                (builder as any).transformers = ['not-a-function'];
                expect(() => assertSlugifyConfig(builder)).toThrow(TypeError);
            });
        });
    });

    describe('getSlugifyConfig()', () => {
        it('should return the default config initially', () => {
            expect(getSlugifyConfig().separator).toBe('-');
        });
    });

    describe('setSlugifyConfig()', () => {
        it('should update the global config', () => {
            const config = SlugifyConfig.builder().withSeparator('_').build();
            setSlugifyConfig(config);
            expect(getSlugifyConfig().separator).toBe('_');
        });
    });

    describe('resetSlugifyConfig()', () => {
        it('should restore the default config', () => {
            const config = SlugifyConfig.builder().withSeparator('_').build();
            setSlugifyConfig(config);
            resetSlugifyConfig();
            expect(getSlugifyConfig().separator).toBe('-');
        });
    });
});
