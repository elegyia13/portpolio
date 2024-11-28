let isMouseMoveListenerActive = false; // 이벤트 중복 방지 플래그

// 모든 탭 초기화
function resetTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
        tab.classList.remove("active"); // 모든 탭에서 active 클래스 제거
    });
}

// 탭 클릭 이벤트
function openTab(tabId) {
    resetTabs(); // 모든 탭 초기화

    // 클릭된 탭 활성화
    const selectedTab = document.querySelector(`.tab-${tabId}`);
    if (selectedTab) {
        selectedTab.classList.add("active");
    }

    // 콘텐츠 설정
    activeContent = tabId.toLowerCase(); // 탭 이름과 콘텐츠 매칭
    resetCanvas(); // 캔버스 초기화
}

// 초기 로드 시 모든 탭 초기화
document.addEventListener("DOMContentLoaded", () => {
    resetTabs(); // 초기화
});








const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let currentColor = "#D5B1F4"; // 기본 색상
let lastX = 0;
let lastY = 0;
let activeContent = ""; // 현재 선택된 콘텐츠
// 초기 화면 메시지와 색칠 메시지 설정
const initialMessage = "I'M YI GYEO RE <br> I DESIGN"; // 초기 메시지
//const colorMessage = "각 탭을 클릭하고 <br> 색칠해보세요!"; // 색칠 시 표시할 메시지

// 폰트 패밀리 설정
let initialMessageFontFamily = "'Permanent Marker', sans-serif"; // 초기 메시지 폰트
let colorMessageFontFamily = "Eulyoo1945-Regular"; // 색칠 메시지 폰트


// 캔버스 초기화
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!activeContent) {
        // 초기 화면에서 메시지 렌더링
        messageChanged = false; // 초기 메시지 상태 초기화
        renderMessage(initialMessage, "rgba(0, 0, 0, 0.3)", initialMessageFontFamily);
    }
}

// 메시지 렌더링 함수
function renderMessage(message, color, fontFamily) {
    ctx.font = `70px ${fontFamily}`; // 폰트 패밀리 동적 설정
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    const lines = message.split("<br>"); // <br> 태그 처리
    const lineHeight = 80;
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 25 + index * lineHeight);
    });
}


// 초기 화면에서 메시지 변경
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || activeContent) return; // 초기 화면에서만 실행

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 색칠 동작
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 60; // 브러시 크기
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    lastX = x;
    lastY = y;

    // 메시지를 색칠 위로 다시 렌더링
    if (!messageChanged) {
        messageChanged = true; // 메시지 상태 변경
        renderMessage(colorMessage, "rgba(0, 0, 0, 0.5)", colorMessageFontFamily);
    } else {
        // 메시지가 이미 변경되었더라도 색칠 후 계속 메시지를 표시
       //renderMessage(colorMessage, "rgba(0, 0, 0, 0.5)", colorMessageFontFamily);
    }
});

// 폰트 로드 후 초기화
document.fonts.ready.then(() => {
    resetCanvas(); // 폰트 로드 완료 후 캔버스 초기화
});



// 마우스 이벤트: 칠하기 시작
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

// 마우스 이벤트: 칠하기 종료
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.beginPath(); // 현재 경로 초기화
});






// 위쪽만 둥근 모서리 이미지를 렌더링하는 함수
function drawTopRoundedImage(imgSrc, x, y, width, height, borderRadius) {
    const img = new Image();
    img.onload = function () {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y); // 왼쪽 위
        ctx.lineTo(x + width - borderRadius, y); // 오른쪽 위
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius); // 오른쪽 곡선
        ctx.lineTo(x + width, y + height); // 아래쪽 직선
        ctx.lineTo(x, y + height); // 왼쪽 아래
        ctx.lineTo(x, y + borderRadius); // 왼쪽 위 곡선 끝
        ctx.quadraticCurveTo(x, y, x + borderRadius, y); // 왼쪽 곡선
        ctx.closePath();

        ctx.clip(); // 클리핑 설정
        ctx.drawImage(img, x, y, width, height); // 이미지 렌더링
        ctx.restore(); // 클리핑 해제
    };
    img.src = imgSrc;
}

