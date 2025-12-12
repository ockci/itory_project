import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Check, Edit3, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { PageType, Tale, ArtStyle } from '../../App'
import SimpleHeader from '../../components/common/SimpleHeader'
import '../../styles/pages/EditStoryPage.css'

interface EditStoryPageProps {
  onNavigate: (page: PageType) => void
  selectedTale: Tale | null
  selectedStyle: ArtStyle | null
  onGoBack: () => void
  onMenuClick: () => void
}

// 단계 정의
const STAGES = [
  { id: 'intro', name: '발단', step: 1, hasChoices: false },
  { id: 'development', name: '전개', step: 2, hasChoices: true },
  { id: 'crisis', name: '위기', step: 3, hasChoices: true },
  { id: 'climax', name: '절정', step: 4, hasChoices: true },
  { id: 'ending', name: '결말', step: 5, hasChoices: true }
]

// 하드코딩된 영상 경로 (public/videos/ 폴더)
const STAGE_VIDEOS: { [key: string]: string } = {
  intro: '/videos/stage1_intro.mp4',
  development: '/videos/stage2_development.mp4',
  crisis: '/videos/stage3_crisis.mp4',
  climax: '/videos/stage4_climax.mp4',
  ending: '/videos/stage5_ending.mp4'
}

// 하드코딩된 각 단계별 스토리 텍스트
const STAGE_STORIES: { [key: string]: string } = {
  intro: '옛날 옛날 어느 마을에 착하고 성실한 주인공이 살았어요. 어느 날, 평화롭던 마을에 신비로운 일이 일어나기 시작했답니다...',
  development: '주인공은 신비한 것을 발견하고 모험을 시작했어요!',
  crisis: '갑자기 위기가 찾아왔어요! 어떻게 해결할 수 있을까요?',
  climax: '결정적인 순간! 주인공은 용기를 내어 문제를 해결했어요!',
  ending: '모두가 행복해지는 결말이에요! 해피엔딩!'
}

