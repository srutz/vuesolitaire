<template>
    <div class="h-1 grow shrink flex flex-col bg-gray-500 p-4 relative">
        <div ref="elem" class="h-1 grow shrink flex flex-col bg-gray-500 p-4 relative" 
            @mousedown="mouseDown"
            @mousemove="mouseMove" 
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart="mouseDown"
            @touchmove="mouseMove"
            @touchend="endDrag"
            @touchcancel="endDrag" >
            <PileRenderer :pile="stock" :clickHandler="clickHandler" />
            <PileRenderer :pile="waste" :clickHandler="clickHandler" />
            <PileRenderer v-for="(pile,i) in stacks":key="'stack' + i" :pile="pile" :clickHandler="clickHandler" />
            <PileRenderer v-for="(pile,i) in tables":key="'tables' + i" :pile="pile" :clickHandler="clickHandler" />

            <KeepAlive>
                <CardRenderer v-for="(card) in cards"
                    :key="GameUtil.cardId(card)" 
                    :pile="getPile(card)!"
                    :card="card"
                    :title="gameContext.state.value.status"
                    :data-card="GameUtil.cardId(card)"
                    @click="clickHandler(getPile(card)!,card)">
                </CardRenderer>
            </KeepAlive>


        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, inject, provide, ref, toRefs, useTemplateRef } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { ClickHandler, RendererContextTag, useRendererContext } from '../composables/RendererContext';
import { PlayingCard, Rank, Suit } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';
import CardRenderer from './CardRenderer.vue';
import PileRenderer from './PileRenderer.vue';


/* setup renderer context */
const elemRef = useTemplateRef('elem')
const rendererContext = useRendererContext(elemRef)
provide(RendererContextTag, rendererContext)

/* get game context */
const gameContext = inject(GameContextTag)!
const { stock, waste, stacks, tables } = toRefs(gameContext.state.value)

/* game clicks */
const clickHandler: ClickHandler = (pile, card) => {
    if (card && pile.type === "stock") {
        gameContext.dispatch({ type: "draw-stock", card: card })
    } else if (!card && pile.type === "stock") {
        gameContext.dispatch({ type: "empty-stock" })
    } else if (card && pile.type === "table") {
        gameContext.dispatch({ type: "draw-table", card: card, side: card.side })
    } else if (card && pile.type === "waste") {
        gameContext.dispatch({ type: "draw-waste", card: card })
    }    
}

/* game drag and drop logic starts */

const dragging = ref(false)
const downPosition = ref({ x: 0, y: 0 })

const { dragPosition, draggedCard, allDraggedCards, destinationPile } = rendererContext

const mouseDown = (event: MouseEvent|TouchEvent) => {
    const container = elemRef.value
    if (container == event.target) {
        return
    }
    const target = GameUtil.findCardElement(event.target as HTMLElement)
    if (!target) {
        return
    }
    const card = GameUtil.findCardById(gameContext.state.value, target.getAttribute("data-card"))
    if (!card) {
        return
    }
    const pile = GameUtil.findPileForCard(gameContext.state.value, card)
    const lastInPile = pile && pile.cards[pile.cards.length - 1] == card
    if (pile?.type != "table" && !lastInPile) {
        return
    }
    if (pile?.type == "stock") {
        return
    }
    if (pile?.type == "table" && card.side == "back") {
        return
    }

    dragging.value = true
    draggedCard.value = card
    const dc = GameUtil.computeAllDraggedCards(gameContext.state.value, card)
    allDraggedCards.value = dc
    //console.log("allDraggedCards: " + dc.map(c => GameUtil.cardToString(c)).join(", "))
    let offsetX, offsetY
    if (event instanceof MouseEvent) {
        offsetX = event.offsetX
        offsetY = event.offsetY
    } else  {
        const touch = event.touches[0]
        offsetX = touch.clientX - target.getBoundingClientRect().left
        offsetY = touch.clientY - target.getBoundingClientRect().top
    }
    downPosition.value = { x: offsetX, y: offsetY }
    const rect = container!.getBoundingClientRect()
    let clientX, clientY
    if (event instanceof MouseEvent) {
        clientX = event.clientX
        clientY = event.clientY
    } else {
        const touch = event.touches[0]
        clientX = touch.clientX
        clientY = touch.clientY
    }
    const x = clientX - offsetX - rect.left
    const y = clientY - offsetY - rect.top
    dragPosition.value = { x, y }
}

const mouseMove = (event: MouseEvent | TouchEvent) => {
    if (!dragging.value) {
        return
    }
    const container = elemRef.value!
    const rect = container.getBoundingClientRect()
    let x, y
    if (event instanceof MouseEvent) {
        x = event.clientX - downPosition.value.x - rect.left
        y = event.clientY - downPosition.value.y - rect.top
    } else {
        const touch = event.touches[0]
        x = touch.clientX - downPosition.value.x - rect.left
        y = touch.clientY - downPosition.value.y - rect.top
    }
    dragPosition.value = { x, y }
    destinationPile.value = undefined
    const target = GameUtil.findCardElement(event.target as HTMLElement)
    if (target) {
        const destination = GameUtil.findClosestPileAndCard(gameContext.state.value, container, target, draggedCard.value)
        if (destination) {
            destinationPile.value = destination.pile
        }
    }
}

const endDrag = () => {
    if (draggedCard.value) {
        if (destinationPile.value?.type === "table") {
            gameContext?.dispatch({ type: "drop-table", cards: allDraggedCards.value, table: destinationPile.value })
        }
    }
    draggedCard.value = undefined
    allDraggedCards.value = []
    dragging.value = false
    destinationPile.value = undefined
}


/* card rendering */
const getPile = (card: PlayingCard) => GameUtil.findPileForCard(gameContext.state.value, card)

const cards = computed(() => {
    // stable deck basically
    // this is currently not reactive
    const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"]
    const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const deck: PlayingCard[] = []
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank, side: "back"})
        }
    }
    return deck
})

</script>