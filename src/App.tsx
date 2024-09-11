import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import AsciiArtGenerator from './components/AsciiArtGenerator'
import { ModeToggle } from "./components/mode-toggle"
import logo from '/logo.svg'  // Import the logo

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="PIICSA Logo" className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold text-primary">PIICSA</h1>
          </div>
          <ModeToggle />
        </header>
        <main className="pt-6 pb-10">
          <AsciiArtGenerator />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
