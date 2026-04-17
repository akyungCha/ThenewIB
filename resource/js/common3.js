// =============================================
// IB 퀴즈 데이터 — 플레이스홀더 (추후 백엔드 연동)
// 각 항목: { question: 문자열, choices: 문자열[], correctIndex: 숫자(0부터 시작) }
// =============================================
const quizData = [
  {
    question: "나라마다 규칙이 다른 이유를 설명하는 핵심 개념은 무엇일까요?",
    choices: ["규칙의 개수", "관점", "문화의 역사", "법률 체계"],
    correctIndex: 1
  },
  {
    question: "IB 교육 프로그램의 핵심 목표는 무엇인가요?",
    choices: ["시험 점수 향상", "국제적 소양과 비판적 사고 계발", "암기 능력 강화", "경쟁에서 이기기"],
    correctIndex: 1
  },
  {
    question: "21세기 리더십에서 가장 중요한 덕목은 무엇인가요?",
    choices: ["권위", "공감과 경청", "규율", "명령"],
    correctIndex: 1
  },
  {
    question: "비교/대조 글쓰기에서 쓰이는 연결어는 무엇인가요?",
    choices: ["therefore", "however", "because", "also"],
    correctIndex: 1
  },
  {
    question: "IB 에세이의 올바른 구조는 어떻게 되나요?",
    choices: ["서론만 작성", "서론 / 본론 / 결론", "결론만 작성", "본론 / 결론"],
    correctIndex: 1
  }
];

// 현재 문제 인덱스 및 답변 여부
let currentIndex = 0;
let answered     = false;

// Web Audio API 컨텍스트 (브라우저 자동재생 정책에 따라 클릭 시 재개)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// =============================================
// 오답 효과음 
// =============================================
function playWrongSound() {
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.28);

  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.32);
}

// =============================================
// 정답 효과음 
// =============================================
function playCorrectSound() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;

    const t = audioCtx.currentTime + i * 0.11;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.start(t);
    osc.stop(t + 0.38);
  });
}

// =============================================
// 진행 바 렌더링
// =============================================
function renderProgress() {
  const total     = quizData.length;
  const container = document.getElementById('quizProgress');
  container.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'quiz-progress-seg' + (i === currentIndex ? ' active' : '');
    container.appendChild(seg);
  }
}

// =============================================
// 문제 및 보기 카드 렌더링
// =============================================
function renderQuestion() {
  answered = false;
  const q = quizData[currentIndex];

  document.getElementById('currentQNum').textContent  = currentIndex + 1;
  document.getElementById('totalQNum').textContent    = quizData.length;
  document.getElementById('quizQuestion').textContent = q.question;

  const choicesEl = document.getElementById('quizChoices');
  choicesEl.innerHTML = '';

  q.choices.forEach((text, idx) => {
    // 카드 생성
    const card = document.createElement('div');
    card.className = 'choice-card';

    // 번호 원형 래퍼 (X 오버레이 포함)
    const numWrap = document.createElement('div');
    numWrap.className = 'choice-num-wrap';

    const numCircle = document.createElement('div');
    numCircle.className   = 'choice-num';
    numCircle.textContent = idx + 1;

    const xImg = document.createElement('img');
    xImg.src       = 'resource/imgs_new/x.png';
    xImg.alt       = '오답';
    xImg.className = 'x-overlay';

    numWrap.appendChild(numCircle);
    numWrap.appendChild(xImg);

    // 보기 텍스트
    const choiceText = document.createElement('div');
    choiceText.className   = 'choice-text';
    choiceText.textContent = text;

    card.appendChild(numWrap);
    card.appendChild(choiceText);

    card.addEventListener('click', () => handleAnswer(card, idx, q.correctIndex));
    choicesEl.appendChild(card);
  });
}

// =============================================
// 답변 처리 — 정답/오답 피드백 적용
// =============================================
function handleAnswer(card, selectedIdx, correctIdx) {
  if (answered) return;
  answered = true;

  // 브라우저 자동재생 정책으로 일시정지된 경우 오디오 재개
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // 모든 카드 잠금 (추가 클릭 방지)
  document.querySelectorAll('.choice-card').forEach(c => c.classList.add('answered'));

  if (selectedIdx === correctIdx) {
    // 정답: 테두리·번호 원형 → 민트색, 차임 효과음
    card.classList.add('correct');
    playCorrectSound();
  } else {
    // 오답: 테두리 → 빨간색, X 이미지 오버레이, 에러 비프음
    card.classList.add('wrong');
    playWrongSound();
  }
}

