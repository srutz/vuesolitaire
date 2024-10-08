import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'


createApp(App)
.use(router)
.mount('#app')

console.log("%cVuesolitaire", "font-size:36px; color: #9c1020; font-Family: 'Sans'; font-weight: 700")
console.log("%cwritten by Stepan Rutz. Source at https://github.com/srutz/vuesolitaire/", "font-size:18px; color: #9c1020; font-Family: 'Noto Sans'; font-weight: 700")