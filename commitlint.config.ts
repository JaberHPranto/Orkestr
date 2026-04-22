import type { UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "test",
        "ci",
        "perf",
        "revert",
      ],
    ],
    "scope-empty": [1, "never"], // warn if no scope
    "subject-case": [0],
    "header-max-length": [2, "always", 72],
  },
} satisfies UserConfig;
