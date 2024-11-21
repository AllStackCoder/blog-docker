import { useMutation, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { deletePost } from '../api/posts'

export function Post({ title, contents, author, _id: postId }) {
  const queryClient = useQueryClient()
  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: queryClient.invalidateQueries(['posts']),
  })
  function handleDeletePost() {
    deletePostMutation.mutate()
  }
  return (
    <article>
      <h3>{title}</h3>
      <div>{contents}</div>
      {author && (
        <em>
          <br />
          Written by <strong>{author}</strong>
        </em>
      )}
      <br />
      <br />
      <button onClick={() => handleDeletePost()}>Delete Post</button>
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  _id: PropTypes.string.isRequired,
}
