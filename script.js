/* ========================================
   ISLAND MOVIE GUIDE
   JavaScript
======================================== */


/* ========================================
   DOM
======================================== */

const header = document.querySelector(".header");
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#nav");
const navLinks = document.querySelectorAll(".nav a");


/* ========================================
   HEADER SCROLL
======================================== */

function updateHeader() {

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* ========================================
   MOBILE MENU
======================================== */

menuButton.addEventListener("click", () => {

  const isOpen = nav.classList.toggle("open");

  menuButton.classList.toggle("active");

  menuButton.setAttribute(
    "aria-expanded",
    isOpen
  );

});


/* ========================================
   CLOSE MENU
======================================== */

navLinks.forEach((link) => {

  link.addEventListener("click", () => {

    nav.classList.remove("open");

    menuButton.classList.remove("active");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

  });

});


/* ========================================
   SCROLL ANIMATION
======================================== */

const animationTargets = [
  ".section-heading",
  ".story-card",
  ".character-card",
  ".world-feature",
  ".notice",
  ".tip-card",
  ".final-message"
];


animationTargets.forEach((selector) => {

  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {

    element.classList.add("fade-in");

  });

});


const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);


document
  .querySelectorAll(".fade-in")
  .forEach((element) => {

    observer.observe(element);

  });


/* ========================================
   SMOOTH SCROLL
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    const targetId = link.getAttribute("href");

    if (targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const headerHeight = header.offsetHeight;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

  });

});


/* ========================================
   PARALLAX EFFECT
======================================== */

const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll", () => {

  if (!hero || !heroContent) {
    return;
  }

  const scrollY = window.scrollY;

  if (scrollY < window.innerHeight) {

    heroContent.style.transform =
      `translateY(${scrollY * 0.18}px)`;

    heroContent.style.opacity =
      Math.max(0, 1 - scrollY / 500);

  }

});


/* ========================================
   RESIZE
======================================== */

window.addEventListener("resize", () => {

  /*
   * PCサイズに戻したとき、
   * スマホメニューをリセットする。
   */

  if (window.innerWidth > 800) {

    nav.classList.remove("open");

    menuButton.classList.remove("active");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

  }

});


/* ========================================
   CHARACTER CAROUSEL
======================================== */

const characterTrack =
  document.querySelector("#characterTrack");

const characterPrev =
  document.querySelector("#characterPrev");

const characterNext =
  document.querySelector("#characterNext");

const characterIndicator =
  document.querySelector("#characterIndicator");

const characterCards =
  document.querySelectorAll(".character-card");


let characterIndex = 0;

const characterTotal =
  characterCards.length;


/* ========================================
   CAROUSEL UPDATE
======================================== */

function updateCharacterCarousel() {

  if (!characterTrack) {
    return;
  }

  /*
   * カードを左方向へ移動
   */

  characterTrack.style.transform =
    `translateX(-${characterIndex * 100}%)`;


  /*
   * 現在位置を表示
   */

  const current =
    characterIndicator.querySelector(
      ".indicator-current"
    );

  current.textContent =
    String(characterIndex + 1).padStart(2, "0");


  /*
   * 最初・最後ではボタンを薄くする
   */

  characterPrev.disabled =
    characterIndex === 0;

  characterNext.disabled =
    characterIndex === characterTotal - 1;

}


/* ========================================
   NEXT
======================================== */

characterNext?.addEventListener("click", () => {

  if (characterIndex < characterTotal - 1) {

    characterIndex++;

    updateCharacterCarousel();

  }

});


/* ========================================
   PREVIOUS
======================================== */

characterPrev?.addEventListener("click", () => {

  if (characterIndex > 0) {

    characterIndex--;

    updateCharacterCarousel();

  }

});


/* ========================================
   TOUCH SWIPE
======================================== */

let touchStartX = 0;
let touchEndX = 0;


