import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div class="app">
        <header class="header">
          <div class="container">
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