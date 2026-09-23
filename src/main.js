import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import { createRouter, createWebHistory } from 'vue-router';
import store from './magazynVuex'

const routes = [
    {
      path: '/index',
      name: 'Index',
      component: App,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
    },
  ];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

router.beforeEach((to, from, next) => {
    document.title = `Kalkulator Całek - ${to.name}`;
    next();
});

createApp(App).use(store).use(router).mount('#app')
