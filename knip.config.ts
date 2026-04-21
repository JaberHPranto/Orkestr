import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "**/__tests__/**/*",
    "**/*.test.*",
    "**/*.spec.*",
    "node_modules",
    ".next",
    "public",
    "coverage",
    "src/components/ui/**",
  ],
  ignoreDependencies: ["@commitlint/types", "tailwindcss", "tw-animate-css"],
  ignoreBinaries: ["production", "open"],
  rules: {
    dependencies: "error",
    exports: "warn",
    files: "warn",
  },
};

export default config;
