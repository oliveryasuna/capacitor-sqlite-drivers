/* eslint-disable max-lines -- ESLint config. */
import url from 'node:url';
import type {Linter} from 'eslint';
// @ts-expect-error: TS7016 because no types.
import betterMutationPlugin from 'eslint-plugin-better-mutation';
import compatPlugin from 'eslint-plugin-compat';
import dependPlugin from 'eslint-plugin-depend';
// @ts-expect-error: TS7016 because no types.
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import importXPlugin from 'eslint-plugin-import-x';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
// @ts-expect-error: TS7016 because no types.
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import vitestPlugin from 'eslint-plugin-vitest';
import tsEslint from 'typescript-eslint';
import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import stylisticJsxPlugin from '@stylistic/eslint-plugin-jsx';
import stylisticTsPlugin from '@stylistic/eslint-plugin-ts';
import type {ParserOptions} from '@typescript-eslint/types';
import type {FileExtension, ImportSettings} from 'eslint-plugin-import-x/lib/types';
import oxc from 'eslint-import-resolver-oxc';
import globals from 'globals';
import nxPlugin from '@nx/eslint-plugin/nx';
import deepmerge from 'deepmerge';
import type {Options as NxDependencyChecksOptions} from '@nx/eslint-plugin/src/rules/dependency-checks';
import jsoncParser from 'jsonc-eslint-parser';

const __DIRNAME: string = url.fileURLToPath(new URL('.', import.meta.url));

const __GLOB_JS: string[] = (['*.{js,jsx,cjs,mjs}', '**/*.{js,jsx,cjs,mjs}'] as const);
const __GLOB_TS: string[] = (['*.{ts,tsx,cts,mts}', '**/*.{ts,tsx,cts,mts}'] as const);
const __GLOB_JSX_TSX: string[] = (['*.{jsx,tsx}', '**/*.{jsx,tsx}'] as const);
const __GLOB_DTS: string[] = (['*.d.ts', '**/*.d.ts'] as const);
const __GLOB_INDEX: string[] = (['**/index.{js,jsx,cjs,mjs,ts,tsx,cts,mts,d.ts}'] as const);
const __GLOB_TEST: string[] = (['**/*.test.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'] as const);
const __GLOB_SCRIPTS: string[] = (['scripts/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'] as const);
const __GLOB_CONFIG: string[] = (['*.config.{js,jsx,cjs,mjs,ts,tsx,cts,mts}', '**/*.config.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'] as const);
const __GLOB_PACKAGE_JSON: string[] = (['package.json', 'packages/*/package.json', 'packages/*/demo/package.json'] as const);

const __ROOT_TS_CONFIGS: string[] = (['tsconfig.json'] as const);
const __PACKAGE_TS_CONFIGS: string[] = ([
  'packages/*/tsconfig.json',
  'packages/*/tsconfig.config.json',
  'packages/*/tsconfig.lib.json',
  'packages/*/tsconfig.test.json',
  'packages/*/demo/tsconfig.json',
  'packages/*/demo/tsconfig.config.json',
  'packages/*/demo/tsconfig.app.json'
] as const);

const __TS_LANGUAGE_OPTIONS: Linter.LanguageOptions = ({
  parser: tsEslint.parser,
  parserOptions: ({
    allowAutomaticSingleRunInference: true,
    project: __PACKAGE_TS_CONFIGS,
    projectService: true,
    tsconfigRootDir: __DIRNAME,
    warnOnUnsupportedTypeScriptVersion: true
  } as ParserOptions)
} as Linter.LanguageOptions);

const __DISABLE_TYPE_CHECKED_RULES: Partial<Linter.RulesRecord> = ({
  ...tsEslint.configs.disableTypeChecked.rules
} as const);