// 하드코딩된 선택지 데이터
const stageChoices: { [key: string]: { question: string; choices: { id: string; icon: string; title: string; desc: string; story: string }[] } } = {
  development: {
    question: '흥부에게 어떤 일이 일어났을까요?',
    choices: [
      {
        id: 'A',
        icon: '✨',
        title: '마법의 돌을 받았어요',
        desc: '말하는 제비가 선물을 줬어요',
        story: '힘들지만 착한 성품으로 묵묵히 밭을 일구며 하루하루를 살아간다. 어느 날, 흥부 앞에 말하는 제비가 나타난다. 제비는 배가 너무 고프다며 도움을 청하고, 흥부는 자기 점심을 나눠준다. 감동한 제비는 흥부에게 빛나는 마법의 돌을 건네는데, "이 돌은 세 가지 소원을 들어준다"는 비밀을 알려준다.'
      },
      {
        id: 'B',
        icon: '🌱',
        title: '신비한 박씨를 받았어요',
        desc: '다친 제비를 도와줬더니 선물을 받았어요',
        story: '흥부는 힘든 상황에서도 마을 사람들을 도우며 지낸다. 어느 날, 다리가 부러진 제비 한 마리를 발견한다. 흥부는 정성껏 제비의 다리를 치료해주고 돌봐준다. 봄이 되어 제비가 떠날 때, 제비는 감사의 표시로 박씨 하나를 남긴다. 흥부가 박씨를 심자, 거대한 박이 자라났다.'
      }
    ]
  },
  crisis: {
    question: '욕심쟁이 놀부는 어떻게 했을까요?',
    choices: [
      {
        id: 'A',
        icon: '😤',
        title: '제비에게 돌을 달라고 했어요',
        desc: '놀부도 마법의 돌을 원했어요',
        story: '흥부는 돌의 힘으로 그동안 이루지 못했던 소박한 소원들을 마법의 돌에 말하게 된다. 그 결과 흥부는 마을에서 가장 풍족한 사람이 된다. 이 소식을 들은 놀부는 욕심이 생기기 시작했다. 놀부는 제비를 찾아가 "나에게도 마법의 돌을 줘!"라고 화를 낸다. 제비는 어쩔 수 없이 놀부에게 돌을 주지만, 이 돌은 사용자의 성품에 따라 효과가 달라지는 돌이었다.'
      },
      {
        id: 'B',
        icon: '🦅',
        title: '제비 다리를 일부러 부러뜨렸어요',
        desc: '놀부도 박씨를 받고 싶었어요',
        story: '흥부가 박을 타자, 박 속에서 금은보화가 쏟아져 나왔다. 흥부네 가족은 단숨에 부자가 되어 행복하게 살게 된다. 이 소식을 들은 놀부는 시기심에 불타올랐다. 놀부는 일부러 제비 다리를 부러뜨리고 치료해주는 척했다. 다음 해 봄, 놀부도 제비에게서 박씨를 받았다.'
      }
    ]
  },
  climax: {
    question: '놀부에게 어떤 일이 벌어졌을까요?',
    choices: [
      {
        id: 'A',
        icon: '👹',
        title: '염라대왕이 나타났어요',
        desc: '욕심 때문에 벌을 받았어요',
        story: '욕심 많은 놀부는 소원으로 흥부보다 더 부자가 되게 해달라고 말했다. 하지만 놀부가 소원을 말하자마자 땅이 갈라지더니 염라대왕이 나와서 소리쳤다. "네 이놈 놀부야!! 네가 기어이 나를 불러내 화를 입는구나!!!" 하며 놀부의 재산을 전부 몰수해갔다. 놀부는 땅을 치며 후회한다.'
      },
      {
        id: 'B',
        icon: '👻',
        title: '도깨비들이 나타났어요',
        desc: '박 속에서 무서운 것들이 나왔어요',
        story: '놀부가 설레는 마음으로 박을 타기 시작했다. 하지만 박 속에서는 금은보화 대신 도깨비들이 튀어나왔다! 도깨비들은 "욕심쟁이 놀부야! 벌을 받아라!" 하며 놀부의 재산을 모두 가져가 버렸다. 놀부는 순식간에 빈털터리가 되어 거리에 나앉게 되었다.'
      }
    ]
  },
  ending: {
    question: '이야기는 어떻게 끝이 났을까요?',
    choices: [
      {
        id: 'A',
        icon: '🤝',
        title: '흥부가 놀부를 용서했어요',
        desc: '형제는 다시 화해했어요',
        story: '모든 것을 잃고 후회하는 놀부에게 흥부는 분노 대신 따뜻한 손을 내민다. 흥부는 놀부를 용서하고 두 형제는 다시 함께 지내기로 한다. 마지막에는 우애가 돈보다 더 큰 보물이라는 메시지가 잔잔하게 남는다.'
      },
      {
        id: 'B',
        icon: '💕',
        title: '놀부가 진심으로 사과했어요',
        desc: '놀부는 착한 사람이 되었어요',
        story: '모든 것을 잃고 길거리를 헤매던 놀부를 흥부가 찾아온다. 흥부는 형의 잘못을 탓하지 않고 따뜻하게 맞아들인다. 놀부는 눈물을 흘리며 진심으로 사과하고, 두 형제는 화해한다. 이후 놀부는 마음을 고쳐먹고 착하게 살았다는 이야기로 끝난다.'
      }
    ]
  }
}

// localStorage 키
const STORAGE_KEY = 'itory_edit_story_state'

