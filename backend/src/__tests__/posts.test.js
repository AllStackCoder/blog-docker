import { describe, expect, test, beforeEach } from '@jest/globals'
import mongoose from 'mongoose'
import { Post } from '../db/models/post'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/post'

describe('create posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello mongoose',
      author: 'Daniel',
      contents: 'This post is stored in mongoDb using mongoose',
      tags: ['Mongoose', 'MongoDB'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail ', async () => {
    const post = {
      author: 'Daniel',
      contents: 'Post with no title',
      tags: ['Empty'],
    }
    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const test = {
      title: 'Only title',
    }
    const createdPost = await createPost(test)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

let createdSamplePosts = []

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all post', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((samPost) => samPost.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'createdAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort((a, b) => {
      return a.createdAt - b.createdAt
    })
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((samPost) => samPost.createdAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tags', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const singlePost = await getPostById(createdSamplePosts[0]._id)
    expect(singlePost.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const singlePost = await getPostById('000000000000000000000000')
    expect(singlePost).toEqual(null)
  })
})

describe('updating post', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })

  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail id the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(post).toEqual(null)
  })
})

describe('deleting post', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await getPostById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
