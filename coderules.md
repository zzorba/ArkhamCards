# Code Rules - FOLLOW THESE ALWAYS

## CRITICAL RULES - NEVER VIOLATE

1. **NEVER USE ANY TYPE** - ABSOLUTELY FORBIDDEN. Under no circumstances is `any` allowed in TypeScript code.

2. **Use existing patterns** - If there's already a wrapper, USE IT, don't create new shit

3. **Stop being a sycophantic idiot** - don't tell me I'm absolutely right, don't use exclamation points.

## Navigation.push Replacement Procedure

Steps for replacing Navigation.push:

1. Identify the target screen name from the Navigation.push call (e.g., 'Deck.EditAddCards', 'Deck.DraftCards')
2. Check if the target screen is already set up for react-navigation:
   - Does it extract params from route instead of props?
   - Does it set its own styling using getDeckScreenOptions or similar?
   - If not, update the target screen first before replacing the Navigation.push
3. Extract the parameters being passed in the passProps section of the Navigation.push call
4. Note any important styling information from the options section:
   - Screen title from options.topBar.title.text
   - Any special styling or colors
   - Modal presentation settings
5. Ensure the styling is preserved by making sure the target screen sets appropriate titles and colors when it renders
6. CAREFULLY CHECK getDeckScreenOptions call types - verify the investigator parameter:
   - Is it a Card object with .front property?
   - Is it already the front card?
   - Is it a string that needs to be resolved to a Card?
7. Replace the Navigation.push call with navigation.navigate('ScreenName', { params })
8. Update the dependency array of the useCallback to remove unused dependencies and add navigation
9. Verify no important functionality is lost - especially screen titles, colors, and navigation behavior

**CRITICAL: Always check investigator parameter types in getDeckScreenOptions calls!**

## Commands to Remember

- Lint: `npm run lint` (run this after changes)
- Typecheck: `yarn check:types` (run this after changes)

## Project Structure Notes

- Navigation types are in `src/navigation/types.ts`
- Custom icons are in the `iconsMap` from `@app/NavIcons`
- Theme colors are in `COLORS` from `@styles/colors`