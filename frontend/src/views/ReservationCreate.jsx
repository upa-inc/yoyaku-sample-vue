import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ReservationForm from '../components/ReservationForm';
import reservationService from '../api/reservations';

export default defineComponent({
  name: 'ReservationCreateView',
  setup() {
    const router = useRouter();
    const isSubmitting = ref(false);
    const error = ref(null);
    const success = ref(false);
    
    const handleSubmit = async (formData) => {
      isSubmitting.value = true;
      error.value = null;
      
      try {
        await reservationService.createReservation(formData);
        success.value = true;
        
        // 成功したら1秒後に一覧ページに移動
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (err) {
        console.error('予約の作成に失敗しました:', err);
        error.value = '予約の作成に失敗しました。入力内容を確認してください。';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return () => (
      <div>
        <h2 class="page-title">新規予約の作成</h2>
        
        {error.value && (
          <div class="error-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffeeee' }}>
            <p>{error.value}</p>
          </div>
        )}
        
        {success.value && (
          <div class="success-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#eeffee' }}>
            <p>予約が正常に作成されました。一覧ページに移動します...</p>
          </div>
        )}
        
        <ReservationForm 
          submitText="予約を作成" 
          isSubmitting={isSubmitting.value} 
          onSubmit={handleSubmit}
        />
        
        <div style={{ marginTop: '20px' }}>
          <button 
            class="btn btn-secondary" 
            onClick={() => router.push('/')}
            disabled={isSubmitting.value}
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }
}); 