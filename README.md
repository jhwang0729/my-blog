# Personal Web Application

A modern, full-stack personal portfolio and note-taking application built with Next.js, Supabase, and Tailwind CSS.

## 🎯 Features

### 📄 Resume Management
- Upload and store multiple resume versions
- Public downloadable links for sharing
- Version control and organization
- File type validation (PDF, DOCX)

### 📝 Notion-like Note Taking
- Rich markdown editor with page linking
- Private editing with public viewing options
- Customizable page headers with icons and backgrounds
- Hierarchical note organization

### 🤖 AI Integration
- ChatGPT API integration for note summarization
- Intelligent search through notes
- Content suggestions and improvements

### 🔐 Hidden Authentication
- Secret login portal (`/admin-portal-xyz`)
- No visible login buttons on public pages
- Secure session management with Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL + Authentication + File Storage)
- **Deployment**: Vercel
- **UI Components**: Radix UI primitives
- **State Management**: Zustand for client state, React Query for server state
- **Rich Text**: Tiptap editor for note-taking
- **AI**: OpenAI API integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd personal-web-app
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env.local
   # Add your Supabase and OpenAI credentials
   ```

3. **Configure Supabase:**
   - Create a new Supabase project
   - Set up the database schema (SQL files coming soon)
   - Configure authentication settings
   - Enable file storage

4. **Start development server:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your application.

## 📂 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Hidden auth routes
│   ├── api/                # API endpoints
│   ├── notes/              # Note-taking pages
│   ├── resume/             # Resume management
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Base UI components (Radix UI)
│   ├── layout/             # Layout components
│   ├── resume/             # Resume-specific components
│   ├── notes/              # Note-taking components
│   └── auth/               # Authentication components
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   ├── openai.ts           # OpenAI integration
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Cursor Rules
This project includes comprehensive cursor rules in `.cursorrules` for consistent development:
- TypeScript best practices
- React patterns and hooks
- Tailwind CSS conventions
- Component structure guidelines

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🔐 Authentication Flow

1. **Public Access**: All content is viewable without authentication
2. **Hidden Login**: Access `/admin-portal-xyz` for authentication
3. **Editing Mode**: Authenticated users can create/edit content
4. **Session Management**: Secure sessions with Supabase Auth

## 📝 Contributing

This is a personal project, but feel free to fork and adapt for your own use. Follow the cursor rules and maintain the existing code style.

## 📄 License

MIT License - feel free to use this project as a template for your own personal website.

---

Built with ❤️ using Next.js, Supabase, and modern web technologies. 