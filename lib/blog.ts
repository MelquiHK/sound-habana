export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  images: string[]
  category: "novedades" | "soluciones"
  createdAt: string
  updatedAt: string
}

export const defaultBlogPosts: BlogPost[] = []

export function getBlogPosts(): BlogPost[] {
  if (typeof window === "undefined") return defaultBlogPosts
  const saved = localStorage.getItem("habana-sound-blog")
  return saved ? JSON.parse(saved) : defaultBlogPosts
}

export function saveBlogPosts(posts: BlogPost[]) {
  localStorage.setItem("habana-sound-blog", JSON.stringify(posts))
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.id === id)
}

export function getBlogPostsByCategory(category: "novedades" | "soluciones"): BlogPost[] {
  return getBlogPosts().filter((p) => p.category === category)
}
