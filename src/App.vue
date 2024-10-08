<template>
    <RouterView />
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { GameContextTag, useGameContext } from './composables/GameContext';

const gameContext = useGameContext()
provide(GameContextTag, gameContext)

</script>
