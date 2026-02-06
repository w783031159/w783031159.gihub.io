import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.js';
import ProductDetail from './views/ProductDetail.js';
import Admin from './views/Admin.js';

const routes = [
    { path: '/', component: Home },
    { path: '/product/:id', component: ProductDetail },
    { path: '/wengjiabao', component: Admin },
];

const router = createRouter({
    history: createWebHashHistory(), // Use Hash history for simple static serving without rewrite rules
    routes,
});

export default router;
