import { defineComponent, ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'ReservationForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        attendees: '',
        roomNumber: ''
      })
    },
    submitText: {
      type: String,
      default: '予約を登録'
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    
    const form = ref({ ...props.initialData });
    const errors = ref({});
    
    // URLパラメータから日時情報を読み取る
    onMounted(() => {
      // URLから日付情報を取得
      if (route.query.date) {
        form.value.date = route.query.date;
      }
      
      // URLから時間情報を取得
      if (route.query.time) {
        form.value.startTime = route.query.time;
        
        // 初期の終了時間を開始時間の1時間後に設定
        const startHour = parseInt(route.query.time.split(':')[0]);
        const endHour = (startHour + 1) % 24;
        form.value.endTime = `${endHour.toString().padStart(2, '0')}:00`;
      }
    });
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!form.value.title.trim()) {
        newErrors.title = '会議タイトルは必須です';
      }
      
      if (!form.value.date) {
        newErrors.date = '日付は必須です';
      }
      
      if (!form.value.startTime) {
        newErrors.startTime = '開始時間は必須です';
      }
      
      if (!form.value.endTime) {
        newErrors.endTime = '終了時間は必須です';
      }
      
      if (form.value.startTime >= form.value.endTime) {
        newErrors.endTime = '終了時間は開始時間より後である必要があります';
      }
      
      if (!form.value.roomNumber) {
        newErrors.roomNumber = '会議室番号は必須です';
      }
      
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };
    
    const submitForm = () => {
      if (validateForm()) {
        emit('submit', { ...form.value });
        router.push('/reservations');
      }
    };
    
    const cancelForm = () => {
      router.push('/reservations');
    };
    
    const isFormValid = computed(() => {
      return form.value.title && 
             form.value.date && 
             form.value.startTime && 
             form.value.endTime && 
             form.value.roomNumber;
    });
    
    return () => (
      <div class="reservation-form card">
        <h2>新規予約</h2>
        <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
          <div class="form-group">
            <label for="title">会議タイトル</label>
            <input
              id="title"
              v-model={form.value.title}
              type="text"
              class="form-control"
              placeholder="会議のタイトルを入力"
              required
            />
            {errors.value.title && <div class="error-text">{errors.value.title}</div>}
          </div>
          
          <div class="form-group">
            <label for="date">日付</label>
            <input
              id="date"
              v-model={form.value.date}
              type="date"
              class="form-control"
              required
            />
            {errors.value.date && <div class="error-text">{errors.value.date}</div>}
          </div>
          
          <div class="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div class="form-group" style={{ flex: 1 }}>
              <label for="startTime">開始時間</label>
              <input
                id="startTime"
                v-model={form.value.startTime}
                type="time"
                class="form-control"
                required
              />
              {errors.value.startTime && <div class="error-text">{errors.value.startTime}</div>}
            </div>
            
            <div class="form-group" style={{ flex: 1 }}>
              <label for="endTime">終了時間</label>
              <input
                id="endTime"
                v-model={form.value.endTime}
                type="time"
                class="form-control"
                required
              />
              {errors.value.endTime && <div class="error-text">{errors.value.endTime}</div>}
            </div>
          </div>
          
          <div class="form-group">
            <label for="roomNumber">会議室番号</label>
            <input
              id="roomNumber"
              v-model={form.value.roomNumber}
              type="text"
              class="form-control"
              placeholder="例: 301"
              required
            />
            {errors.value.roomNumber && <div class="error-text">{errors.value.roomNumber}</div>}
          </div>
          
          <div class="form-group">
            <label for="attendees">参加者</label>
            <input
              id="attendees"
              v-model={form.value.attendees}
              type="text"
              class="form-control"
              placeholder="参加者をカンマ区切りで入力"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">説明</label>
            <textarea
              id="description"
              v-model={form.value.description}
              class="form-control"
              rows="3"
              placeholder="会議の目的や内容を入力"
            ></textarea>
          </div>
          
          <div class="button-group" style={{ marginTop: '20px' }}>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={props.isSubmitting || !isFormValid.value}
            >
              {props.isSubmitting ? '送信中...' : props.submitText}
            </button>
            <button type="button" class="btn btn-secondary" onClick={cancelForm} style={{ marginLeft: '10px' }}>キャンセル</button>
          </div>
        </form>
      </div>
    );
  }
}); 