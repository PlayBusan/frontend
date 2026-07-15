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
