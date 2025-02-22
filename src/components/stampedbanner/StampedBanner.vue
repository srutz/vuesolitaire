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
<style>

.stampedbanner {
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeout0 {
    0% {
        opacity: 1;
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        transform: rotate(-20deg) scale(1);
    }
    100% {
        opacity: 0;
    }
}

@keyframes fadeout1 {
    0% {
        opacity: 1;
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        transform: rotate(-15deg) scale(1);
    }
    100% {
        opacity: 0;
    }
}

@keyframes fadeout2 {
    0% {
        opacity: 1;
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        transform: rotate(15deg) scale(1);
    }
    100% {
        opacity: 0;
    }
}

@keyframes fadeout3 {
    0% {
        opacity: 1;
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        transform: rotate(20deg) scale(1);
    }
    100% {
        opacity: 0;
    }
}

@keyframes pulse0 {
    0% {
        opacity: 0;
    }
    8% {
        transform-origin: 50% 50%;
        transform: rotate(-8deg) scale(6);
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        opacity: .5;
    }
    100% {
        transform: rotate(-20deg) scale(1);
        opacity: 1;
    }
}

@keyframes pulse1 {
    0% {
        opacity: 0;
    }
    8% {
        transform-origin: 50% 50%;
        transform: rotate(-3deg) scale(6);
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        opacity: .5;
    }
    100% {
        transform: rotate(-15deg) scale(1);
        opacity: 1;
    }
}

@keyframes pulse2 {
    0% {
        opacity: 0;
    }
    8% {
        transform-origin: 50% 50%;
        transform: rotate(3deg) scale(6);
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        opacity: .5;
    }
    100% {
        transform: rotate(15deg) scale(1);
        opacity: 1;
    }
}

@keyframes pulse3 {
    0% {
        opacity: 0;
    }
    8% {
        transform-origin: 50% 50%;
        transform: rotate(8deg) scale(6);
        transition: all .3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        opacity: .5;
    }
    100% {
        transform: rotate(20deg) scale(1);
        opacity: 1;
    }
}

</style>
<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useTemplateRef } from 'vue';
import { Point } from '../../composables/RendererContext';
import { useWindowSize } from '../../composables/WindowSize';
import Stamp from './Stamp.vue';


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




