<template>
    <div v-if="status == 'running'" class="absolute bottom-0 overflow-hidden rounded bg-gray-800 shadow-md flex flex text-sm items-center p-2 gap-2">
        <div className="flex items-center rounded-md bg-gray-600 text-gray-100 text-sm px-3 py-1">Stats</div>
        <div class="flex grow overflow-hidden bg-white py-1 text-gray-600 rounded-lg ">
            <div class="flex flex gap-4 px-4">
                <div>Moves {{ stats.moves }}</div>
                <div>Points {{ stats.points }}</div>
                <div>Time {{ time() }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { toRef } from 'vue';
import { useGameContext } from '../composables/GameContext';
import { Util } from '../game/Util';


const gameContext = useGameContext()
const stats = toRef(gameContext.state.value.stats)
const status = toRef(gameContext.state.value.status)

const time = () => Util.formatMillisAsHoursMinutesSecondsWithPadding(new Date().getTime() - stats.value.startTime)

</script>
