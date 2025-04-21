<template>
  <div>
    <h2 class="page-title">新規予約の作成</h2>
    
    <div v-if="error" class="error-message card" style="margin-bottom: 20px; padding: 15px; background-color: #ffeeee;">
      <p>{{ error }}</p>
    </div>
    
    <div v-if="success" class="success-message card" style="margin-bottom: 20px; padding: 15px; background-color: #eeffee;">
      <p>予約が正常に作成されました。一覧ページに移動します...</p>
    </div>
    
    <ReservationForm 
      submitText="予約を作成" 
      :isSubmitting="isSubmitting" 
      @submit="handleSubmit"
    />
    
    <div style="margin-top: 20px;">
      <button 
        class="btn btn-secondary" 
        @click="router.push('/')"
        :disabled="isSubmitting"
      >
        キャンセル
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ReservationForm from '../components/ReservationForm.vue';
import { useReservationStore } from '../stores/reservations';
import { Reservation } from '../types';

export default defineComponent({
  name: 'ReservationCreateView',
  components: {
    ReservationForm
  },
  setup() {
    const router = useRouter();
    const reservationStore = useReservationStore();
    const isSubmitting = ref(false);
    const error = ref<string | null>(null);
    const success = ref(false);
    
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
        
        const result = await reservationStore.createReservation(reservationData);
        if (result) {
          success.value = true;
          
          // 成功したら1秒後に一覧ページに移動
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          error.value = reservationStore.error || '予約の作成に失敗しました。入力内容を確認してください。';
        }
      } catch (err) {
        console.error('予約の作成に失敗しました:', err);
        error.value = '予約の作成に失敗しました。入力内容を確認してください。';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      router,
      isSubmitting,
      error,
      success,
      handleSubmit
    };
  }
});
</script>

<style scoped>
.page-title {
  margin-bottom: 20px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  line-height: 1.5;
  cursor: pointer;
}

.btn-secondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style> 