export default function EditStoryPage({
  onNavigate,
  selectedTale: _selectedTale,
  selectedStyle: _selectedStyle,
  onGoBack,
  onMenuClick
}: EditStoryPageProps) {
  void _selectedTale
  void _selectedStyle

  const [currentStage, setCurrentStage] = useState(0)
  const [selections, setSelections] = useState<{ [key: string]: { id: string; text: string }[] }>({})
  const [customInput, setCustomInput] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoCompleted, setIsVideoCompleted] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [showStageResult, setShowStageResult] = useState(false)

  const currentStageData = STAGES[currentStage]
  const currentStageId = currentStageData?.id
  const currentChoiceData = stageChoices[currentStageId]
  const currentSelections = selections[currentStageId] || []

  // 컴포넌트 마운트 시 이전 상태 초기화 (새로 시작할 때 항상 처음부터)
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    const state = {
      currentStage,
      selections,
      showStageResult
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [currentStage, selections, showStageResult])

  // 3초 로딩 효과
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0)
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + (100 / 30)
        })
      }, 100)

      const timer = setTimeout(() => {
        setIsLoading(false)
        setIsVideoPlaying(true)
      }, 3000)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [isLoading])

  // 영상 재생 시작 시 자동 재생
  useEffect(() => {
    if (isVideoPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true)
      })
    }
  }, [isVideoPlaying])

  // 영상 에러 시 3초 후 자동 완료 처리
  useEffect(() => {
    if (videoError) {
      const timer = setTimeout(() => {
        setIsVideoPlaying(false)
        setIsVideoCompleted(true)
        setVideoError(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [videoError])

  const handleVideoEnded = () => {
    setIsVideoPlaying(false)
    setIsVideoCompleted(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleNextStage = () => {
    if (currentStage === 0) {
      setCurrentStage(1)
      setIsVideoCompleted(false)
      setShowStageResult(false)
    } else if (currentStage === STAGES.length - 1) {
      localStorage.removeItem(STORAGE_KEY)
      onNavigate('video')
    } else {
      setCurrentStage(prev => prev + 1)
      setShowStageResult(false)
      setIsVideoCompleted(false)
    }
  }

  const handleGoBack = () => {
    if (showStageResult) {
      setShowStageResult(false)
      setIsLoading(false)
      setIsVideoPlaying(false)
      setIsVideoCompleted(false)
      setSelections(prev => {
        const newSelections = { ...prev }
        delete newSelections[currentStageId]
        return newSelections
      })
    } else if (currentStage > 0) {
      const prevStage = currentStage - 1
      setCurrentStage(prevStage)
      if (prevStage === 0) {
        setIsVideoCompleted(true)
      } else {
        setShowStageResult(true)
        setIsVideoCompleted(true)
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
      onGoBack()
    }
  }

  const handleChoiceSelect = (choiceId: string, choiceStory: string) => {
    setSelections(prev => ({
      ...prev,
      [currentStageId]: [{ id: choiceId, text: choiceStory }]
    }))
    setShowStageResult(true)
    setIsLoading(true)
    setIsVideoPlaying(false)
    setIsVideoCompleted(false)
    setVideoError(false)
  }

  const handleCustomSubmit = () => {
    if (!customInput.trim()) return

    setSelections(prev => ({
      ...prev,
      [currentStageId]: [{ id: 'custom', text: customInput.trim() }]
    }))
    setCustomInput('')
    setIsCustomMode(false)
    setShowStageResult(true)
    setIsLoading(true)
    setIsVideoPlaying(false)
    setIsVideoCompleted(false)
    setVideoError(false)
  }

  const handleReplay = () => {
    setIsVideoPlaying(true)
    setIsVideoCompleted(false)
    setVideoError(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => setVideoError(true))
    }
  }

  // ============================================
  // 1. 발단 화면
  // ============================================
  if (currentStage === 0) {
    return (
      <div className="edit-story-page">
        <div className="edit-story-page__bg-decorations">
          <div className="edit-story-page__cloud edit-story-page__cloud--1"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--2"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--3"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--4"></div>
        </div>

        <SimpleHeader
          onNavigate={onNavigate}
          onGoBack={handleGoBack}
          onMenuClick={onMenuClick}
          showCenterLogo={true}
          isFixed={true}
        />

        <main className="edit-story-page__main edit-story-page__main--fullscreen">
          <div className="edit-story-page__mini-progress">
            {STAGES.map((s, index) => (
              <div key={index} className={`edit-story-page__mini-step ${index === 0 ? 'active' : ''}`}>
                <div className="edit-story-page__mini-dot"></div>
                <span className="edit-story-page__mini-label">{s.name}</span>
              </div>
            ))}
          </div>

          <div className="edit-story-page__content-frame">
            {isLoading ? (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__loading-emoji">🎬</div>
                <p className="edit-story-page__loading-title">동화가 생성 중입니다...</p>
                <div className="edit-story-page__loading-bar">
                  <div
                    className="edit-story-page__loading-fill"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="edit-story-page__loading-percent">{Math.round(loadingProgress)}%</p>
              </div>
            ) : isVideoPlaying ? (
              <div className="edit-story-page__video-wrapper">
                <video
                  ref={videoRef}
                  src={STAGE_VIDEOS.intro}
                  className="edit-story-page__video-player"
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  playsInline
                  muted={isMuted}
                  autoPlay
                  preload="auto"
                />
                <button
                  onClick={toggleMute}
                  className="edit-story-page__mute-btn"
                  aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                {videoError && (
                  <div className="edit-story-page__video-error">
                    <p className="edit-story-page__error-emoji">😢</p>
                    <p>영상을 불러올 수 없습니다</p>
                    <p className="edit-story-page__error-sub">잠시 후 자동으로 넘어갑니다...</p>
                  </div>
                )}
              </div>
            ) : isVideoCompleted ? (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__complete-emoji">✨</div>
                <p className="edit-story-page__complete-title">발단 완료!</p>
                <button onClick={handleReplay} className="edit-story-page__replay-btn">
                  <RotateCcw size={18} />
                  다시 보기
                </button>
              </div>
            ) : (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__loading-emoji">🎥</div>
                <p className="edit-story-page__loading-title">영상 준비 완료!</p>
              </div>
            )}
          </div>

          {(isVideoPlaying || isVideoCompleted) && (
            <div className="edit-story-page__story-text">
              <span className="edit-story-page__story-label">📖 발단</span>
              <p>{STAGE_STORIES.intro}</p>
            </div>
          )}

          {isVideoCompleted && (
            <div className="edit-story-page__bottom-action">
              <button onClick={handleNextStage} className="edit-story-page__big-btn">
                전개로 가기 - 선택 시작!
                <ChevronRight size={28} />
              </button>
            </div>
          )}
        </main>

        <div className="edit-story-page__landscape">
          <div className="edit-story-page__grass"></div>
          <div className="edit-story-page__tree edit-story-page__tree--1"></div>
          <div className="edit-story-page__tree edit-story-page__tree--2"></div>
          <div className="edit-story-page__tree edit-story-page__tree--3"></div>
          <div className="edit-story-page__house">
            <div className="edit-story-page__house-window edit-story-page__house-window--left"></div>
            <div className="edit-story-page__house-window edit-story-page__house-window--right"></div>
          </div>
          <div className="edit-story-page__bush edit-story-page__bush--1"></div>
          <div className="edit-story-page__bush edit-story-page__bush--2"></div>
          <div className="edit-story-page__bush edit-story-page__bush--3"></div>
          <div className="edit-story-page__bush edit-story-page__bush--4"></div>
          <div className="edit-story-page__flower edit-story-page__flower--1"></div>
          <div className="edit-story-page__flower edit-story-page__flower--2"></div>
          <div className="edit-story-page__flower edit-story-page__flower--3"></div>
          <div className="edit-story-page__flower edit-story-page__flower--4"></div>
        </div>
      </div>
    )
  }

  // ============================================
  // 2. 단계 결과 화면
  // ============================================
  if (showStageResult) {
    return (
      <div className="edit-story-page">
        <div className="edit-story-page__bg-decorations">
          <div className="edit-story-page__cloud edit-story-page__cloud--1"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--2"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--3"></div>
          <div className="edit-story-page__cloud edit-story-page__cloud--4"></div>
        </div>

        <SimpleHeader
          onNavigate={onNavigate}
          onGoBack={handleGoBack}
          onMenuClick={onMenuClick}
          showCenterLogo={true}
          isFixed={true}
        />

        <main className="edit-story-page__main edit-story-page__main--fullscreen">
          <div className="edit-story-page__mini-progress">
            {STAGES.map((s, index) => (
              <div key={index} className={`edit-story-page__mini-step ${index === currentStage ? 'active' : index < currentStage ? 'completed' : ''}`}>
                <div className="edit-story-page__mini-dot">
                  {index < currentStage && <Check size={12} />}
                </div>
                <span className="edit-story-page__mini-label">{s.name}</span>
              </div>
            ))}
          </div>

          <div className="edit-story-page__content-frame">
            {isLoading ? (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__loading-emoji">🎨</div>
                <p className="edit-story-page__loading-title">동화가 생성 중입니다...</p>
                <div className="edit-story-page__loading-bar">
                  <div
                    className="edit-story-page__loading-fill"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="edit-story-page__loading-percent">{Math.round(loadingProgress)}%</p>
              </div>
            ) : isVideoPlaying ? (
              <div className="edit-story-page__video-wrapper">
                <video
                  ref={videoRef}
                  src={`${STAGE_VIDEOS[currentStageId]}?v=${Date.now()}`}
                  className="edit-story-page__video-player"
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  playsInline
                  muted={isMuted}
                  autoPlay
                  preload="auto"
                />
                <button
                  onClick={toggleMute}
                  className="edit-story-page__mute-btn"
                  aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                {videoError && (
                  <div className="edit-story-page__video-error">
                    <p className="edit-story-page__error-emoji">😢</p>
                    <p>영상을 불러올 수 없습니다</p>
                    <p className="edit-story-page__error-sub">잠시 후 자동으로 넘어갑니다...</p>
                  </div>
                )}
              </div>
            ) : isVideoCompleted ? (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__complete-emoji">✨</div>
                <p className="edit-story-page__complete-title">{currentStageData.name} 완료!</p>
                <button onClick={handleReplay} className="edit-story-page__replay-btn">
                  <RotateCcw size={18} />
                  다시 보기
                </button>
              </div>
            ) : (
              <div className="edit-story-page__center-content">
                <div className="edit-story-page__loading-emoji">🎥</div>
                <p className="edit-story-page__loading-title">{currentStageData.name} 영상 준비 완료!</p>
              </div>
            )}
          </div>

          <div className="edit-story-page__story-text">
            <span className="edit-story-page__story-label">📖 {currentStageData.name}</span>
            <p>{currentSelections[0]?.text || STAGE_STORIES[currentStageId]}</p>
          </div>

          {isVideoCompleted && (
            <div className="edit-story-page__bottom-action">
              <button onClick={handleNextStage} className="edit-story-page__big-btn">
                {currentStage === STAGES.length - 1 ? '동화 영상 보기 🎉' : `${STAGES[currentStage + 1].name}으로 가기`}
                <ChevronRight size={28} />
              </button>
            </div>
          )}
        </main>

        <div className="edit-story-page__landscape">
          <div className="edit-story-page__grass"></div>
          <div className="edit-story-page__tree edit-story-page__tree--1"></div>
          <div className="edit-story-page__tree edit-story-page__tree--2"></div>
          <div className="edit-story-page__tree edit-story-page__tree--3"></div>
          <div className="edit-story-page__house">
            <div className="edit-story-page__house-window edit-story-page__house-window--left"></div>
            <div className="edit-story-page__house-window edit-story-page__house-window--right"></div>
          </div>
          <div className="edit-story-page__bush edit-story-page__bush--1"></div>
          <div className="edit-story-page__bush edit-story-page__bush--2"></div>
          <div className="edit-story-page__bush edit-story-page__bush--3"></div>
          <div className="edit-story-page__bush edit-story-page__bush--4"></div>
          <div className="edit-story-page__flower edit-story-page__flower--1"></div>
          <div className="edit-story-page__flower edit-story-page__flower--2"></div>
          <div className="edit-story-page__flower edit-story-page__flower--3"></div>
          <div className="edit-story-page__flower edit-story-page__flower--4"></div>
        </div>
      </div>
    )
  }

  // ============================================
  // 3. 선택지 화면
  // ============================================
  return (
    <div className="edit-story-page">
      <div className="edit-story-page__bg-decorations">
        <div className="edit-story-page__cloud edit-story-page__cloud--1"></div>
        <div className="edit-story-page__cloud edit-story-page__cloud--2"></div>
        <div className="edit-story-page__cloud edit-story-page__cloud--3"></div>
        <div className="edit-story-page__cloud edit-story-page__cloud--4"></div>
      </div>

      <SimpleHeader
        onNavigate={onNavigate}
        onGoBack={handleGoBack}
        onMenuClick={onMenuClick}
        showCenterLogo={true}
        isFixed={true}
      />

      <main className="edit-story-page__main edit-story-page__main--fullscreen">
        <div className="edit-story-page__mini-progress">
          {STAGES.map((s, index) => (
            <div key={index} className={`edit-story-page__mini-step ${index === currentStage ? 'active' : index < currentStage ? 'completed' : ''}`}>
              <div className="edit-story-page__mini-dot">
                {index < currentStage && <Check size={12} />}
              </div>
              <span className="edit-story-page__mini-label">{s.name}</span>
            </div>
          ))}
        </div>

        <div className="edit-story-page__question-card">
          <h2 className="edit-story-page__stage-title">{currentStageData.name}</h2>
          <p className="edit-story-page__question-text">💭 {currentChoiceData?.question || '다음 이야기를 선택해주세요:'}</p>
        </div>

        {!isCustomMode ? (
          <div className="edit-story-page__choice-area">
            <div className="edit-story-page__choice-grid">
              {currentChoiceData?.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(choice.id, choice.story)}
                  className="edit-story-page__choice-card"
                >
                  <div className="edit-story-page__choice-icon">{choice.icon}</div>
                  <h3 className="edit-story-page__choice-title">{choice.title}</h3>
                  <p className="edit-story-page__choice-desc">{choice.desc}</p>
                </button>
              ))}
            </div>

            <button onClick={() => setIsCustomMode(true)} className="edit-story-page__custom-btn">
              <Edit3 size={20} />
              <span>직접 쓰기</span>
            </button>
          </div>
        ) : (
          <div className="edit-story-page__custom-area">
            <div className="edit-story-page__custom-card">
              <h3 className="edit-story-page__custom-title">
                <Edit3 size={20} />
                직접 쓰기
              </h3>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="나만의 이야기를 적어보세요! (예: 마법의 꽃이 피었어요)"
                className="edit-story-page__custom-input"
              />
              <div className="edit-story-page__custom-actions">
                <button
                  onClick={() => { setIsCustomMode(false); setCustomInput('') }}
                  className="edit-story-page__custom-cancel"
                >
                  취소
                </button>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customInput.trim()}
                  className="edit-story-page__custom-submit"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="edit-story-page__landscape">
        <div className="edit-story-page__grass"></div>
        <div className="edit-story-page__tree edit-story-page__tree--1"></div>
        <div className="edit-story-page__tree edit-story-page__tree--2"></div>
        <div className="edit-story-page__tree edit-story-page__tree--3"></div>
        <div className="edit-story-page__house">
          <div className="edit-story-page__house-window edit-story-page__house-window--left"></div>
          <div className="edit-story-page__house-window edit-story-page__house-window--right"></div>
        </div>
        <div className="edit-story-page__bush edit-story-page__bush--1"></div>
        <div className="edit-story-page__bush edit-story-page__bush--2"></div>
        <div className="edit-story-page__bush edit-story-page__bush--3"></div>
        <div className="edit-story-page__bush edit-story-page__bush--4"></div>
        <div className="edit-story-page__flower edit-story-page__flower--1"></div>
        <div className="edit-story-page__flower edit-story-page__flower--2"></div>
        <div className="edit-story-page__flower edit-story-page__flower--3"></div>
        <div className="edit-story-page__flower edit-story-page__flower--4"></div>
      </div>
    </div>
  )
}