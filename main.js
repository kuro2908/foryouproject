let story;
let storyDiv;
let typingTimers = [];
let isTyping = false;
let currentParagraph = null;
let currentText = "";
let pendingParagraph = false;

async function loadStory() {
  const response = await fetch("story.json");
  const storyContent = await response.json();
  story = new inkjs.Story(storyContent);
  storyDiv = document.getElementById("story");
  showNextParagraph(); // Bắt đầu với đoạn đầu tiên
}

// ---------------------------
// Xử lý gõ từ từ
function clearTypingTimers() {
  typingTimers.forEach(id => clearTimeout(id));
  typingTimers = [];
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

function typeText(text, container, callback, speed = 20) {
  isTyping = true;
  currentParagraph = container;
  currentText = text;
  let i = 0;

  function typeNextChar() {
    if (i < text.length) {
      container.textContent += text.charAt(i);
      i++;
      const timer = setTimeout(typeNextChar, speed);
      typingTimers.push(timer);
    } else {
      isTyping = false;
      callback?.();
    }
  }

  typeNextChar();
}

// ---------------------------
// Giao diện lựa chọn
function clearStoryChoices() {
  document.querySelectorAll(".choice").forEach(el => el.remove());
}

function showChoices() {
  clearStoryChoices();

  story.currentChoices.forEach((choice, index) => {
    const choiceDiv = document.createElement("div");
    choiceDiv.classList.add("choice");

    const button = document.createElement("button");
    button.textContent = choice.text;

    button.addEventListener("click", () => {
      story.ChooseChoiceIndex(index);
      clearStoryChoices();
      showNextParagraph();
    });

    choiceDiv.appendChild(button);
    storyDiv.appendChild(choiceDiv);
  });
}

// ---------------------------
// Hiển thị đoạn tiếp theo
function showNextParagraph() {
  clearTypingTimers();

  if (story.canContinue) {
    const paragraph = document.createElement("p");
    storyDiv.appendChild(paragraph);
    const text = story.Continue();

    typeText(text, paragraph, () => {
      pendingParagraph = story.canContinue;
      if (!pendingParagraph) {
        showChoices();
        scrollToBottom();
      }
    });
  }
}

// ---------------------------
// Khi đang gõ mà người dùng click → hiện ngay toàn bộ
function finishTypingImmediately() {
  if (isTyping && currentParagraph && currentText) {s
    clearTypingTimers();
    currentParagraph.textContent = currentText;
    isTyping = false;

    if (!story.canContinue) {
      showChoices();
    } else {
      pendingParagraph = true;
    }
  }
}

// ---------------------------
// Xử lý click/tương tác người dùng
function handleClick() {
  if (!story || story.currentChoices.length > 0) return;

  if (isTyping) {
    finishTypingImmediately();
  } else if (pendingParagraph) {
    pendingParagraph = false;
    showNextParagraph();
  }
}

// ---------------------------
// Sự kiện click và phím
document.addEventListener("click", handleClick);
document.addEventListener("keydown", (event) => {
  if (event.code === "Enter" || event.code === "Space") {
    event.preventDefault();
    handleClick();
  }
});

// ---------------------------
loadStory();
const music = document.getElementById("background-music");
const musicToggleCheckbox = document.getElementById("music-toggle");

let musicStarted = false;

function tryPlayMusic() {
  if (!musicStarted && musicToggleCheckbox.checked) {
    music.play().then(() => {
      musicStarted = true;
    }).catch((err) => {
      console.warn("Autoplay bị chặn. Nhạc sẽ phát sau khi tương tác.");
    });
  }
}

musicToggleCheckbox.addEventListener("change", () => {
  if (musicToggleCheckbox.checked) {
    tryPlayMusic();
    music.play();
  } else {
    music.pause();
  }
});

// phát nhạc sau lần click đầu tiên
document.addEventListener("click", () => {
  tryPlayMusic();
}, { once: true }); // chỉ gọi một lần đầu

const backToTopButton = document.getElementById("back-to-top");

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
