// 참가자 목록
let participants = [];
let remainingParticipants = [...participants];
let drawnNames = [];
let tempParticipants = []; // 모달에서 편집 중인 임시 목록

// DOM 요소
const drawBtn = document.getElementById("drawBtn");
const resetBtn = document.getElementById("resetBtn");
const editParticipantsBtn = document.getElementById("editParticipantsBtn");
const capsule = document.getElementById("capsule");
const capsuleLight = document.getElementById("capsuleLight");
const paper = document.getElementById("paper");
const nameDisplay = document.getElementById("nameDisplay");
const participantsList = document.getElementById("participantsList");
const drawnList = document.getElementById("drawnList");

// 모달 관련 요소
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const newParticipantInput = document.getElementById("newParticipantInput");
const addParticipantBtn = document.getElementById("addParticipantBtn");
const participantsEditList = document.getElementById("participantsEditList");

// 초기화
function init() {
  remainingParticipants = [...participants];
  drawnNames = [];
  updateParticipantsList();
  updateDrawnList();
  resetAnimation();
  drawBtn.disabled = participants.length === 0;

  // 참가자가 없으면 버튼 텍스트 변경
  if (participants.length === 0) {
    drawBtn.textContent = "👥 참가자를 먼저 추가해주세요";
  } else {
    drawBtn.textContent = "🎁 이름 뽑기";
  }
}

// 참가자 목록 업데이트
function updateParticipantsList() {
  participantsList.innerHTML = "";
  participants.forEach((name) => {
    const item = document.createElement("div");
    item.className = "participant-item";
    if (drawnNames.includes(name)) {
      item.classList.add("drawn");
    }
    item.textContent = name;
    participantsList.appendChild(item);
  });
}

// 뽑힌 이름 목록 업데이트
function updateDrawnList() {
  drawnList.innerHTML = "";
  if (drawnNames.length === 0) {
    drawnList.innerHTML =
      '<div style="text-align: center; color: #999;">아직 뽑힌 이름이 없습니다.</div>';
  } else {
    drawnNames.forEach((name, index) => {
      const item = document.createElement("div");
      item.className = "drawn-item";
      item.textContent = `${index + 1}. ${name}`;
      drawnList.appendChild(item);
    });
  }
}

// 애니메이션 리셋
function resetAnimation() {
  capsule.classList.remove("show", "open");
  paper.classList.remove("show");
  nameDisplay.textContent = "";
  capsule.style.bottom = "-70px";
  capsule.style.opacity = "0";
  const outletLight = document.getElementById("outletLight");
  if (outletLight) {
    outletLight.classList.remove("active");
  }
}

// 이름 뽑기
function drawName() {
  if (participants.length === 0) {
    alert("참가자가 없습니다. 참가자를 먼저 추가해주세요.");
    return;
  }

  if (remainingParticipants.length === 0) {
    alert("모든 참가자의 이름이 뽑혔습니다!");
    return;
  }

  // 버튼 비활성화
  drawBtn.disabled = true;

  // 애니메이션 리셋
  resetAnimation();

  // 추출구 빛나는 애니메이션 시작
  const outletLight = document.getElementById("outletLight");
  outletLight.classList.add("active");

  // 랜덤으로 이름 선택
  setTimeout(() => {
    const randomIndex = Math.floor(
      Math.random() * remainingParticipants.length
    );
    const selectedName = remainingParticipants[randomIndex];

    // 선택된 이름 제거
    remainingParticipants = remainingParticipants.filter(
      (name) => name !== selectedName
    );
    drawnNames.push(selectedName);

    // 추출구 빛나는 애니메이션 중지
    outletLight.classList.remove("active");

    // 캡슐 등장 애니메이션
    setTimeout(() => {
      capsule.classList.add("show");

      // 캡슐이 나타난 후 이름 설정
      nameDisplay.textContent = selectedName;

      // 목록 업데이트 (화면에는 표시 안 함)
      updateParticipantsList();
      updateDrawnList();

      // 캡슐이 충분히 보이고 커진 후 열림 애니메이션
      setTimeout(() => {
        capsule.classList.add("open");

        // 캡슐이 분리된 후 종이 나타남
        setTimeout(() => {
          paper.classList.add("show");

          // 애니메이션 완료 후 버튼 활성화
          setTimeout(() => {
            resetAnimation();
            outletLight.classList.remove("active");
            if (remainingParticipants.length > 0) {
              drawBtn.disabled = false;
            }
          }, 2000);
        }, 400);
      }, 1400);
    }, 500);
  }, 2000);
}

// 모달 열기
function openModal() {
  tempParticipants = [...participants];
  renderEditList();
  modalOverlay.classList.add("show");
  newParticipantInput.focus();
}

// 모달 닫기
function closeModal() {
  modalOverlay.classList.remove("show");
  tempParticipants = [];
  newParticipantInput.value = "";
}

// 편집 목록 렌더링
function renderEditList() {
  participantsEditList.innerHTML = "";
  if (tempParticipants.length === 0) {
    participantsEditList.innerHTML =
      '<div class="empty-message">참가자가 없습니다. 위에서 추가해주세요.</div>';
  } else {
    tempParticipants.forEach((name, index) => {
      const item = document.createElement("div");
      item.className = "edit-participant-item";
      item.innerHTML = `
        <span>${name}</span>
        <button class="delete-btn" data-index="${index}">삭제</button>
      `;
      participantsEditList.appendChild(item);
    });
  }

  // 삭제 버튼 이벤트
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      tempParticipants.splice(index, 1);
      renderEditList();
    });
  });
}

// 참가자 추가
function addParticipant() {
  const name = newParticipantInput.value.trim();
  if (name === "") {
    alert("이름을 입력해주세요.");
    return;
  }
  if (tempParticipants.includes(name)) {
    alert("이미 추가된 참가자입니다.");
    return;
  }
  tempParticipants.push(name);
  newParticipantInput.value = "";
  renderEditList();
  newParticipantInput.focus();
}

// 참가자 목록 저장
function saveParticipants() {
  if (tempParticipants.length === 0) {
    alert("최소 1명의 참가자가 필요합니다.");
    return;
  }

  // 참가자 목록이 변경되었는지 확인
  const hasChanged =
    tempParticipants.length !== participants.length ||
    !tempParticipants.every((name, index) => name === participants[index]);

  if (hasChanged) {
    // 참가자 목록 업데이트 및 초기화
    participants = [...tempParticipants];
    remainingParticipants = [...participants];
    drawnNames = [];
    init();
  }

  closeModal();
}

// 이벤트 리스너
drawBtn.addEventListener("click", drawName);
resetBtn.addEventListener("click", () => {
  if (confirm("정말 초기화하시겠습니까?")) {
    init();
  }
});

editParticipantsBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveParticipants);
addParticipantBtn.addEventListener("click", addParticipant);

newParticipantInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addParticipant();
  }
});

// 모달 배경 클릭 시 닫기
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// 초기 실행
init();
