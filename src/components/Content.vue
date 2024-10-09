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
        <ModalDialog :show="aboutShown" :onClose="() => aboutShown = false" title="About Vue-Solitaire">
            <div class="flex flex-col gap-2">
                <p>Small Solitair Game in Vue. Cards are just divs, no Canvas used.</p>
                <p>by Stepan Rutz <a href="mailto:stepan.rutz@gmx.de">stepan.rutz AT gmx.de</a>.</p>
                <p>Projectpage incl. sourcecode <ExternalLink href="https://github.com/srutz/vuesolitaire/" />.</p>
                <div class="h-4"></div>
                <p>Card-Images are are from <ExternalLink href="https://deckofcardsapi.com/"/></p>
                <p>Made with: Typescript, Vue, Vite, Tailwind</p>
                <div class="flex flex-col bg-black p-4 self-strecth items-center relative min-h-64">
                    <div v-for="(card,index) in aboutCards" :key="index" class="w-32 absolute" _style="getAboutStyle(index)">
                        <img draggable="false" class="select-none " :src="'cards/' + card + '.svg'" />
                    </div>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
<script setup lang="ts">
import { CSSProperties, inject, onMounted, onUnmounted, ref } from 'vue';
import GameRenderer from '../components/GameRenderer.vue';
import Menubar from '../components/Menubar.vue';
import { GameContextTag } from '../composables/GameContext';
import { useWindowSize } from '../composables/WindowSize';
import ExternalLink from './dialogs/ExternalLink.vue';
import ModalDialog from './dialogs/ModalDialog.vue';

const { width, height } = useWindowSize()
const gameContext = inject(GameContextTag)!

const aboutShown = ref(false)

const handleMenubarAction = (action: string) => {
    if ("about" == action) {
        aboutShown.value = true
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
const angle = ref(0)

const getAboutStyle = (index: number) => ({ 
    transition: "all 5s ease-in-out", transformOrigin: "bottom center", 
    transform: "rotate(" + (angle.value * (index - aboutCards.length / 2)) + "deg)" } satisfies CSSProperties
)

const aboutCards = [ "0H", "JS", "QD", "KH", "AS", "AD" ]
const frame = ref(0)
onMounted(() => {
    const i = setInterval(() => {
        if (frame.value == 0) {
            angle.value = 12
        } else if (frame.value == 1) {
            frame.value = 0
        }
        frame.value++
        if (frame.value == 2) {
            frame.value = 0
        }
    }, 1000)
    onUnmounted(() => clearInterval(i))
})
</script>