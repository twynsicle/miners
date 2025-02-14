# Miners - Technical Rules and Standards

## TypeScript and Type Safety

1. Type System:
   - All code must be written in TypeScript
   - Use explicit type annotations for function parameters and return types
   - Avoid using `any` type - use proper types or `unknown` if type is truly unknown
   - Define interfaces for all data structures in `types/` directory
   - Use type guards when narrowing types

2. Type Best Practices:
   - Use readonly arrays and properties when data shouldn't be mutated
   - Use union types instead of enums
   - Use discriminated unions for complex state handling
   - Define proper return types for async functions (Promise<T>)

## Code Organization

1. File Structure:
   - React components go in `src/components/`
   - Game logic goes in `src/utils/`
   - Types go in `src/types/`
   - State management in `src/state/`
   - Constants in `src/constants/`
   - Styles in `src/styles/`

2. File Naming:
   - React components: PascalCase.tsx
   - Utility files: camelCase.ts
   - Test files: *.test.ts(x)
   - CSS files: match component name.css
   - Type files: camelCase.ts

3. Code Separation:
   - Game logic should be in TypeScript (.ts) files
   - UI components should be in TypeScript React (.tsx) files
   - Keep business logic separate from display logic
   - Use hooks for shared component logic

## React Components

1. Component Structure:
   - Use functional components with hooks
   - Define prop interfaces for all components
   - Use proper React.FC<Props> typing
   - Keep components focused and single-purpose

2. Props:
   - Define required vs optional props explicitly
   - Use proper TypeScript types for all props
   - Document complex prop types with JSDoc comments
   - Use callback props for component communication

3. State Management:
   - Use Redux for global game state
   - Use local state (useState) for UI-only state
   - Define proper action types and reducers
   - Use TypeScript for type-safe actions and reducers

## Styling

1. CSS Rules:
   - NEVER use inline styles in JSX
   - All styles must be in dedicated CSS files
   - Use CSS variables for shared values
   - Follow BEM naming convention for classes
   - Use CSS modules when needed for scoping

2. Style Organization:
   - One CSS file per component
   - Global styles in global.css
   - CSS variables in variables.css
   - Use relative units (rem, em) over pixels
   - Define breakpoints for responsive design

## Game Logic

1. Code Structure:
   - Keep game logic pure and testable
   - Separate concerns between game rules and UI
   - Use TypeScript for type safety in game operations
   - Document complex game logic with comments

2. State Updates:
   - Use immutable state updates
   - Validate state changes with TypeScript
   - Keep state updates atomic and focused
   - Use proper action creators and reducers

## Error Handling

1. TypeScript Errors:
   - Fix all TypeScript errors before committing
   - Don't use @ts-ignore without good reason
   - Document any necessary type assertions
   - Use proper error types

2. Runtime Errors:
   - Handle all possible error states
   - Provide user-friendly error messages
   - Log errors appropriately
   - Use try-catch blocks where needed

## Testing

1. Test Organization:
   - Write tests for game logic
   - Test components with React Testing Library
   - Use TypeScript in test files
   - Mock complex dependencies

2. Test Coverage:
   - Test all game rules
   - Test component interactions
   - Test state management
   - Test error conditions

## Documentation

1. Code Comments:
   - Use JSDoc for function documentation
   - Document complex algorithms
   - Explain non-obvious type usage
   - Keep comments up to date

2. Type Documentation:
   - Document interfaces and types
   - Explain property constraints
   - Document union types
   - Use examples where helpful

## Performance

1. React Performance:
   - Use proper dependency arrays in hooks
   - Memoize expensive calculations
   - Use React.memo when beneficial
   - Avoid unnecessary rerenders

2. State Performance:
   - Keep state normalized
   - Avoid deep nesting
   - Use proper selectors
   - Batch related updates

---
*Note: These technical rules should be followed by all AI agents and developers working on the project to maintain consistency and quality.*
