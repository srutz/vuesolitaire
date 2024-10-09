<template>
    <div class="bg-white rounded-lg shadow-lg" :style="style"><slot></slot></div>
</template>
<script setup lang="ts">
import { CSSProperties } from 'vue';

const style = {
    width: "calc(min(800px,60vw))"
} satisfies CSSProperties

</script>

