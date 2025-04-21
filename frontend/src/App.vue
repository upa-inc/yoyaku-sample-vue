<template>
  <div class="app">
    <header class="header">
      <div class="container" @click="router.push('/')" style="cursor: pointer;">
        <h1>会議予約システム</h1>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    
    return {
      router
    };
  }
});
</script>

<style scoped>
/* ここにスタイルを追加できます */
</style> 