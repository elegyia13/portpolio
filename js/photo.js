$(function () {
  const canvas = document.querySelector('.canvas');
  const cards = document.querySelectorAll('.draggable-card');
  const textSection = document.getElementById('hoverTextSection');

  let isDraggingCanvas = false;
  let isDraggingCard = false;
  let activeCard = null;
  let startX, startY;

  // 캔버스 드래그 상태
  let canvasOffsetX = 0;
  let canvasOffsetY = 0;

  // 캔버스 초기화
  const frame = document.querySelector('.top-container');
  const frameWidth = frame.offsetWidth;
  const frameHeight = frame.offsetHeight;
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  canvasOffsetX = (frameWidth / 2) - (canvasWidth / 2);
  canvasOffsetY = (frameHeight / 2) - (canvasHeight / 2) + 500;
  canvas.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px)`;

  // 캔버스 드래그 시작
  canvas.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('draggable-card')) {
      // 카드 드래그 시작
      isDraggingCard = true;
      activeCard = e.target;
      startX = e.clientX;
      startY = e.clientY;

      const computedStyle = window.getComputedStyle(activeCard);
      activeCard.dataset.startX = parseInt(computedStyle.left, 10) || 0;
      activeCard.dataset.startY = parseInt(computedStyle.top, 10) || 0;

      // 텍스트 섹션 초기화 및 표시
      const text = activeCard.getAttribute('data-text');
      textSection.innerHTML = text; // HTML 태그를 해석
      textSection.style.display = 'block';
      updateTextSectionPosition(activeCard);
    } else {
      // 캔버스 드래그 시작
      isDraggingCanvas = true;
      startX = e.clientX;
      startY = e.clientY;
      canvas.style.cursor = 'grabbing';
    }
  });

  // 드래그 중
  canvas.addEventListener('mousemove', (e) => {
    if (isDraggingCanvas) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      canvasOffsetX += dx;
      canvasOffsetY += dy;

      canvas.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px)`;

      startX = e.clientX;
      startY = e.clientY;
    }

    if (isDraggingCard && activeCard) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newLeft = parseInt(activeCard.dataset.startX) + dx;
      const newTop = parseInt(activeCard.dataset.startY) + dy;

      activeCard.style.left = `${newLeft}px`;
      activeCard.style.top = `${newTop}px`;

      // 카드 이동 중 텍스트 섹션 위치 업데이트
      updateTextSectionPosition(activeCard);
    }
  });

  // 드래그 종료
  document.addEventListener('mouseup', () => {
    isDraggingCanvas = false;
    isDraggingCard = false;
    activeCard = null;
    canvas.style.cursor = 'grab';
    textSection.style.display = 'none'; // 드래그 종료 시 텍스트 섹션 숨김
  });

  document.addEventListener('mouseleave', () => {
    isDraggingCanvas = false;
    isDraggingCard = false;
    activeCard = null;
    canvas.style.cursor = 'grab';
    textSection.style.display = 'none'; // 드래그 종료 시 텍스트 섹션 숨김
  });

  // 카드 호버 시 텍스트 섹션 표시
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (isDraggingCard || isDraggingCanvas) return; // 드래그 중에는 텍스트 섹션 표시 금지

      const text = card.getAttribute('data-text');
      textSection.innerHTML = text; // HTML 태그를 해석
      textSection.style.display = 'block';
      updateTextSectionPosition(card);
    });

    card.addEventListener('mouseleave', () => {
      if (!isDraggingCard) {
        textSection.style.display = 'none';
        textSection.innerHTML = ''; // 초기화
      }
    });
  });

  // 텍스트 섹션 위치 업데이트 함수
  function updateTextSectionPosition(card) {
    const cardRect = card.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    const sectionTop = cardRect.top - frameRect.top - textSection.offsetHeight - 10; // 카드 위로
    const sectionLeft = cardRect.left - frameRect.left + (cardRect.width / 2) - (textSection.offsetWidth / 2); // 카드 중앙 정렬

    textSection.style.top = `${sectionTop}px`;
    textSection.style.left = `${sectionLeft}px`;
  }
});
