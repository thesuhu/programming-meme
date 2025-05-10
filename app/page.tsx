import { Suspense } from "react"
import MemeSearch from "@/components/meme-search"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeModeScript } from "@/components/theme-mode-script"
import { Github, Heart } from "lucide-react"
import Link from "next/link"
import { getMemes, fallbackMemeData } from "@/lib/meme-service"

export default async function Home() {
  let data
  try {
    data = await getMemes()
  } catch {
    data = fallbackMemeData
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ThemeModeScript />
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1 flex items-center gap-3">
          <img src="/logo.png" alt="Programming Meme Logo" className="h-10 w-auto" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Programming Meme</h1>
            <p className="text-sm text-muted-foreground">Meme about programming from various sources</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/thesuhu/programming-meme"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub Repository</span>
          </Link>
          <Link
            href="https://saweria.co/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Donate</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <Suspense fallback={<SearchSkeleton />}>
        <MemeSearch memes={data.memes} directories={data.directories} />
      </Suspense>
    </main>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-md" />
          ))}
      </div>
    </div>
  )
}
