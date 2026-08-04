<template>
    <div class="signup-container">
        <div class="signup-box">
            <h2>🚀 간편 회원가입</h2>
            <p class="subtitle">AI Video Studio의 멤버가 되어 나만의 영상을 만들어보세요.</p>

            <form @submit.prevent="handleSignup">
                <div class="form-group">
                    <label for="name">이름</label>
                    <input
                            type="text"
                            id="name"
                            v-model="signupData.name"
                            placeholder="홍길동"
                            required
                    />
                </div>

                <div class="form-group">
                    <label for="email">이메일 주소 (ID로 사용)</label>
                    <div class="email-input-group">
                        <input
                                type="email"
                                id="email"
                                v-model="signupData.email"
                                @input="handleEmailInput"
                                placeholder="example@email.com"
                                required
                        />
                        <button type="button" class="btn-check-id" @click="checkIdDuplicate">
                            중복 확인
                        </button>
                    </div>
                    <p v-if="idCheckMessage" :class="['check-msg', isIdChecked ? 'success' : 'error']">
                        {{ idCheckMessage }}
                    </p>
                </div>

                <div class="form-group">
                    <label for="userPhone">연락처 (휴대폰 번호)</label>
                    <input
                            type="tel"
                            id="userPhone"
                            v-model="signupData.userPhone"
                            @input="formatPhoneNumber"
                            placeholder="010-XXXX-XXXX"
                            maxlength="13"
                            required
                    />
                </div>

                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input
                            type="password"
                            id="password"
                            v-model="signupData.password"
                            placeholder="비밀번호를 입력해주세요"
                            required
                    />

                    <div class="password-guidelines" v-if="signupData.password.length > 0">
                        <span :class="{ 'is-valid': isLengthValid }">
                            {{ isLengthValid ? '✓' : '✗' }} 8자 이상
                        </span>
                        <span :class="{ 'is-valid': isLetterNumValid }">
                            {{ isLetterNumValid ? '✓' : '✗' }} 영문/숫자 포함
                        </span>
                        <span :class="{ 'is-valid': isSpecialValid }">
                            {{ isSpecialValid ? '✓' : '✗' }} 특수문자 포함
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="passwordConfirm">비밀번호 확인</label>
                    <input
                            type="password"
                            id="passwordConfirm"
                            v-model="signupData.passwordConfirm"
                            placeholder="비밀번호를 한번 더 입력해주세요"
                            required
                    />
                </div>

                <button type="submit" class="btn-signup-submit">
                    동의하고 가입하기 🎉
                </button>
            </form>

            <div class="signup-footer">
                <p>이미 계정이 있으신가요?</p>
                <router-link to="/login" class="link-login">이미 가입하셨다면? 로그인하기 &rarr;</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'SignupView',
      data() {
        return {
          signupData: {
            name: '',
            email: '',
            userPhone: '',
            password: '',
            passwordConfirm: ''
          },
          // 🛠️ 중복 확인 상태 관리를 위한 변수 추가
          isIdChecked: false,       // 중복 확인 통과 여부 (true여야 가입 가능)
          idCheckMessage: ''        // 화면에 보여줄 안내 문구 ("사용 가능한~" 또는 "이미 존재하는~")
        }
      },
      computed: {
        isLengthValid() {
          return this.signupData.password.length >= 8;
        },
        isLetterNumValid() {
          const hasLetter = /[A-Za-z]/.test(this.signupData.password);
          const hasNumber = /\d/.test(this.signupData.password);
          return hasLetter && hasNumber;
        },
        isSpecialValid() {
          const specialRegex = /[{}[\]/?.,;:|)*~` !^\-_+<>@###$%&\\=('"]/ ;
          return specialRegex.test(this.signupData.password);
        },
        isPasswordAllValid() {
          return this.isLengthValid && this.isLetterNumValid && this.isSpecialValid;
        }
      },
      methods: {
        // 🛠️ 사용자가 이메일 칸을 다시 타이핑하면 중복 확인 인증을 취소하는 안전장치
        handleEmailInput() {
          this.isIdChecked = false;
          this.idCheckMessage = '';
        },

        // 🛠️ [중복 확인] 버튼을 눌렀을 때 실행되는 비동기 함수
        async checkIdDuplicate() {
          if (!this.signupData.email) {
            alert("이메일 주소를 먼저 입력해 주세요! 📧");
            return;
          }

          // 간단한 이메일 형식 체크
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(this.signupData.email)) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
          }

          try {
            // 백엔드 중복 체크 API 호출
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check-id?userId=${encodeURIComponent(this.signupData.email)}`);

            if (response.ok) {
              const data = await response.getJson ? await response.json() : JSON.parse(await response.text());

              if (data.isDuplicate) {
                this.isIdChecked = false;
                this.idCheckMessage = "❌ 이미 존재하는 이메일(ID)입니다.";
              } else {
                this.isIdChecked = true;
                this.idCheckMessage = "✅ 사용 가능한 이메일(ID)입니다.";
              }
            } else {
              alert("중복 체크 중 오류가 발생했습니다.");
            }
          } catch (error) {
            console.error("중복 체크 통신 에러:", error);
            alert("백엔드 서버와 통신에 실패했습니다.");
          }
        },

        formatPhoneNumber(event) {
          let val = event.target.value.replace(/[^0-9]/g, '');
          if (val.length < 4) {
            this.signupData.userPhone = val;
          } else if (val.length < 8) {
            this.signupData.userPhone = val.substr(0, 3) + '-' + val.substr(3);
          } else {
            this.signupData.userPhone = val.substr(0, 3) + '-' + val.substr(3, 4) + '-' + val.substr(7);
          }
        },

        async handleSignup() {
          // 🛠️ [중복 확인 여부 커트라인 추가] 가입 전 인증 완료 체크
          if (!this.isIdChecked) {
            alert("아이디 중복 확인을 먼저 완료해 주세요! 🔍");
            return;
          }

          if (!this.isPasswordAllValid) {
            alert("비밀번호 규칙을 모두 만족해야 가입이 가능합니다! 🔐");
            return;
          }

          if (this.signupData.password !== this.signupData.passwordConfirm) {
            alert("입력하신 두 비밀번호가 서로 다릅니다. 다시 확인해 주세요!");
            return;
          }

          const requestBody = {
            userId: this.signupData.email,
            password: this.signupData.password,
            name: this.signupData.name,
            phone: this.signupData.userPhone,
            email: this.signupData.email
          };

          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
            });

            if (response.ok) {
              alert(`Movie Day Studio 회원이 되신 것을 환영합니다! 🎉\n${this.signupData.name}님, 로그인 후 서비스를 이용해 주세요.`);
              this.$router.push('/login');
            } else {
              const errorMsg = await response.text();
              alert(errorMsg);
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
    /* 🛠️ 중복 확인 버튼과 라벨을 위한 스타일 추가 */
    .email-input-group {
        display: flex;
        gap: 10px;
    }
    .btn-check-id {
        background-color: #00c6ff;
        color: #000;
        border: none;
        border-radius: 10px;
        padding: 0 20px;
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.2s;
    }
    .btn-check-id:hover {
        background-color: #0072ff;
        color: #fff;
    }
    .check-msg {
        margin-top: 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .check-msg.success {
        color: #10b981; /* 초록색 */
    }
    .check-msg.error {
        color: #ef4444; /* 빨간색 */
    }

    /* 봉준님이 올려주신 예쁜 원래 스타일 코드가 그대로 유지됩니다. */
    .signup-container { padding: 60px 20px; max-width: 500px; margin: 0 auto; width: 100%; box-sizing: border-box; }
    .signup-box { background-color: #131a26; border-radius: 20px; padding: 45px 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.05); }
    .signup-box h2 { font-size: 28px; margin-top: 0; margin-bottom: 10px; text-align: center; background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { text-align: center; color: #717f96; font-size: 14px; margin-bottom: 40px; }
    .form-group { margin-bottom: 22px; }
    .form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #9aa4b7; }
    input[type="text"], input[type="email"], input[type="tel"], input[type="password"] { width: 100%; padding: 14px; background-color: #0b0f19; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white; font-size: 15px; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s, box-shadow 0.3s; }
    input:focus { outline: none; border-color: #00c6ff; box-shadow: 0 0 10px rgba(0, 198, 255, 0.2); }
    .btn-signup-submit { width: 100%; padding: 16px; background: linear-gradient(45deg, #ff4e50, #f9d423); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 78, 80, 0.3); transition: transform 0.2s, box-shadow 0.2s; margin-top: 15px; }
    .btn-signup-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 78, 80, 0.5); }
    .signup-footer { margin-top: 35px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px; }
    .signup-footer p { margin: 0 0 8px 0; font-size: 14px; color: #64748b; }
    .link-login { color: #00c6ff; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
    .link-login:hover { color: #0072ff; }
    @media (max-width: 768px) { .signup-box { padding: 30px 20px; } .signup-box h2 { font-size: 24px; } }
</style>