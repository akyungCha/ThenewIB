// 프로그레스 바 타이머 — requestAnimationFrame으로 끊김 없이 증가
document.addEventListener("DOMContentLoaded", () => {
  const TOTAL_MS = 15000;

  document.querySelectorAll(".right_bottom").forEach((wrap) => {
    const input = wrap.querySelector(".progress_input");
    const btn = wrap.querySelector(".right_arrow_btn");
    const fill = wrap.querySelector(".progress_fill");
    const valueLabel = wrap.querySelector(".progress_value");
    if (!input || !fill) return;

    let rafId = null;
    let startTime = null;
    let started = false;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / TOTAL_MS) * 100, 100);

      fill.style.width = pct + "%";

      if (valueLabel) {
        const remaining = Math.ceil((TOTAL_MS - elapsed) / 1000);
        valueLabel.textContent = Math.max(remaining, 0) + "s";
      }

      if (pct >= 80) fill.classList.add("danger");

      if (elapsed < TOTAL_MS) {
        rafId = requestAnimationFrame(tick);
      } else {
        fill.style.width = "100%";
        if (valueLabel) valueLabel.textContent = "0s";
      }
    }

    function startTimer() {
      if (started) return;
      started = true;
      rafId = requestAnimationFrame(tick);
    }

    function resetTimer() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      startTime = null;
      started = false;
      fill.style.width = "0%";
      fill.classList.remove("danger");
      if (valueLabel) valueLabel.textContent = (TOTAL_MS / 1000) + "s";
      input.value = "";
      input.focus();
    }

    input.addEventListener("input", () => startTimer());

    if (btn) {
      btn.addEventListener("click", () => resetTimer());
    }
  });
});

$(function () {
  $(".burgur_nav").click(function () {
    if ($("#burgur").hasClass("on")) {
      $("#burgur").removeClass("on");
      $("#slide").removeClass("on");
    } else {
      $("#burgur").addClass("on");
      $("#slide").addClass("on");
    }
  });
});

//"다른 학생 질문 보기" 버튼 클릭시 포스트잇 -> 통계 패널로 전환
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const showBtn = e.target.closest(
      '.sticker .btn.btn_teal[name="button"]',
    );
    if (!showBtn) return;

    const sticker = showBtn.closest(".sticker");
    if (!sticker) return;

    let circle = sticker.nextElementSibling;
    while (
      circle &&
      !(circle.classList && circle.classList.contains("circle_wrap"))
    ) {
      circle = circle.nextElementSibling;
    }

    if (!circle) {
      const targetSel = showBtn.getAttribute("data-target");
      if (targetSel) circle = document.querySelector(targetSel);
    }

    if (!circle) return;

    sticker.style.display = "none";
    circle.style.display = "block";
    circle.setAttribute("aria-hidden", "false");

    // "나의 원더노트 보기" 클릭 시 다시 포스트잇 패널 복구
    const backBtn = circle.querySelector(".btn.btn_orange");
    if (backBtn && !backBtn._bound) {
      backBtn._bound = true;
      backBtn.addEventListener("click", () => {
        circle.style.display = "none";
        circle.setAttribute("aria-hidden", "true");
        sticker.style.display = "block";
      });
    }
  });
});



// 탭 전환
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab_wrap").forEach((wrap) => {
    wrap.querySelectorAll(".tab_btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".tab_btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
});



