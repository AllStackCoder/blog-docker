import { useQuery } from '@tanstack/react-query'
import { CreatePost } from './components/CreatePost'
import { PostFilter } from './components/PostFilter'
import { PostList } from './components/PostList'
import { PostSorting } from './components/PostSorting'
import { getPosts } from './api/posts'
import { useState } from 'react'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postQuery = useQuery({
    queryKey: ['posts', { author, tags, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, tags, sortBy, sortOrder }),
  })
  const posts = postQuery.data ?? []
  return (
    <div style={{ padding: 24, fontSize: 20 }}>
      <CreatePost />
      <br />
      <hr />
      <div style={{ display: 'flex', gap: 10 }}>
        <span>Filter by:</span>
        <PostFilter
          field='author'
          value={author}
          onChange={(value) => setAuthor(value)}
        />
        <PostFilter
          field='tags'
          value={tags}
          onChange={(value) => setTags(value)}
        />
      </div>
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
