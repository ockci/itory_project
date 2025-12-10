import { Play, Download, Share2, Clock, Palette, Calendar, Star } from 'lucide-react'
import { PageType } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/StoryDetailPage.css'

interface StoryDetailPageProps {
  onNavigate: (page: PageType) => void
  onGoBack: () => void
  onMenuClick: () => void
}

// 선택한 스토리 정보 (하드코딩 - 흥부와 놀부)
const STORY_INFO = {
  id: 'tale_003',
  title: '흥부와 놀부',
  thumbnail: '/images/tales/tale_003.png',
  style: '수채화',
  theme: '착한 마음',
  color: '#42A5F5',
  createdAt: '2024.01.15',
  duration: '6분 15초',
  rating: 5,
  choices: [
    { step: 1, label: '발단', text: '🦅 제비를 만났어요' },
    { step: 2, label: '전개', text: '🌰 박씨를 가져왔어요' },
    { step: 3, label: '위기', text: '🌱 박을 심었어요' },
    { step: 4, label: '절정', text: '💰 보물이 나왔어요' },
    { step: 5, label: '결말', text: '🌟 행복하게 살았어요' }
  ]
}

export default function StoryDetailPage({ onNavigate, onGoBack, onMenuClick }: StoryDetailPageProps) {
  return (
    <div className="story-detail-page">
      {/* 배경 구름 */}
      <div className="story-detail-page__bg-decorations">
        <div className="story-detail-page__cloud story-detail-page__cloud--1"></div>
        <div className="story-detail-page__cloud story-detail-page__cloud--2"></div>
        <div className="story-detail-page__cloud story-detail-page__cloud--3"></div>
      </div>

      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        onMenuClick={onMenuClick}
      />

      <main className="story-detail-page__main">
        <div className="story-detail-page__container">
          {/* 책 표지 카드 - FairyTaleSelectionPage 스타일 */}
          <div className="story-detail-page__book-card">
            <div className="story-detail-page__book-3d">
              {/* 책등 (Spine) - 왼쪽 */}
              <div
                className="story-detail-page__book-spine"
                style={{ background: `linear-gradient(180deg, ${STORY_INFO.color} 0%, ${STORY_INFO.color}dd 100%)` }}
              >
                <span className="story-detail-page__spine-title">{STORY_INFO.title}</span>
              </div>

              {/* 페이지 두께 - 오른쪽 */}
              <div className="story-detail-page__book-pages">
                <div className="story-detail-page__page-line"></div>
                <div className="story-detail-page__page-line"></div>
                <div className="story-detail-page__page-line"></div>
                <div className="story-detail-page__page-line"></div>
                <div className="story-detail-page__page-line"></div>
              </div>

              {/* 책 표지 */}
              <div
                className="story-detail-page__book-cover"
                style={{ background: `linear-gradient(135deg, ${STORY_INFO.color}99 0%, ${STORY_INFO.color} 100%)` }}
              >
                {/* 표지 테두리 장식 */}
                <div className="story-detail-page__cover-border">
                  {/* 이미지 영역 */}
                  <div className="story-detail-page__cover-image">
                    <img
                      src={STORY_INFO.thumbnail}
                      alt={STORY_INFO.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div className="story-detail-page__image-placeholder">📚</div>
                  </div>

                  {/* 제목 영역 */}
                  <div className="story-detail-page__cover-info">
                    <span className="story-detail-page__book-label">전래동화</span>
                    <h3 className="story-detail-page__book-title">{STORY_INFO.title}</h3>
                    <p className="story-detail-page__book-theme">#{STORY_INFO.theme}</p>
                  </div>
                </div>

                {/* 스타일 뱃지 */}
                <div className="story-detail-page__style-badge">{STORY_INFO.style}</div>

                {/* 책 광택 효과 */}
                <div className="story-detail-page__cover-shine"></div>
              </div>
            </div>

            {/* 별점 */}
            <div className="story-detail-page__rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  fill={star <= STORY_INFO.rating ? '#FFD54F' : 'transparent'}
                  color="#FFD54F"
                />
              ))}
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="story-detail-page__info">
            {/* 제목 */}
            <div className="story-detail-page__title-section">
              <h1 className="story-detail-page__title">{STORY_INFO.title}</h1>
              <p className="story-detail-page__subtitle">나만의 특별한 이야기</p>
            </div>

            {/* 메타 정보 */}
            <div className="story-detail-page__meta">
              <div className="story-detail-page__meta-item">
                <Calendar size={18} />
                <span>{STORY_INFO.createdAt}</span>
              </div>
              <div className="story-detail-page__meta-item">
                <Palette size={18} />
                <span>{STORY_INFO.style} 스타일</span>
              </div>
              <div className="story-detail-page__meta-item">
                <Clock size={18} />
                <span>{STORY_INFO.duration}</span>
              </div>
            </div>

            {/* 선택한 여정 */}
            <div className="story-detail-page__journey">
              <h3 className="story-detail-page__journey-title">
                <span className="story-detail-page__journey-icon">✨</span>
                내가 선택한 여정
              </h3>
              <div className="story-detail-page__journey-list">
                {STORY_INFO.choices.map((choice) => (
                  <div key={choice.step} className="story-detail-page__journey-item">
                    <span className="story-detail-page__journey-step">{choice.step}</span>
                    <span className="story-detail-page__journey-label">{choice.label}</span>
                    <span className="story-detail-page__journey-text">{choice.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="story-detail-page__actions">
              <button
                onClick={() => onNavigate('video')}
                className="story-detail-page__btn story-detail-page__btn--play"
              >
                <Play size={22} />
                <span>영상 보기</span>
              </button>
              <button className="story-detail-page__btn story-detail-page__btn--download">
                <Download size={22} />
                <span>다운로드</span>
              </button>
              <button
                onClick={() => onNavigate('bookclub-upload')}
                className="story-detail-page__btn story-detail-page__btn--share"
              >
                <Share2 size={22} />
                <span>공유하기</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 풍경 장식 */}
      <div className="story-detail-page__landscape">
        <div className="story-detail-page__grass"></div>
        <div className="story-detail-page__tree story-detail-page__tree--1"></div>
        <div className="story-detail-page__tree story-detail-page__tree--2"></div>
        <div className="story-detail-page__bush story-detail-page__bush--1"></div>
        <div className="story-detail-page__bush story-detail-page__bush--2"></div>
        <div className="story-detail-page__bush story-detail-page__bush--3"></div>
        <div className="story-detail-page__flower story-detail-page__flower--1"></div>
        <div className="story-detail-page__flower story-detail-page__flower--2"></div>
        <div className="story-detail-page__flower story-detail-page__flower--3"></div>
      </div>
    </div>
  )
}