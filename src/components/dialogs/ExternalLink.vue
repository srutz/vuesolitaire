<template>
    <a class="text-blue-500" :href="href" target="_blank" rel="noreferrer"><slot></slot></a>
</template>
<script setup lang="ts">

const { href } = defineProps<{ href: string }>()

</script>
