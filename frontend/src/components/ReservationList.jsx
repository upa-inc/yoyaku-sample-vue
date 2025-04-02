import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, isSameDay, 
         startOfWeek, endOfWeek, addDays, parseISO, isWithinInterval } from 'date-fns';

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
    const currentWeek = ref(new Date());
    const viewMode = ref('calendar'); // 'calendar', 'list', または 'timeline'
    
    const navigateToDetail = (id) => {
      router.push(`/reservations/${id}`);
    };
    
    const navigateToCreate = () => {
      router.push('/reservations/new');
    };
    
    const navigateToCreateWithDate = (date) => {
      // 日付を YYYY-MM-DD 形式に変換
      const formattedDate = format(date, 'yyyy-MM-dd');
      router.push(`/reservations/new?date=${formattedDate}`);
    };
    
    const navigateToCreateWithDateTime = (date, hour) => {
      // 日付と時間を YYYY-MM-DD と HH:00 形式に変換
      const formattedDate = format(date, 'yyyy-MM-dd');
      const formattedTime = `${hour.toString().padStart(2, '0')}:00`;
      router.push(`/reservations/new?date=${formattedDate}&time=${formattedTime}`);
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
      if (viewMode.value === 'calendar') {
        viewMode.value = 'timeline';
      } else if (viewMode.value === 'timeline') {
        viewMode.value = 'list';
      } else {
        viewMode.value = 'calendar';
      }
    };
    
    const previousWeek = () => {
      const newDate = new Date(currentWeek.value);
      newDate.setDate(newDate.getDate() - 7);
      currentWeek.value = newDate;
    };
    
    const nextWeek = () => {
      const newDate = new Date(currentWeek.value);
      newDate.setDate(newDate.getDate() + 7);
      currentWeek.value = newDate;
    };
    
    const getDaysInWeek = () => {
      const start = startOfWeek(currentWeek.value, { weekStartsOn: 0 });
      const end = endOfWeek(currentWeek.value, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    };
    
    const getReservationsForTimeSlot = (day, hour) => {
      return props.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        if (!isSameDay(reservationDate, day)) return false;
        
        const startHour = parseInt(reservation.startTime.split(':')[0]);
        return startHour === hour;
      });
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
            <div class="view-mode-buttons" style={{ 
              display: 'inline-flex', 
              marginRight: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => viewMode.value = 'calendar'} 
                class={`btn btn-sm ${viewMode.value === 'calendar' ? 'btn-primary' : 'btn-light'}`}
                style={{ 
                  borderRadius: '0', 
                  borderRight: '1px solid #ddd',
                  padding: '5px 10px'
                }}
              >
                <i class="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>カレンダー
              </button>
              <button 
                onClick={() => viewMode.value = 'timeline'} 
                class={`btn btn-sm ${viewMode.value === 'timeline' ? 'btn-primary' : 'btn-light'}`}
                style={{ 
                  borderRadius: '0', 
                  borderRight: '1px solid #ddd',
                  padding: '5px 10px'
                }}
              >
                <i class="fas fa-clock" style={{ marginRight: '5px' }}></i>タイムライン
              </button>
              <button 
                onClick={() => viewMode.value = 'list'} 
                class={`btn btn-sm ${viewMode.value === 'list' ? 'btn-primary' : 'btn-light'}`}
                style={{ 
                  borderRadius: '0',
                  padding: '5px 10px'
                }}
              >
                <i class="fas fa-list" style={{ marginRight: '5px' }}></i>リスト
              </button>
            </div>
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
                    onClick={() => navigateToCreateWithDate(day)}
                    style={{ 
                      minHeight: '100px',
                      border: '1px solid #ddd',
                      padding: '5px',
                      backgroundColor: dayReservations.length > 0 ? '#e6f7ff' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div class="day-number" style={{ fontWeight: 'bold' }}>{getDate(day)}</div>
                    {dayReservations.length > 0 && (
                      <div class="day-reservations">
                        {dayReservations.map(reservation => (
                          <div 
                            class="reservation-chip"
                            onClick={(e) => {
                              e.stopPropagation(); // 親要素のクリックイベントを阻止
                              navigateToDetail(reservation.id);
                            }}
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
        ) : viewMode.value === 'timeline' ? (
          <div class="timeline-view">
            <div class="timeline-navigation" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px' 
            }}>
              <button onClick={previousWeek} class="btn btn-sm">前週</button>
              <h3>{format(startOfWeek(currentWeek.value), 'yyyy/MM/dd')} - {format(endOfWeek(currentWeek.value), 'yyyy/MM/dd')}</h3>
              <button onClick={nextWeek} class="btn btn-sm">次週</button>
            </div>
            
            <div class="timeline-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto repeat(7, 1fr)',
              gap: '1px',
              border: '1px solid #ddd'
            }}>
              {/* 時間帯の列 */}
              <div style={{ backgroundColor: '#f5f5f5', gridRow: '1', gridColumn: '1' }}></div>
              
              {/* 曜日の行 */}
              {getDaysInWeek().map((day, index) => (
                <div style={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderLeft: '1px solid #ddd'
                }}>
                  {format(day, 'E')}
                  <div>{format(day, 'MM/dd')}</div>
                </div>
              ))}
              
              {/* 時間帯とイベント */}
              {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                <>
                  <div style={{ 
                    gridColumn: '1', 
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderTop: '1px solid #ddd',
                    textAlign: 'center'
                  }}>
                    {`${hour}:00`}
                  </div>
                  
                  {getDaysInWeek().map((day, dayIndex) => {
                    const timeSlotReservations = getReservationsForTimeSlot(day, hour);
                    return (
                      <div 
                        onClick={() => navigateToCreateWithDateTime(day, hour)}
                        style={{ 
                          minHeight: '60px',
                          borderTop: '1px solid #ddd',
                          borderLeft: '1px solid #ddd',
                          padding: '5px',
                          backgroundColor: timeSlotReservations.length > 0 ? '#e6f7ff' : 'white',
                          cursor: 'pointer'
                        }}
                      >
                        {timeSlotReservations.map(reservation => (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation(); // 親要素のクリックイベントを阻止
                              navigateToDetail(reservation.id);
                            }}
                            style={{ 
                              backgroundColor: '#1890ff',
                              color: 'white',
                              padding: '3px 5px',
                              borderRadius: '3px',
                              marginBottom: '3px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {reservation.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
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