// IB Writing 페이지 스크립트

// 실시간 단어 수 카운트
document.addEventListener('DOMContentLoaded', function () {
  var textarea  = document.getElementById('ak4WritingArea');
  var wordCount = document.getElementById('ak4WordCount');
  if (!textarea || !wordCount) return;

  textarea.addEventListener('input', function () {
    var text  = textarea.value.trim();
    var count = text ? text.split(/\s+/).filter(function (w) { return w.length > 0; }).length : 0;
    wordCount.innerHTML = 'Word Count: <strong style="color:#20B1A0;">' + count + '</strong>';
  });
});

// Voice Dictionary 언어 토글 (english.png ↔ korea.png) + 클릭음
document.addEventListener('DOMContentLoaded', function () {
  var langIcon = document.getElementById('ak4VdLangIcon');
  if (!langIcon) return;

  var isEnglish = true;

  function playClick() {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8);
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  langIcon.addEventListener('click', function () {
    playClick();
    isEnglish = !isEnglish;
    langIcon.src = isEnglish
      ? 'resource/imgs_new/english.png'
      : 'resource/imgs_new/korea.png';
    langIcon.alt = isEnglish ? 'english' : 'korea';
  });
});

// Voice Dictionary 전송 버튼 — 입력값 있을 때 주황색으로 전환
document.addEventListener('DOMContentLoaded', function () {
  var vdInput   = document.getElementById('ak4VdInput');
  var sendBtn   = document.getElementById('ak4VdSendBtn');
  if (!vdInput || !sendBtn) return;

  vdInput.addEventListener('input', function () {
    sendBtn.classList.toggle('ak4_vd_send_btn--active', vdInput.value.length > 0);
  });
});

// 탭 전환 — Guided Writing / 첨삭 내용
document.addEventListener('DOMContentLoaded', function () {
  var tabBtns  = document.querySelectorAll('.ak4_tab_btn');
  var tabPanes = document.querySelectorAll('.ak4_tab_pane');
  if (!tabBtns.length) return;

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      tabBtns.forEach(function (b) { b.classList.remove('ak4_tab_btn--active'); });
      tabPanes.forEach(function (p) { p.classList.remove('ak4_tab_pane--active'); });

      btn.classList.add('ak4_tab_btn--active');
      var pane = document.getElementById('ak4Tab_' + target);
      if (pane) pane.classList.add('ak4_tab_pane--active');
    });
  });
});

// Voice Dictionary 마이크 토글 (입력창 ↔ 파형 애니메이션)
document.addEventListener('DOMContentLoaded', function () {
  var micIcon  = document.getElementById('ak4VdMicIcon');
  var waveform = document.getElementById('ak4VdWaveform');
  var input    = document.getElementById('ak4VdInput');
  if (!micIcon || !waveform || !input) return;

  var micActive = false;

  micIcon.addEventListener('click', function () {
    micActive = !micActive;
    input.style.display = micActive ? 'none' : '';
    waveform.classList.toggle('ak4_waveform--active', micActive);
    micIcon.classList.toggle('ak4_vd_mic_icon--active', micActive);
  });
});
