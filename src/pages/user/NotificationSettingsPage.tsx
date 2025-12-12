import { useState } from 'react'
import { Bell, MessageSquare, Heart, Gift, Smartphone, Mail } from 'lucide-react'
import { PageType } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/NotificationSettingsPage.css'

interface NotificationSettingsPageProps {
  onNavigate: (page: PageType) => void
  onGoBack: () => void
}

export default function NotificationSettingsPage({ onNavigate, onGoBack }: NotificationSettingsPageProps) {
  const [settings, setSettings] = useState({
    newStory: true,
    comment: true,
    like: false,
    marketing: false,
    push: true,
    email: false
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    alert('알림 설정이 저장되었습니다!')
    onGoBack()
  }

  return (
    <div className="notification-settings-page">
      {/* 배경 구름 */}
      <div className="notification-settings-page__bg-decorations">
        <div className="notification-settings-page__cloud notification-settings-page__cloud--1"></div>
        <div className="notification-settings-page__cloud notification-settings-page__cloud--2"></div>
        <div className="notification-settings-page__cloud notification-settings-page__cloud--3"></div>
        <div className="notification-settings-page__cloud notification-settings-page__cloud--4"></div>
      </div>

      {/* 헤더 - SimpleHeader 사용 (사이드바 없음) */}
      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        showCenterLogo={true}
        showMenuButton={false}
        isFixed={true}
      />

      <main className="notification-settings-page__main">
        {/* 인트로 - 아이콘 제거 */}
        <div className="notification-settings-page__intro">
          <h2 className="notification-settings-page__intro-title">알림을 관리하세요</h2>
          <p className="notification-settings-page__intro-desc">원하는 알림만 받아볼 수 있어요</p>
        </div>

        <div className="notification-settings-page__content">
          {/* 활동 알림 */}
          <div className="notification-settings-page__section">
            <div className="notification-settings-page__section-header">
              <span className="notification-settings-page__section-icon">📬</span>
              <h3 className="notification-settings-page__section-title">활동 알림</h3>
            </div>

            <div className="notification-settings-page__items">
              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #FFE4B5 0%, #FFD180 100%)' }}>
                  <Bell size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">새 동화 완성</span>
                  <span className="notification-settings-page__item-desc">동화 생성이 완료되면 알림</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.newStory ? 'on' : ''}`}
                  onClick={() => toggleSetting('newStory')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>

              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #B8E0D2 0%, #7BC4AD 100%)' }}>
                  <MessageSquare size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">댓글</span>
                  <span className="notification-settings-page__item-desc">내 게시글에 댓글이 달리면 알림</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.comment ? 'on' : ''}`}
                  onClick={() => toggleSetting('comment')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>

              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #FFD4E5 0%, #FFB3D0 100%)' }}>
                  <Heart size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">좋아요</span>
                  <span className="notification-settings-page__item-desc">내 게시글에 좋아요가 달리면 알림</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.like ? 'on' : ''}`}
                  onClick={() => toggleSetting('like')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>
            </div>
          </div>

          {/* 마케팅 알림 */}
          <div className="notification-settings-page__section">
            <div className="notification-settings-page__section-header">
              <span className="notification-settings-page__section-icon">🎁</span>
              <h3 className="notification-settings-page__section-title">마케팅 알림</h3>
            </div>

            <div className="notification-settings-page__items">
              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #E5D4FF 0%, #C9B8FF 100%)' }}>
                  <Gift size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">이벤트 및 혜택</span>
                  <span className="notification-settings-page__item-desc">새로운 이벤트와 혜택 정보</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.marketing ? 'on' : ''}`}
                  onClick={() => toggleSetting('marketing')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>
            </div>
          </div>

          {/* 알림 방법 */}
          <div className="notification-settings-page__section">
            <div className="notification-settings-page__section-header">
              <span className="notification-settings-page__section-icon">📲</span>
              <h3 className="notification-settings-page__section-title">알림 방법</h3>
            </div>

            <div className="notification-settings-page__items">
              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #D4E5FF 0%, #A8CFFF 100%)' }}>
                  <Smartphone size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">푸시 알림</span>
                  <span className="notification-settings-page__item-desc">앱 푸시 알림 받기</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.push ? 'on' : ''}`}
                  onClick={() => toggleSetting('push')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>

              <div className="notification-settings-page__item">
                <div className="notification-settings-page__item-icon" style={{ background: 'linear-gradient(135deg, #FFE4B5 0%, #FFD180 100%)' }}>
                  <Mail size={20} />
                </div>
                <div className="notification-settings-page__item-info">
                  <span className="notification-settings-page__item-label">이메일 알림</span>
                  <span className="notification-settings-page__item-desc">이메일로 알림 받기</span>
                </div>
                <button
                  className={`notification-settings-page__toggle ${settings.email ? 'on' : ''}`}
                  onClick={() => toggleSetting('email')}
                >
                  <div className="notification-settings-page__toggle-circle" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="notification-settings-page__actions">
          <button onClick={handleSave} className="notification-settings-page__submit-btn">
            변경사항 저장 ✨
          </button>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="notification-settings-page__footer">
        <p>© 2025 아이토리. 모든 아이들의 상상력을 응원합니다.</p>
      </footer>
    </div>
  )
}