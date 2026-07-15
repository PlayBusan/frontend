import { axiosInstance } from './axiosInstance'

export const askChat = async (message: string): Promise<string> => {
  const { data } = await axiosInstance.post('/api/chatbot', {
    message,
  })

  return data.reply
}