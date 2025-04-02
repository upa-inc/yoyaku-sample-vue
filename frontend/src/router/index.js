import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'ReservationList',
    component: () => import('../views/ReservationList')
  },
  {
    path: '/reservations/new',
    name: 'ReservationCreate',
    component: () => import('../views/ReservationCreate')
  },
  {
    path: '/reservations/:id',
    name: 'ReservationDetail',
    component: () => import('../views/ReservationDetail'),
    props: true
  },
  {
    path: '/reservations/:id/edit',
    name: 'ReservationEdit',
    component: () => import('../views/ReservationEdit'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 