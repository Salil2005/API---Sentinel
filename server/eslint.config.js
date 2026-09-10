export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        console: "readonly",
        process: "readonly",
      },
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      "no-console": "off",
    },
  },
];