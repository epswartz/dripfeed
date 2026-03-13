# Code Style - Dripfeed MK2

This document defines the coding standards and architectural principles for Dripfeed MK2.

## Languages and Environment
- **TypeScript Only**: All application code must be written in TypeScript.
- **Client-Side Only**: The application is a single-page web app with no backend. It runs entirely in the browser.
- **Storage**: Use `localStorage` for all persistence needs (subscriptions, post state, etc.).

## Architectural Principles
- **Functional Style**: Wherever possible, prioritize a functional programming style. Use pure functions (no side effects) that are easy to test.
- **Class-Based Models**: Specific entities like `Post` and `Fetcher` should be implemented as classes with clear responsibilities.
- **Separation of Concerns**: Each post source must have its own dedicated "fetcher" class in a separate file.

## Data Types
- **Timestamps**: Always use the native `Date` type to represent timestamps throughout the application for clarity and type safety.

## Tooling
- **Linting**: All code must pass the linter (`npm run lint`).
- **Formatting**: Use Prettier (`npm run format`) to maintain consistent code formatting.

## Version Control
- **Feature Branches**: All new development should be done using a feature branch style. Work should be performed in dedicated branches and merged into the main development line upon completion.
