import { computed, InjectionKey, Ref, ref } from "vue"
import { Pile, PileType, PlayingCard } from "../game/GameTypes"
import { useElementSize } from "./ElementSize"
import { useWindowSize } from "./WindowSize"


export type Geometry = {
    scale: number
    xgap: number
    cardWidth: number
    cardHeight: number
}

export function makeGeometry(scale: number) {
    return {
        scale: scale,
        xgap: Math.floor(scale * 16),
        cardWidth: Math.floor(scale * 100),
        cardHeight: Math.floor(scale * 138),
    } 

}

export function getStackingDistance(scale: number, pileType: PileType) {
    switch (pileType) {
        case "table": return Math.floor(scale * 22) 
        case "stack": return Math.floor(scale * 4)
        case "stock": return Math.floor(scale * 3)
        case "waste": return Math.floor(scale * 3)
    }
}

export type Point = { x: number, y: number }
export type Size = { width: number, height: number }

/* gets the left-top anchor position for a pile */
export function getPilePosition(availableSize: Size, geometry: Geometry, pile: Pile) {
    const xdist = geometry.cardWidth + geometry.xgap
    const ydist = geometry.cardHeight + 30 * getStackingDistance(geometry.scale, "stack")
    //console.log("availableSize.width = " + availableSize.width)
    const x0 = Math.floor((availableSize.width - (6 * geometry.xgap + 7 * geometry.cardWidth)) / 2)
    const y0 = 24
    const position: Point = { x: 0, y: 0 }
    switch (pile.type) {
        case "stock": position.x = x0; position.y = y0; break
        case "waste": position.x = x0 + xdist; position.y = y0; break
        case "stack": position.x = x0 + 3 * xdist + pile.index * xdist; position.y = y0; break
        case "table": position.x = x0 + pile.index * xdist; position.y = y0 + ydist; break
    }
    return position
}


export function useRendererContext(elem: Ref<HTMLElement | null>) {
    const { width, height } = useWindowSize()
    const geometry = computed(() => {
        let scale = 1
        if (width.value >= 1200 && height.value >= 940) {
            scale = 1.5
        } else if (width.value >= 1080 && height.value >= 780) {
            scale = 1.25
        }
        return makeGeometry(scale)
    })
    const elementSize = useElementSize(elem)
    const availableSize = computed(() => {
        return { width: elementSize.width.value, height: elementSize.height.value }
    })
    const rendererContext = {
        draggedCard: ref<PlayingCard>(),
        allDraggedCards: ref<PlayingCard[]>([]),
        destinationPile: ref<Pile>(),
        dragPosition: ref({ x: 0, y: 0 }),
        geometry: ref(geometry),
        availableSize: availableSize
    }
    return rendererContext    
}

export type RendererContextType = ReturnType<typeof useRendererContext>
export const RendererContextTag = Symbol('RendererContextTag') as InjectionKey<RendererContextType>

export type ClickHandler = (pile: Pile, card?: PlayingCard) => void

