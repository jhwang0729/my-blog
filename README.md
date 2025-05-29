# Personal Web Application

A modern, full-stack personal portfolio and note-taking application built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Personal Portfolio**: Showcase your work experience, education, and projects
- **Resume Management**: Upload, store, and share multiple resume versions
- **Notion-like Notes**: Create and publish beautifully formatted notes with rich content
- **Dark/Light Mode**: Full system-preference and manual theme switching

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL + Authentication + Storage)
- **Deployment**: Vercel
- **Components**: Radix UI primitives with custom styling
- **Content**: Markdown-based content editing with block structure

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier works for personal use)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-web.git
   cd personal-web
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env.local
   ```

   Then edit `.env.local` with your Supabase credentials

4. Start the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
├── components/              # React components
├── lib/                     # Utility functions and service clients
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── contexts/                # React contexts for state management
```

## Deployment

This project is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## Customization

### Content

Edit your personal information in the following files:

- `src/app/page.tsx` - Home page content
- `src/components/home/` - Portfolio sections

### Styling

The project uses Tailwind CSS for styling:

- `tailwind.config.js` - Theme configuration
- `src/app/globals.css` - Global styles

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with Next.js and Supabase
