import { createApp } from 'vue'
import App from './App.vue'
import Primevue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import './style.css'

const app = createApp(App)

app.use(Primevue, {
  theme: {
    preset: Aura,
  },
})
app.mount('#app')
