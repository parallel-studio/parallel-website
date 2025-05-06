## Project Structure

```
├── app/                          # Next.js application pages and routes
│   └── (pages)/                  # Page components and layouts
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
├── intergrations/                # Third party integrations
│   ├── sanity/                   # sanity
├── libs/                         # Utility libraries and functions
├── orchestra/                    # Debugging and development tools
├── styles/                       # Styling system configuration and utilities
```

## Core Technologies
## modif Yann juste pour push

- **Framework & Runtime**
  - [Next.js 15.2](https://nextjs.org) App Router with React Server Components
  - [React 19.0](https://react.dev) with React Compiler for improved performance
  - [Bun](https://bun.sh) as JavaScript runtime and package manager
  - TypeScript with strict type checking

- **Animation & Interaction**
  - [GSAP 3.12](https://greensock.com/gsap/) (Business Edition) for advanced animations
  - [Lenis 1.1](https://github.com/darkroomengineering/lenis) for smooth scrolling
  - [Hamo](https://github.com/darkroomengineering/hamo) utilities
  - [Tempus](https://github.com/darkroomengineering/tempus) timing utilities

- **Development Tools**
  - [Biome 1.9.4](https://biomejs.dev/) for linting & formatting
  - [Lefthook](https://github.com/evilmartians/lefthook) for Git hooks automation
  - Hot module replacement


### Available Scripts
- `bun dev` - Start development server with Turbo
- `bun dev:https` - Start development server with HTTPS
- `bun build` - Build the project for production
- `bun start` - Start the production server
- `bun setup:styles` - Generate style configuration files
- `bun watch:styles` - Watch and rebuild styles on changes
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run Biome linting
- `bun analyze` - Analyze bundle sizes

## Styling Architecture

- **System Overview**
  - Tailwind CSS v4.0.9 with custom utilities
  - PostCSS with advanced configuration and functions
  - CSS Modules for component styles
  - Responsive viewport-based units

- **Key Features**
  - Viewport-relative units (`mobile-vw`, `desktop-vw`)
  - Custom responsive grid system (configurable [in styles/layout.mjs](/styles/layout.mjs))
  - Pre-defined breakpoints (800px desktop threshold)
  - Typography system with [SERVER MONO](https://github.com/internet-development/www-server-mono) font
  - Theme support
  - Custom scaling utilities with 's' prefix

- **Build Process**
  - Automated style generation with `setup:styles` script
  - CSS optimization with cssnano in production
  - Type-safe theme properties and configuration

For more details on the styling system, see [styles/README.md](/styles/README.md).

## Git Workflow

### Automated Git Hooks (via Lefthook)
- **Pre-commit**: Runs Biome to check and format staged files
- **Post-merge**: Automatically pulls latest environment variables from Vercel

## Documentation

- Detailed documentation available in the respective folders:
  - [`libs/readme.md`](/libs/readme.md)
  - [`styles/readme.md`](/styles/readme.md)
  - [`integrations/readme.md`](/integrations/readme.md)
  - [`hooks/readme.md`](/hooks/readme.md)
  - [`components/readme.md`](/components/readme.md)