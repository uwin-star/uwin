import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './auth.css'
import './notices.css'
import './admin.css'

createApp(App).use(router).mount('#app')