// 노트 확대 모달
document.addEventListener('DOMContentLoaded', function () {
  const overlay    = document.getElementById('ak_note_overlay');
  const modal      = document.getElementById('ak_note_modal');
  const modalInput = document.getElementById('ak_note_modal_input');
  if (!overlay || !modal || !modalInput) return;
  let activeNote = null;

  function openNote(item) {
    activeNote = item;
    modalInput.value = item.querySelector('.ak_note_text').textContent;
    var isDone = item.classList.contains('ak_note_done');
    modalInput.readOnly = isDone;
    overlay.classList.add('active');
    modal.classList.add('active');
    if (!isDone) { modalInput.focus(); }
  }

  function closeNote() {
    if (activeNote && !activeNote.classList.contains('ak_note_done')) {
      var text = modalInput.value.trim();
      activeNote.querySelector('.ak_note_text').textContent = text;
      if (text) { activeNote.classList.add('ak_note_done'); }
      var guide = activeNote.querySelector('.ak_note_guide');
      if (guide) { guide.style.display = text ? 'none' : ''; }
    }
    modalInput.readOnly = false;
    overlay.classList.remove('active');
    modal.classList.remove('active');
    activeNote = null;
  }

  document.querySelectorAll('.ak_note_item').forEach(function (item) {
    item.addEventListener('click', function () { openNote(item); });
  });

  modalInput.addEventListener('input', function () {
    if (!activeNote) { return; }
    var guide = activeNote.querySelector('.ak_note_guide');
    if (guide) { guide.style.display = modalInput.value ? 'none' : ''; }
  });

  modalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); closeNote(); }
  });

  overlay.addEventListener('click', closeNote);
});

// 답변 입력 진행 바
document.addEventListener('DOMContentLoaded', function () {
  var answerInput = document.querySelector('.ak_answer_input');
  var segs        = document.querySelectorAll('.ak_progress_seg');
  if (!answerInput || !segs.length) return;
  var TOTAL    = segs.length;
  var filled   = 0;
  var intervalId = null;

  function tick() {
    if (filled >= TOTAL) { clearInterval(intervalId); return; }
    segs[filled].classList.add('ak_progress_seg_filled');
    filled++;
  }

  answerInput.addEventListener('input', function () {
    if (intervalId === null && filled === 0) {
      intervalId = setInterval(tick, 1000);
    }
  });
});

// 햄버거 네비 토글
document.addEventListener('DOMContentLoaded', function () {
  const btn      = document.getElementById('ak_hamburger');
  const nav      = document.getElementById('ak_nav');
  const backdrop = document.getElementById('ak_backdrop');
  if (!btn || !nav || !backdrop) return;

  function openNav() {
    nav.classList.add('open');
    backdrop.classList.add('open');
    btn.classList.add('open');
  }

  function closeNav() {
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    btn.classList.remove('open');
  }

  btn.addEventListener('click', function () {
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  backdrop.addEventListener('click', closeNav);
});

// "다른 학생 질문 보기" ↔ "내 원더 노트로 돌아가기" 토글
document.addEventListener('DOMContentLoaded', function () {
  var helpBtn   = document.getElementById('ak_help_btn');
  var postGrid  = document.getElementById('ak_post_grid');
  var statsView = document.getElementById('ak_stats_view');
  if (!helpBtn || !postGrid || !statsView) return;

  var boxLeft = document.querySelector('.ak_box_left');
  var btnText = helpBtn.querySelector('.ak_help_btn_text');
  var isStats = false;

  helpBtn.addEventListener('click', function () {
    isStats = !isStats;
    if (isStats) {
      postGrid.style.display  = 'none';
      statsView.style.display = 'flex';
      if (boxLeft) boxLeft.classList.add('ak_stats_active');
      helpBtn.classList.add('ak_help_btn--back');
      if (btnText) btnText.textContent = '내 원더노트로 돌아가기';
    } else {
      statsView.style.display = 'none';
      postGrid.style.display  = '';
      if (boxLeft) boxLeft.classList.remove('ak_stats_active');
      helpBtn.classList.remove('ak_help_btn--back');
      if (btnText) btnText.textContent = '다른 학생 질문 보기';
    }
  });
});

// 전송 아이콘 토글
document.addEventListener('DOMContentLoaded', function () {
  var sendIcon = document.querySelector('.ak_send_icon');
  var answerInputForIcon = document.querySelector('.ak_answer_input');
  if (!sendIcon || !answerInputForIcon) return;
  var path = sendIcon.querySelector('.ak_send_icon_path');
  answerInputForIcon.addEventListener('input', function () {
    if (this.value.length > 0) {
      path.setAttribute('fill', '#FF871D');
    } else {
      path.setAttribute('fill', '#C2C1C1');
    }
  });
});
