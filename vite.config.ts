import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// GitHub Pages 프로젝트 저장소는 https://<user>.github.io/<repo>/ 경로에 배포된다.
// 상대 경로를 사용하면 사용자/조직 사이트와 사용자 도메인에서도 같은 빌드를 쓸 수 있다.
export default defineConfig({
  // base: './',
  plugins: [vue()],
  base: '/UWIN/' 
})
