<template>
    <div class="admin-container">
        <div class="admin-box">
            <h2>📊 관리자 주문 관리 대시보드</h2>
            <p class="subtitle">접수된 AI 영상 제작 요청과 첨부파일을 실시간으로 관리합니다.</p>

            <div v-if="orders.length === 0" class="no-data">
                현재 접수된 주문이 없습니다. 📭
            </div>

            <div v-else class="table-wrapper">
                <table class="admin-table">
                    <thead>
                    <tr>
                        <th>주문번호</th>
                        <th>주문자(ID)</th>
                        <th>제작 스타일</th>
                        <th>스토리 / 요청사항</th>
                        <th>옵션</th>
                        <th>첨부파일 (용량)</th>
                        <th>등록일시</th>
                        <th>진행상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td><span class="badge-id">No.{{ order.id }}</span></td>
                        <td class="text-bold">{{ order.userId }}</td>
                        <td><span class="badge-style">{{ order.videoStyle }}</span></td>
                        <td class="story-cell">
                            <div class="story-text" :title="order.textStory">{{ order.textStory }}</div>
                        </td>
                        <td>
                            <div class="option-badges">
                                <span :class="order.bgmYn ? 'opt-on' : 'opt-off'">🎵 BGM</span>
                                <span :class="order.narrationYn ? 'opt-on' : 'opt-off'">🎙️ 나레이션</span>
                            </div>
                        </td>

                        <td>
                            <div v-if="order.files && order.files.length > 0" class="file-links" style="margin-bottom: 8px;">
                                <!-- 🛠️ 이렇게 수정하면 데이터 구조에 상관없이 key 중복 에러가 원천 차단됩니다 -->
                                <div v-for="(file, idx) in order.files" :key="idx" class="file-item">
                                    📎 <a href="#" @click.prevent="downloadFile(file)">{{ file.originalFileName }}</a>
                                    <span class="file-size">({{ formatBytes(file.fileSize) }})</span>
                                </div>
                            </div>

                            <div v-if="order.completedFileName" class="completed-file-link" style="margin-top: 8px;">
                                🎁 <span style="color: #22c55e; font-weight: bold; flex-shrink: 0;">완료본:</span>
                                <a href="#"
                                   @click.prevent="downloadCompletedFile(order.completedFileName)"
                                   class="completed-file-text"
                                   :title="order.completedFileName">
                                    {{ order.completedFileName }}
                                </a>
                            </div>

                            <span v-if="(!order.files || order.files.length === 0) && !order.completedFileName" class="text-muted">없음</span>
                        </td>

                        <td class="date-text">{{ formatDate(order.inputDt) }}</td>
                        <td>
                            <div class="status-action-box">
                                <select
                                        v-model="order.orderStatus"
                                        :class="getOrderStatusClass(order.orderStatus)"
                                        class="admin-status-select"
                                >
                                    <option value="PENDING">입금 대기 ⏳</option>
                                    <option value="PROCESSING">영상 제작중 🎬</option>
                                    <option value="COMPLETED">제작 완료 ✨</option>
                                    <option value="CANCELLED">제작 취소 ❌</option>
                                </select>

                                <div v-if="order.orderStatus === 'COMPLETED' || order.orderStatus === 'completed'" class="completed-file-zone">
                                    <input
                                            type="file"
                                            @change="handleFileChange($event, order.id)"
                                            accept="video/*"
                                            class="file-input"
                                    />
                                    <p v-if="selectedFiles[order.id]" class="file-name-preview">
                                        선택됨: {{ selectedFiles[order.id].name }}
                                    </p>
                                </div>

                                <button @click="submitStatusUpdate(order)" class="btn-submit-status">
                                    적용
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'AdminView',
      data() {
        return {
          orders: [],
          selectedFiles: {}
        }
      },
      mounted() {
        this.fetchOrders();
      },
      methods: {
        async fetchOrders() {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/list`);
            if (response.ok) {
              this.orders = await response.json();
              console.log("관리자 대시보드 수신 데이터:", this.orders);
            } else {
              alert('대시보드 목록을 불러오는 중 에러가 발생했습니다.');
            }
          } catch (error) {
            console.error('통신 에러:', error);
            alert('백엔드 서버와 통신할 수 없습니다.');
          }
        },

        // 💡 관리자가 선택한 비디오 결과물 파일을 임시 기록하는 핸들러
        handleFileChange(event, orderId) {
          const file = event.target.files[0];
          if (file) {
            // 🎯 [수정] Vue 3 환경에 맞게 복잡한 $set 대신 직관적인 대입 연산자로 변경합니다.
            this.selectedFiles[orderId] = file;
          }
        },

        async submitStatusUpdate(order) {
          try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            const formData = new FormData();
            formData.append('id', order.id);
            formData.append('orderStatus', order.orderStatus);

            // 🎯 [수정] 제작 완료 시 파일 필수 체크 및 예외 처리 로직 강화
            if (this.selectedFiles[order.id]) {
              // 1. 선택된 파일이 있다면 FormData에 정상 탑재
              formData.append('file', this.selectedFiles[order.id]);
            } else if (order.orderStatus === 'COMPLETED') {
              // 2. 상태는 '제작 완료'인데 선택된 파일이 없다면 절대 통과 못하게 리턴 차단!
              alert('⚠️ [오류] 상태를 "제작 완료"로 변경하려면 유저에게 전달할 영상 완료 파일을 반드시 첨부해야 합니다.');
              return; // 🛑 여기서 함수를 강제 종료하여 서버 전송을 막습니다.
            } else {
              // 3. 완료 상태가 아닌 다른 상태(제작중 등)이면서 파일이 없는 경우는 부드럽게 경고 후 진행
              const goAhead = confirm(`주문 No.${order.id}의 상태를 변경하시겠습니까?`);
              if (!goAhead) return;
            }

            // 아래 백엔드 통신(fetch) 코드는 기존과 동일하게 유지됩니다.
            const response = await fetch(`${baseUrl}/api/orders/admin/status-update`, {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              alert(`주문 No.${order.id}의 변경 정보가 성공적으로 반영되었습니다! 🎉`);
              delete this.selectedFiles[order.id];
              try {
                this.fetchOrders();
              } catch (fetchError) {
                console.error("목록 갱신 중 오류:", fetchError);
              }
            } else {
              const errorText = await response.text().catch(() => "알 수 없는 에러");
              alert(`상태 업데이트 실패: ${errorText}`);
            }
          } catch (error) {
            console.error('상태 변경 통신 에러 상세내용:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
          }
        },

        downloadFile(file) {
          const sName = encodeURIComponent(file.storedFileName);
          const oName = encodeURIComponent(file.originalFileName);

          const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/download?storedName=${sName}&originName=${oName}`;

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', file.originalFileName);
          document.body.appendChild(link);

          link.click();
          document.body.removeChild(link);
        },

        // 🎯 [추가] 관리자가 업로드한 완료 비디오 파일을 다운로드하는 함수
        downloadCompletedFile(fileName) {
          if (!fileName) return;

          // 백엔드 API 규격에 맞춰 인코딩 처리
          const sName = encodeURIComponent(fileName);
          const oName = encodeURIComponent(fileName);

          // 기존 백엔드 다운로드 주소 그대로 활용
          const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/download?storedName=${sName}&originName=${oName}`;

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);

          link.click();
          document.body.removeChild(link);
        },

        formatBytes(bytes) {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        formatDate(dateString) {
          if (!dateString) return '-';
          const date = new Date(dateString);
          return date.toLocaleString();
        },
        getOrderStatusClass(orderStatus) {
          if (!orderStatus) return 'status-pending';
          const s = orderStatus.toLowerCase();
          if (s === 'completed' || s === '완료') return 'status-completed';
          if (s === 'processing' || s === '제작중' || s === 'progress') return 'status-processing';
          if (s === 'cancelled' || s === '취소') return 'status-cancelled';
          return 'status-pending';
        }
      }
    }
</script>

<style scoped>
    .admin-container { padding: 40px 20px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; }
    .admin-box { background-color: #131a26; border-radius: 20px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.05); }
    .admin-box h2 { font-size: 26px; margin-top: 0; margin-bottom: 10px; background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #717f96; font-size: 14px; margin-bottom: 30px; }
    .no-data { text-align: center; color: #64748b; padding: 5px 0; font-size: 16px; }
    .table-wrapper { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; color: #9aa4b7; background-color: #0b0f19; }
    .admin-table th { background-color: #1a2333; color: #fff; padding: 15px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.05); }
    .admin-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
    .text-bold { font-weight: bold; color: #fff; }
    .badge-id { background: #22c55e20; color: #22c55e; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .badge-style { background: #3b82f620; color: #3b82f6; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
    .story-cell { max-width: 250px; }
    .story-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #cbd5e1; }
    .option-badges { display: flex; gap: 6px; }
    .opt-on { background: rgba(0, 198, 255, 0.15); color: #00c6ff; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
    .opt-off { background: rgba(255,255,255,0.05); color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px; text-decoration: line-through; }
    .file-links { display: flex; flex-direction: column; gap: 6px; }
    .file-item a { color: #f9d423; text-decoration: none; font-size: 13px; font-weight: 500; }
    .file-item a:hover { text-decoration: underline; color: #ffeb3b; }
    .file-size { color: #64748b; font-size: 11px; margin-left: 4px; }
    .date-text { font-size: 12px; color: #64748b; }

    .status-action-box { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; min-width: 160px; }

    .admin-status-select {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        background-color: #1a2333;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        outline: none;
        transition: all 0.2s;
        width: 100%;
    }
    .admin-status-select.status-pending { background: #eab30820; color: #eab308; border-color: #eab30840; }
    .admin-status-select.status-processing { background: #3b82f620; color: #3b82f6; border-color: #3b82f640; }
    .admin-status-select.status-completed { background: #22c55e20; color: #22c55e; border-color: #22c55e40; }
    .admin-status-select.status-cancelled { background: #ef444420; color: #ef4444; border-color: #ef444440; }
    .admin-status-select option { background-color: #0b0f19; color: #fff; }

    .completed-file-zone { background: rgba(255, 255, 255, 0.03); padding: 6px; border-radius: 8px; border: 1px dashed rgba(255, 255, 255, 0.1); width: 100%; box-sizing: border-box; }
    .file-input { font-size: 11px; color: #9aa4b7; max-width: 140px; cursor: pointer; }
    .file-name-preview { margin: 4px 0 0 0; font-size: 11px; color: #22c55e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }

    .btn-submit-status { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; width: 100%; }
    .btn-submit-status:hover { opacity: 0.9; }

    .text-muted { color: #475569; }

    /* 🎯 완료본 영역 정렬 및 말줄임표용 CSS */
    .completed-file-link {
        display: flex;
        align-items: center;
        max-width: 220px; /* 👈 첨부파일 칸 너비에 맞게 적절히 제한 (조절 가능) */
    }
    .completed-file-text {
        color: #00c6ff;
        text-decoration: none;
        font-weight: 500;
        margin-left: 4px;
        overflow: hidden;
        text-overflow: ellipsis; /* 👈 넘치면 ... 처리 */
        white-space: nowrap;     /* 👈 한 줄로 강제 고정 */
        display: inline-block;
        width: 100%;
    }
    .completed-file-text:hover {
        text-decoration: underline;
    }
</style>