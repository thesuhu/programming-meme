export interface Meme {
  id: string
  filename: string
  directory: string
  url: string
}

export interface MemeData {
  memes: Meme[]
  directories: string[]
}