characterTrack?.addEventListener(
  "touchstart",
  (event) => {

    touchStartX =
      event.changedTouches[0].screenX;

  },
  {
    passive: true
  }
);


characterTrack?.addEventListener(
  "touchend",
  (event) => {

    touchEndX =
      event.changedTouches[0].screenX;

    handleCharacterSwipe();

  },
  {
    passive: true
  }
);


function handleCharacterSwipe() {

  const swipeDistance =
    touchEndX - touchStartX;


  /*
   * 左スワイプ
   */

  if (swipeDistance < -50) {

    if (characterIndex < characterTotal - 1) {

      characterIndex++;

      updateCharacterCarousel();

    }

  }


  /*
   * 右スワイプ
   */

  if (swipeDistance > 50) {

    if (characterIndex > 0) {

      characterIndex--;

      updateCharacterCarousel();

    }

  }

}


/* ========================================
   INITIALIZE
======================================== */

updateCharacterCarousel();


/* ========================================
   VIDEO FACADE
======================================== */

const videoDialog = document.querySelector(".video-dialog");
const videoDialogFrame = videoDialog.querySelector(".video-dialog-frame");
const videoDialogTitle = videoDialog.querySelector(".video-dialog-title");
const videoDialogClose = videoDialog.querySelector(".video-dialog-close");


/*
 * YouTube の API は動画を開いた時にだけ読み込む。
 * 字幕はパラメータでは消えないため、API から明示的に外す。
 */

let youTubeApi = null;

const loadYouTubeApi = () => {

  if (youTubeApi) {
    return youTubeApi;
  }

  youTubeApi = new Promise((resolve) => {

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };

    const tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";

    document.head.appendChild(tag);

  });

  return youTubeApi;

};


let videoPlayer = null;


/*
 * 字幕はパラメータでは消えないため、モジュールを外して現在のトラックも空にする
 */

const disableCaptions = (player) => {

  try {

    player.unloadModule("captions");
    player.unloadModule("cc");

    player.setOption("captions", "track", {});
    player.setOption("cc", "track", {});

  } catch (error) {

    /* モジュールが無い状態では何もしない */

  }

};


/*
 * 閉じたらプレイヤーごと捨てる（再生も止まる）
 */

const clearVideoDialog = () => {

  if (videoPlayer) {
    videoPlayer.destroy();
    videoPlayer = null;
  }

  videoDialogFrame.textContent = "";
  videoDialogTitle.textContent = "";

};


document
  .querySelectorAll(".video-facade")
  .forEach((facade) => {

    facade.addEventListener("click", async () => {

      const videoId = facade.dataset.videoId;

      if (!videoId) {
        return;
      }

      const label = facade.getAttribute("aria-label") || "";

      videoDialogTitle.textContent = label.replace(/を再生する$/, "");

      videoDialog.showModal();

      const api = await loadYouTubeApi();

      if (!videoDialog.open) {
        return;
      }

      const mount = document.createElement("div");

      videoDialogFrame.textContent = "";
      videoDialogFrame.appendChild(mount);

      videoPlayer = new api.Player(mount, {
        videoId: videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          playsinline: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {

            event.target.mute();

            disableCaptions(event.target);

            event.target.playVideo();

          },
          onStateChange: (event) => {

            /*
             * 再生が始まると字幕モジュールが戻るため、都度外す
             */

            if (event.data === api.PlayerState.PLAYING) {
              disableCaptions(event.target);
            }

          }
        }
      });

    });

  });


videoDialogClose.addEventListener("click", () => {

  videoDialog.close();

});


/*
 * 枠の外はどこをタップしても閉じる
 */

videoDialog.addEventListener("click", (event) => {

  const insideFrame = event.target.closest(".video-dialog-frame");
  const isCloseButton = event.target.closest(".video-dialog-close");

  if (!insideFrame && !isCloseButton) {
    videoDialog.close();
  }

});


/*
 * Esc とボタンの両方をここで受ける
 */

videoDialog.addEventListener("close", clearVideoDialog);
