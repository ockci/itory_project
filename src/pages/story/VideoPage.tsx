import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Download, BookOpen, Share2, RotateCcw } from 'lucide-react'
import { PageType, Tale } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/VideoPage.css'

interface VideoPageProps {
  onNavigate: (page: PageType) => void
  selectedTale: Tale | null
  onGoBack: () => void
  onMenuClick: () => void
}

export default function VideoPage({
  onNavigate,
  selectedTale,
  onGoBack,
  onMenuClick
}: VideoPageProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentStage, setCurrentStage] = useState(0) // 0: 로딩, 1: 발단, 2: 전개, 3: 위기, 4: 절정, 5: 결말
  const [isLoading, setIsLoading] = useState(true)
  const [showChoices, setShowChoices] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const chapters = ['발단', '전개', '위기', '절정', '결말']

  // 하드코딩된 영상 경로 (assets/videos 폴더에 저장 예정)
  const videoStages = [
    '/assets/videos/stage1-intro.mp4',    // 발단
    '/assets/videos/stage2-develop.mp4',  // 전개
    '/assets/videos/stage3-crisis.mp4',   // 위기
    '/assets/videos/stage4-climax.mp4',   // 절정
    '/assets/videos/stage5-ending.mp4'    // 결말
  ]

  // 각 단계별 선택지 (발단, 전개, 위기, 절정에만 선택지 표시)
  const stageChoices = [
    ['숲 속으로 들어간다 🌲', '마을로 돌아간다 🏘️'],
    ['용감하게 맞선다 ⚔️', '도망친다 🏃'],
    ['친구를 부른다 📢', '혼자 해결한다 💪'],
    ['마법을 사용한다 ✨', '지혜를 사용한다 🧠']
  ]

  // 초기 로딩 (3초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setCurrentStage(1) // 발단 시작
      setIsPlaying(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // 비디오 자동 재생
  useEffect(() => {
    if (videoRef.current && currentStage > 0 && isPlaying) {
      videoRef.current.play()
    }
  }, [currentStage, isPlaying])

  // 비디오 재생 종료 시 선택지 표시
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setIsPlaying(false)
      if (currentStage < 5) {
        setShowChoices(true)
      }
    }

    video.addEventListener('ended', handleVideoEnd)
    return () => video.removeEventListener('ended', handleVideoEnd)
  }, [currentStage])

  const handleChoice = (choiceIndex: number) => {
    console.log(`${chapters[currentStage - 1]} 단계 선택: ${stageChoices[currentStage - 1][choiceIndex]}`)
    setShowChoices(false)
    setCurrentStage(prev => prev + 1)
    setIsPlaying(true)
  }

  const handleSaveToBookshelf = () => {
    setShowCelebration(true)
    setSaved(true)

    setTimeout(() => {
      onNavigate('bookshelf')
    }, 2000)
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
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="video-page">
      {/* 배경 구름 */}
      <div className="video-page__bg-decorations">
        <div className="video-page__cloud video-page__cloud--1"></div>
        <div className="video-page__cloud video-page__cloud--2"></div>
        <div className="video-page__cloud video-page__cloud--3"></div>
      </div>

      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        onMenuClick={onMenuClick}
      />

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
              {isLoading ? '동화 생성 중...' : `${selectedTale?.title || '나만의 동화'} 완성!`}
            </h1>
            <p className="video-page__subtitle">
              {isLoading
                ? '조금만 기다려주세요...'
                : '세상에 하나뿐인 나만의 동화가 완성됐어요!'
              }
            </p>
          </div>
        </div>

        {/* 로딩 화면 */}
        {isLoading && (
          <div className="video-page__loading-container">
            <div className="video-page__loading-spinner">
              <div className="video-page__loading-emoji">✨</div>
              <div className="video-page__loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="video-page__loading-text">동화를 만들고 있어요...</p>
            </div>
          </div>
        )}

        {/* 비디오 플레이어 */}
        {!isLoading && (
          <>
            <div className="video-page__player-wrapper">
              <div className="video-page__player">
                <video
                  ref={videoRef}
                  src={videoStages[currentStage - 1]}
                  className="video-page__video"
                  muted={isMuted}
                  playsInline
                />

                {/* 재생 버튼 오버레이 */}
                {!isPlaying && !showChoices && (
                  <button
                    className="video-page__play-overlay"
                    onClick={handlePlayPause}
                  >
                    <Play size={48} />
                  </button>
                )}
              </div>

              {/* 선택지 오버레이 */}
              {showChoices && currentStage < 5 && (
                <div className="video-page__choices-overlay">
                  <div className="video-page__choices-container">
                    <h3 className="video-page__choices-title">
                      다음 이야기를 선택해주세요! 🌟
                    </h3>
                    <div className="video-page__choices">
                      {stageChoices[currentStage - 1].map((choice, index) => (
                        <button
                          key={index}
                          className="video-page__choice-btn"
                          onClick={() => handleChoice(index)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 컨트롤 바 */}
              <div className="video-page__controls">
                <button
                  className="video-page__control-btn"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                </button>

                <button
                  className="video-page__control-btn video-page__control-btn--restart"
                  onClick={handleRestart}
                >
                  <RotateCcw size={18} />
                </button>

                <div className="video-page__progress-wrapper">
                  <div className="video-page__progress">
                    <div className="video-page__progress-fill" style={{ width: '35%' }}></div>
                    <div className="video-page__progress-handle" style={{ left: '35%' }}></div>
                  </div>
                  <span className="video-page__time">
                    {currentStage > 0 ? `${chapters[currentStage - 1]}` : '준비 중'}
                  </span>
                </div>

                <button
                  className="video-page__control-btn"
                  onClick={handleMuteToggle}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              {/* 챕터 버튼 */}
              <div className="video-page__chapters">
                {chapters.map((chapter, index) => (
                  <button
                    key={index}
                    className={`video-page__chapter-btn ${currentStage === index + 1 ? 'active' : ''
                      } ${currentStage > index + 1 ? 'completed' : ''}`}
                    disabled={currentStage <= index}
                  >
                    <span className="video-page__chapter-num">{index + 1}</span>
                    <span className="video-page__chapter-name">{chapter}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 액션 버튼들 */}
            {currentStage === 5 && !isPlaying && (
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