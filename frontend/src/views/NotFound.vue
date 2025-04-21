<template>
  <div class="not-found-page">
    <div class="card" style="text-align: center; padding: 40px 20px;">
      <h2 style="font-size: 32px; margin-bottom: 20px;">404</h2>
      <h3 style="margin-bottom: 30px;">ページが見つかりませんでした</h3>
      <p style="margin-bottom: 30px;">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <button class="btn" @click="router.push('/')">
        トップページに戻る
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NotFoundView',
  setup() {
    const router = useRouter();
    
    return {
      router
    };
  }
});
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
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
  cursor: pointer;
}

.btn:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}
</style> 