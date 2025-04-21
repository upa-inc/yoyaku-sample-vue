<template>
  <div>
    <div v-if="reservationStore.error" class="error-message card" style="margin-bottom: 20px; padding: 15px; background-color: #ffeeee;">
      <p>{{ reservationStore.error }}</p>
      <button class="btn" @click="reservationStore.fetchReservations" style="margin-top: 10px;">
        再試行
      </button>
    </div>
    
    <ReservationListComponent 
      :reservations="reservationStore.reservations" 
      :loading="reservationStore.loading" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import ReservationListComponent from '../components/ReservationList.vue';
import { useReservationStore } from '../stores/reservations';

export default defineComponent({
  name: 'ReservationListView',
  components: {
    ReservationListComponent
  },
  setup() {
    const reservationStore = useReservationStore();
    
    onMounted(() => {
      reservationStore.fetchReservations();
    });
    
    return {
      reservationStore
    };
  }
});
</script>

<style scoped>
/* ここにスタイルを追加できます */
</style> 