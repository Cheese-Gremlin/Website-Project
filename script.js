// ================================================================
//  CASTLE NAVIGATION
//  Edit the CASTLE_PAGES array below to add/remove/rename pages.
//  Everything else is automatic — no HTML files need touching.
// ================================================================
const CASTLE_PAGES = [
  { label: "Entrance",  file: "index.html",            emoji: "🏰" },
  { label: "Atrium",    file: "home.html",                emoji: "🏯" },
  { label: "About",     file: "about.html",               emoji: "👑" },
  { label: "Gallery",   file: "galleryentrance.html",     emoji: "⭐" },
  { label: "Info",      file: "infoandsettingsroom.html", emoji: "⚙️" },
];
// ================================================================

(function buildBannerNav() {

  const currentFile = location.pathname.split("/").pop() || "landing.html";

  const bannersHTML = CASTLE_PAGES.map(({ label, file, emoji }) => {
    const active = currentFile === file;
    return `
      <a href="${file}"
         class="castle-banner${active ? " castle-banner--active" : ""}"
         aria-current="${active ? "page" : "false"}"
         title="${label}">
        <img class="castle-banner__img" src="data:image/png;base64,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" alt="" aria-hidden="true" draggable="false">
        <div class="castle-banner__label">
          <span class="castle-banner__emoji" aria-hidden="true">${emoji}</span>
          <span class="castle-banner__text">${label}</span>
        </div>
      </a>`;
  }).join("");

  const navHTML = `
    <nav class="castle-nav" aria-label="Castle Navigation">
      <div class="castle-nav__rod" aria-hidden="true"></div>
      <div class="castle-nav__banners">${bannersHTML}</div>
    </nav>`;

  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // Keep copyright year updated (existing functionality)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();