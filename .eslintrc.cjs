/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",

    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-empty-interface": "off", //recurssive comments
    "react/display-name": "off", //needed for recurssive comments
    "@typescript-eslint/no-unsafe-assignment": "off" //webhook routes
  },
};

module.exports = config;
