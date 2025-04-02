import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, isSameDay } from 'date-fns';

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
    const currentMonth = ref(new Date());
    const viewMode = ref('calendar'); // 'calendar' または 'list'
    
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
    
    const previousMonth = () => {
      const newDate = new Date(currentMonth.value);
      newDate.setMonth(newDate.getMonth() - 1);
      currentMonth.value = newDate;
    };
    
    const nextMonth = () => {
      const newDate = new Date(currentMonth.value);
      newDate.setMonth(newDate.getMonth() + 1);
      currentMonth.value = newDate;
    };
    
    const getDaysInMonth = () => {
      const start = startOfMonth(currentMonth.value);
      const end = endOfMonth(currentMonth.value);
      return eachDayOfInterval({ start, end });
    };
    
    const getReservationsForDay = (day) => {
      return props.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return isSameDay(reservationDate, day);
      });
    };
    
    const toggleViewMode = () => {
      viewMode.value = viewMode.value === 'calendar' ? 'list' : 'calendar';
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
          <div>
            <button class="btn btn-secondary" onClick={toggleViewMode} style={{ marginRight: '10px' }}>
              {viewMode.value === 'calendar' ? 'リスト表示' : 'カレンダー表示'}
            </button>
            <button class="btn" onClick={navigateToCreate}>新規予約</button>
          </div>
        </div>
        
        {props.loading ? (
          <div class="loading">読み込み中...</div>
        ) : props.reservations.length === 0 ? (
          <div class="empty-state card">
            <p>予約がありません。新規予約ボタンから予約を登録してください。</p>
          </div>
        ) : viewMode.value === 'calendar' ? (
          <div class="calendar-view">
            <div class="calendar-navigation" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px' 
            }}>
              <button onClick={previousMonth} class="btn btn-sm">前月</button>
              <h3>{format(currentMonth.value, 'yyyy年 MM月')}</h3>
              <button onClick={nextMonth} class="btn btn-sm">次月</button>
            </div>
            
            <div class="calendar-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '5px'
            }}>
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div class="calendar-header" style={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  padding: '10px',
                  backgroundColor: '#f5f5f5' 
                }}>
                  {day}
                </div>
              ))}
              
              {getDaysInMonth().map(day => {
                const dayReservations = getReservationsForDay(day);
                return (
                  <div 
                    class={`calendar-day ${dayReservations.length > 0 ? 'has-reservations' : ''}`}
                    style={{ 
                      minHeight: '100px',
                      border: '1px solid #ddd',
                      padding: '5px',
                      backgroundColor: dayReservations.length > 0 ? '#e6f7ff' : 'white'
                    }}
                  >
                    <div class="day-number" style={{ fontWeight: 'bold' }}>{getDate(day)}</div>
                    {dayReservations.length > 0 && (
                      <div class="day-reservations">
                        {dayReservations.map(reservation => (
                          <div 
                            class="reservation-chip"
                            onClick={() => navigateToDetail(reservation.id)}
                            style={{ 
                              backgroundColor: '#1890ff',
                              color: 'white',
                              padding: '2px 5px',
                              borderRadius: '3px',
                              marginBottom: '3px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {reservation.startTime}: {reservation.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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