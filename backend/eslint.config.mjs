// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignorados
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'node_modules/**',
    ],
  },

  // Reglas base JS
  eslint.configs.recommended,

  // Reglas TypeScript con type-checking
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier
  eslintPluginPrettierRecommended,

  // Configuración general
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Reglas globales del proyecto
  {
    rules: {
      // Permitimos any cuando es inevitable (ORM, libs externas)
      '@typescript-eslint/no-explicit-any': 'off',

      // Buenas prácticas async
      '@typescript-eslint/no-floating-promises': 'warn',

      // Menos estricto en argumentos dinámicos
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // Calidad de código
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/require-await': 'warn',
    },
  },

  // 🔥 OVERRIDE CLAVE PARA TYPEORM ENTITIES
  {
    files: ['**/*.entity.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Opcional: entities no necesitan estas reglas
      '@typescript-eslint/class-methods-use-this': 'off',
    },
  },
);
