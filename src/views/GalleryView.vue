<template>
    <div class="gallery-container">
        <div class="gallery-header">
            <span class="eyebrow">PORTFOLIO</span>
            <h2>작업 <span>갤러리</span></h2>
            <p>Movie Day Studio가 직접 제작한 AI 영상 · 이미지 작업물을 만나보세요.</p>
        </div>

        <!-- 카테고리 필터 -->
        <div class="filter-group">
            <button
                v-for="cat in categories"
                :key="cat"
                :class="['filter-btn', { active: currentCat === cat }]"
                @click="currentCat = cat"
            >{{ cat }}</button>
        </div>

        <!-- 메이슨리 갤러리 -->
        <div v-if="filteredItems.length" class="masonry">
            <div
                v-for="(item, idx) in filteredItems"
                :key="idx"
                class="masonry-item"
                @click="openLightbox(item)"
            >
                <img :src="item.src" :alt="item.title" loading="lazy" />
                <div class="item-overlay">
                    <span class="item-title">{{ item.title }}</span>
                    <span class="item-cat">{{ item.category }}</span>
                </div>
            </div>
        </div>
        <div v-else class="empty-state">
            아직 등록된 작업물이 없습니다. 🖼️
        </div>

        <!-- 라이트박스 (크게 보기) -->
        <div v-if="selected" class="lightbox" @click.self="closeLightbox">
            <button class="lb-close" @click="closeLightbox">✕</button>
            <div class="lb-content">
                <img :src="selected.src" :alt="selected.title" />
                <div class="lb-info">
                    <h3>{{ selected.title }}</h3>
                    <span class="lb-cat">{{ selected.category }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'GalleryView',
      data() {
        return {
          currentCat: '전체',
          selected: null,
          // 🖼️ 작업물 목록 — 새 이미지는 public/gallery/ 에 넣고 아래에 한 줄 추가하세요.
          //    src 는 public 폴더 기준 절대경로('/gallery/파일명')로 작성합니다.
          items: [
            { src: '/gallery/kimsinwon_1.jpeg', title: '웨딩 영상 1', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_2.jpeg', title: '웨딩 영상 2', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_3.jpeg', title: '웨딩 영상 3', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_4.jpeg', title: '웨딩 영상 4', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_5.jpg', title: '웨딩 영상 5', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_6.jpg', title: '웨딩 영상 6', category: '디즈니풍' },
            { src: '/gallery/kimsinwon_7.jpeg', title: '웨딩 영상 7', category: '디즈니풍' },
            { src: '/gallery/yuna_1.jpg', title: '청춘 로맨스 1', category: '디즈니풍' },
            { src: '/gallery/yuna_10.jpg', title: '청춘 로맨스 10', category: '디즈니풍' },
            { src: '/gallery/yuna_12.jpg', title: '청춘 로맨스 12', category: '디즈니풍' },
            { src: '/gallery/yuna_2.jpg', title: '청춘 로맨스 2', category: '디즈니풍' },
            { src: '/gallery/yuna_3.jpg', title: '청춘 로맨스 3', category: '디즈니풍' },
            { src: '/gallery/yuna_4.jpg', title: '청춘 로맨스 4', category: '디즈니풍' },
            { src: '/gallery/yuna_5.jpg', title: '청춘 로맨스 5', category: '디즈니풍' },
            { src: '/gallery/yuna_6.jpg', title: '청춘 로맨스 6', category: '디즈니풍' },
            { src: '/gallery/yuna_7.jpg', title: '청춘 로맨스 7', category: '디즈니풍' },
            { src: '/gallery/yuna_9.jpg', title: '청춘 로맨스 9', category: '디즈니풍' },
            { src: '/gallery/ghibli_1.png', title: '지브리풍 영상 1', category: '지브리풍' },
            { src: '/gallery/ghibli_10.png', title: '지브리풍 영상 10', category: '지브리풍' },
            { src: '/gallery/ghibli_11.png', title: '지브리풍 영상 11', category: '지브리풍' },
            { src: '/gallery/ghibli_2.png', title: '지브리풍 영상 2', category: '지브리풍' },
            { src: '/gallery/ghibli_3.png', title: '지브리풍 영상 3', category: '지브리풍' },
            { src: '/gallery/ghibli_4.png', title: '지브리풍 영상 4', category: '지브리풍' },
            { src: '/gallery/ghibli_5.png', title: '지브리풍 영상 5', category: '지브리풍' },
            { src: '/gallery/ghibli_7.png', title: '지브리풍 영상 7', category: '지브리풍' },
            { src: '/gallery/ghibli_8.png', title: '지브리풍 영상 8', category: '지브리풍' },
            { src: '/gallery/ghibli_9.png', title: '지브리풍 영상 9', category: '지브리풍' },
            { src: '/gallery/hwangap_1.jpg', title: '환갑 기념 영상 1', category: '지브리풍' },
            { src: '/gallery/hwangap_2.jpg', title: '환갑 기념 영상 2', category: '지브리풍' },
            { src: '/gallery/hwangap_3.jpg', title: '환갑 기념 영상 3', category: '지브리풍' },
            { src: '/gallery/hwangap_4.jpg', title: '환갑 기념 영상 4', category: '지브리풍' },
            { src: '/gallery/hwangap_5.jpg', title: '환갑 기념 영상 5', category: '지브리풍' },
            { src: '/gallery/hwangap_6.jpg', title: '환갑 기념 영상 6', category: '지브리풍' },
            { src: '/gallery/hwangap_7.jpg', title: '환갑 기념 영상 7', category: '지브리풍' },
            { src: '/gallery/hwangap_8.jpg', title: '환갑 기념 영상 8', category: '지브리풍' },
            { src: '/gallery/cinematic_1.jpg', title: '시네마틱 MV 1', category: '시네마틱' },
            { src: '/gallery/cinematic_2.jpg', title: '시네마틱 MV 2', category: '시네마틱' },
            { src: '/gallery/cinematic_3.jpg', title: '시네마틱 MV 3', category: '시네마틱' },
            { src: '/gallery/cinematic_4.jpg', title: '시네마틱 MV 4', category: '시네마틱' },
            { src: '/gallery/cinematic_5.jpg', title: '시네마틱 MV 5', category: '시네마틱' },
            { src: '/gallery/cinematic_6.jpg', title: '시네마틱 MV 6', category: '시네마틱' },
            { src: '/gallery/cinematic_7.jpg', title: '시네마틱 MV 7', category: '시네마틱' },
            { src: '/gallery/cinematic_8.jpg', title: '시네마틱 MV 8', category: '시네마틱' },
            { src: '/gallery/scene10_2.jpg', title: '시네마틱 씬 2', category: '시네마틱' },
            { src: '/gallery/scene9_2.jpg', title: '시네마틱 씬 2', category: '시네마틱' },
            { src: '/gallery/scene9_4.jpg', title: '시네마틱 씬 4', category: '시네마틱' },
            { src: '/gallery/intro_1.jpg', title: '캐릭터 인트로 1', category: '캐릭터' },
            { src: '/gallery/intro_2.jpg', title: '캐릭터 인트로 2', category: '캐릭터' },
            { src: '/gallery/intro_3.jpg', title: '캐릭터 인트로 3', category: '캐릭터' },
            { src: '/gallery/intro_4.jpg', title: '캐릭터 인트로 4', category: '캐릭터' },
          ]
        }
      },
      computed: {
        categories() {
          const set = new Set(this.items.map(i => i.category));
          return ['전체', ...set];
        },
        filteredItems() {
          if (this.currentCat === '전체') return this.items;
          return this.items.filter(i => i.category === this.currentCat);
        }
      },
      methods: {
        openLightbox(item) {
          this.selected = item;
          document.body.style.overflow = 'hidden';
        },
        closeLightbox() {
          this.selected = null;
          document.body.style.overflow = '';
        }
      },
      beforeUnmount() {
        document.body.style.overflow = '';
      }
    }
</script>

<style scoped>
    .gallery-container {
      padding: 50px 20px 70px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .gallery-header { text-align: center; margin-bottom: 40px; }
    .gallery-header .eyebrow {
      display: inline-block; font-size: 13px; font-weight: 700; letter-spacing: 0.1em;
      color: #00c6ff; background: rgba(0,198,255,0.1); border: 1px solid rgba(0,198,255,0.25);
      padding: 6px 16px; border-radius: 50px; margin-bottom: 18px;
    }
    .gallery-header h2 { font-size: 34px; font-weight: 800; margin-bottom: 14px; }
    .gallery-header h2 span { background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gallery-header p { color: #9aa4b7; font-size: 15px; max-width: 520px; margin: 0 auto; line-height: 1.6; }

    /* 카테고리 필터 */
    .filter-group { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
    .filter-btn {
      background: #131a26; color: #9aa4b7; border: 1px solid rgba(255,255,255,0.08);
      padding: 9px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover { color: #fff; border-color: rgba(0,198,255,0.4); }
    .filter-btn.active { background: linear-gradient(45deg, #00c6ff, #0072ff); color: #fff; border-color: transparent; }

    /* 메이슨리 (CSS columns) */
    .masonry { column-count: 3; column-gap: 18px; }
    .masonry-item {
      break-inside: avoid; margin-bottom: 18px; position: relative;
      border-radius: 16px; overflow: hidden; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.06); background: #131a26;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .masonry-item img { width: 100%; display: block; }
    .masonry-item:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
    .item-overlay {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 30px 16px 14px; display: flex; flex-direction: column; gap: 2px;
      background: linear-gradient(to top, rgba(11,15,25,0.9), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .masonry-item:hover .item-overlay { opacity: 1; }
    .item-title { color: #fff; font-size: 15px; font-weight: 700; }
    .item-cat { color: #00c6ff; font-size: 12px; font-weight: 600; }

    .empty-state { text-align: center; color: #9aa4b7; padding: 80px 20px; font-size: 16px; }

    /* 라이트박스 */
    .lightbox {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.88); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; padding: 40px;
    }
    .lb-close {
      position: absolute; top: 24px; right: 30px; background: none; border: none;
      color: #fff; font-size: 34px; cursor: pointer; line-height: 1;
    }
    .lb-content { max-width: 90vw; max-height: 88vh; text-align: center; }
    .lb-content img { max-width: 100%; max-height: 78vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
    .lb-info { margin-top: 16px; }
    .lb-info h3 { color: #fff; font-size: 20px; margin: 0 0 6px; }
    .lb-cat { color: #00c6ff; font-size: 13px; font-weight: 600; }

    @media (max-width: 900px) { .masonry { column-count: 2; } }
    @media (max-width: 560px) {
      .masonry { column-count: 1; }
      .gallery-header h2 { font-size: 26px; }
    }
</style>
