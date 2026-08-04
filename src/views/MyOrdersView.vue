<template>
    <div class="orders-container">
        <div class="orders-header">
            <h2>내 주문 내역 🎥</h2>
            <p>Movie Day Studio와 함께 만든 소중한 추억들입니다.</p>
        </div>

        <div v-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">🎞️</div>
            <p>아직 제작한 영상이 없습니다.<br>첫 번째 영상을 주문해 보세요!</p>
            <router-link to="/order" class="btn-order">지금 제작하기 🚀</router-link>
        </div>

        <div v-else class="orders-grid">
            <div v-for="order in orders" :key="order.id" class="order-card">

                <div class="card-badge" :class="getOrderStatusClass(order.orderStatus)">
                    {{ getStatusText(order.orderStatus) }}
                </div>

                <div class="card-content">
                    <div class="style-icon-box">
                        <span v-if="order.videoStyle && order.videoStyle.includes('디즈니')" class="icon">🏰</span>
                        <span v-else class="icon">🍃</span>
                    </div>
                    <div class="order-info">
                        <h3>{{ order.videoStyle }}</h3>
                        <p class="order-id">주문번호: No.{{ order.id }}</p>
                        <p class="order-date" style="margin-top: 4px; color: #94a3b8;">
                            옵션: {{ order.bgmYn ? '🎵BGM' : '' }} {{ order.narrationYn ? '🎙️나레이션' : '없음' }}
                        </p>
                    </div>
                    <div class="price-tag">
                        {{ formatPrice(order.price) }}원
                    </div>
                </div>

                <div class="card-actions">
                    <button v-if="order.completedFileName" @click="downloadCompletedFile(order.completedFileName)" class="btn-download">
                        영상 다운로드 📥
                    </button>

                    <!-- 🛠️ [수정] 클릭 시 모달이 열리도록 메서드 바인딩 -->
                    <button v-else @click="openDetailModal(order)" class="btn-details">
                        상세 진행 상황 🔍
                    </button>
                </div>
            </div>
        </div>
        <!-- 🛠️ [신규 추가] 주문 상세 내역 팝업 모달 -->
        <div v-if="isDetailModalOpen" class="detail-modal-overlay" @click.self="closeDetailModal">
            <div class="detail-modal-box">
                <div class="modal-header">
                    <h3>📋 주문 상세 내역</h3>
                    <p class="modal-order-id">주문번호: No.{{ selectedOrder.id }}</p>
                </div>

                <div class="modal-body">
                    <!-- 1. 스타일 및 옵션 정보 -->
                    <div class="detail-section">
                        <h4>✨ 선택한 스타일 및 옵션</h4>
                        <div class="detail-info-card">
                            <p><strong>제작 상품:</strong> {{ selectedOrder.videoStyle }}</p>
                            <p><strong>선택 옵션:</strong>
                                {{ selectedOrder.bgmYn ? '🎵 감성 배경음악(BGM)' : '' }}
                                {{ selectedOrder.narrationYn ? '🎙️ AI 나레이션' : '' }}
                                {{ !selectedOrder.bgmYn && !selectedOrder.narrationYn ? '선택 옵션 없음' : '' }}
                            </p>
                            <p><strong>결제 금액:</strong> <span class="modal-price">{{ formatPrice(selectedOrder.price) }}원</span></p>
                        </div>
                    </div>

                    <!-- 2. 스토리 텍스트 -->
                    <div class="detail-section">
                        <h4>📝 내가 작성한 스토리</h4>
                        <div class="story-text-box">
                            {{ selectedOrder.textStory }}
                        </div>
                    </div>

                    <!-- 3. 📸 내가 첨부한 참고 사진 (DTO 명세 맞춤 정석 최적화 버전) -->
                    <div class="detail-section">
                        <h4>📸 내가 첨부한 참고 사진</h4>

                        <div v-if="selectedOrder.files && selectedOrder.files.length > 0" class="photo-grid">
                            <div
                                    v-for="(file, idx) in selectedOrder.files"
                                    :key="idx"
                                    class="photo-item"
                            >
                                <!-- 💡 백엔드 DTO 설계 구조인 storedFileName 변수명을 정확하게 바인딩합니다. -->
                                <img
                                        v-if="file && file.storedFileName"
                                        :src="`${import.meta.env.VITE_API_BASE_URL}/api/orders/view-image?storedName=${encodeURIComponent(file.storedFileName)}`"
                                        alt="참고 사진"
                                />
                            </div>
                        </div>

                        <div v-else class="photo-status-box">
                            📁 등록된 첨부 사진이 없습니다.
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="closeDetailModal" class="btn-modal-close">확인</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'MyOrdersView',
      data() {
        return {
          orders: [],
          // 🛠️ [신규 추가] 모달 제어용 상태 변수
          isDetailModalOpen: false,
          selectedOrder: {}
        }
      },
      mounted() {
        this.fetchUserOrders();
      },
      methods: {
        async fetchUserOrders() {
          const savedUserId = sessionStorage.getItem('userId');
          if (!savedUserId) {
            alert("로그인이 세션이 만료되었습니다. 다시 로그인해 주세요. 🔒");
            this.$router.push('/login');
            return;
          }
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/user/${savedUserId}`);
            if (response.ok) {
              this.orders = await response.json();
              console.log("정상 수신된 유저 주문 데이터:", this.orders);
            } else {
              console.error("주문 내역 로드 실패");
            }
          } catch (error) {
            console.error("서버 통신 에러:", error);
          }
        },

        downloadCompletedFile(fileName) {
          if (!fileName) return;

          const sName = encodeURIComponent(fileName);
          const oName = encodeURIComponent(fileName);
          const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/download?storedName=${sName}&originName=${oName}`;

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);

          link.click();
          document.body.removeChild(link);
        },

        formatPrice(value) {
          if (!value) return '0';
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        getOrderStatusClass(orderStatus) {
          if (!orderStatus) return 'pending';
          const s = orderStatus.toLowerCase();
          if (s === 'completed' || s === '완료') return 'completed';
          if (s === 'processing' || s === '제작중' || s === 'progress') return 'processing';
          return 'pending';
        },

        getStatusText(orderStatus) {
          if (!orderStatus) return '대기중';
          const s = orderStatus.toLowerCase();
          if (s === 'completed' || s === '완료') return '제작 완료 ✨';
          if (s === 'processing' || s === '제작중' || s === 'progress') return '영상 제작중 🎬';
          return '입금 대기중 ⏳';
        },

        // 🎯 모달 오픈 함수 최적화
        openDetailModal(order) {
          this.selectedOrder = order;

          // 실시간 확인용으로 가볍고 핵심적인 로그만 남겨둡니다.
          console.log(`[📂 상세조회] 주문 No.${order.id} 첨부파일 개수:`, order.files ? order.files.length : 0);

          this.isDetailModalOpen = true;
        },

        // 🛠️ [신규 추가] 모달 폐쇄 함수
        closeDetailModal() {
          this.isDetailModalOpen = false;
          this.selectedOrder = {};
        }
      }
    }
