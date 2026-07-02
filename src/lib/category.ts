// 카테고리별 라벨과 색상. 게시판에서 색이 곧 정보가 되도록 slug마다 고유 색을 부여한다.
export type CategoryMeta = {
  slug: string
  name: string
  spine: string // 카드 좌측 스파인 / 강조 색 (CSS var)
  chip: string // 칩 배경/글자 tailwind 클래스
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  free: {
    slug: "free",
    name: "자유게시판",
    spine: "var(--cat-free)",
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  },
  qna: {
    slug: "qna",
    name: "질문",
    spine: "var(--cat-qna)",
    chip: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  },
  notice: {
    slug: "notice",
    name: "공지사항",
    spine: "var(--cat-notice)",
    chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  },
}

export function catBySlug(slug: string | undefined): CategoryMeta {
  return (slug && CATEGORY_META[slug]) || {
    slug: "etc",
    name: slug ?? "기타",
    spine: "var(--muted-foreground)",
    chip: "bg-muted text-muted-foreground",
  }
}
