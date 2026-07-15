<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="spot in processedSpots"
      :key="spot.contentid"
      class="group cursor-pointer rounded-3xl border border-primary/10 overflow-hidden bg-white/70 backdrop-blur-md shadow-xl shadow-slate-100/30 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/30"
    >
      <!-- 이미지 영역 (평점 배지 포함) -->
      <div class="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          :src="spot.image"
          :alt="spot.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <!-- 실시간 핫플 느낌의 소셜 배지 (Seed 기반 고정 평점) -->
        <div
          class="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm"
        >
          <span class="text-amber-500">★</span> {{ spot.rating }}
        </div>
      </div>

      <!-- 콘텐츠 상세 영역 -->
      <div class="p-6">
        <!-- 태그 리스트 (cat3 기반 감성 태그 자동 치환) -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span
            v-for="tag in spot.tags"
            :key="tag"
            class="text-[11px] font-bold text-primary bg-secondary/10 px-2 py-0.5 rounded-full"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 타이틀 & 지역 구 정보 -->
        <div class="text-xs font-semibold text-slate-400 mb-1">{{ spot.district }}</div>
        <h3
          class="text-lg font-black text-slate-800 group-hover:text-primary transition-colors duration-150"
        >
          {{ spot.title }}
        </h3>

        <!-- 기본 안내 멘트 (없을 시 카테고리 기반 추천사 대체) -->
        <p class="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {{ spot.description }}
        </p>

        <!-- 하단 액션바 -->
        <div
          class="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400"
        >
          <span class="font-medium">실시간 조회 {{ spot.views }}</span>
          <span
            class="font-semibold text-primary group-hover:translate-x-1 transition-transform duration-150"
            >상세보기 →</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// API에서 받아온 원본 데이터 리스트 가정
const rawSpots = [
  {
    contentid: '987810',
    title: '해운대 동백섬',
    addr1: '부산광역시 해운대구 동백로 67',
    firstimage: 'http://tong.visitkorea.or.kr/cms/resource/47/3350847_image2_1.jpg',
    cat3: 'A01011300', // 섬 관련 코드
  },
]

// 프론트엔드단에서 풍부하게 가공하는 Computed 속성
const processedSpots = computed(() => {
  return rawSpots.map((spot) => {
    // 1. 주소에서 'OO구' 추출
    const districtMatch = spot.addr1.match(/([가-힣]+구)/)
    const district = districtMatch ? districtMatch[1] : '부산'

    // 2. contentid를 기반으로 고정된 평점(rating)과 조회수(views) 일관되게 생성 (새로고침 시 비변경)
    const idNum = parseInt(spot.contentid) || 100000
    const rating = (4.5 + (idNum % 5) * 0.1).toFixed(1) // 4.5 ~ 4.9 사이 결정
    const views = (idNum % 300) + 120 // 120 ~ 420 사이 조회수 결정

    // 3. cat3(카테고리 코드)에 매핑될 감성 태그 사전
    const tagMap: Record<string, string[]> = {
      A01011300: ['#바다산책로', '#인생샷코스', '#동백꽃코스'],
      default: ['#부산핫플', '#추천여행지', '#인생사진'],
    }
    const tags = tagMap[spot.cat3] || tagMap['default']

    // 4. 가공된 디스크립션 제안
    const description = `${district}의 대표 명소인 ${spot.title}입니다. 맑은 바다 바람과 아름다운 풍경을 배경으로 멋진 인생 사진을 남겨보세요.`

    return {
      contentid: spot.contentid,
      title: spot.title,
      image: spot.firstimage || '기본_대체_이미지_경로.jpg',
      district,
      rating,
      views,
      tags,
      description,
    }
  })
})
</script>
