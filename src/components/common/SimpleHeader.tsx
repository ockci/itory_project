import { ArrowLeft, Menu } from 'lucide-react'
import { PageType } from '../../App'
import '../../styles/components/SimpleHeader.css'

interface SimpleHeaderProps {
  onNavigate?: (page: PageType) => void
  onGoBack?: () => void
  onMenuClick?: () => void
  showBackButton?: boolean
  showMenuButton?: boolean
  showCenterLogo?: boolean  // 중앙 로고 표시 여부
  isFixed?: boolean         // 고정 헤더 여부
}

export default function SimpleHeader({
  onNavigate,
  onGoBack,
  onMenuClick,
  showBackButton = true,
  showMenuButton = true,
  showCenterLogo = false,
  isFixed = false
}: SimpleHeaderProps) {
  return (
    <>
      <header className={`simple-header ${isFixed ? 'simple-header--fixed' : ''}`}>
        {/* 왼쪽: 뒤로가기 또는 로고 */}
        <div className="simple-header__left">
          {showBackButton && onGoBack ? (
            <button onClick={onGoBack} className="simple-header__back-btn">
              <ArrowLeft size={24} color="#5D4E37" />
            </button>
          ) : !showCenterLogo ? (
            <button
              onClick={() => onNavigate?.('home')}
              className="simple-header__logo"
            >
              <img
                src="/src/assets/images/logo.png"
                alt="아이토리"
                className="simple-header__logo-img"
              />
            </button>
          ) : (
            <div className="simple-header__placeholder" />
          )}
        </div>

        {/* 중앙: 로고 (옵션) */}
        {showCenterLogo && (
          <div className="simple-header__center">
            <button
              onClick={() => onNavigate?.('home')}
              className="simple-header__logo simple-header__logo--center"
            >
              <img
                src="/src/assets/images/logo.png"
                alt="아이토리"
                className="simple-header__logo-img"
              />
            </button>
          </div>
        )}

        {/* 오른쪽: 메뉴 버튼 */}
        <div className="simple-header__right">
          {showMenuButton && onMenuClick ? (
            <button onClick={onMenuClick} className="simple-header__menu-btn">
              <Menu size={24} color="#5D4E37" />
            </button>
          ) : (
            <div className="simple-header__placeholder" />
          )}
        </div>
      </header>

      {/* 고정 헤더일 때 콘텐츠 밀어내기용 스페이서 */}
      {isFixed && <div className="simple-header__spacer" />}
    </>
  )
}