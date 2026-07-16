import { axiosInstance } from './axiosInstance'

export const fetchPosts = (category?: string) => {
  const params = category && category !== '전체' ? { category } : {}
  return axiosInstance.get('/api/posts', { params })
}

export const fetchPostById = (id: number | string) => {
  return axiosInstance.get(`/api/posts/${id}`)
}

export const createPost = (payload: {
  title: string
  content: string
  password: string
  nickname: string
  category: string
}) => {
  return axiosInstance.post('/api/posts', payload)
}

export const updatePost = (
  id: number | string,
  payload: {
    title: string
    content: string
    password: string
    category: string
  },
) => {
  return axiosInstance.put(`/api/posts/${id}`, payload)
}

export const deletePost = (
  id: number | string,
  password: string,
) => {
  return axiosInstance.delete(`/api/posts/${id}`, {
    data: {
      password,
    },
  })
}

export const fetchComments = (postId: number | string) => {
  return axiosInstance.get('/api/comments', {
    params: { post_id: postId },
  })
}

export const createComment = (payload: { post_id: number | string; content: string }) => {
  return axiosInstance.post('/api/comments', payload)
}
