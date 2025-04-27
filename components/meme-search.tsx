"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertCircle } from "lucide-react"
import MemeGrid from "@/components/meme-grid"
import type { Meme } from "@/lib/types"
import Pagination from "@/components/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = {
  memes: Meme[]
  directories: string[]
}

export default function MemeSearch({ memes, directories }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDirectory, setSelectedDirectory] = useState<string>("all")
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedMemes, setPaginatedMemes] = useState<Meme[]>([])
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    filterMemes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedDirectory, memes])

  useEffect(() => {
    paginateMemes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setCurrentPage(1)
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))
  }

  const paginateMemes = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedMemes(filteredMemes.slice(startIndex, endIndex))
  }

  return (
    <div className="space-y-6">
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
            <SelectItem value="all">All Category</SelectItem>
            {directories.map((dir) => (
              <SelectItem key={dir} value={dir}>
                {dir}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedMemes.length} of {filteredMemes.length} memes
      </div>
      <MemeGrid memes={paginatedMemes} />
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
      {filteredMemes.length === 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No memes found</AlertTitle>
          <AlertDescription>Try a different search or category.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
