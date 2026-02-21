import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.js';
import ProductDetail from './views/ProductDetail.js';
import Admin from './views/Admin.js';
import About from './views/About.js';

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/product/:id', component: ProductDetail },
    { path: '/wengjiabao', component: Admin },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
