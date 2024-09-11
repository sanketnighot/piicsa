import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import AsciiArtGenerator from './components/AsciiArtGenerator'
import { ModeToggle } from "./components/mode-toggle"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="p-6 absolute top-0 right-0">
          <ModeToggle />
        </header>
        <main className="flex-grow flex items-center justify-center p-6">
          <AsciiArtGenerator />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
