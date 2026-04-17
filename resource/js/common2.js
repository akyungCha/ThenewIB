// common2.js — init for 2-2_IB_research2(260405)

document.addEventListener('DOMContentLoaded', function () {

  // 언어 토글 (korea.png ↔ english.png) + 딸깍 소리
  var icon = document.getElementById('ak_lang_icon');
  var isKorea = true;

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

  // 마이크 아이콘 클릭 → 파형 애니메이션 토글
  var micIcon   = document.getElementById('ak_chat_mic_icon');
  var waveform  = document.getElementById('ak_chat_waveform');
  var chatInputEl = document.querySelector('.ak_chat_input');
  var micActive = false;

  micIcon.addEventListener('click', function () {
    micActive = !micActive;
    chatInputEl.style.display = micActive ? 'none' : '';
    waveform.classList.toggle('ak_waveform--active', micActive);
    micIcon.classList.toggle('ak_chat_mic_icon--active', micActive);
  });

  // 탭 전환 (라이팅 과제 ↔ 나의 원더노트)
  var tab1      = document.getElementById('ak_tab_1');
  var tab2      = document.getElementById('ak_tab_2');
  var rightWrap = document.getElementById('ak_right_wrap');

  tab1.addEventListener('click', function () {
    tab1.className = 'ak_tab_1_active';
    tab2.className = 'ak_tab_2';
    rightWrap.classList.remove('ak_right_wrap--tab2');
  });

  tab2.addEventListener('click', function () {
    tab1.className = 'ak_tab_1';
    tab2.className = 'ak_tab_2_active';
    rightWrap.classList.add('ak_right_wrap--tab2');
  });

  // 수행률 상태 토글 (백엔드 연동 시 setPerfComplete(true/false) 호출)
  var perfBox = document.getElementById('ak_perf_box');

  function setPerfComplete(isComplete) {
    perfBox.classList.toggle('ak_perf_box--complete', isComplete);
  }

  // 테스트용: 원형 진행 박스 클릭 시 상태 전환
  perfBox.addEventListener('click', function () {
    setPerfComplete(!perfBox.classList.contains('ak_perf_box--complete'));
  });

  // 입력값 있을 때 전송 버튼 주황색 전환
  var chatInput = document.querySelector('.ak_chat_input');
  var sendIcon  = document.querySelector('.ak_chat_send_icon');
  chatInput.addEventListener('input', function () {
    sendIcon.classList.toggle('ak_chat_send_icon--active', chatInput.value.length > 0);
  });

  icon.addEventListener('click', function () {
    playClick();
    isKorea = !isKorea;
    icon.src = isKorea
      ? 'resource/imgs_new/korea.png'
      : 'resource/imgs_new/english.png';
    icon.alt = isKorea ? 'korea' : 'english';
  });

});
