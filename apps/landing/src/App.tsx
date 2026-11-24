function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-void px-24 py-48 selection:bg-paper selection:text-void">
      <div className="w-full max-w-115">
        <div className="mb-24 flex items-center justify-between border-b border-graphite pb-12 font-berkeley-mono text-caption">
          <span className="uppercase tracking-wider text-fog">
            STATUS // <span className="text-pulse-green">ACTIVE</span>
          </span>
          <span className="inline-block h-6 w-6 bg-pulse-green" />
        </div>

        <h1 className="font-inter-variable text-heading-sm font-[510] tracking-heading-sm text-paper">
          Home
        </h1>
        <p className="mt-8 font-inter-variable text-body-sm text-fog">
          Base scaffold — replace this with real content.
        </p>
      </div>
    </main>
  )
}

export default App
