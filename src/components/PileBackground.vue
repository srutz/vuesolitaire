<template>
    <div :data-pile="pileId" class="flex items-center cursor-pointer select-none absolute" :style="mainStyle" >
        <div class="bg-gray-500 border border-gray-600 shadow-lg rounded-lg flex justify-center items-center text-gray-600 capitalize text-2xl"
            :style="contentStyle">{{ label}}</div>
    </div>

</template>
<script setup lang="ts">
import { computed, CSSProperties, inject } from 'vue';
import { getPilePosition, RendererContextTag } from '../composables/RendererContext';
import { Pile } from '../game/GameTypes';
import { GameUtil } from '../game/GameUtil';


const { pile } = defineProps<{
    pile: Pile,
}>()

const rendererContext = inject(RendererContextTag)!
const { geometry, availableSize } = rendererContext

const label = ["table", "waste"].indexOf(pile.type) == -1 ? pile.type : ""

const pileId = GameUtil.pileId(pile)
const mainStyle = computed(() => {
    const position = getPilePosition(availableSize.value, geometry.value, pile)
    return {
        left: position.x + "px",
        top: position.y + "px",
    } satisfies CSSProperties
})
const contentStyle = computed(() => {
    return {
        width: geometry.value.cardWidth + "px",
        height: geometry.value.cardHeight + "px",
    } satisfies CSSProperties
})
</script>

