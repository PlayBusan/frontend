export const loadKakaoMap = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')

    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }`

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
    }

    document.head.appendChild(script)
  })
}
