<template>
    <div class="bg-gray-800 p-4 flex flex-col">
        <div class="flex items-center">
            <div class="text-white text-3xl font-bold select-none uppercase tracking-tighter"><span
                    class="text-green-400">Vue</span> Solitaire</div>
            <div class="grow"></div>
            <nav class="flex gap-4">
                <a href="#" class="text-gray-300 hover:text-white text-lg tracking-tight" @click="$emit('menuAction', 'game-new')">New game</a>
                <a href="#" class="text-gray-300 hover:text-white text-lg tracking-tight" @click="$emit('menuAction', 'game-stop')">Stop game</a>
                <a href="#" class="text-gray-300 hover:text-white text-lg tracking-tight" @click="$emit('menuAction', 'about')">About</a>
            </nav>
        </div>
    </div>
</template>
<script setup lang="ts">

defineEmits<{
    menuAction: [action: string]
}>()


</script>