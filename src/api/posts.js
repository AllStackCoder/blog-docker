export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const createPost = async (post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(post),
  })
  return await res.json()
}

export const deletePost = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/${id}`, {
    method: 'DELETE',
  })
  return res.status
}
