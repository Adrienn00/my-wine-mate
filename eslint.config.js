import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import vueConfigPrettier from '@vue/eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
  },
  {
    rules: {
      ...vueConfigPrettier.rules,
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/no-v-html': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist'],
  },
  prettier,
  {
    rules: {
      'prettier/prettier': ['warn', { singleQuote: true }],
    },
  },
]
