// 모든 아바타 이미지 자동 import
const avatarModules = import.meta.glob('@/assets/images/avatars/*.png', {
    eager: true
})

const taleModules = import.meta.glob('@/assets/images/tales/*.png', {
    eager: true
})

const homeModules = import.meta.glob('@/assets/images/*.png', {
    eager: true
})

// 사용하기 쉽게 변환
export const avatars = Object.fromEntries(
    Object.entries(avatarModules).map(([path, module]) => {
        const name = path.match(/\/([^/]+)\.png$/)[1]
        return [name, module.default]
    })
)

export const tales = Object.fromEntries(
    Object.entries(taleModules).map(([path, module]) => {
        const name = path.match(/\/([^/]+)\.png$/)[1]
        return [name, module.default]
    })
)

export const homeImages = Object.fromEntries(
    Object.entries(homeModules).map(([path, module]) => {
        const name = path.match(/\/([^/]+)\.png$/)[1]
        return [name, module.default]
    })
)