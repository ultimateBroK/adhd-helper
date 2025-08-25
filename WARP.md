# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an **ADHD Helper** application built with Next.js 15, React 19, and TypeScript. The project uses modern web technologies including:

- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (New York style)
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Anime.js** for animations

## Development Commands

### Primary Development Workflow
```bash
# Start development server with Turbopack
bun dev

# Alternative package managers
npm run dev
yarn dev
pnpm dev
```

### Build and Production
```bash
# Build for production with Turbopack
bun run build

# Start production server
bun start
```

### Code Quality
```bash
# Run ESLint
bun run lint

# ESLint with specific configuration
eslint src/ --ext .ts,.tsx,.js,.jsx
```

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and global styles
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles with Tailwind and theme variables
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx     # Button component with variants
│       └── input.tsx      # Input component
└── lib/
    └── utils.ts           # Utility functions (cn helper for class merging)
```

### Key Configuration Files
- `components.json` - shadcn/ui configuration with "new-york" style
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint flat configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `postcss.config.mjs` - PostCSS plugin setup for Tailwind v4

### Styling Architecture
- **Tailwind CSS v4** with inline configuration in `globals.css`
- **Custom CSS properties** for theming with light/dark mode support
- **OKLch color space** for consistent color definitions
- **CSS custom variants** for dark mode (`@custom-variant dark`)
- **shadcn/ui** components with class-variance-authority for consistent styling

### Component System
- **shadcn/ui** components in `src/components/ui/`
- **Radix UI primitives** for accessibility
- **CVA (Class Variance Authority)** for component variants
- **Slot pattern** from Radix for composable components
- **Path aliases**: `@/*` maps to `src/*`

### Font System
- **Geist Sans** and **Geist Mono** fonts from Vercel
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Applied via CSS custom properties in Tailwind theme

## Development Patterns

### Adding shadcn/ui Components
```bash
# Add new shadcn/ui components
npx shadcn-ui@latest add [component-name]
```

### TypeScript Configuration
- **Strict mode** enabled
- **Path aliases** configured (`@/*` → `src/*`)
- **Next.js plugin** for enhanced TypeScript support
- **Module resolution**: bundler mode for modern tooling

### Tailwind Patterns
- Use the `cn()` utility from `src/lib/utils.ts` for conditional classes
- Custom properties defined in `:root` and `.dark` for theming
- Consistent spacing and color tokens via CSS custom properties

## Testing and Quality

### Current Setup
- **ESLint** with Next.js and TypeScript rules
- **Flat config format** for ESLint
- No testing framework currently configured

## Performance Considerations

- **Turbopack** enabled for faster development builds
- **Next.js 15** optimizations with React 19
- **Font optimization** with `next/font/google`
- **Image optimization** with `next/image` (already used in homepage)

## Development Notes

- Project uses **Bun** as the preferred package manager (based on `bun.lock`)
- **App Router** is the routing paradigm (not Pages Router)
- **Server Components** by default with RSC enabled in shadcn config
- **Dark mode** support built into the theme system
- **Accessibility** features included via Radix UI components
