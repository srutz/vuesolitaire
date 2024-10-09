<template>
    <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl text-black font-semibold">{{ title }}</h2>
        <button @click="onClose" class="text-gray-500 hover:text-gray-800">
            &times;
        </button>
    </div>
</template>
<script setup lang="ts">
const { title, onClose } = defineProps<{ title: string, onClose: () => void }>()
</script>