function wrapTextCenter(text, startX, startY, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let y = startY;

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, startX, y); // 한 줄의 텍스트 렌더링
            line = words[i] + " ";
            y += lineHeight; // 다음 줄로 이동
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, startX, y); // 마지막 줄 렌더링
}


// 팔레트 색상 설정
function setColor(color) {
    currentColor = color;
    // resetCanvas();
}

// 마우스 이벤트: 칠하기 시작
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

// 마우스 이벤트: 칠하기 종료
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.beginPath(); // 현재 경로 초기화
});

// 마우스 이동 이벤트: 색칠 및 콘텐츠 표시
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 색칠
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 60; // 브러시 크기
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();



    // 색칠 동작 및 콘텐츠 표시
    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 색칠 동작
        ctx.globalCompositeOperation = "source-over"; // 브러시 동작
        ctx.lineWidth = 120; // 브러시 크기
        ctx.lineCap = "round"; // 브러시 끝 모양
        ctx.strokeStyle = currentColor; // 브러시 색상
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

    });


    function drawSkillsImages(imageDataArray) {
        imageDataArray.forEach(({ src, x, y, width, height }) => {
            const img = new Image();
            img.onload = function () {
                ctx.save();
                ctx.globalCompositeOperation = "source-atop"; // 색칠된 영역에서만 보이도록 설정
                ctx.drawImage(img, x, y, width, height);
                ctx.restore();
            };
            img.src = src;
        });
    }

    // about 컨텐츠 부분 

    if (activeContent === "about") {
        ctx.globalCompositeOperation = "source-atop";

        // 이미지 렌더링 (색칠한 부분에서만 표시)
        const imgX = 50; // 이미지 시작 x 좌표
        const imgY = 50; // 이미지 시작 y 좌표
        const imgWidth = 200; // 이미지 너비
        const imgHeight = 300; // 이미지 높이
        const imgBorderRadius = 90; // 이미지 상단 둥근 모서리 반지름

        const img = new Image();
        img.src = "./img/me.png"; // 이미지 경로

        // 이미지 색칠된 부분에서만 렌더링
        img.onload = function () {
            // 색칠한 부분에서만 이미지가 표시되도록 `mousemove`에서 제어
            canvas.addEventListener("mousemove", (e) => {
                if (!isDrawing || activeContent !== "about") return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(imgX + imgBorderRadius, imgY);
                ctx.lineTo(imgX + imgWidth - imgBorderRadius, imgY);
                ctx.quadraticCurveTo(imgX + imgWidth, imgY, imgX + imgWidth, imgY + imgBorderRadius);
                ctx.lineTo(imgX + imgWidth, imgY + imgHeight);
                ctx.lineTo(imgX, imgY + imgHeight);
                ctx.lineTo(imgX, imgY + imgBorderRadius);
                ctx.quadraticCurveTo(imgX, imgY, imgX + imgBorderRadius, imgY);
                ctx.closePath();
                ctx.clip();

                // 색칠한 영역에서만 이미지 렌더링
                ctx.globalCompositeOperation = "source-atop";
                ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
                ctx.restore();
            });
        };

        // 제목 렌더링
        const title = "ABOUT ME!";
        const titleX = 300; // 제목 시작 x 좌표
        const titleY = 80;  // 제목 시작 y 좌표
        ctx.font = "60px Bentham"; // 제목 폰트 및 크기
        ctx.fillStyle = "#fff"; // 제목 색상
        ctx.textAlign = "left"; // 제목 정렬
        ctx.fillText(title, titleX, titleY);

        // 본문 렌더링
        const aboutText = `
안녕하세요, ‘Record Changer’를 꿈꾸는 UI/UX 디자이너 이겨레입니다.
‘Record Changer’는 단순히 레코드를 바꾸는 사람을 넘어,
상황을 새롭게 바꾸고 새로운 기준을 만드는 혁신가를 의미합니다.
저는 디자인을 통해 사용자 경험의 새로운 기준을 세우고자 하며,
늘 한 발 앞서 변화를 주도합니다.
    `;
        const textX = 300; // 본문 시작 x 좌표
        const textY = 150; // 본문 시작 y 좌표
        const maxWidth = canvas.width - textX - 50; // 본문 텍스트 최대 너비
        const lineHeight = 24; // 본문 줄 간격
        ctx.font = "16px Arial"; // 본문 폰트 및 크기
        ctx.fillStyle = "black"; // 본문 색상
        wrapTextCenter(aboutText, textX, textY, maxWidth, lineHeight);
    }



    //스킬 탭 컨텐츠 부분 

    if (activeContent === "skills") {
        ctx.globalCompositeOperation = "source-atop"; // 색칠된 부분에서만 보이도록 설정

        const skillImages = [
            { src: "./img/photoshop.png", x: 50, y: 50, width: 100, height: 100 },
            { src: "./img/ai.png", x: 200, y: 50, width: 100, height: 100 },
            { src: "./img/figma.png", x: 350, y: 50, width: 100, height: 100 },
            { src: "./img/html.png", x: 500, y: 50, width: 100, height: 100 },
            { src: "./img/css.png", x: 650, y: 50, width: 100, height: 100 },
            { src: "./img/js.png", x: 50, y: 200, width: 100, height: 100 },
            { src: "./img/jqaury.png", x: 200, y: 200, width: 100, height: 100 },
            { src: "./img/chatgpt.png", x: 350, y: 200, width: 100, height: 100 },
            { src: "./img/mid_journey.png", x: 500, y: 200, width: 100, height: 100 },
        ];

        // 이미지를 색칠된 부분에서만 보이게 렌더링
        drawSkillsImages(skillImages);
    }




    // motto 콘텐츠 표시
    if (activeContent === "motto") {
        ctx.globalCompositeOperation = "source-atop";

        // 제목 렌더링
        ctx.font = "bold 40px Caveat"; // 제목 폰트와 크기 설정
        ctx.fillStyle = "#fff"; // 제목 색상
        ctx.textAlign = "center";
        const titleY = canvas.height / 2 - 100; // 제목 y 좌표 (캔버스 중앙에서 위로 100px)
        ctx.fillText("Record Changer , 그리고...", canvas.width / 2, titleY); // 제목 위치 지정

        // 본문 텍스트 렌더링
        const mottoText = `
저는 ‘Record Changer'라는 표현을 좋아합니다. 이는 단순히 레코드판을 교체하는 사람이 아닌,
새로운 기준을 만들고 상황을 바꾸며, 더 나은 방향으로 나아가는 사람을 의미합니다. 그리고 자신의
한계를 넘어서는 사람을 뜻하기도 한다고 생각합니다.

또한 'I must not fear. Fear is the mind-killer.'라는 말은 제게 깊은 울림을 주었습니다. 
저는 늘 두려움에 가로막혀 주저했던 사람이었고, 그로 인해 많은 기회를 놓치기도 했습니다. 하지만 
이 말은 두려움이 저의 마음을 억누르고, 생각과 행동을 방해한다는 걸 깨닫게 해주었습니다.

그래서 이제는 이렇게 생각하게 되었습니다.
"나는 두려움에 머물지 않고, 한계를 넘어 새로운 길을 여는 사람이다."
두려움이 나를 막지 못하게 하고, 내 안에 새로운 기준을 세워 앞으로 나아가고자 합니다. 저는 더 이상
두려움에 머무르지 않고, 스스로의 길을 개척해나가는 Record Changer로서 새로운 변화의 시작을
만들어가고 싶습니다.
    `;

        // 본문 줄바꿈 및 제목 아래 위치 조정
        const lineHeight = 24; // 줄 간격
        const maxWidth = canvas.width - 100; // 본문의 최대 너비
        const startY = titleY + 40; // 제목 바로 아래 본문 시작 y 좌표 (40px 간격)

        ctx.font = "16px Eulyoo1945"; // 본문 폰트와 크기 설정
        ctx.fillStyle = "#333333"; // 본문 색상
        ctx.textAlign = "center"; // 본문 중앙 정렬
        wrapTextCenter(mottoText, canvas.width / 2, startY, maxWidth, lineHeight); // 본문 중앙 정렬
    }

    //interest 탭 컨텐츠 부분
    if (activeContent === "interest") {
        ctx.globalCompositeOperation = "source-atop";

        // 관심사 데이터 배열 (이미지 경로와 텍스트)
        const interests = [
            {
                imgSrc: "./img/Paint_Palette.png",
                text: "어렸을 때부터 그림 그리기를 좋아했어요. 그림 감상과 창작 모두를 즐깁니다.",
            },
            {
                imgSrc: "./img/Music.png",
                text: "다양한 장르의 음악을 감상하며 영감을 받아요. 작곡에도 관심이 많아요.",
            },
            {
                imgSrc: "./img/Open_Book.png",
                text: "책을 읽으며 새로운 시각을 배우고, 자기 전에 꼭 한 챕터씩 읽어요.",
            },
            {
                imgSrc: "./img/Book_And_Pencil.png",
                text: "글쓰기를 통해 감정을 표현하고 정리합니다. 매일 일기를 쓰는 습관이 있어요.",
            },
            {
                imgSrc: "./img/Camera.png",
                text: "사진 찍는 걸 좋아해요. 풍경을 담거나 소중한 순간을 기록합니다.",
            },
        ];

        const imgWidth = 60; // 이미지 너비
        const imgHeight = 60; // 이미지 높이
        const canvasPadding = 20; // 캔버스 상하좌우 여백
        const totalHeight = canvas.height - canvasPadding * 2; // 콘텐츠 배치 가능한 전체 높이
        const itemHeight = totalHeight / interests.length; // 각 항목의 할당 높이
        const gap = 10; // 이미지와 텍스트 사이의 간격
        const paintedRegions = new Array(interests.length).fill(false); // 색칠된 영역 상태

        const loadedImages = interests.map((interest, index) => {
            const img = new Image();
            img.src = interest.imgSrc;
            img.onload = () => {
                // 이미지 로드가 완료되면 해당 항목에 이미지 저장
                interests[index].loadedImage = img;
            };
            return img;
        });

        const renderInterestContent = () => {
            interests.forEach((interest, index) => {
                const imgX = 50; // 이미지 시작 X 좌표
                const imgY = canvasPadding + index * itemHeight + itemHeight / 2 - imgHeight / 2; // 이미지 중심 배치
                const textX = imgX + imgWidth + gap; // 텍스트 시작 X 좌표
                const textY = imgY + imgHeight / 2; // 텍스트 Y 좌표 (이미지와 수평 맞춤)
                const maxWidth = canvas.width - textX - canvasPadding; // 텍스트 최대 너비

                if (paintedRegions[index]) {
                    ctx.save();
                    ctx.globalCompositeOperation = "source-atop";

                    // 이미지 렌더링
                    if (interest.loadedImage) {
                        ctx.drawImage(interest.loadedImage, imgX, imgY, imgWidth, imgHeight);
                    }

                    // 텍스트 렌더링
                    ctx.font = "16px Eulyoo1945";
                    ctx.fillStyle = "#333333";
                    ctx.textAlign = "left";
                    wrapTextCenter(interest.text, textX, textY, maxWidth, 20);

                    ctx.restore();
                }
            });
        };



        canvas.addEventListener("mousemove", (e) => {
            if (!isDrawing || activeContent !== "interest") return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            interests.forEach((interest, index) => {
                const imgX = 50; // 이미지 시작 X 좌표
                const imgY = canvasPadding + index * itemHeight + itemHeight / 2 - imgHeight / 2; // 이미지 중심 배치

                // 현재 마우스가 해당 영역에 있는지 확인
                const isInsideRegion =
                    x >= imgX &&
                    x <= imgX + imgWidth &&
                    y >= imgY &&
                    y <= imgY + itemHeight;

                if (isInsideRegion) {
                    paintedRegions[index] = true; // 해당 영역을 색칠된 상태로 표시
                }
            });

            renderInterestContent();
        });

        // 다른 탭으로 전환 시 이벤트 제거
        const cleanupEvent = () => {
            if (activeContent !== "interest") {
                canvas.removeEventListener("mousemove", renderInterestContent);
            }
        };

        cleanupEvent();
    }



    // 컨텍트 탭 컨텐츠 부분

    if (activeContent === "contact") {
        ctx.globalCompositeOperation = "source-atop";

        // 연락처 데이터 배열 (이메일과 전화번호)
        const contactInfo = [
            "elegyia25@gmail.com",  // 이메일
            "010-224*-37**",        // 전화번호
        ];

        const canvasPadding = 50; // 캔버스 상하좌우 여백
        const totalHeight = canvas.height - canvasPadding * 2; // 콘텐츠 배치 가능한 전체 높이
        const itemHeight = totalHeight / contactInfo.length; // 각 항목의 할당 높이

        // 연락처 항목 렌더링
        contactInfo.forEach((info, index) => {
            const centerY = canvasPadding + index * itemHeight + itemHeight / 2; // 각 항목의 중심 Y 좌표
            ctx.font = "40px Eulyoo1945"; // 텍스트 폰트와 크기 설정
            ctx.fillStyle = "#333333"; // 텍스트 색상
            ctx.textAlign = "center"; // 텍스트 중앙 정렬
            ctx.fillText(info, canvas.width / 2, centerY); // 텍스트 렌더링
        });
    }



    lastX = x;
    lastY = y;
});



