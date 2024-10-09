<template>
    <div :data-card="GameUtil.cardId(card)" :class="clazzes.join(' ')" :style="style">
        <div class="bg-white border shadow-lg rounded-lg flex justify-center items-center">
            <img draggable="false" class="select-none " :src="image" :alt="GameUtil.cardToString(card)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, CSSProperties, inject, onMounted, onUnmounted, ref } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { getPilePosition, getStackingDistance, RendererContextTag } from '../composables/RendererContext';
import { Pile, PlayingCard } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';


const computePosition = (pile: Pile, card: PlayingCard, cardIndex: number) => {
    const index = GameUtil.indexOfCard(allDraggedCards.value, card)
    const position = getPilePosition(availableSize.value, geometry.value, pile)
    if (index == -1) {
        position.y = position.y + cardIndex * getStackingDistance(geometry.value.scale, pile.type)
    } else {
        position.x = dragPosition.value.x || 0
        position.y  = (dragPosition.value.y || 0) + index * getStackingDistance(geometry.value.scale, pile.type)
    }
    if (["stopped", "won"].indexOf(gameContext.state.value.status || "") != -1 ) {
        position.x = -300
        position.y = -300
    }
    //console.log("computePosition", gameContext.state.value.status, toRaw(card), toRaw(unref(availableSize)), position)
    return position
}

const DRAG_LAYER = 1000

const props = defineProps<{
    card: PlayingCard,
}>()
const { card } = props

const gameContext = inject(GameContextTag)!
const rendererContext = inject(RendererContextTag)!
const { draggedCard, allDraggedCards, geometry, dragPosition, availableSize } = rendererContext

const dragged = computed(() => GameUtil.hasCard(allDraggedCards.value, card))
const width = computed(() => geometry.value.cardWidth)
const duration = computed(() => {
    const d = ["stopped", "won", "launching"].indexOf(gameContext.state.value.status || "") != -1 ? 750 : undefined
    //console.log("duration", d, gameContext.state.value.status, GameUtil.cardId(card))
    return 750
})
const delay = computed(() => {
    const reactiveCard = GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!
    const reactivePile = GameUtil.findPileForCard(gameContext.state.value, reactiveCard)!
    const cardIndex = GameUtil.indexOfCard(reactivePile.cards, reactiveCard)
    return ["stopped", "won", "launching"].indexOf(gameContext.state.value.status || "") != -1 
        ? Math.floor(cardIndex * 250 / reactivePile.cards.length)
        : undefined
})
const position2 = computed(() => {
    gameContext.state.value
    availableSize.value
    dragPosition.value
    draggedCard.value
    allDraggedCards.value
    const reactiveCard = (GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!)
    const reactivePile = GameUtil.findPileForCard(gameContext.state.value, reactiveCard)!
    const cardIndex = GameUtil.indexOfCard(reactivePile.cards, reactiveCard)
    const p = computePosition(reactivePile, reactiveCard, cardIndex)
    console.log("position", GameUtil.ordinalNumber(card), p,  gameContext.state.value.status, cardIndex, GameUtil.cardId(card), reactivePile.type)
    return p
})
const zIndex = computed(() => GameUtil.hasCard(allDraggedCards.value, card) ? DRAG_LAYER : undefined)
// todo:
const releasingDrag = ref(false)

const position = computed(() => {
    if (gameContext.state.value.status == "stopped") {
        return { x: -300, y: -300 }
    }
    const reactiveCard = (GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!)
    const reactivePile = GameUtil.findPileForCard(gameContext.state.value, reactiveCard)!
    const cardIndex = GameUtil.indexOfCard(reactivePile.cards, reactiveCard)
    const position = getPilePosition(availableSize.value, geometry.value, reactivePile)
    position.y = position.y + cardIndex * getStackingDistance(geometry.value.scale, reactivePile.type)
    return position
})  

const style = computed(() => {
    const style: CSSProperties = {
        width: width.value + "px",
        transitionProperty: "all",
        transitionDuration: (duration.value ?? 0) + "ms",
        transitionDelay: (delay.value ?? 0)+ "ms",
        left: position.value.x !== undefined ? position.value.x + "px" : "auto",
        top: position.value.y !== undefined ? position.value.y + "px" : "auto",
        zIndex: zIndex.value || "2"
    }
    if (!dragged.value) {
        style.transitionProperty = "all"
        style.transitionDuration = "125ms"
        style.transitionTimingFunction = "ease-out"
    }
    if (releasingDrag.value) {
        style.zIndex = DRAG_LAYER
        //style.animation = "bounce 150ms ease-in-out"
    }
    style.transitionDuration = "125ms"
    style.transitionDelay = "500ms"
    return style
})

const clazzes = computed(() => {
    const c = [..."flex items-center cursor-pointer select-none absolute".split(" ")
        , dragged.value ? "xshadow-custom-large" : ""]
    return c
})

const image = computed(() => {
    const reactiveCard = (GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!)
    return reactiveCard.side == "back" ? "cards/back.png" : GameUtil.cardToImage(reactiveCard)
})

onMounted(() => {
    console.log("mounted: " + GameUtil.cardToString(card))
})

onUnmounted(() => {
    console.log("unmounted: " + GameUtil.cardToString(card))
})

</script>
