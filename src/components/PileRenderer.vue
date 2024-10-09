<template>
    <PileBackground :pile="pile" @click="handleClick()"></PileBackground>
</template>
<script setup lang="ts">
import { toRaw } from 'vue';
import { ClickHandler } from '../composables/RendererContext';
import { Pile } from '../game/GameTypes';
import PileBackground from './PileBackground.vue';
 
const { pile, clickHandler } = defineProps<{
    pile: Pile,
    clickHandler: ClickHandler
}>()
const handleClick = () => clickHandler(toRaw(pile))


</script>