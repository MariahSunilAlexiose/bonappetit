import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import globals from "globals"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "valid-typeof": "error",
      "use-isnan": "error",
      "no-unused-vars": "error",
      "no-import-assign": "error",
      "no-duplicate-imports": "error",
      "no-duplicate-case": "error",
      "no-dupe-keys": "error",
      "no-dupe-else-if": "error",
      "no-dupe-args": "error",
      "no-cond-assign": "error",
      "no-compare-neg-zero": "error",
      "no-func-assign": "error",
    },
    ignores: [
      "*.css",
      "*.json",
      ".md",
      ".husky/*",
      ".vscode/*",
      "node_modules/*",
      "src/fonts/*",
      "public/*",
      "yarn.lock",
      ".env*.local",
      ".prettierignore",
      ".gitignore",
      "README.md",
      "jsconfig.json",
    ],
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
]
