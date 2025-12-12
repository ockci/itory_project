import { useState } from 'react'
import { PageType } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/MyBookshelfPage.css'

interface MyBookshelfPageProps {
  onNavigate: (page: PageType) => void
  onGoBack: () => void
  onMenuClick: () => void
}

// 내 책장에 저장된 동화들 (실제 이미지 경로 사용)
const myStories = [
  { id: 1, title: '흥부와 놀부', style: '수채화', thumbnail: '/images/tales/tale_003.png', color: '#FFB3D9', spineColor: '#FF8BBD' },
  { id: 2, title: '콩쥐팥쥐', style: '3D 카툰', thumbnail: '/images/tales/tale_005.png', color: '#B3E0FF', spineColor: '#8BC8FF' },
  { id: 3, title: '토끼와 거북이', style: '실사', thumbnail: '/images/tales/tale_001.png', color: '#FFF4B3', spineColor: '#FFE87C' },
  { id: 4, title: '혹부리 영감', style: '2D 애니', thumbnail: '/images/tales/tale_012.png', color: '#FFB3D9', spineColor: '#FF8BBD' },
  { id: 5, title: '해와 달이 된 오누이', style: '픽사', thumbnail: '/images/tales/tale_002.png', color: '#FFCFA3', spineColor: '#FFB87C' },
  { id: 6, title: '금도끼 은도끼', style: '수채화', thumbnail: '/images/tales/tale_006.png', color: '#E0CFFF', spineColor: '#C8A8FF' },
  { id: 7, title: '선녀와 나무꾼', style: '2D 애니', thumbnail: '/images/tales/tale_004.png', color: '#FFB3D9', spineColor: '#FF8BBD' },
  { id: 8, title: '별주부전', style: '픽사', thumbnail: '/images/tales/tale_007.png', color: '#B3F5E6', spineColor: '#8BE5D0' },
  { id: 9, title: '잭과 콩나무', style: '3D 카툰', thumbnail: '/images/tales/tale_010.png', color: '#B3E0FF', spineColor: '#8BC8FF' },
  { id: 10, title: '호랑이와 곶감', style: '실사', thumbnail: '/images/tales/tale_016.png', color: '#FFF4B3', spineColor: '#FFE87C' },
  { id: 11, title: '도깨비 방망이', style: '수채화', thumbnail: '/images/tales/tale_020.png', color: '#E0CFFF', spineColor: '#C8A8FF' },
  { id: 12, title: '젊어지는 샘물', style: '픽사', thumbnail: '/images/tales/tale_019.png', color: '#B3F5E6', spineColor: '#8BE5D0' }
]

