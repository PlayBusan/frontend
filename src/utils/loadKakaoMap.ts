export const loadKakaoMap = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 종료
    if (window.kakao?.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')

    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&libraries=services`

    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
    }

    script.onerror = () => {
      reject(new Error('카카오맵 SDK 로드 실패'))
    }

    document.head.appendChild(script)
  })
}
