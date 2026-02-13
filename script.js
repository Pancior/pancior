// ========================================
// TRACKING - webhook.site
// ========================================
const WEBHOOK_URL = "https://webhook.site/7e5c544c-2b11-4149-bae6-695120cc0ef0";

function trackEvent(eventName, data = {}) {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    ...data,
  };

  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "no-cors", // Важно для webhook.site
  }).catch((err) => console.error("Tracking failed:", err));

  console.log("📊 Tracked:", eventName, data);
}

// Track page load
trackEvent("page_loaded");

// ========================================
// FALLING HEARTS AND POOP EFFECT
// ========================================
let poopPercentage = 0; // Starts at 0%, increases 10% per "No" click
let noClickCount = 0; // Track how many times "No" was clicked

function createFallingItem() {
  const item = document.createElement("div");
  item.className = "heart";

  // Determine if it's poop or heart based on percentage
  const isPoop = Math.random() * 100 < poopPercentage;
  item.innerHTML = isPoop ? "💩" : "❤️";

  item.style.left = Math.random() * 100 + "vw";
  item.style.animationDuration = 2 + Math.random() * 3 + "s";
  item.style.fontSize = 20 + Math.random() * 30 + "px";

  document.getElementById("heartsBg").appendChild(item);

  setTimeout(() => {
    item.remove();
  }, 5000);
}

// Create falling items every 300ms
setInterval(createFallingItem, 300);

