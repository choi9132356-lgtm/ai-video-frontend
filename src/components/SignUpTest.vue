<template>
    <div style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; width: 400px; margin: 0 auto 30px auto; border-radius: 8px; text-align: left; background: #131a26;">
        <h3 style="text-align: center; margin-top: 0; color: #fff;">📝 신규 회원가입 (테스트)</h3>

        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom:5px; color: #9aa4b7;">아이디</label>
            <input v-model="signUpForm.userId" type="text" style="width: 93%; padding: 8px; background: #1b2436; border: 1px solid #334155; color: white; border-radius: 4px;" placeholder="아이디 입력" />
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom:5px; color: #9aa4b7;">비밀번호</label>
            <input v-model="signUpForm.password" type="password" style="width: 93%; padding: 8px; background: #1b2436; border: 1px solid #334155; color: white; border-radius: 4px;" placeholder="비밀번호 입력" />
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom:5px; color: #9aa4b7;">이름</label>
            <input v-model="signUpForm.name" type="text" style="width: 93%; padding: 8px; background: #1b2436; border: 1px solid #334155; color: white; border-radius: 4px;" placeholder="이름 입력" />
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom:5px; color: #9aa4b7;">전화번호</label>
            <input v-model="signUpForm.phone" type="text" style="width: 93%; padding: 8px; background: #1b2436; border: 1px solid #334155; color: white; border-radius: 4px;" placeholder="010-0000-0000" />
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display:block; margin-bottom:5px; color: #9aa4b7;">이메일</label>
            <input v-model="signUpForm.email" type="email" style="width: 93%; padding: 8px; background: #1b2436; border: 1px solid #334155; color: white; border-radius: 4px;" placeholder="example@email.com" />
        </div>

        <button @click="handleSignUp" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">
            가입하기 🚀
        </button>
    </div>
</template>

<script>
    export default {
      name: 'SignUpTest',
      emits: ['signUpSuccess'],
      data() {
        return {
          signUpForm: {
            userId: '',
            password: '',
            name: '',
            phone: '',
            email: ''
          }
        }
      },
      methods: {
        async handleSignUp() {
          if (!this.signUpForm.userId || !this.signUpForm.password || !this.signUpForm.name) {
            alert('아이디, 비밀번호, 이름은 필수입니다!')
            return
          }

          try {
            const response = await fetch('http://localhost:8080/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.signUpForm)
            })

            if (response.ok) {
              alert('회원가입 성공! 🎉')
              this.signUpForm = { userId: '', password: '', name: '', phone: '', email: '' }
              this.$emit('signUpSuccess')
            } else {
              alert('회원가입 실패 😭')
            }
          } catch (error) {
            console.error('연결 에러:', error)
            alert('백엔드 서버 통신 실패!')
          }
        }
      }
    }
</script>