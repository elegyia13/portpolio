// 이벤트 중복 방지 플래그
let isMouseMoveListenerActive = false;

// 공통 변수 정의
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false; // 마우스 드로잉 상태
let currentColor = "#D5B1F4"; // 기본 색상
let lastX = 0; // 마지막 마우스 X 좌표
let lastY = 0; // 마지막 마우스 Y 좌표
let activeContent = ""; // 현재 활성화된 콘텐츠 탭
let messageChanged = false; // 메시지 상태 변경 플래그

// 초기 메시지 및 팝업 설정
const initialMessage = "I'M YI GYEO RE <br> I DESIGN"; // 초기 메시지
const popupMessage = "환영합니다! 각 탭을 클릭하고 <br> 색칠해보세요!"; // 팝업 메시지
const initialMessageFontFamily = "'Permanent Marker', sans-serif"; // 초기 폰트
const popupFontFamily = "Eulyoo1945"; // 팝업 폰트

// DOM 요소
const popup = document.getElementById("customPopup");
const popupMessageElement = document.getElementById("popupMessage");
const closePopupButton = document.getElementById("closePopup");

// 모든 탭 초기화 함수
function resetTabs() {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
}

// 캔버스 초기화 함수
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
    if (!activeContent) {
        messageChanged = false; // 초기 메시지 상태 초기화
        renderMessage(initialMessage, "rgba(0, 0, 0, 0.3)", initialMessageFontFamily);
    } else {
        renderActiveContent(); // 현재 활성화된 탭 콘텐츠 렌더링
    }
}

// 텍스트 메시지 렌더링 함수
function renderMessage(message, color, fontFamily = initialMessageFontFamily) {
    ctx.font = `70px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    const lines = message.split("<br>");
    const lineHeight = 80;
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 25 + index * lineHeight);
    });
}

// 팝업 표시 함수
function showPopup(message, fontFamily) {
    popupMessageElement.innerHTML = message;
    popupMessageElement.style.fontFamily = fontFamily;
    popup.classList.remove("hidden");
}

// 팝업 닫기 이벤트
closePopupButton.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// 탭 클릭 이벤트 핸들러
function openTab(tabId) {
    resetTabs(); // 모든 탭 초기화
    const selectedTab = document.querySelector(`.tab-${tabId}`);
    if (selectedTab) selectedTab.classList.add("active");

    activeContent = tabId.toLowerCase(); // 현재 활성화된 콘텐츠 설정
    resetCanvas(); // 캔버스 초기화
}

// 색칠 시작 이벤트
canvas.addEventListener("mousedown", e => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

// 색칠 종료 이벤트
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// 캔버스 색칠 및 콘텐츠 렌더링
canvas.addEventListener("mousemove", e => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 색칠 동작
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 60;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    lastX = x;
    lastY = y;

    // 메시지 상태에 따라 업데이트
    if (!messageChanged) {
        messageChanged = true;
        renderMessage(popupMessage, "rgba(0, 0, 0, 0.5)", popupFontFamily);
    }
});

// 초기화 로직
document.addEventListener("DOMContentLoaded", () => {
    resetCanvas(); // 초기 캔버스 상태
    showPopup(popupMessage, popupFontFamily); // 초기 팝업 표시
});

// 색상 변경 함수
function setColor(color) {
    currentColor = color; // 선택된 색상으로 브러시 색상 변경
}

// 현재 활성화된 콘텐츠 렌더링
function renderActiveContent() {
    if (activeContent === "about") {
        renderAboutContent();
    } else if (activeContent === "skills") {
        renderSkillsContent();
    } else if (activeContent === "interest") {
        renderInterestContent();
    } else if (activeContent === "contact") {
        renderContactContent();
    }
}

// 콘텐츠별 렌더링 함수
function renderAboutContent() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText("안녕하세요! 저는 'Record Changer'를 꿈꾸는 디자이너입니다.", canvas.width / 2, canvas.height / 2);
}

function renderSkillsContent() {
    const skills = ["Photoshop", "Illustrator", "Figma", "HTML", "CSS", "JavaScript"];
    ctx.font = "30px Arial";
    ctx.fillStyle = "#444";
    skills.forEach((skill, index) => {
        ctx.fillText(skill, canvas.width / 2, 100 + index * 40);
    });
}

function renderInterestContent() {
    const interests = [
        "🎨 그림 그리기",
        "🎶 음악 감상",
        "📖 책 읽기",
        "✍️ 글쓰기",
        "📸 사진 찍기"
    ];
    ctx.font = "30px Arial";
    ctx.fillStyle = "#555";
    interests.forEach((interest, index) => {
        ctx.fillText(interest, canvas.width / 2, 100 + index * 40);
    });
}

function renderContactContent() {
    const contacts = ["Email: elegyia25@gmail.com", "Phone: 010-224*-37**"];
    ctx.font = "30px Arial";
    ctx.fillStyle = "#666";
    contacts.forEach((contact, index) => {
        ctx.fillText(contact, canvas.width / 2, canvas.height / 2 + index * 40);
    });
}
