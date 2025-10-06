import {createApp} from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice';
import {Toast} from 'primevue'


const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.use(ToastService)
app.component('Toast', Toast)

app.use(pinia)

app.mount('#app')
