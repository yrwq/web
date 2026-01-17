# Bun + Vite + React + MDX Blog

A retro-styled blog built with Bun, Vite, React, TailwindCSS v4, and MDX.

## Features

- **MDX Support**: Write posts in MDX with full React component support.
- **Static Building**: Blog index and posts are built statically using `import.meta.glob`.
- **Retro Terminal Theme**: Styled with Tailwind CSS.
- **Clean Architecture**: Feature-sliced design folder structure.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime.

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

### Build

```bash
bun run build
bun run preview
```

## Adding Content

1. Create a new `.mdx` file in `src/content/blog/`.
2. Add frontmatter:

```yaml
---
title: "My New Post"
date: "2026-01-20"
description: "A short summary."
tags: ["tech"]
draft: false
---
```

3. The post will automatically appear on `/blog` (if not draft).
4. The slug is generated from the filename (e.g. `2026-01-post.mdx` -> `2026-01-post`).

## Styling

- **Global Styles**: `src/styles/globals.css` (Base variables).
- **Theme Config**: `tailwind.config.js` (Tokens).
- **Layout**: `src/components/layout/AppShell.tsx`.

Note: Tailwind v4 is used with `@tailwindcss/postcss`. Use standard CSS variables for theme customization.
