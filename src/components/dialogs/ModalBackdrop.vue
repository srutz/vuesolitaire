<template>
        <div :class="`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 opacity-0 ${opening ? 'animate-fade-in' : 'animate-fade-out'}`"
            ><slot></slot></div>
</template>
<script setup lang="ts">

const { opening } = defineProps<{
    opening: boolean
}>()

</script>