// =============================================
// 초기화
// =============================================
if (document.getElementById('quizProgress')) {
  renderProgress();
  renderQuestion();
}


// =============================================================
// 퀴즈 리포트 — 왼쪽 결과 카드 영역
// qrCardList 가 없는 페이지에서는 즉시 종료
// =============================================================
(function () {
  if (!document.getElementById('qrCardList')) return;

  // -------------------------------------------------------
  // 목업 데이터 (추후 백엔드 연동필요)
  // -------------------------------------------------------
  const reportData = [
    { question: '나라마다 규칙이 다른 이유를 설명하는 핵심 개념은?',   isCorrect: true  },
    { question: 'IB 교육 프로그램의 핵심 목표는 무엇인가요?',          isCorrect: true  },
    { question: '21세기 리더십에서 가장 중요한 덕목은?',               isCorrect: true  },
    { question: '비교/대조 글쓰기에 쓰이는 연결어는?',                isCorrect: false },
    { question: 'IB 에세이의 올바른 구조는 어떻게 되나요?',           isCorrect: false },
    { question: '서론에서 자신의 주장을 효과적으로 제시하는 방법은?',   isCorrect: false },
    { question: '힘 중심 리더십과 지혜로운 리더십의 차이점은?',        isCorrect: true  },
    { question: '국제적 소양을 기르기 위해 필요한 태도는 무엇인가요?', isCorrect: true  },
  ];

  // CSS .qr-card height / .qr-card-list gap 과 반드시 동일하게 유지
  const CARDS_PER_PAGE = 5;
  const CARD_HEIGHT    = 80;
  const CARD_GAP       = 24;
  const PAGE_OFFSET    = CARDS_PER_PAGE * (CARD_HEIGHT + CARD_GAP); // 520px

  const totalPages  = Math.ceil(reportData.length / CARDS_PER_PAGE);
  let   currentPage = 0;

  // -------------------------------------------------------
  // 결과 카드 렌더링
  // -------------------------------------------------------
  function renderReportCards() {
    const list = document.getElementById('qrCardList');
    list.innerHTML = '';

    reportData.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'qr-card';

      // 번호 원형
      const num = document.createElement('div');
      num.className   = 'qr-card-num';
      num.textContent = idx + 1;

      // 문제 텍스트
      const text = document.createElement('div');
      text.className   = 'qr-card-text';
      text.textContent = item.question;

      // 정답/오답 아이콘
      const icon = document.createElement('img');
      icon.className = 'qr-card-result';
      icon.src = item.isCorrect
        ? 'resource/imgs_new/O.svg'
        : 'resource/imgs_new/x.png';
      icon.alt = item.isCorrect ? '정답' : '오답';

      card.appendChild(num);
      card.appendChild(text);
      card.appendChild(icon);
      list.appendChild(card);
    });
  }

  // -------------------------------------------------------
  // 페이지 점(dot) 렌더링
  // -------------------------------------------------------
  function renderPageDots() {
    const el = document.getElementById('qrPageDots');
    el.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = 'qr-dot' + (i === currentPage ? ' active' : '');
      el.appendChild(dot);
    }
  }

  // -------------------------------------------------------
  // 스와이프 힌트 표시 여부 갱신
  // -------------------------------------------------------
  function updateSwipeHint() {
    document.getElementById('qrSwipeHint')
      .classList.toggle('hidden', currentPage >= totalPages - 1);
  }

  // -------------------------------------------------------
  // 페이지 이동
  // -------------------------------------------------------
  function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    document.getElementById('qrCardList').style.transform =
      `translateY(-${currentPage * PAGE_OFFSET}px)`;
    renderPageDots();
    updateSwipeHint();
  }

  // -------------------------------------------------------
  // 스와이프 / 마우스 드래그 / 휠 이벤트 등록
  // 왼쪽 카드 목록 영역(.qr-left) 안에서만 동작
  // -------------------------------------------------------
  function initSwipe() {
    const viewport = document.getElementById('qrViewport');
    let startY   = 0;
    let dragging = false;

    // 터치 (모바일)
    viewport.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dy) < 10) return;
      if (dy < 0) goToPage(currentPage + 1);
      else        goToPage(currentPage - 1);
    });

    // 마우스 드래그 (데스크탑)
    viewport.addEventListener('mousedown', e => {
      dragging = true;
      startY   = e.clientY;
      e.preventDefault();
    });

    viewport.addEventListener('mouseup', e => {
      if (!dragging) return;
      dragging    = false;
      const dy    = e.clientY - startY;
      if (Math.abs(dy) < 10) return;
      if (dy < 0) goToPage(currentPage + 1);
      else        goToPage(currentPage - 1);
    });

    // 마우스 휠 — 뷰포트 안에서만, 페이지 스크롤 차단
    viewport.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY > 0) goToPage(currentPage + 1);
      else              goToPage(currentPage - 1);
    }, { passive: false });
  }

  // -------------------------------------------------------
  // 초기화 실행
  // -------------------------------------------------------
  renderReportCards();
  renderPageDots();
  updateSwipeHint();
  initSwipe();
})();