export default function MyBookshelfPage({ onNavigate, onGoBack, onMenuClick }: MyBookshelfPageProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // 선반당 4권씩 나누기 (PC/태블릿용) - 3줄
  const shelf1 = myStories.slice(0, 4)
  const shelf2 = myStories.slice(4, 8)
  const shelf3 = myStories.slice(8, 12)

  // 책 렌더링 컴포넌트
  const renderBook = (story: typeof myStories[0], isMobile = false) => (
    <div
      key={story.id}
      className={isMobile ? 'bookshelf-page__mobile-book' : 'bookshelf-page__book'}
      onMouseEnter={() => setHoveredId(story.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => onNavigate('story-detail')}
    >
      <div
        className="bookshelf-page__book-cover"
        style={{ background: `linear-gradient(135deg, ${story.color} 0%, ${story.spineColor} 100%)` }}
      >
        {/* 책 이미지 */}
        <div className="bookshelf-page__book-image">
          <img src={story.thumbnail} alt={story.title} />
        </div>

        {/* 스타일 뱃지 */}
        <div className="bookshelf-page__book-badge">{story.style}</div>

        {/* 책 제목 */}
        <div className="bookshelf-page__book-title">{story.title}</div>

        {/* 광택 효과 */}
        <div className="bookshelf-page__book-shine"></div>
      </div>

      {/* 책 아래 두께 */}
      <div
        className="bookshelf-page__book-bottom"
        style={{ background: story.spineColor }}
      ></div>

      {/* 책 그림자 */}
      <div className="bookshelf-page__book-shadow"></div>
    </div>
  )

  return (
    <div className="bookshelf-page">
      {/* 배경 구름 */}
      <div className="bookshelf-page__bg-decorations">
        <div className="bookshelf-page__cloud bookshelf-page__cloud--1"></div>
        <div className="bookshelf-page__cloud bookshelf-page__cloud--2"></div>
        <div className="bookshelf-page__cloud bookshelf-page__cloud--3"></div>
      </div>

      {/* 헤더 */}
      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        onMenuClick={onMenuClick}
        showCenterLogo={true}
        isFixed={true}
      />

      <main className="bookshelf-page__main">
        {/* 타이틀 */}
        <div className="bookshelf-page__header">
          <h1 className="bookshelf-page__title">📚 내 책장</h1>
          <p className="bookshelf-page__subtitle">
            총 <strong>{myStories.length}권</strong>의 동화를 만들었어요!
          </p>
        </div>

        {/* ============================================
            PC/태블릿용 나무 책장 (선반 레이아웃)
            ============================================ */}
        <div className="bookshelf-page__cabinet bookshelf-page__cabinet--desktop">
          {/* 책장 상단 장식 */}
          <div className="bookshelf-page__cabinet-top">
            <span className="bookshelf-page__cabinet-ornament">🌟</span>
            <span className="bookshelf-page__cabinet-label">나만의 동화 컬렉션</span>
            <span className="bookshelf-page__cabinet-ornament">🌟</span>
          </div>

          {/* 책장 본체 */}
          <div className="bookshelf-page__cabinet-body">
            {/* 왼쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--left"></div>

            {/* 선반들 */}
            <div className="bookshelf-page__shelves">
              {/* 첫 번째 선반 */}
              <div className="bookshelf-page__shelf">
                <div className="bookshelf-page__books">
                  {shelf1.map(story => renderBook(story))}
                </div>
                <div className="bookshelf-page__shelf-board"></div>
                <div className="bookshelf-page__shelf-front"></div>
              </div>

              {/* 두 번째 선반 */}
              <div className="bookshelf-page__shelf">
                <div className="bookshelf-page__books">
                  {shelf2.map(story => renderBook(story))}
                </div>
                <div className="bookshelf-page__shelf-board"></div>
                <div className="bookshelf-page__shelf-front"></div>
              </div>

              {/* 세 번째 선반 */}
              <div className="bookshelf-page__shelf">
                <div className="bookshelf-page__books">
                  {shelf3.map(story => renderBook(story))}
                </div>
                <div className="bookshelf-page__shelf-board"></div>
                <div className="bookshelf-page__shelf-front"></div>
              </div>
            </div>

            {/* 오른쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--right"></div>
          </div>

          {/* 책장 하단 */}
          <div className="bookshelf-page__cabinet-bottom"></div>
        </div>

        {/* ============================================
            모바일용 나무 책장 (3열 그리드)
            ============================================ */}
        <div className="bookshelf-page__cabinet bookshelf-page__cabinet--mobile">
          {/* 책장 상단 장식 */}
          <div className="bookshelf-page__cabinet-top">
            <span className="bookshelf-page__cabinet-ornament">🌟</span>
            <span className="bookshelf-page__cabinet-label">나만의 동화 컬렉션</span>
            <span className="bookshelf-page__cabinet-ornament">🌟</span>
          </div>

          {/* 책장 본체 */}
          <div className="bookshelf-page__cabinet-body">
            {/* 왼쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--left"></div>

            {/* 모바일 그리드 */}
            <div className="bookshelf-page__mobile-grid">
              {myStories.map(story => renderBook(story, true))}
            </div>

            {/* 오른쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--right"></div>
          </div>

          {/* 책장 하단 */}
          <div className="bookshelf-page__cabinet-bottom"></div>
        </div>

        {/* 새 동화 만들기 CTA */}
        <div className="bookshelf-page__cta">
          <button
            className="bookshelf-page__cta-btn"
            onClick={() => onNavigate('fairytale-selection')}
          >
            ✨ 새 동화 만들기
          </button>
        </div>
      </main>

      {/* 하단 풍경 장식 */}
      <div className="bookshelf-page__landscape">
        <div className="bookshelf-page__grass"></div>
        <div className="bookshelf-page__tree bookshelf-page__tree--1"></div>
        <div className="bookshelf-page__tree bookshelf-page__tree--2"></div>
        <div className="bookshelf-page__bush bookshelf-page__bush--1"></div>
        <div className="bookshelf-page__bush bookshelf-page__bush--2"></div>
        <div className="bookshelf-page__bush bookshelf-page__bush--3"></div>
        <div className="bookshelf-page__flower bookshelf-page__flower--1"></div>
        <div className="bookshelf-page__flower bookshelf-page__flower--2"></div>
        <div className="bookshelf-page__flower bookshelf-page__flower--3"></div>
      </div>
    </div>
  )
}