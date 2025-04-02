import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReservationDetailComponent from '../components/ReservationDetail';
import reservationService from '../api/reservations';

export default defineComponent({
  name: 'ReservationDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const reservation = ref(null);
    const loading = ref(true);
    const error = ref(null);
    
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
    
    const handleDelete = async () => {
      if (!confirm('この予約をキャンセルしますか？この操作は取り消せません。')) {
        return;
      }
      
      loading.value = true;
      
      try {
        await reservationService.deleteReservation(props.id);
        alert('予約がキャンセルされました');
        router.push('/');
      } catch (err) {
        console.error('予約のキャンセルに失敗しました:', err);
        error.value = '予約のキャンセルに失敗しました。';
        loading.value = false;
      }
    };
    
    onMounted(() => {
      fetchReservation();
    });
    
    return () => (
      <div>
        <div class="detail-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 class="page-title">予約詳細</h2>
          <div>
            <button 
              class="btn btn-secondary" 
              onClick={() => router.push('/')}
              style={{ marginRight: '10px' }}
            >
              一覧に戻る
            </button>
          </div>
        </div>
        
        {error.value && (
          <div class="error-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffeeee' }}>
            <p>{error.value}</p>
            <button class="btn" onClick={fetchReservation} style={{ marginTop: '10px' }}>
              再試行
            </button>
          </div>
        )}
        
        {loading.value ? (
          <div class="loading">読み込み中...</div>
        ) : reservation.value ? (
          <div>
            <ReservationDetailComponent 
              reservation={reservation.value}
              loading={loading.value}
            />
            
            <div class="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button 
                class="btn" 
                onClick={() => router.push(`/reservations/${props.id}/edit`)}
              >
                編集
              </button>
              <button 
                class="btn btn-danger" 
                onClick={handleDelete}
              >
                予約をキャンセル
              </button>
            </div>
          </div>
        ) : (
          <div class="not-found card">
            <p>予約が見つかりませんでした。</p>
          </div>
        )}
      </div>
    );
  }
}); 