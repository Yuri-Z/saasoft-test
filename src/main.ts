import {createApp} from 'vue'
import PrimeVue from 'primevue/config'
import './style.css'
import App from './App.vue'
import Aura from '@primeuix/themes/aura'
import vForm from "@/components/vForm.vue"

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.component('vForm', vForm)
app.mount('#app')
