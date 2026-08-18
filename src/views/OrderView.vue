<template>
  <div class="order-container">
    <div class="order-box">
      <h2>🎬 AI 영상 제작 주문서</h2>
      <p class="subtitle">상상 속 스토리를 고퀄리티 영상으로 실현해 드립니다.</p>

      <!-- ===== 1단계: 스타일 선택 ===== -->
      <div v-if="step === 1" class="style-step">
        <label class="step-label">제작 스타일을 선택해 주세요</label>
        <div class="style-card-grid">
          <div
            v-for="s in styles"
            :key="s.key"
            class="style-card"
            @click="selectStyle(s.key)"
          >
            <img :src="s.image" :alt="s.title" class="style-card-img" />
            <div class="style-card-title">{{ s.title }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 2단계: 플랜 선택 + 주문 입력 ===== -->
      <form v-else @submit.prevent="submitOrder">
        <div class="selected-style-bar">
          <button type="button" class="btn-back" @click="goBackToStyle">← 스타일 다시 선택</button>
          <span class="selected-style-name">
            선택한 스타일: <strong>{{ selectedStyleTitle }}</strong>
          </span>
        </div>

        <div class="form-group">
          <label>플랜을 선택해 주세요</label>
          <div class="plan-selector">
            <label
              v-for="p in plans"
              :key="p.key"
              class="plan-option"
              :class="{ active: orderData.plan === p.key, popular: p.popular }"
            >
              <input type="radio" v-model="orderData.plan" :value="p.key" />
              <span v-if="p.popular" class="popular-badge">⭐ 가장 인기</span>
              <span class="plan-name">{{ p.name }}</span>
              <span class="plan-price">{{ p.priceLabel }}<small>원</small></span>
              <div class="plan-divider"></div>
              <div class="plan-feature"><span class="ic">⏱️</span> 영상 길이 <b>{{ p.duration }}</b></div>
              <div class="plan-feature"><span class="ic">🖼️</span> 이미지 수정 <b>{{ p.imgEdit }}회</b></div>
              <div class="plan-feature"><span class="ic">🎬</span> 영상 수정 <b>{{ p.videoEdit }}회</b></div>
              <div class="plan-check">✓ 선택됨</div>
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
          <label>참고용 사진 업로드</label>

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

        <button type="submit" class="btn-submit" :disabled="!orderData.plan">
          {{ orderData.plan ? currentPrice + '원 결제 및 주문하기 🚀' : '플랜을 선택해 주세요' }}
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
        step: 1,
        styles: [
          { key: 'disney',    title: '디즈니 스타일',      image: '/disney.png' },
          { key: 'ghibli',    title: '지브리 스타일',      image: '/ghibli.png' },
          { key: 'cinematic', title: '시네마틱 실사 스타일', image: '/cinematic.jpg' }
        ],
        plans: [
          { key: 'BASIC',    name: 'Basic',    price: 80000,  priceLabel: '80,000',  duration: '1분',       imgEdit: 1, videoEdit: 1 },
          { key: 'STANDARD', name: 'Standard', price: 140000, priceLabel: '140,000', duration: '1분 30초',  imgEdit: 2, videoEdit: 1, popular: true },
          { key: 'PREMIUM',  name: 'Premium',  price: 230000, priceLabel: '230,000', duration: '2분',       imgEdit: 3, videoEdit: 2 }
        ],
        orderData: {
          videoStyle: null,
          plan: null,
          storyText: '',
          options: {
            bgm: false,
            narration: false
          }
        },
        uploadedFiles: [],
        isModalOpen: false
      }
    },
    computed: {
      selectedStyleTitle() {
        const s = this.styles.find(s => s.key === this.orderData.videoStyle);
        return s ? s.title : '';
      },
      selectedPlan() {
        return this.plans.find(p => p.key === this.orderData.plan) || null;
      },
      currentPrice() {
        return this.selectedPlan ? this.selectedPlan.priceLabel : '0';
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
      if (['disney', 'ghibli', 'cinematic'].includes(selectedStyle)) {
        this.orderData.videoStyle = selectedStyle;
        this.step = 2;
      }
    },
    methods: {
      selectStyle(key) {
        this.orderData.videoStyle = key;
        this.step = 2;
      },
      goBackToStyle() {
        this.step = 1;
        this.orderData.plan = null;
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const files = Array.from(event.target.files);
        this.uploadedFiles = files;
      },
      async submitOrder() {
        const savedUserId = sessionStorage.getItem('userId');
        if (!savedUserId) {
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
          this.$router.push('/login');
          return;
        }

        if (!this.orderData.plan) {
          alert("플랜을 선택해 주세요.");
          return;
        }

        const plan = this.selectedPlan;
        const priceNum = plan.price;

        const styleMap = {
          disney: '디즈니 스타일',
          ghibli: '지브리 스타일',
          cinematic: '시네마틱 실사 스타일'
        };
        const styleText = styleMap[this.orderData.videoStyle] || this.orderData.videoStyle;

        const formData = new FormData();
        formData.append('userId', savedUserId);
        formData.append('videoStyle', styleText);
        formData.append('plan', plan.key);
        formData.append('price', priceNum);
        formData.append('bgmYn', this.orderData.options.bgm);
        formData.append('narrationYn', this.orderData.options.narration);
        formData.append('textStory', this.orderData.storyText);

        this.uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            this.isModalOpen = true;
          } else {
            alert("주문 처리 중 서버 에러가 발생했습니다.");
          }
        } catch (error) {
          console.error("통신 에러:", error);
          alert("백엔드 서버와 통신에 실패했습니다.");
        }
      },
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

  /* ===== 스타일 선택(1단계) 카드 ===== */
  .step-label {
      display: block;
      font-weight: 600;
      margin-bottom: 18px;
      color: #e2e8f0;
      font-size: 16px;
  }
  .style-card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
  }
  .style-card {
      background-color: #0b0f19;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
  }
  .style-card:hover {
      transform: translateY(-6px);
      border-color: #ff4e50;
      box-shadow: 0 10px 25px rgba(255, 78, 80, 0.25);
  }
  .style-card-img {
      width: 100%;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      display: block;
  }
  .style-card-title {
      padding: 16px 10px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
  }

  /* ===== 선택된 스타일 바 + 뒤로가기 ===== */
  .selected-style-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 25px;
      flex-wrap: wrap;
  }
  .btn-back {
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      color: #a0aec0;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
  }
  .btn-back:hover { border-color: #ff4e50; color: #ff4e50; }
  .selected-style-name { color: #a0aec0; font-size: 15px; }
  .selected-style-name strong { color: #fff; }

  /* ===== 플랜 선택(2단계) ===== */
  .plan-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      align-items: stretch;
  }
  .plan-option {
      position: relative;
      background: linear-gradient(180deg, #161f2e, #0d131f);
      border: 2px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 26px 18px 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
      text-align: center;
  }
  .plan-option:hover {
      transform: translateY(-6px);
      border-color: rgba(255, 78, 80, 0.5);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4);
  }
  .plan-option.active {
      border-color: #00c6ff;
      background: linear-gradient(180deg, #1a2940, #0f1a2e);
      box-shadow: 0 0 0 3px rgba(0, 198, 255, 0.35), 0 14px 34px rgba(0, 198, 255, 0.25);
      transform: scale(1.05);
  }
  .plan-option.popular {
      transform: none;
      border-color: rgba(249, 212, 35, 0.4);
  }
  .plan-option.popular:hover {
      transform: translateY(-6px);
  }
  .plan-option.popular.active {
      border-color: #00c6ff;
      background: linear-gradient(180deg, #1a2940, #0f1a2e);
      box-shadow: 0 0 0 3px rgba(0, 198, 255, 0.35), 0 16px 36px rgba(0, 198, 255, 0.25);
      transform: scale(1.05);
  }
  .plan-option input[type="radio"] { display: none; }
  .popular-badge {
      position: absolute;
      top: -13px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(45deg, #ff4e50, #f9d423);
      color: #000;
      font-size: 12px;
      font-weight: 800;
      padding: 5px 16px;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(249, 212, 35, 0.4);
  }
  .plan-name {
      font-size: 19px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
  }
  .plan-price {
      font-size: 26px;
      font-weight: 900;
      margin-bottom: 4px;
      background: linear-gradient(45deg, #ff4e50, #f9d423);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
  }
  .plan-price small {
      font-size: 14px;
      color: #717f96;
      font-weight: 600;
      -webkit-text-fill-color: #717f96;
  }
  .plan-divider {
      width: 40px;
      height: 2px;
      background: rgba(255, 255, 255, 0.12);
      margin: 16px 0;
      border-radius: 2px;
  }
  .plan-feature {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: #cbd5e1;
      margin-bottom: 11px;
      width: 100%;
      justify-content: flex-start;
  }
  .plan-feature .ic { width: 22px; text-align: center; flex-shrink: 0; }
  .plan-feature b { color: #fff; }
  .plan-check {
      margin-top: 14px;
      font-size: 13px;
      font-weight: 700;
      color: #ff4e50;
      opacity: 0;
      transition: 0.2s;
  }
  .plan-option.active .plan-check { opacity: 1; }
  .plan-option.popular.active .plan-check { color: #00c6ff; }
  .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
  }

  @media (max-width: 640px) {
      .style-card-grid, .plan-selector { grid-template-columns: 1fr; }
  }
</style>
