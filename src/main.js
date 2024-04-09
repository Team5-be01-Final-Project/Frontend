import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from "axios"
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/main.css'


axios.defaults.baseURL="http://localhost:8081/api"
//axios.defaults.baseURL="https://bpssystem.store/api" 배포용 URL
axios.defaults.withCredentials = true; // withCredentials 전역 설정

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(router)


app.use(createVuestic());
app.mount('#app')