// ========================================
// CAT VIDEO WITH ALPHA CHANNEL (WEBM)
// ========================================
const video = document.getElementById("catVideo");
const canvas = document.getElementById("catCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size - 2x bigger and wider
// Detect mobile and use smaller canvas for better performance
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
canvas.width = isMobile ? 800 : 1600;
canvas.height = isMobile ? 600 : 1200;
console.log(
  `📱 Device: ${isMobile ? "Mobile" : "Desktop"}, Canvas: ${canvas.width}x${canvas.height}`,
);

// Ensure video is loaded (especially important for mobile)
video.load();

// Check video format support
const canPlayWebm = video.canPlayType('video/webm; codecs="vp8, vorbis"');
const canPlayWebmVP9 = video.canPlayType('video/webm; codecs="vp9"');
console.log(`📹 WebM support: VP8=${canPlayWebm}, VP9=${canPlayWebmVP9}`);

// Mobile-specific settings
video.setAttribute("playsinline", "true");
video.setAttribute("webkit-playsinline", "true");
video.playsInline = true;

// DOUBLE SAFETY FOR LOOP
video.loop = true; // Force loop property
video.addEventListener("ended", function () {
  console.log("Video ended - restarting manually");
  this.currentTime = 0;
  this.play();
});

video.addEventListener("error", function (e) {
  console.error("Video error:", e);
});

video.addEventListener("playing", function () {
  console.log(
    "✓ Video is playing, loop:",
    this.loop,
    "duration:",
    this.duration,
    "readyState:",
    this.readyState,
  );
});

video.addEventListener("loadeddata", function () {
  console.log("✓ Video data loaded, duration:", this.duration);
});

video.addEventListener("canplaythrough", function () {
  console.log("✓ Video can play through without buffering");
});

function processFrame() {
  // Only draw if video is ready and has data
  if (video.readyState >= 2) {
    // HAVE_CURRENT_DATA or better
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  // Continue loop
  requestAnimationFrame(processFrame);
}

// Start animation loop immediately
processFrame();

// ========================================
// BACKGROUND MUSIC
// ========================================
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.175; // 17.5% volume for background music
bgMusic.load(); // Preload music
console.log("✓ Background music element found:", bgMusic);
console.log("Music src:", bgMusic.src, "readyState:", bgMusic.readyState);

// Preload music
bgMusic.addEventListener("loadeddata", () => {
  console.log("✓ Background music loaded, duration:", bgMusic.duration);
});

bgMusic.addEventListener("error", (e) => {
  console.error("❌ Background music load error:", e, "src:", bgMusic.src);
});

bgMusic.addEventListener("playing", () => {
  console.log(
    "🎵 Music is PLAYING! Volume:",
    bgMusic.volume,
    "Muted:",
    bgMusic.muted,
  );
});

bgMusic.addEventListener("pause", () => {
  console.warn("⏸️ Music PAUSED");
});

function switchBackgroundMusic(track) {
  console.log(`🔄 Switching background music to: ${track}`);

  const wasPlaying = !bgMusic.paused;
  bgMusic.src = track;
  bgMusic.load();
  bgMusic.muted = true; // Start muted for mobile compatibility
  bgMusic.volume = 0.175;

  if (wasPlaying) {
    bgMusic
      .play()
      .then(() => {
        console.log(`🎵 Background music switched to: ${track}`);
        // Unmute after 200ms
        setTimeout(() => {
          bgMusic.muted = false;
          console.log("🔊 Switched music unmuted");
        }, 200);
      })
      .catch((err) => {
        console.error("❌ Background music switch failed:", err);
      });
  }
}

// ========================================
// START OVERLAY - ENABLE AUDIO ON CLICK
// ========================================
const startOverlay = document.getElementById("startOverlay");
video.volume = 0.5; // 50% volume for main video
video.muted = true; // Start muted

let logoUnmuted = false;

function startExperience() {
  // Track start button click
  trackEvent("started", { action: "clicked_overlay" });

  // Hide overlay
  startOverlay.classList.add("hide");
  setTimeout(() => startOverlay.remove(), 500);

  console.log("🎬 Starting experience...");
  console.log(
    "Video readyState:",
    video.readyState,
    "networkState:",
    video.networkState,
  );

  // MOBILE CHROME FIX: Play muted first, then try to unmute
  video.muted = true; // Start muted for compatibility
  video.volume = 0.5; // 50% volume

  // If video is not ready, wait for it
  if (video.readyState < 3) {
    // Less than HAVE_FUTURE_DATA
    console.log("⏳ Video not ready, waiting for canplay event...");
    let hasPlayed = false;
    video.addEventListener(
      "canplay",
      () => {
        if (!hasPlayed) {
          hasPlayed = true;
          console.log("✓ Video ready, starting playback");
          attemptPlay();
        }
      },
      { once: true },
    );
    // Fallback: if canplay doesn't fire in 2 seconds, try anyway
    setTimeout(() => {
      if (!hasPlayed) {
        hasPlayed = true;
        console.log("⏰ Canplay timeout - attempting play anyway");
        attemptPlay();
      }
    }, 2000);
  } else {
    attemptPlay();
  }

  function attemptPlay() {
    // START BACKGROUND MUSIC - muted first for mobile compatibility
    console.log("🎵 Attempting to play background music...");
    console.log(
      "Music readyState:",
      bgMusic.readyState,
      "volume:",
      bgMusic.volume,
      "muted:",
      bgMusic.muted,
    );

    // Keep muted for initial play (mobile compatibility)
    bgMusic.volume = 0.175;
    // bgMusic already has muted=true from HTML

    bgMusic
      .play()
      .then(() => {
        console.log("🎵 Background music started (muted initially for mobile)");

        // Unmute after music starts playing
        setTimeout(() => {
          bgMusic.muted = false;
          console.log(
            "🔊 Music unmuted! Volume:",
            bgMusic.volume,
            "Playing:",
            !bgMusic.paused,
          );
        }, 300);
      })
      .catch((err) => {
        console.error("❌ Background music play failed:", err);
        // Try one more time with explicit play
        setTimeout(() => {
          bgMusic
            .play()
            .then(() => console.log("🎵 Music started on retry"))
            .catch((e) => console.error("Music retry also failed:", e));
        }, 500);
      });

    video
      .play()
      .then(() => {
        console.log(
          "✓ Video playing (muted initially for mobile compatibility)",
        );
        console.log(
          "Current time:",
          video.currentTime,
          "duration:",
          video.duration,
        );

        // Try to unmute after video starts playing
        setTimeout(() => {
          video.muted = false;
          logoUnmuted = true;
          console.log("🔊 Attempting to unmute... Muted:", video.muted);

          // Force play again after unmuting (mobile Chrome requirement)
          video
            .play()
            .then(() => {
              console.log("✓ Video playing WITH AUDIO!");
            })
            .catch((err) => {
              console.warn("⚠️ Unmuted playback blocked, keeping muted:", err);
              video.muted = true; // Fallback to muted
            });
        }, 300); // Longer delay for slower devices
      })
      .catch((err) => {
        console.error("❌ Video play failed even muted:", err);
        console.log(
          "Video state - src:",
          video.src,
          "readyState:",
          video.readyState,
        );
        // Try one more time with explicit play
        setTimeout(() => {
          console.log("🔄 Retrying play...");
          video.play().catch((e) => console.error("❌ Retry failed:", e));
        }, 500);
      });
  }
}

// Start on overlay click
startOverlay.addEventListener("click", startExperience);
startOverlay.addEventListener("touchstart", startExperience);

// Mobile: Resume video and music when page becomes visible again
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && logoUnmuted) {
    console.log("📱 Page visible again, ensuring video and music play");
    video.play().catch((err) => console.warn("Resume video failed:", err));
    bgMusic.play().catch((err) => console.warn("Resume music failed:", err));
  }
});

