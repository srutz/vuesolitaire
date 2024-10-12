<template>
    <div :data-card="GameUtil.cardId(card)" :class="clazzes.join(' ')" :style="style">
        <div class="bg-white border shadow-lg rounded-lg flex justify-center items-center">
            <img draggable="false" class="select-none " :src="image" :alt="GameUtil.cardToString(card)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, CSSProperties, inject, ref, watchEffect } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { getPilePosition, getStackingDistance, RendererContextTag } from '../composables/RendererContext';
import { PlayingCard } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';


const DRAG_LAYER = 1000

const props = defineProps<{
    card: PlayingCard,
}>()
const { card } = props

const gameContext = inject(GameContextTag)!
const rendererContext = inject(RendererContextTag)!
const { allDraggedCards, geometry, dragPosition, availableSize } = rendererContext

const dragged = computed(() => GameUtil.hasCard(allDraggedCards.value, card))
const width = computed(() => geometry.value.cardWidth)
const releasingDrag = ref(false)


const style = computed(() => {
    let position = { x: 0, y: 0 }
    const status = gameContext.state.value.status
    const reactiveCard = GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!
    const reactivePile = GameUtil.findPileForCard(gameContext.state.value, reactiveCard)!
    const cardIndex = GameUtil.indexOfCard(reactivePile.cards, reactiveCard)
    const dragIndex = GameUtil.indexOfCard(allDraggedCards.value, card)
    if (status == "stopped" ) {
        position = { x: -300, y: -300 }
    } else if (status == "won") {
        position = { x: window.innerWidth + 300, y: -300 }
    } else if (dragIndex == -1) {
        position = getPilePosition(availableSize.value, geometry.value, reactivePile)
        position.y = position.y + cardIndex * getStackingDistance(geometry.value.scale, reactivePile.type)
    } else {
        position.x = dragPosition.value.x || 0
        position.y  = (dragPosition.value.y || 0) + dragIndex * getStackingDistance(geometry.value.scale, reactivePile.type)
    }

    const duration = ["stopped", "won", "launching"].indexOf(gameContext.state.value.status || "") != -1 ? 750 : undefined
    const delay = ["stopped", "won", "launching"].indexOf(gameContext.state.value.status || "") != -1 
        ? Math.floor(cardIndex * 250 / reactivePile.cards.length)
        : undefined

    const zIndex = GameUtil.hasCard(allDraggedCards.value, card) ? DRAG_LAYER + cardIndex : 10 + cardIndex

    const style: CSSProperties = {
        width: width.value + "px",
        transitionProperty: "all",
        transitionDuration: (duration ?? 0) + "ms",
        transitionDelay: (delay ?? 0)+ "ms",
        left: position.x !== undefined ? position.x + "px" : "auto",
        top: position.y !== undefined ? position.y + "px" : "auto",
        zIndex: zIndex
    }
    // if not dragged animate always
    if (dragIndex != -1) {
        style.transitionProperty = "none"
        style.zIndex = DRAG_LAYER + cardIndex
    } else {
        style.transitionProperty = "all"
        style.transitionDuration = "125ms"
        style.transitionTimingFunction = "ease-out"
    }
    if (releasingDrag.value) {
        //style.zIndex = DRAG_LAYER + cardIndex
        style.animation = "bounce 150ms ease-in-out"
    }
    return style
})

watchEffect(() => {
    //console.log("change " + GameUtil.cardToString(card) + " " + dragged)
    if (!dragged.value) {
        setTimeout(() => {
            releasingDrag.value = false
        }, 150)
        releasingDrag.value = true
    }
})

const clazzes = computed(() => {
    const c = [..."flex items-center cursor-pointer select-none absolute".split(" ")
        , dragged.value ? "xshadow-custom-large" : ""]
    return c
})

const image = computed(() => {
    const reactiveCard = (GameUtil.findCardById(gameContext.state.value, GameUtil.cardId(card))!)
    return reactiveCard.side == "back" ? "/vuesolitaire/cards/back.png" : GameUtil.cardToImage(reactiveCard)
})



</script>
