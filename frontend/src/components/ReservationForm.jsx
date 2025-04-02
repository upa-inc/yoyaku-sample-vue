import { defineComponent, ref, computed } from 'vue';
import { format } from 'date-fns';

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
    const form = ref({ ...props.initialData });
    const errors = ref({});
    
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
      }
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
        <div class="form-group">
          <label for="title">会議タイトル</label>
          <input
            id="title"
            v-model={form.value.title}
            type="text"
            class="form-control"
            placeholder="会議のタイトルを入力"
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
        
        <div class="form-actions">
          <button
            type="button"
            class="btn"
            onClick={submitForm}
            disabled={props.isSubmitting || !isFormValid.value}
          >
            {props.isSubmitting ? '送信中...' : props.submitText}
          </button>
        </div>
      </div>
    );
  }
}); 