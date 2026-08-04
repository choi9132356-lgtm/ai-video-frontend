<template>
    <div class="process-container">
        <div class="process-header">
            <span class="eyebrow">HOW IT WORKS</span>
            <h2>이렇게 <span>제작</span>됩니다</h2>
            <p>주문부터 완성까지, 고객님과 함께 만들어가는 11단계 제작 과정입니다.</p>
        </div>

        <div class="timeline">
            <!-- Phase 1 -->
            <div class="phase phase-1">
                <div class="phase-title"><span class="chip">STEP 1-5</span>💬 상담 &amp; 결정</div>
                <div class="steps">
                    <div class="step"><div class="num">1</div><div class="box"><h4>🛒 주문 접수</h4><p>고객님이 원하는 영상 스타일(디즈니/지브리)을 선택하고 주문합니다.</p></div></div>
                    <div class="step"><div class="num">2</div><div class="box"><h4>📸 자료 전달</h4><p>고객님이 사진과 스토리를 보내주시면 제작 검토를 시작합니다.</p></div></div>
                    <div class="step"><div class="num">3</div><div class="box"><h4>🎨 시안 제작 &amp; 전달</h4><p>캐릭터보드와 시나리오를 만들어 고객님께 미리 전달합니다.</p></div></div>
                    <div class="step"><div class="num">4</div><div class="box"><h4>✅ 최종 결정</h4><p>시안을 받아보시고 진행 여부를 최종 결정합니다.</p></div></div>
                    <div class="step highlight"><div class="num">5</div><div class="box"><h4>💳 입금<span class="tag">진행 확정</span></h4><p>진행하기로 결정하시면 결제(무통장 입금)를 진행합니다.</p></div></div>
                </div>
            </div>

            <!-- Phase 2 -->
            <div class="phase phase-2">
                <div class="phase-title"><span class="chip">STEP 6-9</span>🎬 제작 준비</div>
                <div class="steps">
                    <div class="step"><div class="num">6</div><div class="box"><h4>🚀 제작 착수</h4><p>본격적인 영상 제작 작업을 시작합니다.</p></div></div>
                    <div class="step"><div class="num">7</div><div class="box"><h4>📝 시나리오·보드 확정</h4><p>시나리오, 나레이션, 캐릭터보드를 최종 확정합니다.</p></div></div>
                    <div class="step"><div class="num">8</div><div class="box"><h4>🖼️ 씬별 이미지 제작</h4><p>영상을 구성할 장면(씬)별 이미지를 하나씩 제작합니다.</p></div></div>
                    <div class="step"><div class="num">9</div><div class="box"><h4>👀 이미지 전달 &amp; 컨펌</h4><p>제작된 이미지를 전달하고 고객님의 확인을 받습니다.</p></div></div>
                </div>
            </div>

            <!-- Phase 3 -->
            <div class="phase phase-3">
                <div class="phase-title"><span class="chip">STEP 10-11</span>✨ 영상 완성</div>
                <div class="steps">
                    <div class="step"><div class="num">10</div><div class="box"><h4>🎥 영상 제작</h4><p>나레이션, 배경음(BGM), 자막을 포함해 영상을 완성합니다.</p></div></div>
                    <div class="step highlight"><div class="num">11</div><div class="box"><h4>🏁 수정 체크 &amp; 제작 확정<span class="tag">완료</span></h4><p>수정 사항을 확인한 뒤 최종 영상 제작을 확정합니다.</p></div></div>
                </div>
            </div>
        </div>

        <div class="process-cta">
            <router-link to="/order" class="btn-cta">지금 제작하기 🚀</router-link>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'ProcessView'
    }
</script>

<style scoped>
    .process-container {
      padding: 50px 20px 70px;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .process-header { text-align: center; margin-bottom: 55px; }
    .process-header .eyebrow {
      display: inline-block; font-size: 13px; font-weight: 700; letter-spacing: 0.1em;
      color: #00c6ff; background: rgba(0,198,255,0.1); border: 1px solid rgba(0,198,255,0.25);
      padding: 6px 16px; border-radius: 50px; margin-bottom: 18px;
    }
    .process-header h2 { font-size: 34px; font-weight: 800; margin-bottom: 14px; line-height: 1.3; }
    .process-header h2 span { background: linear-gradient(45deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .process-header p { color: #9aa4b7; font-size: 15px; max-width: 520px; margin: 0 auto; line-height: 1.6; }

    .timeline { }

    .phase { margin-bottom: 40px; }
    .phase-title {
      display: flex; align-items: center; gap: 12px;
      font-size: 18px; font-weight: 700; margin-bottom: 22px; padding-left: 4px;
    }
    .phase-title .chip {
      font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 8px; color: #000;
    }
    .phase-1 .chip { background: linear-gradient(45deg, #ff4e50, #f9d423); }
    .phase-2 .chip { background: linear-gradient(45deg, #00c6ff, #0072ff); color:#fff; }
    .phase-3 .chip { background: linear-gradient(135deg, #667eea, #764ba2); color:#fff; }

    .steps { position: relative; padding-left: 52px; }
    .steps::before {
      content: ''; position: absolute; left: 19px; top: 8px; bottom: 8px; width: 2px;
      background: linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06));
    }
    .step { position: relative; margin-bottom: 18px; }
    .step:last-child { margin-bottom: 0; }
    .step .num {
      position: absolute; left: -52px; top: 0;
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px; color: #fff;
      background: #131a26; border: 2px solid rgba(255,255,255,0.15); z-index: 2;
    }
    .phase-1 .step .num { border-color: #f9d423; }
    .phase-2 .step .num { border-color: #00c6ff; }
    .phase-3 .step .num { border-color: #a78bfa; }
    .step .box {
      background: #131a26; border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 16px 20px; transition: all 0.2s ease;
    }
    .step .box:hover { transform: translateX(4px); border-color: rgba(0,198,255,0.35); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
    .step .box h4 { font-size: 15.5px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
    .step .box p { font-size: 13.5px; color: #9aa4b7; line-height: 1.55; }
    .step.highlight .box { background: linear-gradient(135deg, rgba(255,78,80,0.12), rgba(249,212,35,0.06)); border-color: rgba(249,212,35,0.4); }
    .step .tag { display:inline-block; font-size:11px; font-weight:700; color:#f9d423; background:rgba(249,212,35,0.12); padding:2px 8px; border-radius:6px; margin-left:6px; }

    .process-cta { text-align: center; margin-top: 55px; }
    .btn-cta {
      text-decoration: none; display: inline-block; padding: 14px 34px;
      background: linear-gradient(45deg, #ff4e50, #f9d423); color: #000;
      font-size: 16px; font-weight: bold; border-radius: 50px;
      box-shadow: 0 4px 15px rgba(255, 78, 80, 0.4); transition: all 0.3s;
    }
    .btn-cta:hover { transform: scale(1.05); }

    @media (max-width: 768px) {
      .process-header h2 { font-size: 26px; }
      .phase-title { font-size: 16px; }
      .steps { padding-left: 46px; }
      .step .num { left: -46px; width: 36px; height: 36px; font-size: 14px; }
      .steps::before { left: 17px; }
    }
</style>
