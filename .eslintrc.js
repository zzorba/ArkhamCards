module.exports = {
  root: true,
  extends: '@react-native-community',
  'env': {
    'browser': true,
    'commonjs': true,
    'react-native/react-native': true
  },
  'globals': {
    'process': true,
    'Promise': true
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': [
    'react',
    'react-native',
    'destructuring',
  ],
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'rules': {
    // Enable additional rules for ESLint:
    // http://eslint.org/docs/rules/

    // React native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    // 'react-native/no-inline-styles': 'error',
    // 'react-native/no-color-literals': 'error',

    // Destructuring rules
    'destructuring/no-rename': 'error',

    // Possible Errors
    'no-template-curly-in-string': 'error',

    // Best Practices
    'array-callback-return': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'no-else-return': 'error',
    'no-eval': 'error',
    'no-floating-decimal': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-with': 'error',
    'radix': 'error',
    'yoda': 'error',

    // Stylistic Issues
    'array-bracket-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'func-call-spacing': 'error',
    'indent': ['error', 2, {
      'SwitchCase': 1,
    }],
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'linebreak-style': ['error', 'unix'],
    // 'new-cap': 'error',
    'no-multiple-empty-lines': 'error',
    'no-nested-ternary': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true,
    }],
    'semi-spacing': 'error',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'spaced-comment': 'error',

    // ECMAScript 6
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',

    // override default options for rules from base configurations
    'no-cond-assign': ['error', 'always'],

    // disable rules from base configurations
    'no-console': 'off',

    // Enable additional rules for React:
    // https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
    'react/no-multi-comp': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-string-refs': 'error',
    'react/no-unused-prop-types': 'error',
    'react/self-closing-comp': ['error', {
      'component': true,
      'html': false,
    }],
    'react/style-prop-object': 'error',
    'react/no-unescaped-entities': 'off',

    // Enable additional rules for JSX:
    // https://github.com/yannickcr/eslint-plugin-react#jsx-specific-rules
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-spacing': ['error', {
      'when': 'never',
      'children': {
        'when': 'always',
      },
    }],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-key': 'error',
    'react/jsx-no-bind': ['error', {
      'ignoreRefs': true,
      'allowFunctions': true,
    }],
    'react/jsx-no-target-blank': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-wrap-multilines': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-invalid-this': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    'react/no-multi-comp': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'react-native/split-platform-components': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/display-name': 'off',
    'destructuring/no-rename': 'off',
    'semi': 'off',
  }
}
