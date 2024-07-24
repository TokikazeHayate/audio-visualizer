import { createRouter, createWebHashHistory } from 'vue-router'
import CircleVisual from './views/CircleVisual.vue'
import HorizontalVisual from './views/HorizontalVisual.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: CircleVisual,
        },
        {
            path: '/circle',
            component: CircleVisual,
        },
        {
            path: '/horizon',
            component: HorizontalVisual,
        }
    ]
});

export default router