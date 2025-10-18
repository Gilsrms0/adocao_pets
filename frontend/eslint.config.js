import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import pluginReactHooks from "eslint-plugin-react-hooks";


export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    // React-specific settings
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    }
  },
  {
    ignores: ["dist", "node_modules", "coverage", "eslint.config.js"],
  }
];
