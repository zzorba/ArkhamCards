# Project Context
## Global rules, to always follow in all circumstances
- Never use any

## Current Migration Status

- Migrating from react-native-navigation (RNN) to react-navigation
- Most core screens have been converted
- Working on fixing remaining Navigation.push calls in helper functions

## Key Files Being Modified

- `src/components/nav/helper.tsx` - Contains navigation helper functions that need RNN removal
- `src/navigation/types.ts` - Navigation type definitions
- `src/navigation/AppNavigator.tsx` - Main navigation setup

## Important Context

- The project uses yarn, not npm
- TypeScript checking command is `yarn check:types`
- Many screens need to be added to navigation types before helper functions can be converted