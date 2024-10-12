<template>
    <div v-if="status == 'running'" class="absolute bottom-0 overflow-hidden rounded bg-gray-800 shadow-md flex flex text-sm items-center p-2 gap-2">
        <div className="flex items-center rounded-md bg-gray-600 text-gray-100 text-sm px-3 py-1">Stats</div>
        <div class="flex grow overflow-hidden bg-white py-1 text-gray-600 rounded-lg w-[310px] ">
            <div class="flex flex gap-4 px-4">
                <div>Moves {{ moves }}</div>
                <div>Points {{ points }}</div>
                <div>Time {{ time() }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { GameContextTag } from '../composables/GameContext';
import { Util } from '../game/Util';

const gameContext = inject(GameContextTag)!
const status = computed(() => gameContext.state.value.status)

const moves = computed(() => gameContext.state.value.stats.moves)
const points = computed(() => gameContext.state.value.stats.moves)

const updateTrigger = ref(false)

const time = () => Util.formatMillisAsHoursMinutesSecondsWithPadding(new Date().getTime() - gameContext.state.value.stats.startTime 
    + (updateTrigger.value?0:0))

onMounted(() => {
    const interval = setInterval(() => {
        updateTrigger.value = !updateTrigger.value
    }, 500)
    onUnmounted(() => clearInterval(interval))
})

</script>
