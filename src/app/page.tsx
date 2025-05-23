export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
            Welcome to My Personal Web
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern portfolio and note-taking application built with Next.js, Supabase, and Tailwind CSS.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">📄 Resume Management</h3>
            <p className="text-muted-foreground">
              Upload, manage, and share multiple versions of your resume with others.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">📝 Notion-like Notes</h3>
            <p className="text-muted-foreground">
              Create and organize notes with markdown formatting and page linking.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">🤖 AI Integration</h3>
            <p className="text-muted-foreground">
              Integrate ChatGPT for note summarization and intelligent search.
            </p>
          </div>
        </div>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Setup Complete - Ready for Development
          </div>
        </section>
      </div>
    </main>
  )
} 