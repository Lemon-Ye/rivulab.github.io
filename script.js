const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry?.type === "reload";
const isHomePage = /(^|\/)(index\.html)?$/.test(window.location.pathname);

if (isHomePage && isReload && window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealTargets = [
  ".section-heading",
  ".feature",
  ".project-card",
  ".detail-item",
  ".detail-list",
  ".cta-section",
];

const revealElements = revealTargets.flatMap((selector) =>
  Array.from(document.querySelectorAll(selector)),
);
const revealState = new WeakSet();

revealElements.forEach((element, index) => {
  element.classList.add("reveal");

  if (element.matches(".feature, .project-card, .detail-item")) {
    element.classList.add("reveal-card");
  }

  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.14) {
          entry.target.classList.add("is-visible");
          revealState.add(entry.target);
        } else if (revealState.has(entry.target) && entry.intersectionRatio <= 0.02) {
          entry.target.classList.remove("is-visible");
          revealState.delete(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: [0.02, 0.14],
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
