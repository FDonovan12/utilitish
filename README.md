## Licence

Ce projet est distribué sous licence [GPL v3](https://www.gnu.org/licenses/gpl-3.0.html) © 2025 Donovan Ferreira.

Ceci est une petite librairie qui ajoute plusieurs méthodes au prototype JavaScript.

## Configuration Slugify

La méthode `slugify()` peut être personnalisée pour répondre à vos besoins spécifiques. Consultez la JSDoc dans votre IDE pour voir tous les exemples disponibles.

### Configuration globale

Vous pouvez définir une configuration globale qui s'appliquera à tous les appels `slugify()` :

```typescript
import { setSlugifyConfig } from 'utilitish';

// Configuration pour remplacer les symboles de genre
setSlugifyConfig({
    customReplacements: {
        '♀': 'feminin',
        '♂': 'masculin',
    },
    separator: '_',
});

'Test ♀'.slugify(); // "test_feminin"
'User♂@domain.com'.slugify(); // "user_masculin_at_domain_com"
```

### Configuration par appel

Vous pouvez aussi passer une configuration spécifique à chaque appel :

```typescript
// Utilise la config globale
'Hello World'.slugify(); // "hello-world"

// Override la config pour cet appel
'Hello World'.slugify({ separator: '_' }); // "hello_world"
```

### Options de configuration

- **`customReplacements`**: Remplacer des caractères spécifiques (ex: "♀" → "feminin")
- **`separator`**: Caractère de séparation (défaut: "-")
- **`lowercase`**: Convertir en minuscules (défaut: true)
- **`removeAccents`**: Supprimer les accents (défaut: true)
- **`allowedChars`**: Regex des caractères autorisés (défaut: /[a-zA-Z0-9]/)
- **`maxLength`**: Longueur maximale du slug
- **`transformers`**: Fonctions de transformation personnalisées

### Gestion de la configuration

```typescript
import { getSlugifyConfig, resetSlugifyConfig } from 'utilitish';

// Obtenir la config actuelle
const currentConfig = getSlugifyConfig();

// Réinitialiser aux valeurs par défaut
resetSlugifyConfig();
```

Pour plus d'exemples et cas d'usage avancés, consultez les JSDoc intégrées dans votre IDE.
