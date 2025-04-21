<template>
  <div v-if="loading" class="loading">読み込み中...</div>
  <div v-else class="reservation-detail card">
    <h2>{{ reservation.title }}</h2>
    
    <div class="detail-row">
      <strong>日付:</strong> {{ formatDate(reservation.date) }}
    </div>
    
    <div class="detail-row">
      <strong>時間:</strong> {{ reservation.startTime }} - {{ reservation.endTime }}
    </div>
    
    <div class="detail-row">
      <strong>会議室:</strong> {{ reservation.roomNumber }}
    </div>
    
    <div v-if="reservation.attendees" class="detail-row">
      <strong>参加者:</strong> {{ reservation.attendees }}
    </div>
    
    <div v-if="reservation.description" class="detail-row">
      <strong>説明:</strong>
      <p>{{ reservation.description }}</p>
    </div>
    
    <div class="detail-row">
      <strong>予約ID:</strong> {{ reservation.id }}
    </div>
    
    <div v-if="reservation.createdAt" class="detail-row">
      <strong>作成日時:</strong> {{ new Date(reservation.createdAt).toLocaleString('ja-JP') }}
    </div>
    
    <div class="detail-actions" style="margin-top: 20px;">
      <button class="btn" @click="navigateToEdit">
        編集
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';

interface Reservation {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  attendees?: string;
  description?: string;
  createdAt?: string;
}

export default defineComponent({
  name: 'ReservationDetailComponent',
  props: {
    reservation: {
      type: Object as PropType<Reservation>,
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
    
    const formatDate = (dateStr: string) => {
      try {
        return format(new Date(dateStr), 'yyyy年MM月dd日');
      } catch (e) {
        return dateStr;
      }
    };
    
    return {
      navigateToEdit,
      formatDate
    };
  }
});
</script>

<style scoped>
.reservation-detail {
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-row {
  margin-bottom: 15px;
}

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
}

.btn:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}
</style> 