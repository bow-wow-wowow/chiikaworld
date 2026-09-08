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
