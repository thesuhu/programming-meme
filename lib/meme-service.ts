import fs from "fs"
import path from "path"
import type { MemeData, Meme } from "./types"

// Path ke direktori data relatif terhadap root project
const DATA_DIR = path.join(process.cwd(), "public", "data")

export async function getMemes(): Promise<MemeData> {
  try {
    // Pastikan direktori data ada
    if (!fs.existsSync(DATA_DIR)) {
      console.error("Data directory does not exist:", DATA_DIR)
      return { memes: [], directories: [] }
    }

    // Baca semua direktori di dalam data/
    const directories = fs.readdirSync(DATA_DIR).filter((dir) => {
      const stat = fs.statSync(path.join(DATA_DIR, dir))
      return stat.isDirectory()
    })

    // Baca semua file meme dari setiap direktori
    const memes: Meme[] = []

    directories.forEach((directory) => {
      const dirPath = path.join(DATA_DIR, directory)

      try {
        const files = fs.readdirSync(dirPath).filter((file) => {
          // Filter hanya file gambar
          const ext = path.extname(file).toLowerCase()
          return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
        })

        // Buat objek meme untuk setiap file
        files.forEach((file) => {
          const id = `${directory}-${file}`
          const filePath = `/data/${directory}/${file}` // Path untuk akses dari browser

          memes.push({
            id,
            filename: file,
            directory,
            url: filePath,
          })
        })
      } catch (error) {
        console.error(`Error reading directory ${directory}:`, error)
      }
    })

    return {
      memes,
      directories,
    }
  } catch (error) {
    console.error("Error reading meme data:", error)
    return { memes: [], directories: [] }
  }
}

// Data fallback jika terjadi error
export const fallbackMemeData: MemeData = {
  memes: [
    {
      id: "fallback1",
      filename: "Example Meme 1.jpg",
      directory: "Developer",
      url: "/placeholder.svg?height=400&width=400&text=Example+Meme+1",
    },
    {
      id: "fallback2",
      filename: "Example Meme 2.jpg",
      directory: "JavaScript",
      url: "/placeholder.svg?height=400&width=400&text=Example+Meme+2",
    },
  ],
  directories: ["Developer", "JavaScript"],
}
