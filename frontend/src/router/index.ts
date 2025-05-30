import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReservationList from '../views/ReservationList.vue';
import ReservationCreate from '../views/ReservationCreate.vue';
import ReservationDetail from '../views/ReservationDetail.vue';
import ReservationEdit from '../views/ReservationEdit.vue';
import NotFound from '../views/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'ReservationList',
    component: ReservationList
  },
  {
    path: '/reservations/new',
    name: 'ReservationCreate',
    component: ReservationCreate
  },
  {
    path: '/reservations/:id',
    name: 'ReservationDetail',
    component: ReservationDetail,
    props: true
  },
  {
    path: '/reservations/:id/edit',
    name: 'ReservationEdit',
    component: ReservationEdit,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 