import { axiosInstance } from './axiosInstance'

/** 축제 전체 목록 조회
 * GET /api/festivals
 * @param params optional query params (page, size, search, etc.)
 */
export const getFestivals = () => {
  return axiosInstance.get('/api/festivals')
}

/** 특정 연/월 기준 축제 달력 조회
 * GET /api/festivals/calendar?year=YYYY&month=MM
 */
export const getFestivalsByMonth = (year: number, month: number) => {
  return axiosInstance.get('/api/festivals/calendar', {
    params: { year, month },
  })
}

/** 특정 축제 상세 조회
 * GET /api/festivals/{content_id}
 */
export const getFestivalDetail = (contentId: string | number) => {
  return axiosInstance.get(`/api/festivals/${contentId}`)
}

export default {
  getFestivals,
  getFestivalsByMonth,
  getFestivalDetail,
}