// ========================================
// MODAL LOGIC WITH RANDOM VIDEOS
// ========================================
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const modalClose = document.getElementById("modalClose");
const modalText = document.getElementById("modalText");
const questionText = document.querySelector(".question-text");

// List of videos in Filmiki folder with display names
const videoFiles = [
  {
    path: "All Best Cat Memes_Sub_04.webm",
    name: "Co? Nie?",
  },
  {
    path: "All Best Cat Memes_Sub_05.webm",
    name: "Ada... serio?",
  },
  {
    path: "All Best Cat Memes_Sub_07.webm",
    name: "Kotek jest smutny... 😿",
  },
  {
    path: "All Best Cat Memes_Sub_09.webm",
    name: "Co nie?! Trzimcie mnie! ",
  },
  {
    path: "All Best Cat Memes_Sub_10.webm",
    name: "Nie bądź taka, przytul Kamila kociaka...",
  },
  {
    path: "All Best Cat Memes_Sub_11.webm",
    name: "Kamil zły 😠",
  },
  {
    path: "All Best Cat Memes_Sub_12.webm",
    name: "Nadal nie? 🥺",
  },
  {
    path: "All Best Cat Memes_Sub_13.webm",
    name: "Naprawdę? Znowu nie?",
  },
  {
    path: "All Best Cat Memes_Sub_17.webm",
    name: "Jak to nie?! 😮 ",
  },
  {
    path: "All Best Cat Memes_Sub_18.webm",
    name: "Boże czy Ty to widzisz? 👉👈",
  },
  {
    path: "All Best Cat Memes_Sub_19.webm",
    name: "Nieeeeeeeeeeeeeeeeeee ",
  },
  {
    path: "All Best Cat Memes_Sub_20.webm",
    name: "Nie? No to jesteśmy zgubieni... oboje...",
  },
  {
    path: "All Best Cat Memes_Sub_24.webm",
    name: "Wali Ci? No co jest?!",
  },
  {
    path: "All Best Cat Memes_Sub_25.webm",
    name: "Nie pozbydzies sie mie... Jo byda zawsze 💕",
  },
];

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Randomize video order on page load
const randomizedVideos = shuffleArray(videoFiles);
let currentVideoIndex = 0;
let isYesMode = false;

const originalQuestion = "Aduś! Zostaniesz moją walentynką?";
const yesQuestion = "Wiedziałem, że będziesz moją walentynką :3";

console.log("🎲 Randomized video order:", randomizedVideos);

function showModal(videoSrc, text = "") {
  modalVideo.src = videoSrc;
  modalText.textContent = text;
  modal.classList.add("show");
  modalVideo.play();
}

function hideModal() {
  modal.classList.remove("show");
  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalText.textContent = "";
}

function switchMainVideoTo(videoSrc) {
  const wasMuted = video.muted;
  video.src = videoSrc;
  // Preserve muted state (keep audio if it was playing)
  if (logoUnmuted) {
    video.muted = false;
  }
  video.play();
}

