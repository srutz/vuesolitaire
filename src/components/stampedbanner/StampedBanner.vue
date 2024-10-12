/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */
<template>
    <div ref="elemRef" class="self-stretch relative mb-16"
        ><Stamp v-for="(c, i) in texts" 
            :text="c" 
            :key="i"
            :position="computePosition(i)"
            :size="size"
            :keyframes='"pulse" + (i % 4)'
            :delayMs="i * 50"/>
    </div>
</template>
<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useTemplateRef } from 'vue';
import { Point } from '../../composables/RendererContext';
import { useWindowSize } from '../../composables/WindowSize';
import Stamp from './Stamp.vue';
import "./StampedBanner.css";


const { text } = defineProps<{ text: string }>()
const texts = text.split("")

const windowSize = useWindowSize()
const elemRef = useTemplateRef<HTMLDivElement>("elemRef")

const size = computed(() => windowSize.width.value < 1100 ? 100 : 160)

function computePosition(i: number) {
    const availw = elemRef.value?.clientWidth || 0
    const availh = elemRef.value?.clientHeight || 0
    const usedw = text.length * size.value
    const x0 = (availw - usedw) / 2
    const y0 = (availh - size.value) / 2
    const p: Point = { x: x0 + i * size.value, y: y0 }
    return p
}

</script>




