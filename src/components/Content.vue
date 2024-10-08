<template>
    <div class="h-1 grow shrink flex flex-col">
        <Menubar @menuAction ="handleMenubarAction" />
        <div class="relative bg-indigo-800 h-1 grow shrink flex flex-col overflow-hidden">
            <div v-if="width < 820"
                class="flex grow items-center justify-center text-center text-7xl font-bold p-4 text-white">Please use a
                wider browser window</div>
            <div v-else-if="height < 640"
                class="flex grow items-center justify-center text-center text-7xl font-bold p-4 text-white">Please use a
                taller browser window
            </div>
            <GameRenderer v-else ></GameRenderer>
        </div>
    </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import GameRenderer from '../components/GameRenderer.vue';
import Menubar from '../components/Menubar.vue';
import { GameContextTag } from '../composables/GameContext';
import { useWindowSize } from '../composables/WindowSize';

const { width, height } = useWindowSize()
const gameContext = inject(GameContextTag)!

const handleMenubarAction = (action: string) => {
    if ("about" == action) {
        //setAboutShown(true)
    } else if ("game-new" == action) {
        if (gameContext.state.value.status == "running") {
            //setNewGameConfirmShown(true)
            startNewGame()
        } else {
            startNewGame()
        }
    } else if ("game-stop" == action) {
        if (gameContext.state.value.status == "running") {
            //setStopGameConfirmShown(true)
            gameContext.dispatch({ type: "game-stop" })
        } else {
            gameContext.dispatch({ type: "game-stop" })
        }
    }
}

const startNewGame = () => {
    gameContext.dispatch({ type: "game-new" })
    setTimeout(() => {
        gameContext.dispatch({ type: "game-launched" })
    }, 1_000)
}


</script>