<template>
  <div class="order-container">
    <div class="order-box">
      <h2>🎬 AI 영상 제작 주문서</h2>
      <p class="subtitle">상상 속 스토리를 고퀄리티 영상으로 실현해 드립니다.</p>

      <form @submit.prevent="submitOrder">
        <div class="form-group">
          <label>제작 스타일 선택</label>
          <div class="style-selector">
            <label class="style-option" :class="{ active: orderData.videoStyle === 'disney' }">
              <input type="radio" v-model="orderData.videoStyle" value="disney" />
              <span class="emoji">🏰</span>
              <span class="style-title">디즈니 스타일</span>
              <div class="product-info">
                <span>⏱️ 길이: 최대 1분</span>
                <span>🖼️ 장면: 최대 6장</span>
                <span class="price">80,000원</span>
              </div>
            </label>

            <label class="style-option" :class="{ active: orderData.videoStyle === 'ghibli' }">
              <input type="radio" v-model="orderData.videoStyle" value="ghibli" />
              <span class="emoji">🍃</span>
              <span class="style-title">지브리 스타일</span>
              <div class="product-info">
                <span>⏱️ 길이: 최대 3분</span>
                <span>🖼️ 장면: 최대 14장</span>
                <span class="price">160,000원</span>
              </div>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>추가 옵션 선택 (무료 제공)</label>
          <div class="options-wrapper">
            <label class="checkbox-option">
              <input type="checkbox" v-model="orderData.options.bgm" />
              <span class="checkbox-custom"></span>
              🎵 감성 배경음악(BGM) 삽입 원함
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="orderData.options.narration" />
              <span class="checkbox-custom"></span>
              🎙️ AI 나레이션 목소리 삽입 원함
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="storyText">영상 스토리 및 요청사항</label>
          <textarea
                  id="storyText"
                  v-model="orderData.storyText"
                  rows="6"
                  placeholder="영상의 줄거리나 원하는 연출 흐름을 자유롭게 적어주세요. 구체적일수록 좋습니다! (예: 주인공 두 사람이 기차역에서 처음 만나는 장면으로 시작해 주세요.)"
                  required
          ></textarea>
        </div>

        <div class="form-group">
          <label v-if="orderData.videoStyle === 'disney'">참고용 사진 업로드 (디즈니 스타일은 최대 6장)</label>
          <label v-else>참고용 사진 업로드 (지브리 스타일은 최대 12장)</label>

          <div class="file-upload-zone" @click="triggerFileInput">
            <div class="upload-icon">📸</div>
            <p v-if="uploadedFiles.length === 0">클릭하여 영상 제작에 필요한 사진을 첨부해 주세요.</p>
            <p v-else class="file-count">{{ uploadedFiles.length }}개의 파일이 선택되었습니다.</p>
            <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    multiple
                    accept="image/*"
                    class="hidden-file-input"
            />
          </div>

          <ul v-if="uploadedFiles.length > 0" class="file-list">
            <li v-for="(file, index) in uploadedFiles" :key="index">
              📁 {{ file.name }}
            </li>
          </ul>
        </div>

        <div class="total-price-zone">
          <div class="price-label">최종 결제 금액</div>
          <div class="price-value">{{ currentPrice }}원</div>
        </div>

        <button type="submit" class="btn-submit">
          {{ currentPrice }}원 결제 및 주문하기 🚀
        </button>
      </form>
    </div>

    <div v-if="isModalOpen" class="bank-modal-overlay">
      <div class="bank-modal-box">
        <div class="modal-header">
          <span class="modal-icon">💰</span>
          <h3>주문이 접수되었습니다!</h3>
          <p class="modal-subtitle">아래 계좌로 입금해 주시면 확인 후 제작이 시작됩니다.</p>
        </div>

        <div class="modal-body">
          <div class="bank-info-card">
            <div class="info-row">
              <span class="info-label">입금 은행</span>
              <span class="info-value">카카오뱅크</span>
            </div>
            <div class="info-row">
              <span class="info-label">계좌 번호</span>
              <span class="info-value highlight">3333-11-7735624</span> </div>
            <div class="info-row">
              <span class="info-label">예금주</span>
              <span class="info-value">최봉준</span>
            </div>
            <div class="info-row border-top">
              <span class="info-label">입금 금액</span>
              <span class="info-value price">{{ currentPrice }}원</span>
            </div>
            <div class="info-row">
              <span class="info-label">입금자명</span>
              <span class="info-value notice">※ 주문자 이름과 동일하게 입금해 주세요.</span>
            </div>
          </div>

          <div class="kakaotalk-guide">
            <p>💡 <strong>입금 후 아래 버튼</strong>을 눌러 1:1 메시지를 남겨주시면 <br>신속하게 입금 확인 및 제작 진행을 도와드립니다!</p>
            <a
                    href="https://open.kakao.com/o/sIMtr0Ci"
                    target="_blank"
                    class="btn-kakaotalk"
            >
              <span class="talk-icon">💬</span> 카카오톡 입금 확인 요청하기
            </a> </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModalAndNavigate" class="btn-modal-close">
            확인 (내 주문 내역으로 이동)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OrderView',
    data() {
      return {
        orderData: {
          videoStyle: 'disney',
          storyText: '',
          options: {
            bgm: false,
            narration: false
          }
        },
        uploadedFiles: [],
        // 🛠️ 모달 열림/닫힘 상태 변수 추가
        isModalOpen: false
      }
    },
    computed: {
      currentPrice() {
        if (this.orderData.videoStyle === 'disney') {
          return '80,000';
        } else {
          return '160,000';
        }
      }
    },
    mounted() {
      const savedUserId = sessionStorage.getItem('userId');
      if (!savedUserId) {
        alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다. 🔒");
        this.$router.push('/login');
        return;
      }

      const selectedStyle = this.$route.query.style;
      if (selectedStyle === 'disney' || selectedStyle === 'ghibli') {
        this.orderData.videoStyle = selectedStyle;
      }
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const files = Array.from(event.target.files);
        const maxLimit = this.orderData.videoStyle === 'disney' ? 6 : 12;

        if (files.length > maxLimit) {
          alert(`${this.orderData.videoStyle === 'disney' ? '디즈니' : '지브리'} 스타일은 사진을 최대 ${maxLimit}장까지만 업로드할 수 있습니다.`);
          return;
        }
        this.uploadedFiles = files;
      },
      async submitOrder() {
        const savedUserId = sessionStorage.getItem('userId');
        if (!savedUserId) {
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
          this.$router.push('/login');
          return;
        }

        const priceNum = this.orderData.videoStyle === 'disney' ? 80000 : 160000;
        const styleText = this.orderData.videoStyle === 'disney' ? '디즈니 스타일 식전영상' : '지브리 스타일 뮤직비디오';

        const formData = new FormData();
        formData.append('userId', savedUserId);
        formData.append('videoStyle', styleText);
        formData.append('price', priceNum);
        formData.append('bgmYn', this.orderData.options.bgm);
        formData.append('narrationYn', this.orderData.options.narration);
        formData.append('textStory', this.orderData.storyText);

        this.uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        try {
          const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            // ⭕ [수정] 칙칙한 기존 Alert창 대신 모달 팝업을 띄웁니다!
            this.isModalOpen = true;
          } else {
            alert("주문 처리 중 서버 에러가 발생했습니다.");
          }
        } catch (error) {
          console.error("통신 에러:", error);
          alert("백엔드 서버와 통신에 실패했습니다.");
        }
      },
      // 🛠️ 모달 닫고 '내 주문 내역'으로 보내주는 신규 메서드
      closeModalAndNavigate() {
        this.isModalOpen = false;
        this.$router.push('/my-orders');
      }
    }
  }
