<template>
    <div class="showcase-container">
        <div class="showcase-header">
            <h2>✨ AI Creative Video Showcase</h2>
            <p class="subtitle">원하시는 제작 스타일을 선택하여 실제 AI 생성 샘플 영상을 감상해 보세요.</p>
        </div>

        <!-- 🎛️ 스타일 선택 버튼 그룹 (탭) -->
        <div class="tab-button-group">
            <button
                    v-for="(item, idx) in showcaseVideos"
                    :key="idx"
                    :class="['tab-btn', { active: currentTab === idx }]"
                    @click="changeTab(idx)"
            >
                {{ item.styleName }}
            </button>
        </div>

        <!-- 🎥 선택된 영상 상세 쇼케이스 구역 -->
        <div class="active-video-container">
            <div class="video-card">
                <div class="video-wrapper">
                    <!-- 💡 ref를 부여하여 스크립트에서 음소거 상태를 직접 컨트롤합니다 -->
                    <!-- 🚨 주의: 브라우저 정책 상 처음엔 muted가 있어야 자동재생이 시작됩니다 -->
                    <video
                            ref="showcaseVideoRef"
                            :key="selectedVideo.videoUrl"
                            :src="selectedVideo.videoUrl"
                            autoplay
                            loop
                            muted
                            playsinline
                            class="showcase-video"
                    ></video>

                    <div class="video-overlay">
                        <span class="badge-style">{{ selectedVideo.style }}</span>
                    </div>

                    <!-- 🔊 [신규 추가] 오디오 볼륨/음소거 토글 버튼 -->
                    <button @click="toggleMute" class="btn-mute-toggle" :title="isMuted ? '소리 켜기' : '음소거'">
                        <span v-if="isMuted">🔇 소리 켜기</span>
                        <span v-else>🔊 음소거</span>
                    </button>
                </div>

                <div class="video-info">
                    <h3>{{ selectedVideo.title }}</h3>
                    <div class="prompt-box">
                        <span class="prompt-label">💡 사용된 AI 프롬프트</span>
                        <p class="prompt-text">"{{ selectedVideo.prompt }}"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'ShowcaseView',
      data() {
        return {
          currentTab: 0,
          isMuted: true, // 💡 최초 자동재생을 위해 기본값은 true(음소거)로 시작
          showcaseVideos: [
            {
              styleName: "✨ 디즈니 스타일 샘플",
              title: "👰🤵 디즈니 감성 식전영상 예제",
              style: "Disney Theme",
              prompt: "Magical fairy tale wedding theme, 3D Disney animation character style, emotional and bright lighting, highly detailed 8k",
              videoUrl: `${import.meta.env.VITE_API_BASE_URL}/api/orders/showcase/stream?fileName=` + encodeURIComponent("디즈니식전영상.mp4")
            },
            {
              styleName: "🎵 지브리 스타일 샘플",
              title: "🌳 지브리풍 감성 뮤직비디오 예제",
              style: "Ghibli Art",
              prompt: "Cozy animated green meadow, nostalgic anime aesthetics, hand-drawn cinematic watercolor texture, warm summer breeze",
              videoUrl: `${import.meta.env.VITE_API_BASE_URL}/api/orders/showcase/stream?fileName=` + encodeURIComponent("지브리뮤직비디오.mp4")
            }
          ]
        }
      },
      computed: {
        selectedVideo() {
          return this.showcaseVideos[this.currentTab];
        }
      },
      methods: {
        // 🔊 소리 토글 함수
        toggleMute() {
          const video = this.$refs.showcaseVideoRef;
          if (video) {
            video.muted = !video.muted;
            this.isMuted = video.muted;
          }
        },
        // 🔄 탭 전환 시 오디오 유연성 처리
        changeTab(idx) {
          this.currentTab = idx;
          // 💡 새 탭으로 바뀔 때 유저가 직전에 소리를 켜두었다면, 새 영상도 소리가 나도록 유지하기 위한 예외 처리
          this.$nextTick(() => {
            const video = this.$refs.showcaseVideoRef;
            if (video) {
              video.muted = this.isMuted;
            }
          });
        }
      }
    }
</script>

<style scoped>
    .showcase-container {
      padding: 60px 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .showcase-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .showcase-header h2 {
      font-size: 30px;
      margin-top: 0;
      margin-bottom: 12px;
      font-weight: 700;
      background: linear-gradient(45deg, #00c6ff, #0072ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: #717f96;
      font-size: 15px;
      margin: 0;
    }

    .tab-button-group {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 35px;
    }

    .tab-btn {
      background-color: #131a26;
      color: #9aa4b7;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px 28px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .tab-btn:hover {
      color: #fff;
      border-color: rgba(0, 198, 255, 0.5);
      background-color: #1a2333;
    }

    .tab-btn.active {
      background: linear-gradient(45deg, #00c6ff, #0072ff);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 6px 20px rgba(0, 198, 255, 0.4);
      transform: translateY(-2px);
    }

    .active-video-container {
      animation: fadeIn 0.4s ease-in-out;
    }

    .video-card {
      background-color: #131a26;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 */
      overflow: hidden;
      background-color: #0b0f19;
    }

    .showcase-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-overlay {
      position: absolute;
      top: 15px;
      left: 15px;
      z-index: 2;
    }

    .badge-style {
      background: rgba(0, 198, 255, 0.15);
      color: #00c6ff;
      border: 1px solid rgba(0, 198, 255, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.5px;
      backdrop-filter: blur(4px);
    }

    /* 🔊 음소거 토글 버튼 스타일링 */
    .btn-mute-toggle {
      position: absolute;
      bottom: 15px;
      right: 15px;
      z-index: 10;
      background: rgba(11, 15, 25, 0.7);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      backdrop-filter: blur(6px);
      transition: all 0.2s ease;
    }

    .btn-mute-toggle:hover {
      background: rgba(0, 198, 255, 0.3);
      border-color: #00c6ff;
      transform: scale(1.05);
    }

    .video-info {
      padding: 30px;
    }

    .video-info h3 {
      margin: 0 0 16px 0;
      font-size: 22px;
      color: #fff;
      font-weight: 600;
    }

    .prompt-box {
      background-color: #0b0f19;
      border-radius: 10px;
      padding: 15px 18px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .prompt-label {
      display: block;
      font-size: 11px;
      color: #00c6ff;
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .prompt-text {
      margin: 0;
      color: #9aa4b7;
      font-size: 13.5px;
      line-height: 1.6;
      font-style: italic;
      word-break: break-word;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 500px) {
      .tab-btn { padding: 10px 18px; font-size: 13px; }
    }
</style>