<template>
  <form @submit.prevent="submitForm" class="reservation-form">
    <div class="form-row" style="margin-bottom: 15px;">
      <label for="title">会議タイトル</label>
      <input 
        id="title" 
        v-model="form.title" 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.title }"
        placeholder="例: 週次プロジェクトミーティング"
      />
      <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
    </div>

    <div class="form-row" style="margin-bottom: 15px;">
      <label for="date">日付</label>
      <input 
        id="date" 
        v-model="form.date" 
        type="date" 
        class="form-control" 
        :class="{ 'is-invalid': errors.date }"
      />
      <div v-if="errors.date" class="invalid-feedback">{{ errors.date }}</div>
    </div>

    <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
      <div style="flex: 1;">
        <label for="startTime">開始時間</label>
        <input 
          id="startTime" 
          v-model="form.startTime" 
          type="time" 
          class="form-control" 
          :class="{ 'is-invalid': errors.startTime }"
        />
        <div v-if="errors.startTime" class="invalid-feedback">{{ errors.startTime }}</div>
      </div>

      <div style="flex: 1;">
        <label for="endTime">終了時間</label>
        <input 
          id="endTime" 
          v-model="form.endTime" 
          type="time" 
          class="form-control" 
          :class="{ 'is-invalid': errors.endTime }"
        />
        <div v-if="errors.endTime" class="invalid-feedback">{{ errors.endTime }}</div>
      </div>
    </div>

    <div class="form-row" style="margin-bottom: 15px;">
      <label for="roomNumber">会議室</label>
      <select 
        id="roomNumber" 
        v-model="form.roomNumber" 
        class="form-control" 
        :class="{ 'is-invalid': errors.roomNumber }"
      >
        <option value="">選択してください</option>
        <option v-for="room in roomOptions" :key="room.id" :value="room.id">
          {{ room.name }}
        </option>
      </select>
      <div v-if="errors.roomNumber" class="invalid-feedback">{{ errors.roomNumber }}</div>
    </div>

    <div class="form-row" style="margin-bottom: 15px;">
      <label>参加者</label>
      <div class="attendee-input-container" style="display: flex; margin-bottom: 10px;">
        <input 
          v-model="newAttendee" 
          type="text" 
          class="form-control" 
          placeholder="参加者の名前を入力" 
          @keyup.enter="addAttendee"
          style="flex-grow: 1; margin-right: 10px;"
          :class="{ 'is-invalid': errors.attendees }"
        />
        <button 
          type="button" 
          class="btn" 
          @click="addAttendee"
          style="white-space: nowrap;"
        >
          追加
        </button>
      </div>
      
      <!-- 候補リスト -->
      <div v-if="newAttendee && filteredAttendeeOptions.length > 0" class="attendee-suggestions" style="margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; max-height: 150px; overflow-y: auto;">
        <div 
          v-for="option in filteredAttendeeOptions" 
          :key="option" 
          class="attendee-suggestion-item" 
          @click="selectAttendee(option)"
          style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
        >
          {{ option }}
        </div>
      </div>
      
      <!-- 参加者タグリスト -->
      <div class="attendee-tags" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
        <div 
          v-for="(attendee, index) in attendeeList" 
          :key="index" 
          class="attendee-tag" 
          style="background-color: #e1f5fe; padding: 5px 10px; border-radius: 4px; display: flex; align-items: center;"
        >
          {{ attendee }}
          <button 
            type="button" 
            class="remove-attendee-btn" 
            @click="removeAttendee(index)" 
            style="background: none; border: none; color: #999; margin-left: 5px; cursor: pointer; font-size: 14px;"
          >
            ×
          </button>
        </div>
      </div>
      
      <div v-if="errors.attendees" class="invalid-feedback" style="display: block;">{{ errors.attendees }}</div>
    </div>

    <div class="form-row" style="margin-bottom: 15px;">
      <label for="description">説明</label>
      <textarea 
        id="description" 
        v-model="form.description" 
        class="form-control" 
        :class="{ 'is-invalid': errors.description }"
        rows="4" 
        placeholder="会議の目的や議題などを入力してください"
      ></textarea>
      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
    </div>

    <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 10px;">
      <button type="button" class="btn btn-secondary" @click="cancelForm">キャンセル</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? '処理中...' : submitText }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
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
      
      // バリデーション成功時のみsubmit処理を実行
      if (isValid) {
        // 日付が確実に含まれるよう明示的に指定
        const submitData = { 
          ...form.value,
          date: form.value.date // 明示的に日付を含める
        };
        emit('submit', submitData);
      }
    };
    
    const cancelForm = () => {
      router.back();
    };
    
    return {
      form,
      errors,
      roomOptions,
      newAttendee,
      attendeeList,
      filteredAttendeeOptions,
      addAttendee,
      selectAttendee,
      removeAttendee,
      submitForm,
      cancelForm
    };
  }
});
</script>

<style scoped>
.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.attendee-suggestion-item:hover {
  background-color: #f5f5f5;
}

.attendee-tag:hover {
  background-color: #b3e5fc;
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
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn:disabled {
  opacity: 0.65;
}
</style> 