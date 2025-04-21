<template>
  <div>
    <div class="edit-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <h2 class="page-title">予約の編集</h2>
      <div>
        <button 
          class="btn btn-secondary" 
          @click="router.push(`/reservations/${id}`)"
          style="margin-right: 10px;"
        >
          キャンセル
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-message card" style="margin-bottom: 20px; padding: 15px; background-color: #ffeeee;">
      <p>{{ error }}</p>
    </div>
    
    <div v-if="success" class="success-message card" style="margin-bottom: 20px; padding: 15px; background-color: #eeffee;">
      <p>予約が正常に更新されました。詳細ページに移動します...</p>
    </div>
    
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="reservation">
      <ReservationForm 
        :initialData="reservation"
        submitText="予約を更新" 
        :isSubmitting="isSubmitting" 
        @submit="handleSubmit"
      />
    </div>
    <div v-else class="not-found card">
      <p>予約が見つかりませんでした。</p>
      <button class="btn" @click="router.push('/')" style="margin-top: 15px;">
        一覧に戻る
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useRouter } from 'vue-router';
import ReservationForm from '../components/ReservationForm.vue';
import { useReservationStore } from '../stores/reservations';
import { Reservation } from '../types';

export default defineComponent({
  name: 'ReservationEditView',
  components: {
    ReservationForm
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
    const isSubmitting = ref(false);
    const error = ref<string | null>(null);
    const success = ref(false);
    
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
    
    const handleSubmit = async (formData: any) => {
      isSubmitting.value = true;
      error.value = null;
      
      try {
        // フォームデータをAPIの型に変換
        const reservationData: Omit<Reservation, 'id'> = {
          title: formData.title,
          date: formData.date,
          description: formData.description,
          roomNumber: formData.roomNumber,
          startTime: formData.startTime,
          endTime: formData.endTime,
          attendees: formData.attendees
        };
        
        const result = await reservationStore.updateReservation(props.id, reservationData);
        if (result) {
          success.value = true;
          
          // 成功したら1秒後に詳細ページに移動
          setTimeout(() => {
            router.push(`/reservations/${props.id}`);
          }, 1000);
        } else {
          error.value = reservationStore.error || '予約の更新に失敗しました。入力内容を確認してください。';
        }
      } catch (err) {
        console.error('予約の更新に失敗しました:', err);
        error.value = '予約の更新に失敗しました。入力内容を確認してください。';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(() => {
      fetchReservation();
    });
    
    return {
      router,
      reservation,
      loading,
      isSubmitting,
      error,
      success,
      handleSubmit
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