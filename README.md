# Personal Web Application - Cursor Rules

This repository contains comprehensive cursor rules designed to help you build modern, scalable web applications with best practices and consistent code quality.

## 📁 Cursor Rules Organization

### Main Rule File
- **`.cursorrules`** - The main file that Cursor automatically recognizes and applies

### Detailed Rule Files (in `.cursor-rules/` directory)
- **`.cursor-rules/.cursorrules`** - Complete development guidelines
- **`.cursor-rules/.cursorrules-react`** - React-specific rules  
- **`.cursor-rules/.cursorrules-typescript`** - TypeScript guidelines
- **`.cursor-rules/.cursorrules-styling`** - Styling & design system rules
- **`.cursor-rules/.cursorrules-api-testing`** - API & testing strategies

## 🔧 How to Apply These Rules

### Automatic Application
The main `.cursorrules` file is **automatically applied** by Cursor when you open this project. No additional setup required!

### Manual Reference
For detailed guidelines on specific topics, you can:

1. **View the specialized rule files** in the `.cursor-rules/` directory
2. **Copy specific rules** to your main `.cursorrules` file if needed
3. **Reference them during development** for best practices

### Customizing Rules
To customize the rules for your specific needs:

1. Edit the main `.cursorrules` file for project-wide changes
2. Modify specific rule files in `.cursor-rules/` for detailed guidelines
3. Add project-specific rules to the main `.cursorrules` file

## 🎯 What Each Rule File Contains

### `.cursorrules` (Main File)
- Core development principles and technology stack
- Essential coding standards and file naming conventions
- Quick start commands and project structure
- References to detailed rule files

### `.cursor-rules/.cursorrules-react`
- Component design principles and hooks best practices
- Performance optimization techniques
- State management patterns and error handling
- Component patterns (compound components, render props, etc.)
- React 18+ features and testing strategies

### `.cursor-rules/.cursorrules-typescript`
- Type safety and strict configuration guidelines
- Generic types, utility types, and advanced patterns
- Error handling with discriminated unions
- API and data type patterns
- Runtime type checking and validation

### `.cursor-rules/.cursorrules-styling`
- CSS architecture and responsive design principles
- Tailwind CSS and styled-components best practices
- Design token implementation and theming
- Animation guidelines and dark mode support
- Performance optimization for styles

### `.cursor-rules/.cursorrules-api-testing`
- RESTful API design and authentication patterns
- Database integration and error handling
- Comprehensive testing strategies (unit, integration, E2E)
- API testing and configuration examples
- Security best practices

## 🚀 Getting Started

### 1. Choose Your Tech Stack

Based on the cursor rules, here are the recommended technology stacks:

#### Frontend-Only Application
```bash
# Create a new Vite + React + TypeScript project
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install

# Add recommended dependencies
npm install @tanstack/react-query zustand react-hook-form
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react clsx tailwind-merge

# Add Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Full-Stack Application (Next.js)
```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app

# Add recommended dependencies
npm install @tanstack/react-query zustand react-hook-form zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react prisma @prisma/client
npm install jsonwebtoken bcryptjs

# Add development dependencies
npm install -D @types/jsonwebtoken @types/bcryptjs
```

### 2. Project Structure

Follow this recommended project structure:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components (if using file-based routing)
├── services/           # API services and business logic
├── stores/             # State management (Zustand stores)
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── styles/             # Global styles and CSS
```

### 3. Configuration Files

#### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### ESLint Configuration (`.eslintrc.json`)
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

#### Prettier Configuration (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 4. Environment Setup

Create environment files:

#### `.env.example`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/myapp"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# API
API_URL="http://localhost:3000/api"

# External Services
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### `.env.local` (for development)
Copy `.env.example` to `.env.local` and fill in your actual values.

## 🛠️ Development Workflow

### 1. Component Development
Follow the component structure template from the cursor rules:

```tsx
import React from 'react';
import { ComponentProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2,
  ...props 
}) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    <div {...props}>
      {/* Component JSX */}
    </div>
  );
};
```

### 2. Testing Strategy
- Write unit tests for utility functions and business logic
- Create integration tests for API endpoints
- Use React Testing Library for component testing
- Implement E2E tests for critical user flows

### 3. Git Workflow
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Create feature branches for new development
- Review code before merging to main branch

## 📚 Key Principles

1. **Type Safety**: Use TypeScript strictly with proper type definitions
2. **Component Composition**: Build complex UIs through composition
3. **Performance**: Implement lazy loading, memoization, and code splitting
4. **Accessibility**: Ensure your app is accessible to all users
5. **Testing**: Write meaningful tests that focus on behavior
6. **Security**: Validate inputs, sanitize data, and use HTTPS
7. **Responsive Design**: Mobile-first approach with fluid layouts

## 🔧 Recommended VS Code Extensions

- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🎯 How It Works

1. **Automatic Application**: Cursor automatically reads and applies the main `.cursorrules` file
2. **Organized Structure**: Detailed rules are organized in the `.cursor-rules/` directory for easy reference
3. **Modular Approach**: Each specialized rule file focuses on specific aspects of development
4. **Easy Customization**: You can modify rules to fit your project's specific needs

These cursor rules are designed to help you build high-quality, maintainable web applications. The main `.cursorrules` file provides essential guidelines that Cursor will automatically apply, while the detailed rule files in `.cursor-rules/` serve as comprehensive references for best practices. Happy coding! 🚀 