# Design System

How the product looks and feels. The ui-designer owns this file and writes it at kickoff, after the stakeholder chooses a visual style. Every UI spec and every screen follows it. Products without a user interface leave it empty.

## Direction
_The chosen visual style (link its decision brief), the feeling it should give, and the stakeholder's reference sites or apps. Brand guidelines from the stakeholder or a hired designer go here and override everything below._

## Design Tokens
_Each token has a name, a value and a role. Code uses token names only, never raw values._
- Colors (primary, surface, text, muted, border, success, warning, danger; light and dark if needed):
- Typography (font families, size scale, weights, line heights):
- Spacing scale:
- Radius:
- Shadows:

## Component Library
_The library chosen in the architect's ADR, where the theme or token file lives in the code, and how the tokens above map onto it._

## Layout Patterns
_Page width, grid, navigation, header and footer, and how each changes between mobile (390 px) and desktop (1440 px)._

## Components
_Inventory of the components the product uses (buttons, inputs, tables, cards, dialogs, toasts...), with their variants and when to use each. Use the library's component whenever one exists._

## Content and Tone
_Voice of the UI text, how to write empty, error and success messages, date and number formats._

## Visual Check
_Filled by the ui-designer at kickoff: the exact commands to start the app, capture a screenshot of a page at 390 px and 1440 px width (for example with Playwright), and run the accessibility scan (for example axe)._
- Start the app:
- Screenshot:
- Accessibility scan:
