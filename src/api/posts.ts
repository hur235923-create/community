import { supabase } from "@/lib/supabase"

export type PostRow = {
  id: number
  title: string
  content: string
  view_count: number
  created_at: string
  category_id: number
  user_id: number
  categories: { slug: string; name: string } | null
  users: { nickname: string } | null
}

export type Category = { id: number; slug: string; name: string }

export const POST_PAGE_SIZE = 10

export async function fetchPosts(opts: {
  categorySlug?: string
  search?: string
  page: number
}): Promise<{ rows: PostRow[]; total: number }> {
  const from = opts.page * POST_PAGE_SIZE
  const to = from + POST_PAGE_SIZE - 1
  let q = supabase
    .from("posts")
    .select("*, categories!inner(slug,name), users(nickname)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)
  if (opts.categorySlug && opts.categorySlug !== "all") {
    q = q.eq("categories.slug", opts.categorySlug)
  }
  if (opts.search) q = q.ilike("title", `%${opts.search}%`)
  const { data, count, error } = await q
  if (error) throw new Error(error.message)
  return { rows: (data ?? []) as PostRow[], total: count ?? 0 }
}

export async function fetchPost(id: number): Promise<PostRow> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(slug,name), users(nickname)")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data as PostRow
}

export async function incrementView(id: number): Promise<void> {
  await supabase.rpc("increment_view_count", { p_post_id: id })
}

export async function deletePost(id: number): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("id")
  if (error) throw new Error(error.message)
  return (data ?? []) as Category[]
}

export async function createPost(input: {
  categoryId: number
  userId: number
  title: string
  content: string
}): Promise<number> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      category_id: input.categoryId,
      user_id: input.userId,
      title: input.title,
      content: input.content,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  return data.id as number
}

export async function updatePost(
  id: number,
  input: { categoryId: number; title: string; content: string }
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({
      category_id: input.categoryId,
      title: input.title,
      content: input.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
}