// 탭 클릭 이벤트
function openTab(tabId) {
    // 모든 탭 초기화
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => tab.classList.remove("active"));

    // 탭 활성화
    const selectedTab = document.querySelector(`.tab-${tabId}`);
    if (selectedTab) {
        selectedTab.classList.add("active");
    }

    // 콘텐츠 설정
    activeContent = tabId.toLowerCase(); // 탭 이름과 콘텐츠 매칭

    resetCanvas(); // 캔버스 초기화
}



// 팝업 초기 메시지
let popupMessage = "환영합니다! 각 탭을 클릭하고 <br> 색칠해보세요!";
let popupFontFamily = "Eulyoo1945"; // 팝업 메시지 폰트 패밀리

// 팝업 엘리먼트 가져오기
const popup = document.getElementById("customPopup");
const popupMessageElement = document.getElementById("popupMessage");
const closePopupButton = document.getElementById("closePopup");

// 팝업 표시 함수
function showPopup(message, fontFamily) {
    popupMessageElement.innerHTML = message; // 팝업 메시지 설정
    popupMessageElement.style.fontFamily = fontFamily; // 폰트 패밀리 설정
    popup.classList.remove("hidden"); // 팝업 표시
}

// 팝업 닫기 이벤트
closePopupButton.addEventListener("click", () => {
    popup.classList.add("hidden"); // 팝업 숨김
});

// 초기화면에서 팝업 표시
document.fonts.ready.then(() => {
    showPopup(popupMessage, popupFontFamily); // 팝업 메시지와 폰트 패밀리 설정
});

// 초기화면 메시지 렌더링 함수
function renderMessage(message, color) {
    ctx.font = "70px 'Permanent Marker', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    const lines = message.split("<br>"); // <br> 태그 처리
    const lineHeight = 80;
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 25 + index * lineHeight);
    });
}




