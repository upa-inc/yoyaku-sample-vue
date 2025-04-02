import { defineComponent } from 'vue';
import { RouterView, useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    return () => (
      <div class="app">
        <header class="header">
          <div class="container" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <h1>会議予約システム</h1>
          </div>
        </header>
        <main class="container">
          <RouterView />
        </main>
      </div>
    );
  }
}); 