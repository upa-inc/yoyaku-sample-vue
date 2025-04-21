<template>
  <div>
    <div class="detail-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <h2 class="page-title">予約詳細</h2>
      <div>
        <button 
          class="btn btn-secondary" 
          @click="router.push('/')"
          style="margin-right: 10px;"
        >
          一覧に戻る
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-message card" style="margin-bottom: 20px; padding: 15px; background-color: #ffeeee;">
      <p>{{ error }}</p>
      <button class="btn" @click="fetchReservation" style="margin-top: 10px;">
        再試行
      </button>
    </div>
    
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="reservation" class="reservation-container">
      <ReservationDetailComponent 
        :reservation="reservation"
        :loading="loading"
      />
      
      <div class="actions" style="margin-top: 20px; display: flex; gap: 10px;">
        <button 
          class="btn" 
          @click="router.push(`/reservations/${id}/edit`)"
        >
          編集
        </button>
        <button 
          class="btn btn-danger" 
          @click="handleDelete"
        >
          予約をキャンセル
        </button>
      </div>
    </div>
    <div v-else class="not-found card">
      <p>予約が見つかりませんでした。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useRouter } from 'vue-router';
import ReservationDetailComponent from '../components/ReservationDetail.vue';
import { useReservationStore } from '../stores/reservations';
import { Reservation } from '../types';

export default defineComponent({
  name: 'ReservationDetailView',
  components: {
    ReservationDetailComponent
  },
  props: {
    id: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const reservationStore = useReservationStore();
    const reservation = ref<Reservation | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    
    const fetchReservation = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const result = await reservationStore.getReservation(props.id);
        if (result) {
          reservation.value = result;
        } else {
          error.value = reservationStore.error || '予約データの読み込みに失敗しました。';
        }
      } catch (err) {
        console.error('予約の取得に失敗しました:', err);
        error.value = '予約データの読み込みに失敗しました。';
      } finally {
        loading.value = false;
      }
    };
    
    const handleDelete = async () => {
      if (!confirm('この予約をキャンセルしますか？この操作は取り消せません。')) {
        return;
      }
      
      loading.value = true;
      
      try {
        const success = await reservationStore.deleteReservation(props.id);
        if (success) {
          alert('予約がキャンセルされました');
          router.push('/');
        } else {
          error.value = reservationStore.error || '予約のキャンセルに失敗しました。';
          loading.value = false;
        }
      } catch (err) {
        console.error('予約のキャンセルに失敗しました:', err);
        error.value = '予約のキャンセルに失敗しました。';
        loading.value = false;
      }
    };
    
    onMounted(() => {
      fetchReservation();
    });
    
    return {
      router,
      reservation,
      loading,
      error,
      fetchReservation,
      handleDelete
    };
  }
});
</script>

<style scoped>
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  cursor: pointer;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.not-found {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.card {
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style> 