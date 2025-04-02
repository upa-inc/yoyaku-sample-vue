import { defineComponent, ref, onMounted } from 'vue';
import ReservationListComponent from '../components/ReservationList';
import reservationService from '../api/reservations';

export default defineComponent({
  name: 'ReservationListView',
  setup() {
    const reservations = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    const fetchReservations = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await reservationService.getReservations();
        reservations.value = response.data;
      } catch (err) {
        console.error('予約の取得に失敗しました:', err);
        error.value = '予約データの読み込みに失敗しました。しばらくしてから再度お試しください。';
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      fetchReservations();
    });
    
    return () => (
      <div>
        {error.value && (
          <div class="error-message card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffeeee' }}>
            <p>{error.value}</p>
            <button class="btn" onClick={fetchReservations} style={{ marginTop: '10px' }}>
              再試行
            </button>
          </div>
        )}
        
        <ReservationListComponent 
          reservations={reservations.value} 
          loading={loading.value} 
        />
      </div>
    );
  }
}); 