</script>

<style scoped>
    /* 봉준님의 기존 명품 디자인 코드는 100% 동일하게 완벽 보존되었습니다! */
    .orders-container { padding: 80px 20px; max-width: 1100px; margin: 0 auto; color: white; }
    .orders-header { text-align: center; margin-bottom: 60px; }
    .orders-header h2 { font-size: 32px; margin-bottom: 10px; background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .orders-header p { color: #717f96; font-size: 16px; }

    .empty-state { text-align: center; padding: 100px 20px; background-color: #131a26; border-radius: 20px; border: 1px dashed rgba(255, 255, 255, 0.1); }
    .empty-icon { font-size: 64px; margin-bottom: 20px; }
    .btn-order { display: inline-block; margin-top: 25px; padding: 14px 30px; background: linear-gradient(45deg, #ff4e50, #f9d423); color: #000; text-decoration: none; border-radius: 10px; font-weight: bold; }

    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; }
    .order-card { background: #131a26; border-radius: 24px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.05); position: relative; transition: all 0.3s ease; }
    .order-card:hover { transform: translateY(-8px); border-color: #00c6ff; box-shadow: 0 10px 30px rgba(0, 198, 255, 0.1); }

    .card-badge { position: absolute; top: 25px; right: 25px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .card-badge.pending { background: rgba(249, 212, 35, 0.15); color: #f9d423; }
    .card-badge.processing { background: rgba(0, 198, 255, 0.15); color: #00c6ff; }
    .card-badge.completed { background: rgba(34, 197, 94, 0.15); color: #22c55e; }

    .card-content { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
    .style-icon-box { background-color: #0b0f19; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 18px; font-size: 32px; }
    .order-info h3 { font-size: 18px; margin: 0 0 6px 0; color: #fff; }
    .order-id, .order-date { font-size: 13px; color: #64748b; margin: 0; }
    .price-tag { margin-left: auto; font-weight: 800; color: #f9d423; font-size: 18px; }

    .card-actions { border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; display: flex; justify-content: flex-end; }
    .btn-download { background: linear-gradient(45deg, #00c6ff, #0072ff); color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
    .btn-details { background: #1e293b; color: #94a3b8; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: background 0.2s, color 0.2s; }
    .btn-details:hover { background: #334155; color: #fff; }
    .btn-download:hover { opacity: 0.9; }

    /* 🛠 Honor 디자인 연계: [신규 추가] 주문 상세 모달 CSS */
    .detail-modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex; justify-content: center; align-items: center;
        z-index: 9999; backdrop-filter: blur(5px);
    }
    .detail-modal-box {
        background-color: #131a26;
        border-radius: 24px;
        width: 90%; max-width: 520px;
        padding: 35px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white;
        text-align: left;
        box-shadow: 0 20px 45px rgba(0,0,0,0.6);
        animation: fadeInModal 0.25s ease-out;
    }
    @keyframes fadeInModal {
        from { transform: translateY(15px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .detail-modal-box h3 { font-size: 22px; margin: 0; color: #fff; }
    .modal-order-id { font-size: 13px; color: #64748b; margin: 6px 0 0 0; }
    .detail-section { margin-top: 22px; }
    .detail-section h4 { font-size: 14px; color: #00c6ff; margin: 0 0 10px 0; font-weight: 600; }
    .detail-info-card {
        background: #0b0f19; padding: 16px; border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.04); font-size: 14px; line-height: 1.7;
    }
    .detail-info-card p { margin: 0 0 8px 0; }
    .detail-info-card p:last-child { margin-bottom: 0; }
    .modal-price { color: #f9d423; font-weight: bold; }
    .story-text-box {
        background: #0b0f19; padding: 16px; border-radius: 12px;
        font-size: 14px; color: #cbd5e1; line-height: 1.6;
        max-height: 140px; overflow-y: auto; white-space: pre-wrap;
        border: 1px solid rgba(255,255,255,0.04);
    }
    .photo-status-box {
        background: rgba(0, 198, 255, 0.04); border: 1px dashed rgba(0, 198, 255, 0.2);
        padding: 14px; border-radius: 12px; font-size: 13px; color: #9aa4b7; line-height: 1.5;
    }
    .modal-footer { margin-top: 35px; }
    .btn-modal-close {
        width: 100%; padding: 14px;
        background: linear-gradient(45deg, #1e293b, #334155);
        color: white; border: none; border-radius: 10px;
        font-size: 15px; font-weight: 600; cursor: pointer;
        transition: background 0.2s;
    }
    .btn-modal-close:hover { background: #475569; }

    /* 📸 모달 내 첨부사진 바둑판 스타일 */
    .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 10px;
        background: #0b0f19;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.04);
        max-height: 200px;
        overflow-y: auto;
    }
    .photo-item {
        position: relative;
        padding-top: 100px; /* 1:1 정사각형 비율 유지 */
        border-radius: 8px;
        overflow: hidden;
        background-color: #1a2333;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .photo-item img {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        object-fit: cover; /* 이미지가 찌그러지지 않게 채움 */
        cursor: pointer;
        transition: transform 0.2s;
    }
    .photo-item img:hover {
        transform: scale(1.1); /* 마우스 올리면 살짝 확대효과 */
    }

    @media (max-width: 768px) { .orders-grid { grid-template-columns: 1fr; } .order-card { padding: 25px; } }
</style>