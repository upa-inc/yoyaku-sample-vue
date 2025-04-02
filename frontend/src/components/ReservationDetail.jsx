import { defineComponent } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ReservationDetailComponent',
  props: {
    reservation: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    
    const navigateToEdit = () => {
      router.push(`/reservations/${props.reservation.id}/edit`);
    };
    
    const formatDate = (dateStr) => {
      try {
        return format(new Date(dateStr), 'yyyy年MM月dd日');
      } catch (e) {
        return dateStr;
      }
    };
    
    return () => {
      if (props.loading) {
        return <div class="loading">読み込み中...</div>;
      }
      
      const { reservation } = props;
      
      return (
        <div class="reservation-detail card">
          <h2>{reservation.title}</h2>
          
          <div class="detail-row">
            <strong>日付:</strong> {formatDate(reservation.date)}
          </div>
          
          <div class="detail-row">
            <strong>時間:</strong> {reservation.startTime} - {reservation.endTime}
          </div>
          
          <div class="detail-row">
            <strong>会議室:</strong> {reservation.roomNumber}
          </div>
          
          {reservation.attendees && (
            <div class="detail-row">
              <strong>参加者:</strong> {reservation.attendees}
            </div>
          )}
          
          {reservation.description && (
            <div class="detail-row">
              <strong>説明:</strong>
              <p>{reservation.description}</p>
            </div>
          )}
          
          <div class="detail-row">
            <strong>予約ID:</strong> {reservation.id}
          </div>
          
          {reservation.createdAt && (
            <div class="detail-row">
              <strong>作成日時:</strong> {new Date(reservation.createdAt).toLocaleString('ja-JP')}
            </div>
          )}
          
          <div class="detail-actions" style={{ marginTop: '20px' }}>
            <button class="btn" onClick={navigateToEdit}>
              編集
            </button>
          </div>
        </div>
      );
    }
  }
}); 