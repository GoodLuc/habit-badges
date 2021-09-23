import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'

const app = createApp(App).use(store).use(router)

new WaveUI(app, {
  // Some Wave UI options.
})

app.mount('#app')
