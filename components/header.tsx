import { Brain } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Nirmaan AI</h1>
            <p className="text-xs text-muted-foreground">Transcript Analysis</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Instructions
          </Link>
        </nav>
      </div>
    </header>
  )
}
