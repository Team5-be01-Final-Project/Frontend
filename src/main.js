import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from "axios"


axios.defaults.baseURL="https://bpssystem.store/"
axios.defaults.withCredentials = true; // withCredentials 전역 설정


const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(router)


app.use(createVuestic());
app.mount('#app')
