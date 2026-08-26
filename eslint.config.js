import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

const jsdocRules = {
    "jsdoc/check-alignment": "error",
    "jsdoc/check-param-names": "error",
    "jsdoc/check-tag-names": "error",
    "jsdoc/check-types": "error",
    "jsdoc/require-param": "error",
    "jsdoc/require-param-description": "error",
    "jsdoc/require-returns": "error",
    "jsdoc/require-returns-check": "error",
};

export default [
    {
        ignores: [
            "node_modules/**",
            "target/**",
            "web/pkg/**",
            "reports/**",
            "playwright-report/**",
            "test-results/**",
        ],
    },
    js.configs.recommended,
    {
        files: ["web/js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            sourceType: "module",
        },
        plugins: { jsdoc },
        rules: jsdocRules,
    },
    {
        files: ["e2e/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: { ...globals.browser, ...globals.node },
            sourceType: "module",
        },
        plugins: { jsdoc },
        rules: jsdocRules,
    },
    {
        files: ["playwright.config.js", "eslint.config.js", "scripts/**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.node,
            sourceType: "module",
        },
        plugins: { jsdoc },
        rules: jsdocRules,
    },
];
