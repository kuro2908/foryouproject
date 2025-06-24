let story;
let storyDiv;

async function loadStory() {
  const response = await fetch("story.json");
  const storyContent = await response.json();
  story = new inkjs.Story(storyContent);
  storyDiv = document.getElementById("story");
  showFullStory(); 
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
      showFullStory(); // Sau khi chọn xong, hiển thị toàn bộ tiếp theo luôn
    });

    choiceDiv.appendChild(button);
    storyDiv.appendChild(choiceDiv);
  });
}

// ---------------------------
// Hiển thị toàn bộ phần tiếp theo (không chờ thao tác)
function showFullStory() {
  while (story.canContinue) {
    const paragraph = document.createElement("p");
    paragraph.textContent = story.Continue();
    storyDiv.appendChild(paragraph);
  }

  if (story.currentChoices.length > 0) {
    showChoices();
  }
}

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
