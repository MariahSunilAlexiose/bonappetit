import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import globals from "globals"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
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
      "react/prop-types": "off",
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: [
      "*.css",
      "*.json",
      ".vscode/*",
      "node_modules/*",
      "public/*",
      ".env",
      ".gitignore",
      "README.md",
      "yarn.lock",
    ],
  },
]
