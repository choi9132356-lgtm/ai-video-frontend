<template>
    <div class="login-container">
        <div class="login-box">
            <h2>🔐 로그인</h2>
            <p class="subtitle">AI Video Studio에 오신 것을 환영합니다.</p>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">이메일 주소</label>
                    <input
                            type="email"
                            id="email"
                            v-model="loginData.email"
                            placeholder="example@email.com"
                            required
                    />
                </div>

                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input
                            type="password"
                            id="password"
                            v-model="loginData.password"
                            placeholder="비밀번호를 입력해주세요"
                            required
                    />
                </div>

                <button type="submit" class="btn-login-submit">
                    로그인하기 🚀
                </button>
            </form>

            <div class="login-footer">
                <p>아직 계정이 없으신가요?</p>
                <router-link to="/signup" class="link-signup">간편 회원가입 하러가기 &rarr;</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'LoginView',
      data() {
        return {
          // 💡 유저가 입력한 값을 실시간으로 담아둘 데이터 상자
          loginData: {
            email: '',
            password: ''
          }
        }
      },
      methods: {
        async handleLogin() {
          console.log("--- 로그인 시도 데이터 ---");
          console.log("입력 이메일:", this.loginData.email);
          console.log("입력 비밀번호:", this.loginData.password);

          // 💡 백엔드 DTO 바구니 구조(userId, password)와 명칭을 1:1로 맞추어 포장합니다.
          const requestBody = {
            userId: this.loginData.email, // 가입할 때 이메일을 ID로 썼으므로 로그인할 때도 마찬가지입니다!
            password: this.loginData.password
          };

          try {
            // 1. 진짜 백엔드 서버의 UserController 로그인 API 주소로 전송!
            const response = await fetch('http://localhost:8080/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
            });

            // 2. 백엔드 검증 통과! (200 OK 상태코드를 받은 경우)
            if (response.ok) {
              const user = await response.json(); // 로그인 성공한 유저 정보를 백엔드에서 받아옴
              alert(`${user.name}님, 환영합니다! 로그인이 완료되었습니다. 🎉`);

              // 💡 로그인한 사람의 이름과 ID를 브라우저 임시 저장소(sessionStorage)에 보관해 둡니다.
              // 나중에 메인화면 상단바 등에 "홍길동님 환영합니다"라고 띄울 때 요긴하게 쓰입니다.
              sessionStorage.setItem('userName', user.name);
              sessionStorage.setItem('userId', user.userId);
              sessionStorage.setItem('userRole', user.role);

              this.$router.push('/'); // 로그인 대성공 후 메인 화면으로 리다이렉트!
            } else {
              // 3. 백엔드 검증 실패 (400 Bad Request - 존재하지 않는 아이디, 비밀번호 불일치 등)
              const errorMsg = await response.text();
              alert(errorMsg); // 백엔드가 뱉은 한글 메시지가 그대로 팝업으로 뜹니다.
            }
          } catch (error) {
            console.error('통신 에러:', error);
            alert('백엔드 서버와 통신에 실패했습니다.');
          }
        }
      }
    }
</script>

<style scoped>
    .login-container {
      padding: 80px 20px;
      max-width: 500px; /* 로그인창은 아담하고 깔끔하게 너비 제한 */
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .login-box {
      background-color: #131a26;
      border-radius: 20px;
      padding: 45px 40px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .login-box h2 {
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 10px;
      text-align: center;
      background: linear-gradient(45deg, #ff4e50, #f9d423); /* 로그인 타이틀은 메인 로고 색상과 통일 */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      text-align: center;
      color: #717f96;
      font-size: 14px;
      margin-bottom: 40px;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #9aa4b7;
    }

    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 14px;
      background-color: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
      font-size: 15px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #ff4e50;
      box-shadow: 0 0 10px rgba(255, 78, 80, 0.2);
    }

    .btn-login-submit {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 보라빛 네온 버튼 */
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 15px;
    }

    .btn-login-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(118, 75, 162, 0.5);
    }

    .login-footer {
      margin-top: 35px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 25px;
    }

    .login-footer p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #64748b;
    }

    .link-signup {
      color: #00c6ff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: color 0.2s;
    }

    .link-signup:hover {
      color: #0072ff;
    }

    /* 모바일 반응형 처리 */
    @media (max-width: 768px) {
      .login-box {
        padding: 30px 20px;
      }
      .login-box h2 {
        font-size: 24px;
      }
    }
</style>