export default ([
  // Ignored files.
  {
    ignores: [
      '**/node_modules/**',
      '**/coverage/**',
      '**/dist/**'
    ]
  },
  // Plugins.
  {
    plugins: {
      '@nx': nxPlugin,
      '@stylistic/js': stylisticJsPlugin,
      '@stylistic/jsx': stylisticJsxPlugin,
      '@stylistic/ts': stylisticTsPlugin,
      '@typescript-eslint': tsEslint.plugin,
      'better-mutation': betterMutationPlugin,
      'compat': compatPlugin,
      'depend': dependPlugin,
      'eslint-comments': eslintCommentsPlugin,
      'import-x': importXPlugin,
      'jsdoc': jsdocPlugin,
      'sonarjs': sonarjsPlugin,
      'unicorn': unicornPlugin
    }
  },
  // JavaScript/TypeScript files.
  {
    files: [
      ...__GLOB_JS,
      ...__GLOB_TS
    ],
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': (__GLOB_TS as FileExtension[])
      },
      'import-x/resolver': oxc
    } satisfies (AddPrefix<ImportSettings, 'import-x/'>),
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          globals: {
            ...globals.browser
          }
        }
      }
    },
    rules: {
      // ESLint
      //--------------------------------------------------

      // Possible Errors
      //

      'for-direction': ['error'],
      'getter-return': ['error', {
        allowImplicit: false
      }],
      'no-async-promise-executor': ['error'],
      'no-await-in-loop': ['error'],
      'no-compare-neg-zero': ['error'],
      'no-cond-assign': ['error',
        'always'],
      'no-console': ['off'],
      'no-constant-condition': ['error', {
        checkLoops: true
      }],
      'no-control-regex': ['error'],
      'no-debugger': ['error'],
      'no-dupe-args': ['error'],
      'no-dupe-else-if': ['error'],
      'no-dupe-keys': ['error'],
      'no-duplicate-case': ['error'],
      'no-empty': ['error', {
        allowEmptyCatch: false
      }],
      'no-empty-character-class': ['error'],
      'no-ex-assign': ['error'],
      'no-extra-boolean-cast': ['error', {
        enforceForInnerExpressions: true
      }],
      'no-func-assign': ['error'],
      'no-inner-declarations': ['off'],
      'no-invalid-regexp': ['error', {
        allowConstructorFlags: []
      }],
      'no-irregular-whitespace': ['error', {
        skipStrings: false,
        skipComments: false,
        skipRegExps: false,
        skipTemplates: false
      }],
      'no-loss-of-precision': ['error'],
      'no-misleading-character-class': ['error', {
        allowEscape: false
      }],
      'no-obj-calls': ['error'],
      'no-promise-executor-return': ['error', {
        allowVoid: false
      }],
      'no-prototype-builtins': ['error'],
      'no-regex-spaces': ['error'],
      'no-sparse-arrays': ['error'],
      'no-template-curly-in-string': ['error'],
      'no-unexpected-multiline': ['error'],
      'no-unreachable': ['error'],
      'no-unreachable-loop': ['error'],
      'no-unsafe-finally': ['error'],
      'no-unsafe-negation': ['error', {
        enforceForOrderingRelations: true
      }],
      'no-unsafe-optional-chaining': ['error', {
        disallowArithmeticOperators: true
      }],
      'require-atomic-updates': ['error', {
        allowProperties: false
      }],
      'use-isnan': ['error', {
        enforceForSwitchCase: true,
        enforceForIndexOf: true
      }],
      'valid-typeof': ['error', {
        requireStringLiterals: true
      }],

      // Best practices
      //

      'accessor-pairs': ['error', {
        setWithoutGet: false,
        getWithoutSet: false,
        enforceForClassMembers: true
      }],
      'array-callback-return': ['error', {
        allowImplicit: false,
        checkForEach: true,
        allowVoid: false
      }],
      'block-scoped-var': ['error'],
      'class-methods-use-this': ['off'],
      'complexity': ['error', {
        max: 20,
        variant: 'classic'
      }],
      'consistent-return': ['error', {
        treatUndefinedAsUnspecified: false
      }],
      'curly': ['error',
        'all'],
      'default-case': ['error', {
        commentPattern: '^no default$'
      }],
      'default-case-last': ['error'],
      'default-param-last': ['error'],
      'dot-notation': ['error', {
        allowKeywords: true,
        allowPattern: '^NODE_ENV$'
      }],
      'eqeqeq': ['error',
        'always',
        {
          null: 'always'
        }],
      'grouped-accessor-pairs': ['error',
        'getBeforeSet'],
      'guard-for-in': ['error'],
      'max-classes-per-file': ['error',
        1],
      'no-alert': ['error'],
      'no-caller': ['error'],
      'no-case-declarations': ['error'],
      'no-div-regex': ['error'],
      'no-else-return': ['off'],
      'no-empty-function': ['error', {
        allow: []
      }],
      'no-empty-pattern': ['error'],
      'no-eq-null': ['error'],
      'no-eval': ['error', {
        allowIndirect: false
      }],
      'no-extend-native': ['error', {
        exceptions: []
      }],
      'no-extra-bind': ['error'],
      'no-extra-label': ['error'],
      'no-fallthrough': ['error', {
        commentPattern: 'fallthrough',
        allowEmptyCase: false,
        reportUnusedFallthroughComment: true
      }],
      'no-global-assign': ['error', {
        exceptions: []
      }],
      'no-implicit-coercion': ['error', {
        boolean: true,
        number: true,
        string: true,
        disallowTemplateShorthand: true,
        allow: []
      }],
      'no-implicit-globals': ['error'],
      'no-implied-eval': ['error'],
      'no-import-assign': ['error'],
      'no-invalid-this': ['error', {
        capIsConstructor: false
      }],
      'no-iterator': ['error'],
      'no-labels': ['error', {
        allowLoop: false,
        allowSwitch: false
      }],
      'no-lone-blocks': ['error'],
      'no-loop-func': ['error'],
      'no-magic-numbers': ['off'],
      'no-multi-str': ['error'],
      'no-new': ['error'],
      'no-new-func': ['error'],
      'no-new-wrappers': ['error'],
      'no-nonoctal-decimal-escape': ['error'],
      'no-octal': ['error'],
      'no-octal-escape': ['error'],
      'no-param-reassign': ['off'],
      'no-proto': ['error'],
      'no-redeclare': ['error', {
        builtinGlobals: true
      }],
      'no-restricted-properties': ['error'],
      'no-return-assign': ['error',
        'always'],
      'no-return-await': ['error'],
      'no-script-url': ['error'],
      'no-self-assign': ['error'],
      'no-self-compare': ['error'],
      'no-sequences': ['error', {
        allowInParentheses: true
      }],
      'no-throw-literal': ['error'],
      'no-unmodified-loop-condition': ['error'],
      'no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
        enforceForJSX: true
      }],
      'no-unused-labels': ['error'],
      // 'no-useless-assignment': ['error'],
      'no-useless-backreference': ['error'],
      'no-useless-call': ['error'],
      'no-useless-catch': ['error'],
      'no-useless-concat': ['error'],
      'no-useless-escape': ['error'],
      'no-useless-return': ['error'],
      'no-void': ['off'],
      'no-warning-comments': ['warn', {
        terms: ['todo', 'fixme', 'xxx'],
        location: 'start'
      }],
      'no-with': ['error'],
      'prefer-named-capture-group': ['error'],
      'prefer-object-has-own': ['error'],
      'prefer-promise-reject-errors': ['error', {
        allowEmptyReject: false
      }],
      'prefer-regex-literals': ['error', {
        disallowRedundantWrapping: true
      }],
      'radix': ['error',
        'always'],
      'require-await': ['error'],
      'require-unicode-regexp': ['off'],
      'vars-on-top': ['off'],
      'yoda': ['error',
        'never'],

      // Strict mode
      //

      strict: ['error',
        'global'],

      // Variables
      //

      'init-declarations': ['error',
        'always'],
      'no-delete-var': ['error'],
      'no-label-var': ['error'],
      'no-restricted-globals': ['error'],
      'no-shadow': ['off'],
      'no-shadow-restricted-names': ['error'],
      'no-undef': ['off'],
      'no-undef-init': ['off'],
      'no-undefined': ['off'],
      'no-unused-vars': ['error', {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'all',
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        reportUsedIgnorePattern: false
      }],
      'no-use-before-define': ['error', {
        functions: true,
        classes: true,
        variables: true,
        allowNamedExports: false
      }],

      // Node.js and CommonJS
      //

      'callback-return': ['error', [
        'callback'
      ]],
      'global-require': ['error'],
      'handle-callback-err': ['error',
        'err'],
      'no-buffer-constructor': ['error'],
      'no-mixed-requires': ['error', {
        grouping: false,
        allowCall: false
      }],
      'no-new-require': ['error'],
      'no-path-concat': ['error'],
      'no-process-env': ['off'],
      'no-process-exit': ['error'],
      'no-restricted-modules': ['error'],
      'no-sync': ['error'],

      // Stylistic issues
      //

      'camelcase': ['off'],
      'capitalized-comments': ['off'],
      'consistent-this': ['error',
        'self'],
      'func-name-matching': ['error',
        'always',
        {
          considerPropertyDescriptor: true,
          includeCommonJSModuleExports: true
        }],
      'func-names': ['off'],
      'func-style': ['error',
        'expression',
        {
          allowArrowFunctions: true
        }],
      'id-blacklist': ['off'],
      'id-length': ['error', {
        min: 2,
        max: 50,
        properties: 'always',
        exceptions: [
          'i',
          'j',
          'k',
          'x',
          'y',
          'z',
          '_',
          '$',
          'e',
          'a',
          'b'
        ]
      }],
      // 'id-match': [
      //   'error',
      //   '^[a-z]+([A-Z][a-z]+)*$|^__?[A-Z_]+$',
      //   {
      //     properties: true,
      //     classFields: true,
      //     onlyDeclarations: false,
      //     ignoreDestructuring: false
      //   }
      // ],
      // TODO: Fix this for React.
      // 'indent': ['error',
      //   2,
      //   {
      //     SwitchCase: 0,
      //     VariableDeclarator: {
      //       var: 1,
      //       let: 1,
      //       const: 1
      //     },
      //     outerIIFEBody: 1,
      //     MemberExpression: 1,
      //     FunctionDeclaration: {
      //       parameters: 1,
      //       body: 1
      //     },
      //     FunctionExpression: {
      //       parameters: 1,
      //       body: 1
      //     },
      //     CallExpression: {
      //       arguments: 1
      //     },
      //     ArrayExpression: 1,
      //     ObjectExpression: 1,
      //     ImportDeclaration: 1,
      //     flatTernaryExpressions: false,
      //     ignoredNodes: [],
      //     ignoreComments: false
      //   }],
      'max-depth': ['error', {
        max: 4
      }],
      'max-lines': ['error', {
        max: 300,
        skipBlankLines: true,
        skipComments: true
      }],
      'max-lines-per-function': ['error', {
        max: 100,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: false
      }],
      'max-nested-callbacks': ['error', {
        max: 3
      }],
      'max-params': ['error', {
        max: 10
      }],
      'max-statements': ['error',
        25,
        {
          ignoreTopLevelFunctions: false
        }],
      'new-cap': ['off'],
      'no-array-constructor': ['error'],
      'no-bitwise': ['off'],
      'no-continue': ['off'],
      'no-inline-comments': ['error'],
      'no-lonely-if': ['error'],
      'no-multi-assign': ['error'],
      'no-negated-condition': ['off'],
      'no-nested-ternary': ['error'],
      'no-object-constructor': ['error'],
      'no-plusplus': ['off'],
      'no-restricted-syntax': ['error'],
      'no-ternary': ['off'],
      'no-underscore-dangle': ['off'],
      'no-unneeded-ternary': ['error', {
        defaultAssignment: true
      }],
      'one-var': ['off'],
      'operator-assignment': ['error',
        'always'],
      'prefer-object-spread': ['error'],
      'quotes': ['error',
        'single',
        {
          avoidEscape: false,
          allowTemplateLiterals: false
        }],
      'semi': ['error',
        'always',
        {
          omitLastInOneLineBlock: false
        }],
      'sort-keys': ['off'],
      'sort-vars': ['off'],
      'unicode-bom': ['off'],

      // ECMAScript 6
      //

      'arrow-body-style': ['error',
        'as-needed',
        {
          requireReturnForObjectLiteral: false
        }],
      'constructor-super': ['error'],
      'logical-assignment-operators': ['error',
        'always',
        {
          enforceForIfStatements: true
        }],
      'no-class-assign': ['error'],
      'no-const-assign': ['error'],
      'no-dupe-class-members': ['error'],
      'no-duplicate-imports': ['off'],
      'no-new-native-nonconstructor': ['error'],
      'no-restricted-exports': ['error'],
      'no-restricted-imports': ['error'],
      'no-this-before-super': ['error'],
      'no-useless-computed-key': ['off'],
      'no-useless-constructor': ['error'],
      'no-useless-rename': ['error',
        {
          ignoreImport: false,
          ignoreExport: false,
          ignoreDestructuring: false
        }],
      'no-var': ['error'],
      'object-shorthand': ['error',
        'never'],
      'prefer-arrow-callback': ['error', {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }],
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }],
      'prefer-destructuring': ['off'],
      'prefer-exponentiation-operator': ['error'],
      'prefer-numeric-literals': ['error'],
      'prefer-rest-params': ['error'],
      'prefer-spread': ['error'],
      'prefer-template': ['error'],
      'require-yield': ['error'],
      'sort-imports': ['off'],
      'symbol-description': ['error']

      // TODO: More JavaScript/TypeScript files rules.
    }
  },
  // Disable type-checked rules for JavaScript files.
  {
    files: __GLOB_JS,
    rules: __DISABLE_TYPE_CHECKED_RULES
  },
  // TypeScript files.
  {
    files: __GLOB_TS,
    languageOptions: __TS_LANGUAGE_OPTIONS,
    plugins: {
      'tsdoc': tsdocPlugin
    },
    rules: {
      // @typescript-eslint
      //--------------------------------------------------

      '@typescript-eslint/consistent-type-exports': ['error', {
        'fixMixedExportsWithInlineTypeSpecifier': false
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        'disallowTypeAnnotations': true,
        'fixStyle': 'separate-type-imports',
        'prefer': 'type-imports'
      }],
      'no-unused-vars': ['off'],
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'all',
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        reportUsedIgnorePattern: false
      }],
      'require-await': ['off'],
      '@typescript-eslint/require-await': ['error']

      // TODO: More TypeScript files rules.
    }
  },
  // JSX/TSX files.
  {
    files: __GLOB_JSX_TSX,
    languageOptions: deepmerge(
        __TS_LANGUAGE_OPTIONS,
        {
          parserOptions: {
            ecmaFeatures: {
              jsx: true
            }
          }
        }
    ),
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      // TODO: JSX/TSX files rules.
    }
  },
  // Declaration files.
  {
    files: __GLOB_DTS,
    rules: {
      // ESLint
      //--------------------------------------------------

      'max-classes-per-file': ['off']
    }
  },
  // Index files.
  {
    files: __GLOB_INDEX,
    rules: {
      // @typescript-eslint
      //--------------------------------------------------

      '@typescript-eslint/consistent-type-exports': ['off']
    }
  },
  // Test files.
  {
    files: __GLOB_TEST,
    languageOptions: deepmerge(
        __TS_LANGUAGE_OPTIONS,
        {
          globals: {
            ...vitestPlugin.environments.env.globals
          }
        }
    ),
    plugins: {
      'vitest': vitestPlugin
    },
    rules: {
      // TODO: Test files rules.
    }
  },
  // Scripts files.
  {
    files: __GLOB_SCRIPTS,
    languageOptions: __TS_LANGUAGE_OPTIONS,
    rules: {
      // @nx
      //--------------------------------------------------

      '@nx/enforce-module-boundaries': ['off']
    }
  },
  // Config files.
  {
    files: __GLOB_CONFIG,
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: __ROOT_TS_CONFIGS,
        projectService: true,
        tsconfigRootDir: __DIRNAME,
        warnOnUnsupportedTypeScriptVersion: true
      }
    },
    rules: {
      // @nx
      //--------------------------------------------------

      '@nx/enforce-module-boundaries': ['off']
    }
  },
  // Package JSON files.
  {
    files: __GLOB_PACKAGE_JSON,
    languageOptions: {
      parser: jsoncParser
    },
    rules: {
      // @nx
      //--------------------------------------------------

      '@nx/dependency-checks': ['error', ({
        buildTargets: ['build'],
        checkMissingDependencies: true,
        checkObsoleteDependencies: true,
        checkVersionMismatches: true,
        ignoredDependencies: [],
        ignoredFiles: [],
        includeTransitiveDependencies: false,
        useLocalPathsForWorkspaceDependencies: false
      } satisfies NxDependencyChecksOptions[number])]
    }
  }
] as Linter.Config[]);
