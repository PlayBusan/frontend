import festivalData from '@/data/festival_data.json'

interface FestivalItem {
  contentid: string
  title: string
  addr1: string
  addr2: string
  firstimage: string
  firstimage2: string
  eventstartdate: string
  eventenddate: string
  [key: string]: unknown
}

const items = (festivalData as { items: FestivalItem[] }).items

/** 축제 전체 목록 조회 (로컬 festival_data.json 기반) */
export const getFestivals = () => {
  return Promise.resolve({
    data: {
      status: 'success',
      total: items.length,
      data: items,
    },
  })
}

/** 특정 연/월 기준 축제 달력 조회 (로컬 festival_data.json 기반) */
export const getFestivalsByMonth = (year: number, month: number) => {
  const targetYm = `${year}${String(month).padStart(2, '0')}`

  const filtered = items
    .filter(
      (item) => item.eventstartdate?.startsWith(targetYm) || item.eventenddate?.startsWith(targetYm),
    )
    .map((item) => ({
      content_id: item.contentid,
      title: item.title,
      start_date: item.eventstartdate,
      end_date: item.eventenddate,
      addr1: item.addr1 ?? '',
    }))

  return Promise.resolve({
    data: {
      status: 'success',
      target_period: `${year}년 ${String(month).padStart(2, '0')}월`,
      total: filtered.length,
      data: filtered,
    },
  })
}

/** 특정 축제 상세 조회 (로컬 festival_data.json 기반) */
export const getFestivalDetail = (contentId: string | number) => {
  const item = items.find((i) => i.contentid === String(contentId))

  return Promise.resolve({
    data: {
      status: item ? 'success' : 'error',
      data: item ?? null,
    },
  })
}

export default {
  getFestivals,
  getFestivalsByMonth,
  getFestivalDetail,
}
