import { createApp } from 'vue';
import router from './router.js';
import Navbar from './components/Navbar.js';

const app = createApp({});

app.component('navbar', Navbar);
app.use(router);
app.mount('#app');