</script>

<style scoped>
  /* 🛠️ 무통장 입금 안내 모달 전용 CSS 추가 */
  .bank-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
  }
  .bank-modal-box {
      background-color: #131a26;
      border-radius: 20px;
      width: 90%;
      max-width: 460px;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      text-align: center;
      animation: fadeInModal 0.3s ease-out;
  }
  @keyframes fadeInModal {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
  }
  .modal-icon { font-size: 40px; display: block; margin-bottom: 10px; }
  .bank-modal-box h3 { font-size: 22px; margin: 0 0 8px 0; color: #fff; }
  .modal-subtitle { font-size: 14px; color: #717f96; margin: 0 0 25px 0; line-height: 1.4; }
  .bank-info-card {
      background-color: #0b0f19;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 25px;
      text-align: left;
  }
  .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 15px;
  }
  .info-row:last-child { margin-bottom: 0; }
  .info-label { color: #717f96; font-weight: 500; }
  .info-value { color: #e2e8f0; font-weight: 600; }
  .info-value.highlight { color: #00c6ff; font-family: monospace; font-size: 16px; }
  .info-value.price { color: #ff4e50; font-size: 18px; font-weight: bold; }
  .info-value.notice { color: #f9d423; font-size: 12px; font-weight: normal; }
  .border-top {
      border-top: 1px dashed rgba(255,255,255,0.1);
      padding-top: 12px;
      margin-top: 12px;
  }
  .kakaotalk-guide {
      background-color: rgba(249, 212, 35, 0.05);
      border: 1px solid rgba(249, 212, 35, 0.15);
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 25px;
  }
  .kakaotalk-guide p { font-size: 13px; color: #cbd5e1; margin: 0 0 12px 0; line-height: 1.5; }
  .btn-kakaotalk {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background-color: #fef01b;
      color: #3c1e1e;
      border-radius: 10px;
      text-decoration: none;
      font-weight: bold;
      font-size: 15px;
      box-shadow: 0 4px 12px rgba(254, 240, 27, 0.2);
      transition: transform 0.2s, background-color 0.2s;
  }
  .btn-kakaotalk:hover {
      transform: translateY(-2px);
      background-color: #fadb14;
  }
  .talk-icon { font-size: 16px; }
  .btn-modal-close {
      width: 100%;
      padding: 14px;
      background: linear-gradient(45deg, #334155, #1e293b);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
  }
  .btn-modal-close:hover { background: #475569; }

  /* 원래 유지되는 스타일 */
  .order-container { padding: 60px 20px; max-width: 850px; margin: 0 auto; width: 100%; box-sizing: border-box; }
  .order-box { background-color: #131a26; border-radius: 20px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.05); }
  .order-box h2 { font-size: 28px; margin-top: 0; margin-bottom: 10px; text-align: center; background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .subtitle { text-align: center; color: #717f96; font-size: 15px; margin-bottom: 40px; }
  .form-group { margin-bottom: 25px; }
  .form-group label { display: block; font-size: 15px; font-weight: 600; margin-bottom: 10px; color: #9aa4b7; }
  input[type="text"], input[type="tel"], textarea { width: 100%; padding: 14px; background-color: #0b0f19; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white; font-size: 15px; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s, box-shadow 0.3s; }
  input:focus, textarea:focus { outline: none; border-color: #00c6ff; box-shadow: 0 0 10px rgba(0, 198, 255, 0.2); }
  .style-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .style-option { background-color: #0b0f19; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 25px 20px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.3s; }
  .style-option input[type="radio"] { display: none; }
  .style-option .emoji { font-size: 36px; margin-bottom: 10px; }
  .style-option .style-title { font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 15px; }
  .product-info { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 14px; color: #717f96; width: 100%; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px; }
  .product-info .price { margin-top: 10px; font-size: 20px; font-weight: 800; color: #f9d423; }
  .style-option.active { border-color: #00c6ff; background-color: rgba(0, 198, 255, 0.04); box-shadow: 0 0 20px rgba(0, 198, 255, 0.15); }
  .options-wrapper { display: flex; gap: 30px; background-color: #0b0f19; padding: 15px 20px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); }
  .checkbox-option { display: flex; align-items: center; cursor: pointer; font-size: 14px; color: #9aa4b7; user-select: none; }
  .checkbox-option input { display: none; }
  .checkbox-custom { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 4px; margin-right: 10px; display: inline-block; position: relative; transition: all 0.2s; }
  .checkbox-option input:checked + .checkbox-custom { background-color: #00c6ff; border-color: #00c6ff; }
  .checkbox-option input:checked + .checkbox-custom::after { content: '✓'; position: absolute; color: #000; font-size: 14px; font-weight: bold; top: -2px; left: 3px; }
  .file-upload-zone { border: 2px dashed rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 30px; text-align: center; background-color: #0b0f19; cursor: pointer; transition: border-color 0.3s; }
  .file-upload-zone:hover { border-color: #00c6ff; }
  .upload-icon { font-size: 32px; margin-bottom: 10px; }
  .file-upload-zone p { margin: 0; font-size: 14px; color: #64748b; }
  .file-upload-zone .file-count { color: #00c6ff; font-weight: bold; }
  .hidden-file-input { display: none; }
  .file-list { margin-top: 15px; padding-left: 5px; list-style: none; }
  .file-list li { font-size: 13px; color: #9aa4b7; margin-bottom: 5px; }
  .total-price-zone { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding: 20px; background: linear-gradient(90deg, rgba(19, 26, 38, 1) 0%, rgba(11, 15, 25, 1) 100%); border-radius: 12px; border-left: 4px solid #ff4e50; }
  .price-label { font-size: 16px; font-weight: bold; color: #9aa4b7; }
  .price-value { font-size: 26px; font-weight: 800; color: #ff4e50; }
  .btn-submit { width: 100%; padding: 18px; background: linear-gradient(45deg, #ff4e50, #f9d423); color: #000; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 78, 80, 0.3); transition: transform 0.2s, box-shadow 0.2s; margin-top: 20px; }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 78, 80, 0.5); }
  @media (max-width: 768px) { .order-box { padding: 25px 20px; } .style-selector { grid-template-columns: 1fr; gap: 15px; } .options-wrapper { flex-direction: column; gap: 12px; } .order-box h2 { font-size: 22px; } .total-price-zone { flex-direction: column; gap: 10px; text-align: center; } }
</style>