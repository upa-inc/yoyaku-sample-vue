import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';

export default defineComponent({
  name: 'ReservationListComponent',
  props: {
    reservations: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    
    const navigateToDetail = (id) => {
      router.push(`/reservations/${id}`);
    };
    
    const navigateToCreate = () => {
      router.push('/reservations/new');
    };
    
    const formatDate = (dateStr) => {
      try {
        return format(new Date(dateStr), 'yyyy/MM/dd');
      } catch (e) {
        return dateStr;
      }
    };
    
    return () => (
      <div class="reservation-list">
        <div class="list-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 class="page-title">予約一覧</h2>
          <button class="btn" onClick={navigateToCreate}>新規予約</button>
        </div>
        
        {props.loading ? (
          <div class="loading">読み込み中...</div>
        ) : props.reservations.length === 0 ? (
          <div class="empty-state card">
            <p>予約がありません。新規予約ボタンから予約を登録してください。</p>
          </div>
        ) : (
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>日付</th>
                  <th>時間</th>
                  <th>会議室</th>
                  <th>参加者</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {props.reservations.map((reservation) => (
                  <tr key={reservation.id} onClick={() => navigateToDetail(reservation.id)} style={{ cursor: 'pointer' }}>
                    <td>{reservation.title}</td>
                    <td>{formatDate(reservation.date)}</td>
                    <td>{reservation.startTime} - {reservation.endTime}</td>
                    <td>{reservation.roomNumber}</td>
                    <td>{reservation.attendees}</td>
                    <td>
                      <button 
                        class="btn btn-secondary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToDetail(reservation.id);
                        }}
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}); 