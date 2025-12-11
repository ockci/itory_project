import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Download, BookOpen, Share2, RotateCcw, SkipForward, ArrowLeft, Menu } from 'lucide-react'
import { PageType, Tale } from '../../App'
import '../../styles/pages/VideoPage.css'

interface VideoPageProps {
  onNavigate: (page: PageType) => void
  selectedTale: Tale | null
  onGoBack: () => void
  onMenuClick: () => void
}

// 단계별 영상 경로 (EditStoryPage와 동일)
const STAGE_VIDEOS = [
  '/videos/stage1_intro.mp4',
  '/videos/stage2_development.mp4',
  '/videos/stage3_crisis.mp4',
  '/videos/stage4_climax.mp4',
  '/videos/stage5_ending.mp4'
]

const CHAPTERS = ['발단', '전개', '위기', '절정', '결말']

export default function VideoPage({
  onNavigate,
  selectedTale,
  onGoBack,
  onMenuClick
}: VideoPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0) // 0~4 (5단계)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [saved, setSaved] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // 3초 로딩 후 첫 번째 영상 자동 재생
  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 33
      setLoadingProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsLoading(false)
          setIsPlaying(true)
        }, 300)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 영상 자동 재생
  useEffect(() => {
    if (!isLoading && isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true)
      })
    }
  }, [isLoading, isPlaying, currentStage])

  // 영상 에러 시 3초 후 다음으로
  useEffect(() => {
    if (videoError) {
      const timer = setTimeout(() => {
        handleVideoEnded()
        setVideoError(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [videoError])

  // 영상 종료 시 다음 영상으로
  const handleVideoEnded = () => {
    if (currentStage < STAGE_VIDEOS.length - 1) {
      // 다음 영상으로
      setCurrentStage(prev => prev + 1)
      setIsPlaying(true)
    } else {
      // 모든 영상 완료
      setIsPlaying(false)
      setIsCompleted(true)
    }
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleRestart = () => {
    setCurrentStage(0)
    setIsCompleted(false)
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const handleSkipToNext = () => {
    if (currentStage < STAGE_VIDEOS.length - 1) {
      setCurrentStage(prev => prev + 1)
      setIsPlaying(true)
    }
  }

  const handleChapterClick = (index: number) => {
    setCurrentStage(index)
    setIsCompleted(false)
    setIsPlaying(true)
  }

  const handleSaveToBookshelf = () => {
    setShowCelebration(true)
    setSaved(true)

    setTimeout(() => {
      onNavigate('bookshelf')
    }, 2000)
  }

  return (
    <div className="video-page">
      {/* 배경 구름 */}
      <div className="video-page__bg-decorations">
        <div className="video-page__cloud video-page__cloud--1"></div>
        <div className="video-page__cloud video-page__cloud--2"></div>
        <div className="video-page__cloud video-page__cloud--3"></div>
      </div>

      {/* 헤더 - 가운데 로고, 왼쪽 뒤로가기, 오른쪽 메뉴 */}
      <header className="video-page__header">
        <div className="video-page__header-left">
          <button onClick={onGoBack} className="video-page__back-btn">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="video-page__header-center">
          <button onClick={() => onNavigate('home')} className="video-page__logo-btn">
            <img
              src="/src/assets/images/logo.png"
              alt="아이토리"
              className="video-page__logo-img"
            />
          </button>
        </div>

        <div className="video-page__header-right">
          <button onClick={onMenuClick} className="video-page__menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* 축하 팝업 */}
      {showCelebration && (
        <div className="video-page__celebration-overlay">
          <div className="video-page__celebration-modal">
            <div className="video-page__celebration-emoji">🎉</div>
            <h2 className="video-page__celebration-title">동화 완성!</h2>
            <p className="video-page__celebration-subtitle">내 책장으로 이동합니다...</p>
            <div className="video-page__celebration-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <main className="video-page__main">
        {/* 타이틀 배너 */}
        <div className="video-page__title-banner">
          <div className="video-page__title-icon">🎬</div>
          <div className="video-page__title-content">
            <h1 className="video-page__title">
              {isLoading ? '동화 준비 중...' : isCompleted ? '동화 완성! 🎉' : `${selectedTale?.title || '나만의 동화'}`}
            </h1>
            <p className="video-page__subtitle">
              {isLoading
                ? '영상을 불러오고 있어요...'
                : isCompleted
                  ? '세상에 하나뿐인 나만의 동화가 완성됐어요!'
                  : `${CHAPTERS[currentStage]} 재생 중...`
              }
            </p>
          </div>
        </div>

        {/* 로딩 화면 */}
        {isLoading && (
          <div className="video-page__loading-container">
            <div className="video-page__loading-content">
              <div className="video-page__loading-emoji">🎬</div>
              <h3 className="video-page__loading-title">동화 영상 준비 중...</h3>
              <div className="video-page__loading-bar">
                <div className="video-page__loading-fill" style={{ width: `${loadingProgress}%` }}></div>
              </div>
              <p className="video-page__loading-percent">{loadingProgress}%</p>
            </div>
          </div>
        )}

        {/* 비디오 플레이어 */}
        {!isLoading && (
          <>
            <div className="video-page__player-wrapper">
              <div className="video-page__player">
                {!isCompleted ? (
                  <>
                    <video
                      ref={videoRef}
                      src={STAGE_VIDEOS[currentStage]}
                      className="video-page__video"
                      muted={isMuted}
                      playsInline
                      onEnded={handleVideoEnded}
                      onError={handleVideoError}
                    />

                    {/* 영상 에러 오버레이 */}
                    {videoError && (
                      <div className="video-page__error-overlay">
                        <div className="video-page__error-emoji">😢</div>
                        <p>영상을 불러올 수 없습니다</p>
                        <p className="video-page__error-sub">다음 영상으로 넘어갑니다...</p>
                      </div>
                    )}

                    {/* 재생 버튼 오버레이 */}
                    {!isPlaying && !videoError && (
                      <button
                        className="video-page__play-overlay"
                        onClick={handlePlayPause}
                      >
                        <Play size={48} />
                      </button>
                    )}
                  </>
                ) : (
                  /* 완료 화면 */
                  <div className="video-page__complete-screen">
                    <div className="video-page__complete-emoji">🎊</div>
                    <h2 className="video-page__complete-title">모든 영상 재생 완료!</h2>
                    <p className="video-page__complete-subtitle">나만의 동화가 완성되었어요</p>
                    <button onClick={handleRestart} className="video-page__restart-btn">
                      <RotateCcw size={20} /> 처음부터 다시 보기
                    </button>
                  </div>
                )}
              </div>

              {/* 컨트롤 바 */}
              {!isCompleted && (
                <div className="video-page__controls">
                  <button
                    className="video-page__control-btn"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                  </button>

                  <button
                    className="video-page__control-btn"
                    onClick={handleRestart}
                    title="처음부터"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <div className="video-page__progress-wrapper">
                    <div className="video-page__progress">
                      <div
                        className="video-page__progress-fill"
                        style={{ width: `${((currentStage + 1) / STAGE_VIDEOS.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="video-page__time">
                      {CHAPTERS[currentStage]} ({currentStage + 1}/{STAGE_VIDEOS.length})
                    </span>
                  </div>

                  <button
                    className="video-page__control-btn"
                    onClick={handleSkipToNext}
                    disabled={currentStage >= STAGE_VIDEOS.length - 1}
                    title="다음 영상"
                  >
                    <SkipForward size={20} />
                  </button>

                  <button
                    className="video-page__control-btn"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              )}

              {/* 챕터 버튼 */}
              <div className="video-page__chapters">
                {CHAPTERS.map((chapter, index) => (
                  <button
                    key={chapter}
                    className={`video-page__chapter-btn ${currentStage === index ? 'active' : ''} ${currentStage > index || isCompleted ? 'completed' : ''}`}
                    onClick={() => handleChapterClick(index)}
                  >
                    <span className="video-page__chapter-num">{index + 1}</span>
                    <span className="video-page__chapter-name">{chapter}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 액션 버튼들 - 완료 시에만 표시 */}
            {isCompleted && (
              <div className="video-page__actions">
                <button className="video-page__action-btn video-page__action-btn--download">
                  <Download size={22} />
                  <span>다운로드</span>
                </button>
                <button
                  onClick={handleSaveToBookshelf}
                  disabled={saved}
                  className={`video-page__action-btn video-page__action-btn--save ${saved ? 'saved' : ''}`}
                >
                  <BookOpen size={22} />
                  <span>{saved ? '저장 완료!' : '내 책장에 저장'}</span>
                </button>
                <button
                  onClick={() => onNavigate('bookclub-upload')}
                  className="video-page__action-btn video-page__action-btn--share"
                >
                  <Share2 size={22} />
                  <span>북클럽에 공유</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 하단 풍경 장식 */}
      <div className="video-page__landscape">
        <div className="video-page__grass"></div>
        <div className="video-page__tree video-page__tree--1"></div>
        <div className="video-page__tree video-page__tree--2"></div>
        <div className="video-page__house">
          <div className="video-page__house-window video-page__house-window--left"></div>
          <div className="video-page__house-window video-page__house-window--right"></div>
        </div>
        <div className="video-page__bush video-page__bush--1"></div>
        <div className="video-page__bush video-page__bush--2"></div>
        <div className="video-page__bush video-page__bush--3"></div>
        <div className="video-page__flower video-page__flower--1"></div>
        <div className="video-page__flower video-page__flower--2"></div>
        <div className="video-page__flower video-page__flower--3"></div>
      </div>
    </div>
  )
}