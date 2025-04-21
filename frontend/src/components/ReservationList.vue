<template>
  <div class="reservation-list">
    <div class="list-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
      <h2 class="page-title">予約一覧</h2>
      <div>
        <div class="view-mode-buttons" style="display: inline-flex; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden">
          <button 
            @click="viewMode = 'calendar'" 
            :class="`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-light'}`"
            style="border-radius: 0; border-right: 1px solid #ddd; padding: 5px 10px"
          >
            <i class="fas fa-calendar-alt" style="margin-right: 5px"></i>カレンダー
          </button>
          <button 
            @click="viewMode = 'timeline'" 
            :class="`btn btn-sm ${viewMode === 'timeline' ? 'btn-primary' : 'btn-light'}`"
            style="border-radius: 0; border-right: 1px solid #ddd; padding: 5px 10px"
          >
            <i class="fas fa-clock" style="margin-right: 5px"></i>タイムライン
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`"
            style="border-radius: 0; padding: 5px 10px"
          >
            <i class="fas fa-list" style="margin-right: 5px"></i>リスト
          </button>
        </div>
        <button class="btn" @click="navigateToCreate">新規予約</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="reservations.length === 0" class="empty-state card">
      <p>予約がありません。新規予約ボタンから予約を登録してください。</p>
    </div>
    
    <!-- カレンダー表示 -->
    <div v-else-if="viewMode === 'calendar'" class="calendar-view">
      <div class="calendar-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
        <button @click="previousMonth" class="btn btn-sm">前月</button>
        <h3>{{ format(currentMonth, 'yyyy年 MM月') }}</h3>
        <button @click="nextMonth" class="btn btn-sm">次月</button>
      </div>
      
      <!-- ここにカレンダーグリッドの実装を追加 -->
      <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
        <div v-for="(day, index) in ['日', '月', '火', '水', '木', '金', '土']" :key="`header-${index}`" class="calendar-header" style="text-align: center; padding: 10px; font-weight: bold;">
          {{ day }}
        </div>
        
        <!-- 月初めの空白を埋める -->
        <div v-for="i in getFirstDayOfMonthOffset()" :key="`blank-start-${i}`" class="calendar-day calendar-blank" style="min-height: 100px; background: #f5f5f5; border-radius: 4px;"></div>
        
        <!-- 各日付のセル -->
        <div v-for="day in getDaysInMonth()" :key="day.toISOString()" class="calendar-day" style="min-height: 100px; border: 1px solid #ddd; border-radius: 4px; padding: 8px; position: relative;">
          <div class="date-display" style="font-weight: bold; margin-bottom: 5px;">{{ getDate(day) }}</div>
          
          <!-- その日の予約一覧 -->
          <div v-for="reservation in getReservationsForDay(day)" :key="reservation.id" class="day-reservation" @click="navigateToDetail(reservation.id)" style="background: #f0f8ff; margin-bottom: 4px; padding: 4px; border-radius: 3px; font-size: 0.8em; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            {{ reservation.title }} ({{ reservation.startTime }} - {{ reservation.endTime }})
          </div>
          
          <!-- 新規予約を追加するプラスボタン -->
          <button @click="navigateToCreateWithDate(day)" class="add-reservation-btn" style="position: absolute; right: 5px; bottom: 5px; background: #eee; border: none; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">+</button>
        </div>
        
        <!-- 月末の空白を埋める -->
        <div v-for="i in getLastDayOfMonthOffset()" :key="`blank-end-${i}`" class="calendar-day calendar-blank" style="min-height: 100px; background: #f5f5f5; border-radius: 4px;"></div>
      </div>
    </div>
    
    <!-- リスト表示 -->
    <div v-else-if="viewMode === 'list'" class="list-view card">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">タイトル</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">日付</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">時間</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">会議室</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">参加者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in sortedReservations" :key="reservation.id" @click="navigateToDetail(reservation.id)" style="cursor: pointer;">
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ reservation.title }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ formatDate(reservation.date) }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ reservation.startTime }} - {{ reservation.endTime }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ reservation.roomNumber }}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ reservation.attendees }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- タイムライン表示 -->
    <div v-else class="timeline-view">
      <div class="timeline-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
        <button @click="previousWeek" class="btn btn-sm">前週</button>
        <h3>{{ format(startOfWeek(currentWeek), 'yyyy/MM/dd') }} - {{ format(endOfWeek(currentWeek), 'yyyy/MM/dd') }}</h3>
        <button @click="nextWeek" class="btn btn-sm">次週</button>
      </div>
      
      <!-- ここにタイムラインの実装を追加 -->
      <div class="timeline-grid" style="display: grid; grid-template-columns: 80px repeat(7, 1fr); gap: 1px; border: 1px solid #ddd;">
        <!-- ヘッダー行 -->
        <div style="padding: 10px; text-align: center; background: #f5f5f5; border-bottom: 1px solid #ddd;"></div>
        <div v-for="day in getDaysInWeek()" :key="day.toISOString()" style="padding: 10px; text-align: center; background: #f5f5f5; border-bottom: 1px solid #ddd; border-left: 1px solid #ddd;">
          {{ format(day, 'M/d') }} ({{ ['日', '月', '火', '水', '木', '金', '土'][day.getDay()] }})
        </div>
        
        <!-- 時間帯ごとの行 -->
        <template v-for="hour in Array.from({ length: 14 }, (_, i) => i + 8)" :key="`hour-${hour}`">
          <!-- 時間表示 -->
          <div style="padding: 10px; text-align: right; background: #f5f5f5; border-top: 1px solid #ddd;">
            {{ hour }}:00
          </div>
          
          <!-- 各曜日のセル -->
          <div v-for="day in getDaysInWeek()" :key="`${day.toISOString()}-${hour}`" 
               style="padding: 5px; min-height: 40px; border-top: 1px solid #ddd; border-left: 1px solid #ddd;"
               @click="navigateToCreateWithDateTime(day, hour)">
            <div v-for="reservation in getReservationsForTimeSlot(day, hour)" :key="reservation.id" 
                 class="timeline-reservation" 
                 @click.stop="navigateToDetail(reservation.id)" 
                 style="background: #e1f5fe; padding: 4px; border-radius: 3px; margin-bottom: 2px; font-size: 0.8em; cursor: pointer;">
              {{ reservation.title }} ({{ reservation.roomNumber }})
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, isSameDay,
  startOfWeek, endOfWeek, addDays, parseISO, isWithinInterval
} from 'date-fns';

interface Reservation {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  attendees: string;
  description: string;
}

export default defineComponent({
  name: 'ReservationListComponent',
  props: {
    reservations: {
      type: Array as PropType<Reservation[]>,
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
    
    const navigateToDetail = (id: string) => {
      router.push(`/reservations/${id}`);
    };
    
    const navigateToCreate = () => {
      router.push('/reservations/new');
    };
    
    const navigateToCreateWithDate = (date: Date) => {
      // 日付を YYYY-MM-DD 形式に変換
      const formattedDate = format(date, 'yyyy-MM-dd');
      router.push(`/reservations/new?date=${formattedDate}`);
    };
    
    const navigateToCreateWithDateTime = (date: Date, hour: number) => {
      // 日付と時間を YYYY-MM-DD と HH:00 形式に変換
      const formattedDate = format(date, 'yyyy-MM-dd');
      const formattedTime = `${hour.toString().padStart(2, '0')}:00`;
      router.push(`/reservations/new?date=${formattedDate}&time=${formattedTime}`);
    };
    
    const formatDate = (dateStr: string) => {
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
    
    const getFirstDayOfMonthOffset = () => {
      const firstDay = startOfMonth(currentMonth.value);
      return firstDay.getDay(); // 0 (日曜日) から 6 (土曜日)
    };
    
    const getLastDayOfMonthOffset = () => {
      const lastDay = endOfMonth(currentMonth.value);
      return 6 - lastDay.getDay(); // 0 (日曜日) から 6 (土曜日)
    };
    
    const getReservationsForDay = (day: Date) => {
      return props.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return isSameDay(reservationDate, day);
      });
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
    
    const getReservationsForTimeSlot = (day: Date, hour: number) => {
      return props.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        if (!isSameDay(reservationDate, day)) return false;
        
        const startHour = parseInt(reservation.startTime.split(':')[0]);
        return startHour === hour;
      });
    };
    
    const sortedReservations = computed(() => {
      return [...props.reservations].sort((a, b) => {
        // 日付で比較
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        
        // 時間で比較
        const timeA = a.startTime;
        const timeB = b.startTime;
        return timeA.localeCompare(timeB);
      });
    });
    
    return {
      currentMonth,
      currentWeek,
      viewMode,
      navigateToDetail,
      navigateToCreate,
      navigateToCreateWithDate,
      navigateToCreateWithDateTime,
      formatDate,
      previousMonth,
      nextMonth,
      getDaysInMonth,
      getFirstDayOfMonthOffset,
      getLastDayOfMonthOffset,
      getReservationsForDay,
      previousWeek,
      nextWeek,
      getDaysInWeek,
      getReservationsForTimeSlot,
      sortedReservations,
      // date-fnsの関数をテンプレートで使用できるように公開
      format,
      getDate,
      startOfWeek,
      endOfWeek
    };
  }
});
</script>

<style scoped>
.calendar-day:hover {
  background-color: #f9f9f9;
}

.day-reservation:hover {
  background-color: #e3f2fd;
}

.timeline-reservation:hover {
  background-color: #b3e5fc;
}

tr:hover {
  background-color: #f5f5f5;
}

.add-reservation-btn:hover {
  background-color: #ddd;
}
</style> 