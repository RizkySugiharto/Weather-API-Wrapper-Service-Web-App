import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import App from './App.vue'
import logger from './logger'

const pinia = createPinia()
    .use(piniaPluginPersistedState)

const app = createApp(App)
    .use(logger)
    .use(pinia)
    .mount('#app')

export default app
