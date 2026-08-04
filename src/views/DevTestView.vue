<template>
    <div style="padding: 100px 20px; text-align: center; min-height: 100vh; background: #0b0f19;">
        <h1 style="color: #fff; margin-bottom: 10px;">🧪 시크릿 연동 테스트 룸</h1>
        <p style="color: #9aa4b7; margin-bottom: 40px;">메인 화면을 해치지 않고 여기서 비밀리에 기능 테스트를 진행합니다.</p>

        <SignUpTest @signUpSuccess="fetchUsers" />

        <hr style="width: 50%; margin: 40px auto; border-color: rgba(255,255,255,0.1);" />

        <button @click="fetchUsers" style="padding: 12px 24px; font-size: 15px; cursor: pointer; background-color: #42b983; color: white; border: none; border-radius: 5px; font-weight: bold; margin-bottom: 30px;">
            DB 유저 목록 새로고침 🔄
        </button>

        <div v-if="userList.length > 0" style="max-width: 700px; margin: 0 auto; text-align: left;">
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; background: #131a26; border-color: rgba(255,255,255,0.1); color: #fff;">
                <thead style="background-color: rgba(255,255,255,0.05); color: #00c6ff;">
                <tr>
                    <th style="padding: 12px;">번호</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>이메일</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in userList" :key="user.userIdx">
                    <td style="padding: 12px;">{{ user.userIdx }}</td>
                    <td>{{ user.userId }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.email }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    // components 폴더에 짜둔 회원가입 부품을 가져옵니다.
    import SignUpTest from '../components/SignUpTest.vue'

    export default {
      name: 'DevTestView',
      components: {
        SignUpTest
      },
      data() {
        return {
          userList: []
        }
      },
      methods: {
        async fetchUsers() {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`)
            this.userList = await response.json()
          } catch (error) {
            console.error('유저 목록 로드 실패:', error)
          }
        }
      },
      mounted() {
        this.fetchUsers() // 페이지 열리자마자 목록 조회
      }
    }
</script>