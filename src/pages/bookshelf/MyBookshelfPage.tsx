import { PageType } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/MyBookshelfPage.css'

interface MyBookshelfPageProps {
  onNavigate: (page: PageType) => void
  onGoBack: () => void
  onMenuClick: () => void
}

// 내 동화 목록 - 실제 이미지 경로 사용
const myStories = [
  { id: 1, title: '흥부와 놀부', style: '수채화', thumbnail: '/images/tales/tale_003.png', color: '#42A5F5' },
  { id: 2, title: '콩쥐팥쥐', style: '3D 카툰', thumbnail: '/images/tales/tale_005.png', color: '#FFB300' },
  { id: 3, title: '토끼와 거북이', style: '실사', thumbnail: '/images/tales/tale_001.png', color: '#4CAF50' },
  { id: 4, title: '혹부리 영감', style: '2D 애니', thumbnail: '/images/tales/tale_012.png', color: '#5C6BC0' },
  { id: 5, title: '해와 달이 된 오누이', style: '픽사', thumbnail: '/images/tales/tale_002.png', color: '#AB47BC' },
  { id: 6, title: '금도끼 은도끼', style: '수채화', thumbnail: '/images/tales/tale_006.png', color: '#FF7043' },
  { id: 7, title: '선녀와 나무꾼', style: '2D 애니', thumbnail: '/images/tales/tale_004.png', color: '#EC407A' },
  { id: 8, title: '별주부전', style: '픽사', thumbnail: '/images/tales/tale_007.png', color: '#26A69A' },
  { id: 9, title: '잭과 콩나무', style: '3D 카툰', thumbnail: '/images/tales/tale_010.png', color: '#66BB6A' },
  { id: 10, title: '호랑이와 곶감', style: '실사', thumbnail: '/images/tales/tale_016.png', color: '#FFA726' },
  { id: 11, title: '도깨비 방망이', style: '수채화', thumbnail: '/images/tales/tale_020.png', color: '#9575CD' },
  { id: 12, title: '젊어지는 샘물', style: '픽사', thumbnail: '/images/tales/tale_019.png', color: '#4FC3F7' }
]

// PC용: 선반별로 책 나누기 (한 선반에 4권씩)
const booksPerShelf = 4
const shelves: typeof myStories[] = []
for (let i = 0; i < myStories.length; i += booksPerShelf) {
  shelves.push(myStories.slice(i, i + booksPerShelf))
}

export default function MyBookshelfPage({ onNavigate, onGoBack, onMenuClick }: MyBookshelfPageProps) {
  return (
    <div className="bookshelf-page">
      {/* 배경 구름 */}
      <div className="bookshelf-page__bg-decorations">
        <div className="bookshelf-page__cloud bookshelf-page__cloud--1"></div>
        <div className="bookshelf-page__cloud bookshelf-page__cloud--2"></div>
        <div className="bookshelf-page__cloud bookshelf-page__cloud--3"></div>
      </div>

      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        onMenuClick={onMenuClick}
      />

      <main className="bookshelf-page__main">
        {/* 페이지 타이틀 */}
        <div className="bookshelf-page__header">
          <h1 className="bookshelf-page__title">📚 내 책장</h1>
          <p className="bookshelf-page__subtitle">
            총 <strong>{myStories.length}권</strong>의 동화가 있어요!
          </p>
        </div>

        {/* 나무 책장 - PC/태블릿용 (선반 구조) */}
        <div className="bookshelf-page__cabinet bookshelf-page__cabinet--desktop">
          {/* 책장 상단 장식 */}
          <div className="bookshelf-page__cabinet-top">
            <div className="bookshelf-page__cabinet-ornament">✨</div>
            <div className="bookshelf-page__cabinet-label">나만의 동화 컬렉션</div>
            <div className="bookshelf-page__cabinet-ornament">✨</div>
          </div>

          {/* 책장 본체 */}
          <div className="bookshelf-page__cabinet-body">
            {/* 왼쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--left"></div>

            {/* 선반들 */}
            <div className="bookshelf-page__shelves">
              {shelves.map((shelfBooks, shelfIndex) => (
                <div key={shelfIndex} className="bookshelf-page__shelf">
                  {/* 책들 */}
                  <div className="bookshelf-page__books">
                    {shelfBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bookshelf-page__book"
                        onClick={() => onNavigate('story-detail')}
                      >
                        {/* 책 표지 */}
                        <div
                          className="bookshelf-page__book-cover"
                          style={{
                            background: `linear-gradient(145deg, ${book.color}99 0%, ${book.color} 100%)`
                          }}
                        >
                          {/* 이미지 */}
                          <div className="bookshelf-page__book-image">
                            <img
                              src={book.thumbnail}
                              alt={book.title}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>

                          {/* 스타일 뱃지 */}
                          <div className="bookshelf-page__book-badge">{book.style}</div>

                          {/* 제목 */}
                          <div className="bookshelf-page__book-title">{book.title}</div>

                          {/* 광택 */}
                          <div className="bookshelf-page__book-shine"></div>
                        </div>

                        {/* 책 두께 (아래) */}
                        <div
                          className="bookshelf-page__book-bottom"
                          style={{ background: book.color }}
                        ></div>

                        {/* 책 그림자 */}
                        <div className="bookshelf-page__book-shadow"></div>
                      </div>
                    ))}
                  </div>

                  {/* 선반 판 */}
                  <div className="bookshelf-page__shelf-board">
                    <div className="bookshelf-page__shelf-front"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--right"></div>
          </div>

          {/* 책장 하단 */}
          <div className="bookshelf-page__cabinet-bottom"></div>
        </div>

        {/* 모바일용 그리드 레이아웃 (세로 3열, 가로 4열 자동) */}
        <div className="bookshelf-page__cabinet bookshelf-page__cabinet--mobile">
          {/* 책장 상단 장식 */}
          <div className="bookshelf-page__cabinet-top">
            <div className="bookshelf-page__cabinet-ornament">✨</div>
            <div className="bookshelf-page__cabinet-label">나만의 동화 컬렉션</div>
            <div className="bookshelf-page__cabinet-ornament">✨</div>
          </div>

          {/* 책장 본체 */}
          <div className="bookshelf-page__cabinet-body">
            {/* 왼쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--left"></div>

            {/* 모바일 그리드 책장 */}
            <div className="bookshelf-page__mobile-grid">
              {myStories.map((book, index) => (
                <div
                  key={book.id}
                  className="bookshelf-page__mobile-book"
                  data-index={index}
                  onClick={() => onNavigate('story-detail')}
                >
                  <div
                    className="bookshelf-page__book-cover"
                    style={{
                      background: `linear-gradient(145deg, ${book.color}99 0%, ${book.color} 100%)`
                    }}
                  >
                    <div className="bookshelf-page__book-image">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="bookshelf-page__book-badge">{book.style}</div>
                    <div className="bookshelf-page__book-title">{book.title}</div>
                    <div className="bookshelf-page__book-shine"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽 프레임 */}
            <div className="bookshelf-page__cabinet-side bookshelf-page__cabinet-side--right"></div>
          </div>

          {/* 책장 하단 */}
          <div className="bookshelf-page__cabinet-bottom"></div>
        </div>

        {/* 새 동화 만들기 */}
        <div className="bookshelf-page__cta">
          <button
            className="bookshelf-page__cta-btn"
            onClick={() => onNavigate('fairytale-selection')}
          >
            <span>✨</span>
            <span>새로운 동화 만들기</span>
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