modalClose.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// ========================================
// ADHD FEATURES
// ========================================
// 4. Przyciski skalują się z każdym "Nie"
function scaleButtons() {
  const noScale = Math.max(0.5, 1 - noClickCount * 0.08); // Kurczy się
  const yesScale = Math.min(2, 1 + noClickCount * 0.15); // Rośnie

  btnNo.style.transform = `scale(${noScale})`;
  btnYes.style.transform = `scale(${yesScale})`;
}

// 5. Shake efekt strony
function shakeScreen() {
  document.body.classList.add("shake");
  setTimeout(() => {
    document.body.classList.remove("shake");
  }, 500);
}

// 6. Floating emoji z tekstami
const floatingMessages = [
  { emoji: "💕", text: "Kliknij TAK!" },
  { emoji: "🥺", text: "Przecież wiesz że chcesz!" },
  { emoji: "💖", text: "No dalej..." },
  { emoji: "😘", text: "Zostań moją walentynką!" },
  { emoji: "❤️", text: "Proszę!" },
  { emoji: "🙏", text: "Daj szansę!" },
  { emoji: "🐟", text: "Zjemy razem ŚLEDZIE!!" },
  { emoji: "🐟", text: "Zjemy razem ŚLEDZIE!!" },
  { emoji: "🐟", text: "Zjemy razem ŚLEDZIE!!" },
];

function createFloatingEmoji() {
  const msg =
    floatingMessages[Math.floor(Math.random() * floatingMessages.length)];
  const emoji = document.createElement("div");
  emoji.className = "floating-emoji";
  emoji.textContent = msg.emoji + " " + msg.text;
  emoji.style.left = Math.random() * (window.innerWidth - 200) + "px";
  emoji.style.top = Math.random() * (window.innerHeight - 100) + 100 + "px";

  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 4000);
}

// 7. Achievement notifications
const achievements = [
  {
    clicks: 1,
    title: "🏆 Początek końca",
    desc: "Kliknęłaś NIE po raz pierwszy",
  },
  { clicks: 3, title: "🏆 Hardcorowa Walentynka", desc: "3 razy NIE? Serio?" },
  { clicks: 5, title: "🏆 Bezlitosna", desc: "5 razy odrzuciłaś kociaka 😿" },
  { clicks: 7, title: "🏆 LEGEND STATUS", desc: "7x NIE! To już chore 😱" },
  { clicks: 10, title: "🏆💀 BOSS FINAL", desc: "10 razy! Ada pls..." },
];

function showAchievement(clicks) {
  const achievement = achievements.find((a) => a.clicks === clicks);
  if (!achievement) return;

  const achDiv = document.createElement("div");
  achDiv.className = "achievement";
  achDiv.innerHTML = `<div style="font-size: 1.5rem; margin-bottom: 5px;">${achievement.title}</div>
                      <div style="font-size: 0.9rem; opacity: 0.9;">${achievement.desc}</div>`;

  document.body.appendChild(achDiv);

  setTimeout(() => achDiv.remove(), 4000);
}

// Click counter
const clickCounter = document.getElementById("clickCounter");
const clickCount = document.getElementById("clickCount");

function updateClickCounter() {
  clickCount.textContent = noClickCount;
  if (noClickCount > 0) {
    clickCounter.style.display = "block";
  }
}

// ========================================
// BUTTON LOGIC
// ========================================
const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");

// NO button - show modal with next video in sequence
btnNo.addEventListener("click", () => {
  noClickCount++;

  // Track NO click
  trackEvent("button_clicked", {
    button: "NO",
    clickCount: noClickCount,
    poopPercentage: Math.min(poopPercentage + 30, 100),
  });

  // ⭐ ADHD FEATURES ⭐
  scaleButtons(); // 4. Przyciski skalują się
  shakeScreen(); // 5. Shake strony
  createFloatingEmoji(); // 6. Floating emoji
  updateClickCounter(); // 7. Licznik
  showAchievement(noClickCount); // 7. Achievements

  // Increase poop percentage by 30% each click (max 100%)
  poopPercentage = Math.min(poopPercentage + 30, 100);
  console.log(`💩 Poop percentage: ${poopPercentage}%`);

  // Restore original state if in YES mode
  if (isYesMode) {
    questionText.textContent = originalQuestion;
    switchMainVideoTo("Logo.webm");
    switchBackgroundMusic("Normal.mp3"); // Switch back to Normal music
    isYesMode = false;
  }

  // Get current video from randomized list
  const currentVideoObj =
    randomizedVideos[currentVideoIndex % randomizedVideos.length];
  console.log(
    `▶️ Playing video ${currentVideoIndex + 1}/${randomizedVideos.length}: ${currentVideoObj.name}`,
  );

  showModal(currentVideoObj.path, currentVideoObj.name);
  currentVideoIndex++; // Move to next video for next time
});

