// ================================================================
//  GALLERY ENGINE — gallery-engine.js  (v2 — perspective zoom walk)
//
//  HOW THE WALK WORKS:
//  ─────────────────────────────────────────────────────────────
//  Instead of scrolling a long corridor, we use a single corridor
//  IMAGE that zooms in (scales up from the vanishing point) as
//  the user scrolls. This creates a true "walking forward" feel.
//
//  Each frame and door has a "depth" (0 = near the entrance,
//  1 = deep in the corridor). As the walk progresses, frames
//  that are "ahead" appear to approach and grow, while frames
//  "behind" shrink and disappear to the sides — just like real
//  perspective would behave.
//
//  YOU DON'T NEED TO EDIT THIS FILE.
//  Everything you want to customise is in gallery-data.js.
// ================================================================

(function () {

  // ── Which dataset to use ──────────────────────────────────────
  const isRoom = typeof ROOM_ID !== 'undefined';
  const data   = isRoom ? ROOMS[ROOM_ID] : MAIN_CORRIDOR;

  if (!data) {
    console.error(`Gallery Error: No data found for ROOM_ID="${ROOM_ID}". Check gallery-data.js.`);
    return;
  }

  const frames = data.frames || [];
  const doors  = data.doors  || [];


  // ── Fill in title / subtitle ──────────────────────────────────
  const titleEl    = document.getElementById('galleryTitle');
  const subtitleEl = document.getElementById('gallerySubtitle');
  if (titleEl)    titleEl.textContent    = data.title    || '';
  if (subtitleEl) subtitleEl.textContent = data.subtitle || '';


  // ── Build the frames and doors arrays with depth values ───────
  //
  //  We interleave frames and doors in order, then assign each
  //  a "depth" value between 0 (entrance) and 1 (far end).
  //  Depth determines where in the corridor it appears.

  // First, flatten frames and doors into one ordered list
  const items = [];

  frames.forEach((frame, index) => {
    items.push({ type: 'frame', data: frame, frameIndex: index });

    // Insert doors that come after this frame
    doors
      .filter(d => d.afterFrame === index)
      .forEach(door => items.push({ type: 'door', data: door }));
  });

  // Doors set afterFrame beyond last frame — push them at the end
  doors
    .filter(d => d.afterFrame >= frames.length)
    .forEach(door => items.push({ type: 'door', data: door }));

  // Assign depth: spread items evenly between 0.08 and 0.95
  const total = items.length;
  items.forEach((item, i) => {
    item.depth = total <= 1 ? 0.5 : 0.08 + (i / (total - 1)) * 0.87;
  });


  // ── DOM: create the frames layer ─────────────────────────────
  const corridorEl  = document.getElementById('corridor');
  const wrapEl      = document.getElementById('corridorWrap');
  if (!corridorEl || !wrapEl) return;

  // Remove the old corridor__content div if present
  const oldContent = document.getElementById('corridorContent');
  if (oldContent) oldContent.remove();

  // Create the frames layer (sits above the corridor image)
  const framesLayer = document.createElement('div');
  framesLayer.className = 'frames-layer';
  wrapEl.appendChild(framesLayer);

  // Create each frame/door element and store a reference
  const elements = items.map(item => {
    if (item.type === 'frame') {
      return { item, el: buildFrameEl(item.data) };
    } else {
      return { item, el: buildDoorEl(item.data) };
    }
  });

  elements.forEach(({ el }) => framesLayer.appendChild(el));


  // ── Entrance panel & end overlay ─────────────────────────────
  const entranceEl  = document.querySelector('.corridor__entrance');
  const endOverlay  = document.querySelector('.corridor__end-overlay');
  const progressBar = document.querySelector('.walk-progress');


  // ════════════════════════════════════════════════════════════════
  //  PERSPECTIVE MATHS
  //
  //  The corridor image is treated as if it has a vanishing point
  //  at (50%, 48%) — the dark archway in the reference image.
  //
  //  When walkT = 0 (at entrance): corridor scale = 1
  //  When walkT = 1 (deepest):     corridor scale = MAX_ZOOM
  //
  //  A frame at depth D becomes "visible" (fills the screen) when
  //  walkT is near D. We use a simple perspective projection:
  //    apparentScale = 1 / (1 - walkT * D_factor)
  //
  //  Each frame's screen position is calculated so that it appears
  //  to sit on the left or right wall, shrinking into the distance
  //  when far away and growing as you approach.
  // ════════════════════════════════════════════════════════════════

  // How much the background image zooms in total
  const MAX_ZOOM = 3.2;

  // Wall inset: how far from the edge of the screen frames sit
  // at depth 0 (nearest). In viewport-width fraction.
  const WALL_INSET_NEAR = 0.03;   // 3% from left/right edge when very close
  const WALL_INSET_FAR  = 0.31;   // 31% from edge when far (near vanishing pt)

  // Vertical position range (fraction of viewport height)
  const VERT_NEAR = 0.38;   // how high up on screen when near
  const VERT_FAR  = 0.44;   // settles toward centre/slightly above when far

  // Base frame pixel sizes at full (near) scale
  const FRAME_SIZES = {
    small:  { w: 160, h: 120 },
    medium: { w: 230, h: 175 },
    large:  { w: 300, h: 225 },
  };

  const DOOR_SIZE = { w: 110, h: 185 };

  // ── Walk state ────────────────────────────────────────────────
  // walkT is the normalised progress: 0 = entrance, 1 = deepest
  let walkT = 0;

  // How much walkT changes per pixel of scroll
  // Lower = slower walking, Higher = faster
  const WALK_SPEED = 0.0008;


  // ── Main render function ──────────────────────────────────────
  //
  //  Called every time walkT changes.
  //  Updates:
  //    1. The corridor background zoom
  //    2. Every frame and door position/size on screen
  //    3. UI elements (entrance panel, progress bar, end overlay)

  function render() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 1. Zoom the corridor image
    const corridorScale = 1 + walkT * (MAX_ZOOM - 1);
    corridorEl.style.transform = `scale(${corridorScale})`;

    // 2. Update each frame / door
    elements.forEach(({ item, el }) => {
      const depth = item.depth; // 0..1

      // "relativeDepth" is how far this item is ahead of us.
      // Positive = still ahead (not yet reached)
      // Near 0 = right in front of us
      // Negative = behind us (we've passed it)
      const relDepth = depth - walkT;

      // Perspective scale: items far away are small, close ones are large
      // We use an exponential curve so things grow quickly as you approach
      // The item is "at the camera" when relDepth ≈ 0 (full size)
      // It's tiny in the distance when relDepth ≈ 1
      // We clamp so items don't get unreasonably huge when walked past

      // perspScale: 1 = full size (right in front), shrinks to 0 as depth increases
      const perspScale = Math.max(0.05, Math.min(2.5, 1 / (1 + relDepth * 4.5)));

      // Horizontal: left wall items slide from left edge to vanishing point as depth increases
      //             right wall items do the same from the right
      const horizFrac = WALL_INSET_FAR + (WALL_INSET_NEAR - WALL_INSET_FAR) * perspScale;

      // Vertical: items converge toward the vanishing point's height as they recede
      const vertFrac = VERT_FAR + (VERT_NEAR - VERT_FAR) * Math.max(0, Math.min(1, perspScale));

      // Frame/door dimensions at this perspective scale
      let baseW, baseH;
      if (item.type === 'frame') {
        const sz = FRAME_SIZES[item.data.size] || FRAME_SIZES.medium;
        baseW = sz.w; baseH = sz.h;
      } else {
        baseW = DOOR_SIZE.w; baseH = DOOR_SIZE.h;
      }

      const dispW = baseW * perspScale;
      const dispH = baseH * perspScale;

      // Position in px
      const centerY = vh * vertFrac;
      const top  = centerY - dispH * 0.5;

      let left;
      const side = item.data.position || item.data.side || 'left';
      if (side === 'left') {
        // left wall: anchor right edge of frame to horizFrac from left
        left = vw * horizFrac - dispW;
      } else {
        // right wall: anchor left edge of frame to (1 - horizFrac) from left
        left = vw * (1 - horizFrac);
      }

      // Opacity: fully visible when ahead or just passed,
      //          fades out once well behind
      const opacity = relDepth < -0.25
        ? Math.max(0, 1 + (relDepth + 0.25) * 4)
        : 1;

      // Apply styles
      el.style.left    = `${left}px`;
      el.style.top     = `${top}px`;
      el.style.width   = `${dispW}px`;
      el.style.height  = `${dispH}px`;
      el.style.opacity = opacity;

      // Nameplate font scales with frame
      const nameplate = el.querySelector('.gallery-frame__nameplate');
      if (nameplate) {
        nameplate.style.fontSize = `${Math.max(0.38, 0.6 * perspScale)}rem`;
        nameplate.style.bottom   = `${-22 * perspScale}px`;
      }

      // Door label scales too
      const doorLabel = el.querySelector('.corridor-door__label');
      if (doorLabel) {
        doorLabel.style.fontSize = `${Math.max(0.38, 0.72 * perspScale)}rem`;
      }

      // Door body resize
      const doorBody = el.querySelector('.corridor-door__door');
      if (doorBody) {
        doorBody.style.width  = `${dispW}px`;
        doorBody.style.height = `${dispH}px`;
      }
    });

    // 3. Entrance panel: hide once user starts walking
    if (entranceEl) {
      if (walkT > 0.04) entranceEl.classList.add('is-hidden');
      else              entranceEl.classList.remove('is-hidden');
    }

    // 4. Progress bar
    if (progressBar) progressBar.style.width = `${walkT * 100}%`;

    // 5. End overlay: show when at the very end
    if (endOverlay) {
      if (walkT >= 0.98) endOverlay.classList.add('is-visible');
      else               endOverlay.classList.remove('is-visible');
    }
  }


  // ── Scroll / touch / keyboard input ──────────────────────────

  function clampT(t) { return Math.max(0, Math.min(1, t)); }

  // Mouse wheel
  wrapEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    walkT = clampT(walkT + e.deltaY * WALK_SPEED);
    render();
  }, { passive: false });

  // Touch drag
  let lastTouchY = null;
  wrapEl.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });

  wrapEl.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (lastTouchY === null) return;
    const delta = lastTouchY - e.touches[0].clientY;
    lastTouchY  = e.touches[0].clientY;
    walkT = clampT(walkT + delta * WALK_SPEED * 1.5);
    render();
  }, { passive: false });

  wrapEl.addEventListener('touchend', () => { lastTouchY = null; });

  // Arrow / Page keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      walkT = clampT(walkT + 0.06);
      render();
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      walkT = clampT(walkT - 0.06);
      render();
    }
  });

  // Re-render on resize
  window.addEventListener('resize', render);

  // Initial render
  render();


  // ── Build a frame element ─────────────────────────────────────
  function buildFrameEl(frame) {
    const el = document.createElement('div');
    el.className = 'gallery-frame';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `View: ${frame.name || 'Untitled'}`);

    if (frame.src) {
      const img = document.createElement('img');
      img.src       = frame.src;
      img.alt       = frame.name || '';
      img.className = 'gallery-frame__img';
      el.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'gallery-frame__placeholder';
      ph.innerHTML = `<span class="gallery-frame__placeholder-icon">🖼️</span><span>Add src in<br>gallery-data.js</span>`;
      el.appendChild(ph);
    }

    const nameplate = document.createElement('div');
    nameplate.className   = 'gallery-frame__nameplate';
    nameplate.textContent = frame.name || 'Untitled';
    el.appendChild(nameplate);

    const open = () => showLightbox(frame);
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    return el;
  }


  // ── Build a door element ──────────────────────────────────────
  function buildDoorEl(door) {
    const link = document.createElement('a');
    link.href      = door.href || '#';
    link.className = 'corridor-door';
    link.setAttribute('aria-label', `Enter: ${door.label || 'Room'}`);

    const label = document.createElement('div');
    label.className   = 'corridor-door__label';
    label.textContent = door.label || '';
    link.appendChild(label);

    const doorBody = document.createElement('div');
    doorBody.className = 'corridor-door__door';

    const arch = document.createElement('div');
    arch.className = 'corridor-door__arch';
    doorBody.appendChild(arch);

    link.appendChild(doorBody);
    return link;
  }


  // ── Lightbox ──────────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxNm  = document.getElementById('lightboxName');
  const lightboxDsc = document.getElementById('lightboxDesc');
  const lightboxBtn = document.getElementById('lightboxClose');

  function showLightbox(frame) {
    if (!lightbox) return;
    if (frame.src) {
      lightboxImg.src   = frame.src;
      lightboxImg.alt   = frame.name || '';
      lightboxImg.style.display = 'block';
      const ph = lightbox.querySelector('.lightbox__placeholder-msg');
      if (ph) ph.style.display = 'none';
    } else {
      lightboxImg.style.display = 'none';
      let ph = lightbox.querySelector('.lightbox__placeholder-msg');
      if (!ph) {
        ph = document.createElement('div');
        ph.className = 'lightbox__placeholder-msg';
        ph.innerHTML = '<span style="font-size:2rem;opacity:0.4">🖼️</span><span>No image added yet</span>';
        lightbox.querySelector('.lightbox__frame-border').appendChild(ph);
      }
      ph.style.display = 'flex';
    }
    lightboxNm.textContent  = frame.name        || 'Untitled';
    lightboxDsc.textContent = frame.description  || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lightboxBtn) lightboxBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (lightboxBtn) lightboxBtn.addEventListener('click', closeLightbox);
  if (lightbox)    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

})();
