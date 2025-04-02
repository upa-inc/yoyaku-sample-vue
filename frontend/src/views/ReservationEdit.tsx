import { defineComponent, ref, onMounted, PropType } from 'vue';
import { useRouter } from 'vue-router';
import ReservationForm from '../components/ReservationForm';
import reservationService from '../api/reservations';
import { Reservation } from '../types';

export default defineComponent({
  name: 'ReservationEditView',
  props: {
    id: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const reservation = ref<Reservation | null>(null);
    const loading = ref(true);
    const isSubmitting = ref(false);
    const error = ref<string | null>(null);
    const success = ref(false);
    
    const fetchReservation = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await reservationService.getReservation(props.id);
        reservation.value = response.data;
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
        const reservationData: Reservation = {
          title: formData.title,
          date: formData.date,
          description: formData.description,
          roomNumber: formData.roomNumber,
          roomId: formData.roomNumber, // roomNumberをroomIdに変換
          startTime: formData.startTime,
          endTime: formData.endTime,
          attendees: formData.attendees ? formData.attendees.split(',').map((a: string) => a.trim()) : []
        };
        
        await reservationService.updateReservation(props.id, reservationData);
        success.value = true;
        
        // 成功したら1秒後に詳細ページに移動
        setTimeout(() => {
          router.push(`/reservations/${props.id}`);
        }, 1000);
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
    
    return () => (
      <div>
        <div class="edit-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 class="page-title">予約の編集</h2>
          <div>
            <button 
              class="btn btn-secondary" 
              onClick={() => router.push(`/reservations/${props.id}`)}
              style={{ marginRight: '10px' }}
            >
              キャンセル
            </button>
          </div>
        </div>
        
        {error.value && (
          <div class="error-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffeeee' }}>
            <p>{error.value}</p>
          </div>
        )}
        
        {success.value && (
          <div class="success-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#eeffee' }}>
            <p>予約が正常に更新されました。詳細ページに移動します...</p>
          </div>
        )}
        
        {loading.value ? (
          <div class="loading">読み込み中...</div>
        ) : reservation.value ? (
          <ReservationForm 
            initialData={reservation.value}
            submitText="予約を更新" 
            isSubmitting={isSubmitting.value} 
            onSubmit={handleSubmit}
          />
        ) : (
          <div class="not-found card">
            <p>予約が見つかりませんでした。</p>
            <button class="btn" onClick={() => router.push('/')} style={{ marginTop: '15px' }}>
              一覧に戻る
            </button>
          </div>
        )}
      </div>
    );
  }
}); 