// =============================================================
// 퀴즈 리포트 — 오른쪽 원형 프로그레스바
// qrCircleFill 이 없는 페이지에서는 즉시 종료
// =============================================================
(function () {
  if (!document.getElementById('qrCircleFill')) return;

  const CIRCUMFERENCE = 251.2; // 2π × r(40)

  function initCircle() {
    const icons   = document.querySelectorAll('.qr-card-result');
    let   correct = 0;
    icons.forEach(img => { if (img.alt === '정답') correct++; });
    const total  = icons.length;
    const pct    = total > 0 ? Math.round((correct / total) * 100) : 0;
    const offset = CIRCUMFERENCE * (1 - pct / 100);

    const fill  = document.getElementById('qrCircleFill');
    const label = document.getElementById('qrCircleLabel');
    const stats = document.getElementById('qrStats');
    const msg   = document.getElementById('qrMsg');

    // 퍼센트 레이블
    label.textContent = pct + '%';

    // 통계 텍스트 (숫자만 bold)
    stats.innerHTML = `전체 문제 수 <strong>${total}</strong>    ㅣ     맞힌 문제 수 <strong>${correct}</strong>`;

    const iconHtml = `<img src="resource/imgs_new/triangle.svg" alt="" class="qr-msg-icon">`;

    // 초기 안내 문구 (점수 기반)
    if (pct < 80) {
      msg.innerHTML = `${iconHtml}퀴즈 80점을 넘어야 Writing 학습에 입장할 수 있습니다. 퀴즈에 다시 도전해주세요!`;
    } else {
      msg.innerHTML = `${iconHtml}퀴즈 80점을 넘었어요! 이제 Writing Contest에 도전해보세요!`;
    }

    const right      = document.getElementById('qrPerfBox');
    const incomplete = document.getElementById('qrCircleIncomplete');
    const complete   = document.getElementById('qrCircleComplete');
    const retryBtn   = document.querySelector('.qr-retry-btn');

    function switchToComplete() {
      right.classList.add('is-done');
      msg.innerHTML      = `퀴즈 80점을 넘었어요! 이제 Writing Contest에 도전해보세요!`;
      retryBtn.textContent = 'Writing Contest 참가하기';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          complete.classList.add('is-visible');
        });
      });
    }

    function switchToIncomplete() {
      complete.classList.remove('is-visible');
      msg.innerHTML      = `${iconHtml}퀴즈 80점을 넘어야 Writing 학습에 입장할 수 있습니다. 퀴즈에 다시 도전해주세요!`;
      retryBtn.textContent = '퀴즈 다시 도전하기';
      complete.addEventListener('transitionend', () => {
        right.classList.remove('is-done');
      }, { once: true });
    }

    // 퀴즈 80% 이상 — 완료 원형(passed 뱃지) 자동 전환
    if (pct >= 80) {
      switchToComplete();
      return;
    }

    // 퀴즈 80% 미만 — fail 뱃지 원형 + 채우기 애니메이션 
    fill.style.strokeDasharray  = CIRCUMFERENCE;
    fill.style.strokeDashoffset = CIRCUMFERENCE;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.transition       = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        fill.style.strokeDashoffset = offset;
      });
    });

// [DEV NOTE] 현재는 UI 프리뷰용 클릭 토글로 구현되어 있습니다.
// 실제 서비스 환경에서는 아래 두 줄의 클릭 이벤트를 제거하고
// 퀴즈 점수 데이터(score)가 기준 점수(예: 80점) 이상일 때 switchToComplete(),
// 미만일 때 switchToIncomplete()를 자동 호출하는 방식으로 교체해주세요.
    incomplete.addEventListener('click', switchToComplete);
    complete.addEventListener('click', switchToIncomplete);
  }

  setTimeout(initCircle, 0);
})();


