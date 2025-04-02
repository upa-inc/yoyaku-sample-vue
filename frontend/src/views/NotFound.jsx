import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NotFoundView',
  setup() {
    const router = useRouter();
    
    return () => (
      <div class="not-found-page">
        <div class="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>404</h2>
          <h3 style={{ marginBottom: '30px' }}>ページが見つかりませんでした</h3>
          <p style={{ marginBottom: '30px' }}>
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <button class="btn" onClick={() => router.push('/')}>
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }
}); 