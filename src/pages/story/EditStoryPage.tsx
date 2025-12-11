import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Check, Edit3, RotateCcw } from 'lucide-react'
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
const stageChoices: { [key: string]: { question: string; choices: { id: string; icon: string; title: string; desc: string }[] } } = {
  development: {
    question: '주인공에게 어떤 일이 일어났나요?',
    choices: [
      { id: 'A', icon: '🌟', title: '신비한 것을 발견했어요', desc: '반짝이는 무언가를 찾았어요' },
      { id: 'B', icon: '🤝', title: '새로운 친구를 만났어요', desc: '특별한 만남이 시작됐어요' }
    ]
  },
  crisis: {
    question: '어떤 위기가 찾아왔나요?',
    choices: [
      { id: 'A', icon: '😤', title: '나쁜 사람이 나타났어요', desc: '욕심쟁이가 나타났어요' },
      { id: 'B', icon: '🌪️', title: '어려운 상황이 생겼어요', desc: '예상치 못한 문제 발생' }
    ]
  },
  climax: {
    question: '결정적인 순간! 어떻게 해결했나요?',
    choices: [
      { id: 'A', icon: '💪', title: '용기를 내서 해결했어요', desc: '두려움을 이겨냈어요' },
      { id: 'B', icon: '🤝', title: '함께 힘을 모았어요', desc: '친구들과 협력했어요' }
    ]
  },
  ending: {
    question: '이야기는 어떻게 끝이 났나요?',
    choices: [
      { id: 'A', icon: '👨‍👩‍👧‍👦', title: '모두 행복해졌어요', desc: '해피엔딩!' },
      { id: 'B', icon: '🌈', title: '더 좋은 세상이 됐어요', desc: '모두가 웃는 결말' }
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
  const videoRef = useRef<HTMLVideoElement>(null)

  const [showStageResult, setShowStageResult] = useState(false)

  const currentStageData = STAGES[currentStage]
  const currentStageId = currentStageData?.id
  const currentChoiceData = stageChoices[currentStageId]
  const currentSelections = selections[currentStageId] || []

  // 새로고침 시 상태 복원
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setCurrentStage(state.currentStage || 0)
        setSelections(state.selections || {})
        setShowStageResult(state.showStageResult || false)

        if (state.currentStage > 0 || state.showStageResult) {
          setIsLoading(false)
          setIsVideoCompleted(true)
        }
      } catch (e) {
        console.error('상태 복원 실패:', e)
      }
    }
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

  const handleChoiceSelect = (choiceId: string, choiceText: string) => {
    setSelections(prev => ({
      ...prev,
      [currentStageId]: [{ id: choiceId, text: choiceText }]
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
                />
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
                  src={STAGE_VIDEOS[currentStageId]}
                  className="edit-story-page__video-player"
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  playsInline
                />
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
                  onClick={() => handleChoiceSelect(choice.id, choice.title)}
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