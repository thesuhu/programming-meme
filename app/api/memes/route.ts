import { NextResponse } from "next/server"
import { getMemes, fallbackMemeData } from "@/lib/meme-service"

// Set cache control headers
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const memeData = await getMemes()

    // If no memes were returned, use fallback data
    if (memeData.memes.length === 0) {
      console.log("No memes found in data directory, using fallback data")
      return NextResponse.json(fallbackMemeData, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    }

    return NextResponse.json(memeData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error in memes API:", error)

    // Return fallback data in case of error
    return NextResponse.json(fallbackMemeData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  }
}
