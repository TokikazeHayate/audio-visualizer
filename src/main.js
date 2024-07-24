import { createApp } from 'vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import App from './App.vue'
import router from './routes';

const app = createApp(App);

app.use(router);

app.mount('#app');
