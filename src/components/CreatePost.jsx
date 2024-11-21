import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'

export function CreatePost() {
  const [postData, setPostData] = useState({
    title: '',
    contents: '',
    author: '',
    tags: [],
  })
  function handleChange(e) {
    const { value, name } = e.target
    if (name === 'tags') {
      setPostData({ ...postData, [name]: value.split(',') })
    } else {
      setPostData({ ...postData, [name]: value })
    }
  }
  const queryClient = useQueryClient()
  function onSuccess() {
    queryClient.invalidateQueries(['posts'])
    setPostData({
      title: '',
      contents: '',
      author: '',
      tags: [],
    })
  }

  const createPostMutation = useMutation({
    mutationFn: () => createPost(postData),
    onSuccess: () => onSuccess(),
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='title'
          id='create-title'
          onChange={handleChange}
          value={postData.title}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-author'>Author: </label>
        <input
          type='text'
          name='author'
          id='create-author'
          value={postData.author}
          onChange={handleChange}
        />
      </div>
      <div>
        <br />
        <label htmlFor='create-tags'>Tags: </label>
        <input
          type='text'
          name='tags'
          id='create-tags'
          value={postData.tags.join(',')}
          onChange={handleChange}
        />
      </div>
      <br />
      <textarea
        value={postData.contents}
        name='contents'
        rows={5}
        cols={50}
        onChange={handleChange}
      />
      <br />
      <br />
      <input
        type='submit'
        value={createPostMutation.isPending ? 'creating...' : 'create'}
        disabled={!postData.title || createPostMutation.isPending}
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </form>
  )
}
