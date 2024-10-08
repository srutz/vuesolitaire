<template>
    <PileBackground :pile="pile" @click="handleClick()"></PileBackground>
    <CardRenderer v-for="(card,i) in cards"
            :key="GameUtil.cardId(card)" 
            :pile="pile"
            :index="i"
            :card="card"
            :title="gameContext.state.value.status"
            :data-card="GameUtil.cardId(card)"
            @click="handleClick(card)">
    </CardRenderer>
</template>
<script setup lang="ts">
import { computed, inject, toRaw } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { ClickHandler } from '../composables/RendererContext';
import { Pile, PlayingCard } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';
import CardRenderer from './CardRenderer.vue';
import PileBackground from './PileBackground.vue';

const { pile, clickHandler } = defineProps<{
    pile: Pile,
    clickHandler: ClickHandler
}>()

const gameContext = inject(GameContextTag)!
const cards = computed(() => {
    /* use the pile from the gamestate, its reactive */
    const reactivePile = GameUtil.findPileById(gameContext.state.value, GameUtil.pileId(pile))!
    return reactivePile.cards
})

const handleClick = (card?: PlayingCard) => {
    clickHandler(toRaw(pile), toRaw(card))
}

</script>