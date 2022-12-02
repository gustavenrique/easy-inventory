import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Multiselect from 'vue-multiselect'
import './assets/base.css'

const app = createApp(App)

app.use(router)
   .component('Multiselect', Multiselect)

app.config.globalProperties.$apiUrl = import.meta.env.VITE_APP_STOQUEI_API_URL

app.mount('#app')
