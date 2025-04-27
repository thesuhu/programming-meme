"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertCircle } from "lucide-react"
import MemeGrid from "@/components/meme-grid"
import { getMemes, fallbackMemeData } from "@/lib/meme-service"
import type { Meme } from "@/lib/types"
import Pagination from "@/components/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MemeSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDirectory, setSelectedDirectory] = useState<string>("all")
  const [memes, setMemes] = useState<Meme[]>([])
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([])
  const [directories, setDirectories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedMemes, setPaginatedMemes] = useState<Meme[]>([])
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getMemes()

        if (data.memes.length === 0) {
          // If no memes were returned, use fallback data
          setMemes(fallbackMemeData.memes)
          setFilteredMemes(fallbackMemeData.memes)
          setDirectories(["all", ...fallbackMemeData.directories])
          setError("Could not load memes from GitHub. Showing example data.")
        } else {
          setMemes(data.memes)
          setFilteredMemes(data.memes)
          setDirectories(["all", ...data.directories])
        }
      } catch (err) {
        console.error("Error fetching memes:", err)
        setError("Failed to load memes. Using example data instead.")

        // Use fallback data
        setMemes(fallbackMemeData.memes)
        setFilteredMemes(fallbackMemeData.memes)
        setDirectories(["all", ...fallbackMemeData.directories])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemes()
  }, [])

  useEffect(() => {
    filterMemes()
  }, [searchQuery, selectedDirectory, memes])

  useEffect(() => {
    // Update paginated memes whenever filtered memes or current page changes
    paginateMemes()
  }, [filteredMemes, currentPage])

  const filterMemes = () => {
    let filtered = [...memes]

    // Filter by directory
    if (selectedDirectory !== "all") {
      filtered = filtered.filter((meme) => meme.directory === selectedDirectory)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((meme) => meme.filename.toLowerCase().includes(query))
    }

    setFilteredMemes(filtered)

    // Reset to first page when filters change
    setCurrentPage(1)

    // Calculate total pages
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))
  }

  const paginateMemes = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedMemes(filteredMemes.slice(startIndex, endIndex))
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search memes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDirectory} onValueChange={setSelectedDirectory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {directories.map((dir) => (
              <SelectItem key={dir} value={dir}>
                {dir === "all" ? "All Category" : dir}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center">Loading memes...</p>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {paginatedMemes.length} of {filteredMemes.length} memes
          </div>
          <MemeGrid memes={paginatedMemes} />
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </>
      )}
    </div>
  )
}
