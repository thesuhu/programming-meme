import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Meme } from "@/lib/types"

interface MemeGridProps {
  memes: Meme[]
}

export default function MemeGrid({ memes }: MemeGridProps) {
  if (memes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">No memes found</p>
        <p className="text-sm text-muted-foreground mt-2">Try a different search or filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {memes.map((meme) => (
        <Card key={meme.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={meme.url || "/placeholder.svg"}
                alt={meme.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy" // Add lazy loading
                placeholder="blur" // Add placeholder
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPjwvc3ZnPg=="
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium truncate" title={meme.filename}>
                {meme.filename}
              </h3>
              <p className="text-sm text-muted-foreground">{meme.directory}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
