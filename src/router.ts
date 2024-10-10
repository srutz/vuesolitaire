import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Content from "./components/Content.vue"


const routes = [
    { path: '/', component: Content },
    { name: "vuesolitaire", path: '/vuesolitaire', component: Content },
] satisfies RouteRecordRaw[]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})