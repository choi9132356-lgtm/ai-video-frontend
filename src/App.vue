<template>
  <div id="vue-root-container">

    <header>
      <router-link to="/" class="logo-link">
        <div class="logo">🎬 Movie Day Studio</div>
      </router-link>

      <!-- 모바일 햄버거 버튼 (좁은 화면에서만 표시) -->
      <button class="hamburger-btn" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen" aria-label="메뉴 열기">
        <span v-if="!isMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>

      <div class="nav-buttons" :class="{ 'is-open': isMenuOpen }" @click="isMenuOpen = false">
        <!-- 🎯 [신규 추가] 누구나 언제든 예제 영상을 볼 수 있도록 첫 번째 메뉴로 쇼케이스 링크 배치 -->
        <router-link to="/showcase" class="nav-menu-item">샘플 쇼케이스 ✨</router-link>
        <router-link to="/process" class="nav-menu-item">제작 과정 🗺️</router-link>
        <router-link to="/gallery" class="nav-menu-item">작업 갤러리 🖼️</router-link>

        <router-link to="/my-orders" class="nav-menu-item">내 주문 내역 📥</router-link>
        <router-link v-if="isLoggedIn && userRole === 'ADMIN'" to="/admin" class="nav-menu-item admin-menu-item">ERP 관리자 🛠️</router-link>
        <span class="nav-divider">|</span>

        <template v-if="!isLoggedIn">
          <a href="/login" class="btn btn-login">로그인</a>
          <a href="/signup" class="btn btn-signup">회원가입</a>
        </template>

        <template v-else>
          <span class="user-welcome">👋 {{ loginUserName }}님</span>
          <button @click="handleLogout" class="btn btn-login" style="background: transparent; cursor: pointer; color: #ff4e50; font-weight: bold;">
            로그아웃
          </button>
        </template>
      </div>
    </header>

    <router-view></router-view>

    <div v-if="$route.path === '/'" class="main-content-wrapper">
      <section class="hero">
        <h1>상상하는 모든 스토리를<br><span>AI 영상</span>으로 만드세요</h1>
        <p>텍스트와 몇 장의 사진만으로 전문가가 만든 것 같은 고퀄리티 애니메이션과 뮤직비디오를 몇 분 만에 완성합니다.</p>

        <router-link to="/order" class="btn-main">지금 제작하기 🚀</router-link>
      </section>

      <section class="services">
        <h2>🔥 인기 제작 스타일</h2>
        <div class="grid">

          <router-link :to="{ path: '/order', query: { style: 'disney' } }" class="card-link-wrapper">
            <div class="card">
              <div class="card-image disney-bg"></div>
              <div class="card-content">
                <h3>디즈니 스타일 식전영상</h3>
                <div class="card-price">80,000원</div>
                <p>우리 커플의 러브스토리를 마법 같은 디즈니 3D 애니메이션 감성으로 재탄생시킵니다. 결혼식을 더욱 특별하게 만들어보세요.</p>
                <span class="btn-order">지금 주문하기 &rarr;</span>
              </div>
            </div>
          </router-link>

          <router-link :to="{ path: '/order', query: { style: 'ghibli' } }" class="card-link-wrapper">
            <div class="card">
              <div class="card-image ghibli-bg"></div>
              <div class="card-content">
                <h3>지브리 스타일 뮤직비디오</h3>
                <div class="card-price">160,000원</div>
                <p>특유의 따뜻하고 서정적인 수채화풍 지브리 감성 일러스트 비주얼. 내가 좋아하는 음악에 맞춰 감성 가득한 뮤비를 제작합니다.</p>
                <span class="btn-order">지금 주문하기 &rarr;</span>
              </div>
            </div>
          </router-link>

        </div>
      </section>

      <footer>
        <div class="footer-content">
          <h3>Contact Us</h3>
          <p>제작 문의나 커스텀 영상 요청은 아래 인스타그램 디엠(DM)으로 편하게 연락주세요!</p>
          <a href="https://www.instagram.com/MovieDayStudio" target="_blank" class="instagram-btn">
            📸 @MovieDayStudio 문의하기
          </a>
          <div class="copyright">
            &copy; 2026 AI Video Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>

  </div>
