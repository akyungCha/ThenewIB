/* =============================================
   IB Report 페이지 공통 스크립트 (common5.js)
============================================= */

$(document).ready(function () {

  /* ─────────────────────────────────────────
     인덱스 탭 전환 (IB Report ↔ My Report)
  ───────────────────────────────────────── */
  $('#ak5IndexTabs').on('click', '.ak5_index_btn', function () {
    var target = $(this).data('view');

    /* 탭 버튼 활성 상태 교체 */
    $('.ak5_index_btn').removeClass('ak5_index_btn--active');
    $(this).addClass('ak5_index_btn--active');

    /* 해당 뷰 패널 표시, 나머지 숨김 */
    $('.ak5_view').removeClass('ak5_view--active');
    $('#ak5View_' + target).addClass('ak5_view--active');
  });

  /* ─────────────────────────────────────────
     UCC 영상 모달
  ───────────────────────────────────────── */

  /* 플레이스홀더 유튜브 URL (추후 실제 영상 URL 로 교체) */
  var UCC_PLACEHOLDER = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';

  var $uccModal   = $('#ak5UccModal');
  var $uccIframe  = $('#ak5UccIframe');
  var $uccTitle   = $('#ak5UccModalTitle');

  /* 모달 열기 */
  function openUccModal(title) {
    $uccTitle.text(title);
    $uccIframe.attr('src', UCC_PLACEHOLDER);
    $uccModal.addClass('ak5_modal_overlay--open');
    /* 모달이 열린 동안 body 스크롤 방지 */
    $('body').css('overflow', 'hidden');
  }

  /* 모달 닫기 */
  function closeUccModal() {
    $uccModal.removeClass('ak5_modal_overlay--open');
    /* iframe src 초기화 — 영상 재생 중단 */
    $uccIframe.attr('src', '');
    $('body').css('overflow', '');
  }

  /* UCC 버튼 클릭 → 모달 열기 */
  $('.ak5_card_grid').on('click', '.ak5_cta_btn[data-type="ucc"]', function () {
    var title = $(this).closest('.ak5_report_card').find('.ak5_card_title').text();
    openUccModal(title);
  });

  /* 닫기(×) 버튼 클릭 */
  $('#ak5UccModalClose').on('click', function () {
    closeUccModal();
  });

  /* 오버레이(배경) 클릭 → 닫기 (모달 박스 내부 클릭은 무시) */
  $uccModal.on('click', function (e) {
    if ($(e.target).is($uccModal)) {
      closeUccModal();
    }
  });

  /* ESC 키 → 닫기 */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $uccModal.hasClass('ak5_modal_overlay--open')) {
      closeUccModal();
    }
  });

  /* ─────────────────────────────────────────
     1차 첨삭 모달 (feedback1)
  ───────────────────────────────────────── */

  var $fb1Modal     = $('#ak5Fb1Modal');
  var $fb1Indicator = $('#ak5Fb1Indicator');
  var $fb1Prev      = $('#ak5Fb1Prev');
  var $fb1Next      = $('#ak5Fb1Next');
  var TOTAL_VIEWS   = 2;
  var currentView   = 1; /* 현재 표시 중인 뷰 번호 (1 또는 2) */

  /* 뷰 전환 — direction: 'next' | 'prev' */
  function showFb1View(newView) {
    var direction = newView > currentView ? 'next' : 'prev';

    /* 현재 뷰 페이드 아웃 후 숨김 */
    var $current = $('#ak5Fb1View_' + currentView);
    $current.css({
      opacity: 0,
      transform: direction === 'next' ? 'translateX(-30px)' : 'translateX(30px)'
    });

    var nextView = newView;
    currentView  = newView;

    setTimeout(function () {
      /* 현재 뷰 완전 숨김 */
      $current.removeClass('ak5_fb1_view--active').css({ opacity: '', transform: '' });

      /* 새 뷰 — 진입 방향에서 시작 */
      var $next = $('#ak5Fb1View_' + nextView);
      $next.css({
        opacity: 0,
        transform: direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)'
      });
      $next.addClass('ak5_fb1_view--active');

      /* 강제 리플로우 후 목표 상태로 전환 */
      $next[0].offsetWidth; // eslint-disable-line no-unused-expressions
      $next.css({ opacity: 1, transform: 'translateX(0)' });

      /* transition 완료 후 인라인 스타일 정리 */
      setTimeout(function () {
        $next.css({ opacity: '', transform: '' });
      }, 260);
    }, 220);

    /* 인디케이터 + 화살표 비활성 상태 즉시 갱신 */
    updateFb1Nav();
  }

  /* 인디케이터 텍스트 및 화살표 disabled 상태 갱신 */
  function updateFb1Nav() {
    $fb1Indicator.text(currentView + ' / ' + TOTAL_VIEWS);
    $fb1Prev.prop('disabled', currentView === 1);
    $fb1Next.prop('disabled', currentView === TOTAL_VIEWS);
  }

  /* 모달 열기 */
  function openFb1Modal(title) {
    $('#ak5Fb1ModalTitle').text(title);

    /* 뷰 1 부터 시작 */
    currentView = 1;
    $('.ak5_fb1_view').removeClass('ak5_fb1_view--active ak5_fb1_view--left');
    $('#ak5Fb1View_1').addClass('ak5_fb1_view--active');
    updateFb1Nav();

    $fb1Modal.addClass('ak5_modal_overlay--open');
    $('body').css('overflow', 'hidden');
  }

  /* 모달 닫기 */
  function closeFb1Modal() {
    $fb1Modal.removeClass('ak5_modal_overlay--open');
    $('body').css('overflow', '');
  }

  /* 1차 첨삭 버튼 클릭 → 모달 열기 */
  $('.ak5_card_grid').on('click', '.ak5_cta_btn[data-type="feedback1"]', function () {
    var title = $(this).closest('.ak5_report_card').find('.ak5_card_title').text();
    openFb1Modal(title);
  });

  /* 닫기(×) 버튼 */
  $('#ak5Fb1ModalClose').on('click', function () {
    closeFb1Modal();
  });

  /* 오버레이(배경) 클릭 → 닫기 */
  $fb1Modal.on('click', function (e) {
    if ($(e.target).is($fb1Modal)) {
      closeFb1Modal();
    }
  });

  /* ESC 키 → 닫기 */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $fb1Modal.hasClass('ak5_modal_overlay--open')) {
      closeFb1Modal();
    }
  });

  /* 이전 화살표 */
  $fb1Prev.on('click', function () {
    if (currentView > 1) {
      showFb1View(currentView - 1);
    }
  });

  /* 다음 화살표 */
  $fb1Next.on('click', function () {
    if (currentView < TOTAL_VIEWS) {
      showFb1View(currentView + 1);
    }
  });

  /* ─────────────────────────────────────────
     2차 첨삭 모달 (feedback2)
  ───────────────────────────────────────── */

  var $fb2Modal      = $('#ak5Fb2Modal');
  var $fb2Indicator  = $('#ak5Fb2Indicator');
  var $fb2Prev       = $('#ak5Fb2Prev');
  var $fb2Next       = $('#ak5Fb2Next');
  var TOTAL_VIEWS_2  = 2;
  var currentView2   = 1;

  /* 뷰 전환 */
  function showFb2View(newView) {
    var direction = newView > currentView2 ? 'next' : 'prev';

    var $current = $('#ak5Fb2View_' + currentView2);
    $current.css({
      opacity: 0,
      transform: direction === 'next' ? 'translateX(-30px)' : 'translateX(30px)'
    });

    var nextView  = newView;
    currentView2  = newView;

    setTimeout(function () {
      $current.removeClass('ak5_fb1_view--active').css({ opacity: '', transform: '' });

      var $next = $('#ak5Fb2View_' + nextView);
      $next.css({
        opacity: 0,
        transform: direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)'
      });
      $next.addClass('ak5_fb1_view--active');

      $next[0].offsetWidth; // eslint-disable-line no-unused-expressions
      $next.css({ opacity: 1, transform: 'translateX(0)' });

      setTimeout(function () {
        $next.css({ opacity: '', transform: '' });
      }, 260);
    }, 220);

    updateFb2Nav();
  }

  /* 인디케이터 + 화살표 disabled 갱신 */
  function updateFb2Nav() {
    $fb2Indicator.text(currentView2 + ' / ' + TOTAL_VIEWS_2);
    $fb2Prev.prop('disabled', currentView2 === 1);
    $fb2Next.prop('disabled', currentView2 === TOTAL_VIEWS_2);
  }

  /* 모달 열기 */
  function openFb2Modal(title) {
    $('#ak5Fb2ModalTitle').text(title);

    currentView2 = 1;
    $('#ak5Fb2View_1, #ak5Fb2View_2').removeClass('ak5_fb1_view--active');
    $('#ak5Fb2View_1').addClass('ak5_fb1_view--active');
    updateFb2Nav();

    $fb2Modal.addClass('ak5_modal_overlay--open');
    $('body').css('overflow', 'hidden');
  }

  /* 모달 닫기 */
  function closeFb2Modal() {
    $fb2Modal.removeClass('ak5_modal_overlay--open');
    $('body').css('overflow', '');
  }

  /* 2차 첨삭 버튼 클릭 → 모달 열기 */
  $('.ak5_card_grid').on('click', '.ak5_cta_btn[data-type="feedback2"]', function () {
    var title = $(this).closest('.ak5_report_card').find('.ak5_card_title').text();
    openFb2Modal(title);
  });

  /* 닫기(×) 버튼 */
  $('#ak5Fb2ModalClose').on('click', function () {
    closeFb2Modal();
  });

  /* 오버레이(배경) 클릭 → 닫기 */
  $fb2Modal.on('click', function (e) {
    if ($(e.target).is($fb2Modal)) {
      closeFb2Modal();
    }
  });

  /* ESC 키 → 닫기 */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $fb2Modal.hasClass('ak5_modal_overlay--open')) {
      closeFb2Modal();
    }
  });

  /* 이전 화살표 */
  $fb2Prev.on('click', function () {
    if (currentView2 > 1) {
      showFb2View(currentView2 - 1);
    }
  });

  /* 다음 화살표 */
  $fb2Next.on('click', function () {
    if (currentView2 < TOTAL_VIEWS_2) {
      showFb2View(currentView2 + 1);
    }
  });

});
