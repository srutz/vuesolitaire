<template>
    <div v-if="text.trim().length > 0" class="stamped text-6xl font-bold flex flex-col justify-center items-center text-white"
            :style="style">{{text}}</div>
</template>
<script setup lang="ts">
import { computed, CSSProperties, onMounted, onUnmounted, ref } from 'vue';
import { Point } from '../../composables/RendererContext';

const { text, position, size, delayMs = 0, keyframes } = 
    defineProps<{ text: string, position: Point, size: number, delayMs?: number, keyframes: string }>()

const animationName = ref(keyframes)

const style = computed(() => (
    { 
        animationDelay: delayMs + "ms",
        left: position.x + "px", 
        top: position.y + "px",
        width: (size - 8) +"px",
        height: (size - 8) +"px",
        animationName: animationName.value
    } satisfies CSSProperties))

/* simple frame based animation machine */
const frameCounter = ref(0)
onMounted(() => {
    const i = setInterval(() => {
        //console.log("tick " + frameCounter.current)
        const DURATIONTICKS = 3
        if (frameCounter.value == DURATIONTICKS) {
            const animationNumer = keyframes.substring(keyframes.length - 1)
            animationName.value = "fadeout" + animationNumer
        } else if (frameCounter.value > DURATIONTICKS) {
            frameCounter.value = 0
            animationName.value = keyframes
            return
        }
        frameCounter.value++
    }, 1_000)
    onUnmounted(() => clearInterval(i)) 
})

</script>