</template>

<script>
  export default {
      name: 'App',
      data() {
        return {
          isLoggedIn: false,
          loginUserName: '',
          userRole: '',
          isMenuOpen: false
        }
      },
      mounted() {
        this.checkLoginStatus();
      },
      watch: {
        $route() {
          this.checkLoginStatus();
          this.isMenuOpen = false; // 페이지 이동 시 모바일 메뉴 닫기
        }
      },
      methods: {
        checkLoginStatus() {
          const name = sessionStorage.getItem('userName');
          const role = sessionStorage.getItem('userRole');

          if (name) {
            this.isLoggedIn = true;
            this.loginUserName = name;
            this.userRole = role;
          } else {
            this.isLoggedIn = false;
            this.loginUserName = '';
            this.userRole = '';
          }
        },
        handleLogout() {
          if (confirm("로그아웃 하시겠습니까?")) {
            sessionStorage.clear();
            this.isLoggedIn = false;
            this.loginUserName = '';
            this.userRole = '';
            alert("로그아웃 되었습니다. 👋");
            this.$router.push('/');
          }
        }
      }
    }
</script>

<style>
  body { font-family: 'Pretendard', -apple-system, sans-serif; margin: 0; padding: 0; background: linear-gradient(125deg, #0b0f19, #111827, #1b153a, #0b0f19); background-size: 400% 400%; animation: auroraBg 18s ease infinite; color: #ffffff; overflow-x: hidden; min-height: 100vh; display: flex; flex-direction: column; }
  #vue-root-container { display: flex; flex-direction: column; min-height: 100vh; width: 100%; }
  .main-content-wrapper { display: flex; flex-direction: column; flex: 1; }
  @keyframes auroraBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background-color: rgba(11, 15, 25, 0.7); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  header .logo { font-size: 24px; font-weight: bold; background: linear-gradient(45deg, #ff4e50, #f9d423); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  header .nav-buttons { display: flex; align-items: center; }
  .nav-menu-item { color: #9aa4b7; text-decoration: none; font-size: 14px; font-weight: 600; margin-right: 20px; transition: color 0.3s; }
  .nav-menu-item:hover { color: #ffffff; }
  .admin-menu-item { color: #f9d423; }
  .admin-menu-item:hover { color: #ffe066; }
  .nav-divider { color: rgba(255, 255, 255, 0.15); margin-right: 15px; }
  header .nav-buttons .btn { text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-left: 10px; transition: all 0.3s; }
  header .nav-buttons .btn-login { color: #aaa; }
  header .nav-buttons .btn-login:hover { color: #fff; }
  header .nav-buttons .btn-signup { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
  /* 햄버거 버튼 — 데스크톱에서는 숨김 */
  .hamburger-btn { display: none; background: none; border: none; color: #fff; font-size: 26px; cursor: pointer; padding: 4px 8px; line-height: 1; }
  .router-link-active:not(.logo-link) { color: #00c6ff !important; font-weight: bold; }
  .hero { text-align: center; padding: 60px 20px 45px 20px; background: radial-gradient(circle at top, rgba(99, 102, 241, 0.2) 0%, rgba(11, 15, 25, 0.5) 100%); flex-shrink: 0; }
  .hero h1 { font-size: 38px; margin-top: 0; margin-bottom: 15px; font-weight: 800; line-height: 1.3; }
  .hero h1 span { background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: 16px; color: #9aa4b7; max-width: 580px; margin: 0 auto 25px auto; line-height: 1.5; }
  .hero .btn-main { text-decoration: none; display: inline-block; padding: 12px 28px; background: linear-gradient(45deg, #ff4e50, #f9d423); color: #000; font-size: 16px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(255, 78, 80, 0.4); transition: all 0.3s; }
  .hero .btn-main:hover { transform: scale(1.05); }
  .services { padding: 40px 40px 80px 40px; max-width: 1400px; margin: 0 auto; border-top: 1px solid rgba(255, 255, 255, 0.08); width: 100%; box-sizing: border-box; flex-shrink: 0; }
  .services h2 { font-size: 36px; font-weight: 700; margin-bottom: 50px; text-align: center; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 40px; justify-content: center; }

  .card-link-wrapper { text-decoration: none; color: inherit; display: block; }
  .card { background-color: #131a26; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5); transition: transform 0.3s, box-shadow 0.3s; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; }
  .card-link-wrapper:hover .card { transform: translateY(-12px); box-shadow: 0 20px 50px rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.5); }
  .card-image { height: 320px; width: 100%; background-size: cover; background-position: center; position: relative; flex-shrink: 0; }
  .card-image::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, transparent 50%, #131a26); }
  .disney-bg { background-image: url('/disney.png'); }
  .ghibli-bg { background-image: url('/ghibli.png'); }
  .card-content { padding: 35px; background-color: #131a26; flex-grow: 1; }
  .card-content h3 { font-size: 26px; margin: 0 0 15px 0; color: #fff; }
  .card-content p { color: #9aa4b7; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; }
  .card-content .btn-order { display: inline-block; text-decoration: none; color: #00c6ff; font-weight: 600; font-size: 16px; transition: color 0.2s; }
  .card-link-wrapper:hover .btn-order { color: #0072ff; }

  footer { background-color: #060911; padding: 60px 20px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: auto; width: 100%; box-sizing: border-box; flex-shrink: 0; }
  .footer-content h3 { font-size: 18px; color: #fff; margin: 0 0 10px 0; letter-spacing: 1px; }
  .footer-content p { color: #717f96; font-size: 14px; margin-bottom: 25px; }
  .instagram-btn { display: inline-block; text-decoration: none; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: bold; transition: transform 0.2s, box-shadow 0.2s; }
  .instagram-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(220, 39, 67, 0.4); }
  .copyright { margin-top: 40px; font-size: 12px; color: #4a5568; }

  @media (max-width: 768px) {
    header { padding: 15px 20px; }
    header .logo { font-size: 20px; }

    /* 햄버거 버튼 표시 */
    .hamburger-btn { display: block; }

    /* 메뉴: 기본 숨김 → 햄버거 클릭 시 세로 드롭다운으로 펼침 */
    header .nav-buttons {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      background: rgba(11, 15, 25, 0.97);
      backdrop-filter: blur(12px);
      padding: 10px 20px 20px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      gap: 4px;
    }
    header .nav-buttons.is-open { display: flex; }

    .nav-menu-item { font-size: 15px; margin-right: 0; padding: 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .nav-divider { display: none; }

    header .nav-buttons .btn { display: block; text-align: center; margin: 6px 0 0 0; padding: 12px; font-size: 15px; }
    .user-welcome { padding: 12px 8px; display: block; }

    .hero { padding: 40px 20px 30px 20px; }
    .hero h1 { font-size: 26px; }
    .hero p { font-size: 14px; margin-bottom: 20px; }
    .services { padding: 50px 20px 60px 20px; }
    .services h2 { font-size: 26px; margin-bottom: 30px; }
    .grid { grid-template-columns: 1fr; gap: 20px; }
    .card-image { height: 220px; }
    footer { padding: 40px 20px; }
  }

  .card-price { font-size: 20px; font-weight: 800; color: #f9d423; margin-bottom: 12px; }
  .logo-link { text-decoration: none; color: inherit; }
  .user-welcome { color: #ffffff; font-size: 14px; font-weight: 600; margin-right: 10px; }
</style>