# ESLint and Prettier Configuration Guide

## Setup Summary

The Atlas Protocol project now has comprehensive ESLint and Prettier configuration for automatic TypeScript linting and formatting.

## Installed Dependencies

The following dev dependencies have been added to `package.json`:

- `@typescript-eslint/eslint-plugin` - TypeScript-specific ESLint rules
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `eslint` - Core ESLint linter
- `eslint-config-next` - Next.js ESLint configuration
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-import` - Import ordering and management
- `eslint-plugin-react` - React-specific ESLint rules
- `eslint-plugin-react-hooks` - React Hooks best practices
- `prettier` - Code formatter

## Configuration Files

### .eslintrc.js
Comprehensive ESLint configuration with:
- **TypeScript Strict Rules**
  - `@typescript-eslint/no-explicit-any` - Enforces proper typing instead of `any`
  - `@typescript-eslint/explicit-function-return-types` - Requires return type annotations
  - `@typescript-eslint/no-unused-vars` - Flags unused variables (ignores underscore-prefixed)
  - `@typescript-eslint/strict-boolean-expressions` - Ensures boolean contexts are actually booleans

- **React Rules**
  - Enforces React Hooks best practices
  - Disables prop-types (using TypeScript instead)
  - React JSX scope rules for Next.js

- **Import Ordering**
  - Groups imports: builtin → external → internal → parent → sibling → index
  - Prioritizes React and Next.js imports
  - Alphabetical ordering within groups

- **General Best Practices**
  - `eqeqeq` - Enforces === and !==
  - `prefer-const` - Use const for variables that don't change
  - `no-var` - Prevents var declaration
  - No debugger statements in production

### .prettierrc.json
Consistent formatting rules:
- Print width: 120 characters (readable but efficient)
- Semicolons: false (modern JavaScript style)
- Single quotes: false (double quotes for consistency)
- Trailing commas: es5 (objects, arrays, functions)
- Tab width: 2 spaces
- Arrow parens: always (cleaner for multi-line)

### .eslintignore
Excludes from linting:
- `node_modules/` - Dependencies
- `.next/` - Next.js build output
- `generated/` - Generated files
- `scripts/` - Build scripts

### .prettierignore
Excludes from formatting:
- Build output (.next, dist, build)
- Dependencies
- Generated files
- Environment files

## NPM Scripts

Added to package.json:

```bash
# Lint TypeScript and JavaScript files
npm run lint

# Lint and automatically fix fixable issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted (CI-friendly)
npm run format:check
```

## TypeScript Configuration Updates

Updated `tsconfig.json` with additional strict options:
- `noUncheckedIndexedAccess` - Ensures array/object access is type-safe
- `noImplicitReturns` - Requires explicit returns
- `noFallthroughCasesInSwitch` - Prevents switch case fallthrough

## Usage Workflow

### Before Committing
```bash
# Fix all automatically fixable lint issues
npm run lint:fix

# Format code
npm run format
```

### In CI/CD Pipeline
```bash
# Check linting without fixing
npm run lint

# Check formatting without changing files
npm run format:check
```

### During Development
```bash
# Run linter continuously (if using watch mode)
npm run lint

# Fix issues as you develop
npm run lint:fix
```

## ESLint Rules Explained

### Strict Type Rules
- **no-explicit-any** (Error): Forces use of proper types instead of `any`
- **explicit-function-return-types** (Warn): Helps catch unintended return type changes
- **no-unused-vars** (Error): Keeps code clean, ignores underscore-prefixed variables
- **strict-boolean-expressions** (Warn): Prevents accidental type coercion

### Import Ordering
Ensures consistent import organization:
```typescript
// 1. React and external libraries
import React from "react"
import { useState } from "react"
import type { NextPage } from "next"
import { Button } from "@/components/ui/button"

// 2. Internal project imports
import { useWallet } from "@/lib/wallet-utils"
import type { Wallet } from "@/types"

// 3. Relative imports
import { helper } from "../utils"
import type { Config } from "./config"
```

### React Hooks Rules
- **rules-of-hooks** (Error): Enforces conditional hook calling
- **exhaustive-deps** (Warn): Ensures useEffect dependencies are complete

## Incremental Type Checking

The configuration uses incremental type checking to allow gradual migration to stricter types:

1. Current strict mode catches new type issues
2. Fix new issues as you work
3. Consider enabling `exactOptionalPropertyTypes` when ready (currently false)
4. Gradually reduce exclusions in ESLint rules

## Integration with IDEs

### VS Code
Install the following extensions:
- ESLint (Microsoft)
- Prettier - Code formatter

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

## Troubleshooting

### ESLint Won't Fix
Some rules are warnings only and won't be auto-fixed:
```bash
npm run lint:fix  # Fix only error-level rules
```

### Prettier Conflicts
If Prettier and ESLint disagree, Prettier takes precedence (via eslint-config-prettier).

### Type Errors After Setup
The strict TypeScript config may reveal existing type issues. These can be fixed incrementally:
- Use `// @ts-expect-error` for deliberate overrides (with explanation)
- Fix types gradually using the audit reports in `/docs/`

## Next Steps

1. Run `npm run lint:fix` to auto-resolve current issues
2. Run `npm run format` to format the codebase
3. Commit these changes
4. Set up pre-commit hooks (optional, using husky):
   ```bash
   npm install husky lint-staged
   npx husky install
   npx husky add .husky/pre-commit "npm run lint:fix && npm run format"
   ```

## Disabled Rules for Development

The following have reduced severity for development speed:
- `no-console` (Warn): Allows debug logging with pattern `console.log("[v0] ...")`
- `explicit-function-return-types` (Warn): Allows type inference in some cases
- `@typescript-eslint/no-non-null-assertion` (Warn): Allows `!` for known non-nulls

## Resources

- [ESLint Documentation](https://eslint.org/docs/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Documentation](https://prettier.io/docs/)
- [Next.js ESLint Setup](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
