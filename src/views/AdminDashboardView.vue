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
                            <div v-if="order.files && order.files.length > 0" class="file-links">
                                <div v-for="file in order.files" :key="file.id" class="file-item">
                                    📎 <a href="#" @click.prevent="downloadFile(file)">{{ file.originalFileName }}</a>
                                    <span class="file-size">({{ formatBytes(file.fileSize) }})</span>
                                </div>
                            </div>
                            <span v-else class="text-muted">없음</span>
                        </td>
                        <td class="date-text">{{ formatDate(order.inputDt) }}</td>
                        <td>
                <span :class="'status-' + order.orderStatus.toLowerCase()" class="badge-status">
                  {{ order.orderStatus }}
                </span>
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
      name: 'AdminDashboardView',
      data() {
        return {
          orders: []
        }
      },
      mounted() {
        this.fetchOrders();
      },
      methods: {
        async fetchOrders() {
          try {
            const response = await fetch('http://localhost:8080/api/orders/admin/list');
            if (response.ok) {
              this.orders = await response.json();
            } else {
              alert('대시보드 목록을 불러오는 중 에러가 발생했습니다.');
            }
          } catch (error) {
            console.error('통신 에러:', error);
            alert('백엔드 서버와 통신할 수 없습니다.');
          }
        },
        downloadFile(file) {
          // 💡 다운로드 기능은 파일 다운로드 API 구현 후 연동할 예정입니다!
          alert(`파일 다운로드 요청:\n서버 저장명: ${file.storedFileName}\n원본명: ${file.originalFileName}`);
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
    .file-links { display: flex; flex-direction: column; gap: 4px; }
    .file-item a { color: #f9d423; text-decoration: none; font-size: 13px; }
    .file-item a:hover { text-decoration: underline; }
    .file-size { color: #64748b; font-size: 11px; margin-left: 4px; }
    .date-text { font-size: 12px; color: #64748b; }
    .badge-status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; }
    .status-pending { background: #eab30820; color: #eab308; }
    .status-processing { background: #3b82f620; color: #3b82f6; }
    .status-completed { background: #22c55e20; color: #22c55e; }
    .text-muted { color: #475569; }
</style>