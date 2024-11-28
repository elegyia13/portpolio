$(function () {
  const canvas = document.querySelector('.canvas');
  const cards = document.querySelectorAll('.draggable-card');

  let isDraggingCanvas = false;
  let isDraggingCard = false;
  let canvasOffsetX = 0;
  let canvasOffsetY = 0;
  let startX, startY;
  let activeCard = null;

  // 프레임 크기 가져오기
  const frame = document.querySelector('.top-container');
  const frameWidth = frame.offsetWidth;
  const frameHeight = frame.offsetHeight;

  // 캔버스 크기 가져오기
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  // 초기 위치 계산 (캔버스 중심 배치)
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

      // 카드의 초기 위치 가져오기
      const computedStyle = window.getComputedStyle(activeCard);
      activeCard.dataset.startX = parseInt(computedStyle.left, 10) || 0;
      activeCard.dataset.startY = parseInt(computedStyle.top, 10) || 0;
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
    }
  });

  // 드래그 종료
  document.addEventListener('mouseup', () => {
    isDraggingCanvas = false;
    isDraggingCard = false;
    activeCard = null;
    canvas.style.cursor = 'grab';
  });

  document.addEventListener('mouseleave', () => {
    isDraggingCanvas = false;
    isDraggingCard = false;
    activeCard = null;
    canvas.style.cursor = 'grab';
  });
});


