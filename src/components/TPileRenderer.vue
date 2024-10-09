<template>
    <div class="text-white">{{ content }}</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { ClickHandler } from '../composables/RendererContext';
import { Pile } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';

const { pile, clickHandler } = defineProps<{
    pile: Pile,
    clickHandler: ClickHandler
}>()

/* get the current set of cards from the gamecontext */
const gameContext = inject(GameContextTag)!
const cards = computed(() => {
    /* use the pile from the gamestate, its reactive */
    const reactivePile = GameUtil.findPileById(gameContext.state.value, GameUtil.pileId(pile))!
    return reactivePile.cards
    //return pile.cards
})
const content = computed(() => {
    let t = GameUtil.pileId(pile) + ": "
    for (let i = 0; i < cards.value.length; i++) {
        const card = cards.value[i];
        t += GameUtil.cardToString(card) + " "
    }
    return t
})

</script>