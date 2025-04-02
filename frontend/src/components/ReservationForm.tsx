import { defineComponent, ref, computed, onMounted, PropType } from 'vue';
import { format } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';

interface ReservationData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  attendees: string;
  roomNumber: string;
}

interface RoomOption {
  id: string;
  name: string;
}

interface FormErrors {
  [key: string]: string;
}

export default defineComponent({
  name: 'ReservationForm',
  props: {
    initialData: {
      type: Object as PropType<ReservationData>,
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
    
    const form = ref<ReservationData>({ ...props.initialData });
    const errors = ref<FormErrors>({});
    
    // 会議室の選択肢を定義
    const roomOptions = ref<RoomOption[]>([
      { id: '101', name: '101号室 (小会議室)' },
      { id: '102', name: '102号室 (小会議室)' },
      { id: '201', name: '201号室 (中会議室)' },
      { id: '202', name: '202号室 (中会議室)' },
      { id: '301', name: '301号室 (大会議室)' },
      { id: '302', name: '302号室 (大会議室)' },
      { id: '401', name: '401号室 (役員会議室)' },
    ]);
    
    // 参加者管理用の変数
    const newAttendee = ref('');
    const attendeeList = ref<string[]>([]);
    
    // 参加者候補リスト
    const attendeeOptions = ref([
      '山田 太郎',
      '佐藤 花子',
      '田中 一郎',
      '鈴木 次郎',
      '高橋 三郎',
      '伊藤 四郎',
      '渡辺 五郎',
      '小林 恵子',
      '加藤 美咲',
      '吉田 直樹'
    ]);
    
    // 候補リストにない参加者のフィルタリング用
    const filteredAttendeeOptions = computed(() => {
      return attendeeOptions.value.filter(
        option => !attendeeList.value.includes(option) && 
                 option.toLowerCase().includes(newAttendee.value.toLowerCase())
      );
    });
    
    // 初期データから参加者リストを設定
    onMounted(() => {
      // URLから日付情報を取得
      if (route.query.date) {
        form.value.date = route.query.date as string;
      }
      
      // URLから時間情報を取得
      if (route.query.time) {
        form.value.startTime = route.query.time as string;
        
        // 初期の終了時間を開始時間の1時間後に設定
        const startHour = parseInt((route.query.time as string).split(':')[0]);
        const endHour = (startHour + 1) % 24;
        form.value.endTime = `${endHour.toString().padStart(2, '0')}:00`;
      }
      
      // 初期の参加者リストを設定
      if (props.initialData.attendees) {
        attendeeList.value = props.initialData.attendees.split(',').map(item => item.trim()).filter(Boolean);
      }
    });
    
    // 参加者追加関数 - 手動で追加する場合用
    const addAttendee = () => {
      if (newAttendee.value.trim() && !attendeeList.value.includes(newAttendee.value.trim())) {
        attendeeList.value.push(newAttendee.value.trim());
        newAttendee.value = '';
        updateAttendees();
      }
    };
    
    // 選択リストから参加者追加
    const selectAttendee = (attendee: string) => {
      if (!attendeeList.value.includes(attendee)) {
        attendeeList.value.push(attendee);
        newAttendee.value = '';
        updateAttendees();
      }
    };
    
    // 参加者削除関数
    const removeAttendee = (index: number) => {
      attendeeList.value.splice(index, 1);
      // 参加者リストを更新
      updateAttendees();
    };
    
    // フォームの attendees フィールドを更新
    const updateAttendees = () => {
      form.value.attendees = attendeeList.value.join(', ');
    };
    
    const validateForm = () => {
      console.log('test');
      const newErrors: FormErrors = {};
      
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
      
      if (!form.value.attendees.trim()) {
        newErrors.attendees = '参加者は必須です';
      }
      
      if (!form.value.description.trim()) {
        newErrors.description = '説明は必須です';
      }
      
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };
    
    const submitForm = () => {
      // validateFormを実行して、その結果を変数に保存
      const isValid = validateForm();

      console.log('送信前のフォームデータ:', form.value); // デバッグ用のログを追加
      console.log(isValid);
      
      // バリデーション成功時のみsubmit処理を実行
      if (isValid) {
        // 日付が確実に含まれるよう明示的に指定
        const submitData = { 
          ...form.value,
          date: form.value.date // 明示的に日付を含める
        };
        emit('submit', submitData);
        router.push('/reservations/new');
      }
      // バリデーション失敗時は何もせず、エラーメッセージが表示されたままになる
    };
    
    const cancelForm = () => {
      router.push('/reservations/new');
    };
    
    return () => (
      <div class="reservation-form card">
        <h2>新規予約</h2>
        <form onSubmit={(e: Event) => { e.preventDefault(); submitForm(); }}>
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
            <select
              id="roomNumber"
              v-model={form.value.roomNumber}
              class="form-control"
            >
              <option value="">会議室を選択してください</option>
              {roomOptions.value.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {errors.value.roomNumber && <div class="error-text">{errors.value.roomNumber}</div>}
          </div>
          
          <div class="form-group">
            <label for="attendees">参加者</label>
            <div class="attendees-input-container">
              <div class="attendees-tags">
                {attendeeList.value.map((attendee, index) => (
                  <span class="attendee-tag" key={index}>
                    {attendee}
                    <button 
                      type="button" 
                      class="remove-tag" 
                      onClick={() => removeAttendee(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div class="attendee-dropdown-container">
                <input
                  id="newAttendee"
                  v-model={newAttendee.value}
                  type="text"
                  class="form-control"
                  placeholder="参加者を選択または入力"
                  onKeyPress={(e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addAttendee(); } }}
                />
                {newAttendee.value && (
                  <div class="attendee-dropdown">
                    {filteredAttendeeOptions.value.length > 0 ? (
                      filteredAttendeeOptions.value.map((option, index) => (
                        <div 
                          key={index} 
                          class="attendee-option"
                          onClick={() => selectAttendee(option)}
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div class="attendee-option no-results" onClick={() => addAttendee()}>
                        候補がありません。新しい名前として追加できます。
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {errors.value.attendees && <div class="error-text">{errors.value.attendees}</div>}
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
            {errors.value.description && <div class="error-text">{errors.value.description}</div>}
          </div>
          
          <div class="button-group" style={{ marginTop: '20px' }}>
            <button
              type="submit"
              class="btn btn-primary"
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