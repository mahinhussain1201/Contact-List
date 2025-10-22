# Contact List (TRIA)

A polished React application to browse, search, and manage contacts. It blends smooth micro-interactions, accessibility-minded controls, and delightful visuals like a particle background and animated accents.

## Hosted Link 
[Vercel](https://contact-list-nine-hazel.vercel.app/)

## Features

- **Contact browsing and search**: Filter contacts via the top `SearchBar` with clear focus and borders.
- **Alphabet rail**: Quickly jump to sections; active letter highlights while scrolling.
- **Add contact modal**: Clean glass panel with optional falling pattern and form with labels, validation, and avatar preview.
- **Contact cards**: Subtle hover motion, deterministic pastel initials when no avatar.
- **Toasts**: Animated success/error notifications.
- **Background effects**: Lightweight throttled particle smoke for ambient motion.
- **Local persistence**: Added contacts and deleted IDs are stored in `localStorage` across sessions.

## Tech Stack

- **React** (components in `src/components/`)
- **Tailwind CSS** utility classes for rapid, consistent styling
- **lucide-react** icons for crisp SVGs

Optional (only if present in your setup): Vite/CRA for dev server and build.

## Getting Started

- **Prerequisites**
  - Node.js 18+ and npm or pnpm or yarn

- **Install**
```bash
npm install
```

- **Run dev server** (Vite or CRA)
```bash
# If Vite
npm run dev
# If CRA
npm start
```

- **Build**
```bash
npm run build
```

- **Preview production build (Vite)**
```bash
npm run preview
```

If you are unsure whether this project uses Vite or CRA, check `package.json` scripts (`dev` vs `start`).

## Project Structure

```
src/
  App.jsx                   # App shell, modal trigger, footer, toasts wiring
  components/
    SearchBar.jsx           # Search with animated/focused visuals
    ContactList.jsx         # Grouped sections, intersection observer, alphabet rail
    ContactCard.jsx         # Individual card presentation
    AddContactForm.jsx      # Form with labels, validation, avatar preview
    Modal.jsx               # Modal with optional falling pattern background
    SmokeBackground.jsx     # Throttled particle canvas background
    Toasts.jsx              # Slide-in toasts
```

## Environment / APIs

- **Random User API**: The list is derived from Random User. No key required.
- No server credentials or secrets are required for local development.

## Design Choices & Assumptions

- **Consistency**: Modal background matches Add Contact form (`bg-white/90`, `backdrop-blur-sm`, soft gray borders) for a coherent feel.
- **Performance**: Particle generation is throttled to reduce CPU/GPU load; rail updates use `IntersectionObserver`.
- **Deterministic styling**: Initials colors are calculated from name hash for stable visuals without stored state.
- **Accessibility**: Focus-visible styles on rail/buttons; aria labels; Escape-to-dismiss modal; semantic headings.
- **Local persistence**: New contacts and deletions stored in `localStorage` to survive reloads.

## Libraries Used

- **React**: Declarative component model, strong ecosystem, and state management hooks simplify building interactive UIs like `SearchBar`, `ContactList`, and the modal flow.
- **Tailwind CSS**: Utility-first classes enable rapid iteration and consistent design tokens (spacing, colors, radii) without maintaining large CSS files; supports responsive and a11y states inline.
- **lucide-react**: Lightweight, crisp SVG icon set with React wrappers; easy to tree-shake and style with Tailwind classes.

## Contributing

- Fork the repo, create a feature branch, and open a PR.
- Keep UI changes consistent with the established glass/soft gradient style and a11y patterns.

## License

Created By:
Mahin Hussain
[LinkedIn](https://www.linkedin.com/in/mahin-hussain/)
