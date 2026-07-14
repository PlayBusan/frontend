import { weatherApi } from './axiosInstance'

export const getCurrentWeather = () => {
  return weatherApi.get('/weather', {
    params: {
      q: 'Busan',
      units: 'metric',
      lang: 'kr',
      appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    },
  })
}