// YES button - show TAK.webm modal, change logo and text
btnYes.addEventListener("click", () => {
  // Track YES click
  trackEvent("button_clicked", {
    button: "YES",
    finalAnswer: true,
    afterNoClicks: noClickCount,
  });

  // ZAJEBISTY EFEKT! 🎉
  createHeartExplosion();

  // Reset ADHD features
  btnNo.style.transform = "scale(1)";
  btnYes.style.transform = "scale(1)";
  clickCounter.style.display = "none";
  autoFloatingEnabled = false; // Stop auto floating emoji

  // Change to YES mode
  isYesMode = true;
  questionText.textContent = yesQuestion;
  switchMainVideoTo("TANIEC.webm");
  switchBackgroundMusic("Extra.mp3"); // Switch to Extra music

  // Reset poop percentage when saying YES
  poopPercentage = 0;
  console.log("💕 Poop percentage reset to 0%");

  // Show modal with TAK.webm and message
  showModal("TAK.webm", "Yey! Kocham Cię!");
});

// ZAJEBISTY EFEKT - Heart explosion!
function createHeartExplosion() {
  // ADD TO BODY DIRECTLY, NOT TO heartsBg (which has low z-index)
  const colors = ["❤️", "💕", "💖", "💗", "💘", "💙", "💚", "💛"];

  // Create 100 hearts exploding from center
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "explosion-heart";
      heart.innerHTML = colors[Math.floor(Math.random() * colors.length)];
      heart.style.left = "50%";
      heart.style.top = "50%";
      heart.style.fontSize = 30 + Math.random() * 50 + "px";

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 400;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      heart.style.setProperty("--tx", tx + "px");
      heart.style.setProperty("--ty", ty + "px");

      document.body.appendChild(heart); // ADD TO BODY, NOT heartsContainer!

      setTimeout(() => heart.remove(), 2000);
    }, i * 10);
  }

  console.log("🎆 HEART EXPLOSION!");
}

// Move NO button to random position
function moveButton() {
  const container = document.querySelector(".main-content");
  const btn = btnNo;

  // Set absolute positioning on first move
  if (btn.style.position !== "absolute") {
    const rect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    btn.style.position = "absolute";
    btn.style.left = rect.left - containerRect.left + "px";
    btn.style.top = rect.top - containerRect.top + "px";

    // Trigger reflow then move
    setTimeout(() => {
      moveToRandomPosition();
    }, 50);
  } else {
    moveToRandomPosition();
  }

  function moveToRandomPosition() {
    const maxX = container.offsetWidth - btn.offsetWidth - 40;
    const maxY = container.offsetHeight - btn.offsetHeight - 40;

    const newX = 20 + Math.random() * Math.max(0, maxX);
    const newY = 20 + Math.random() * Math.max(0, maxY);

    btn.style.left = newX + "px";
    btn.style.top = newY + "px";
  }
}

// Move NO button automatically every 2 seconds
setInterval(() => {
  if (!isYesMode && !modal.classList.contains("show")) {
    moveButton();
  }
}, 2000);

// Auto-generate floating emoji every 5 seconds (after start)
let autoFloatingEnabled = false;
setTimeout(() => {
  autoFloatingEnabled = true;
  setInterval(() => {
    if (!isYesMode && autoFloatingEnabled) {
      createFloatingEmoji();
    }
  }, 5000);
}, 3000); // Start after 3 seconds
