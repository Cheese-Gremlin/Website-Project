// ================================================================
//  GALLERY DATA — THIS IS THE ONLY FILE YOU NEED TO EDIT!
//  
//  HOW TO ADD AN IMAGE:
//    1. Put your image file in the same folder as these HTML files
//    2. Add an entry to the MAIN_CORRIDOR or a ROOM's frames array
//    3. Fill in the src, name, and description
//
//  HOW TO REARRANGE FRAMES:
//    Just change the "position" field! Options are:
//      - "left"  → hangs on the left wall
//      - "right" → hangs on the right wall
//    Frames appear in the order they are listed (top to bottom = front to back)
//
//  HOW TO ADD A DOOR:
//    Add an entry to the "doors" array with the room file it links to
//    Doors appear between frames — set "afterFrame" to the frame index
//    (0 = before first frame, 1 = after first frame, etc.)
//
//  HOW TO CHANGE FRAME SIZE:
//    Set "size" to "small", "medium", or "large"
//
//  HOW TO ADD MORE ROOMS:
//    1. Duplicate gallery-room.html and rename it (e.g. "room-sculpture.html")
//    2. Add a new object to the ROOMS array below with that filename
//    3. Add a door in the main corridor or another room pointing to it
// ================================================================


// ── MAIN CORRIDOR ─────────────────────────────────────────────────────────────
// This is what appears in gallery.html (the long hallway you scroll through)

const MAIN_CORRIDOR = {

  // The title shown at the entrance of the corridor
  title: "The Gallery",
  subtitle: "Welcome, wanderer. These halls hold many wonders.",

  // Picture frames on the corridor walls
  // Each frame: { src, name, description, position, size }
  frames: [
    {
      src: "",           // ← path to your image file, e.g. "images/my-art.png"
      name: "First Work",
      description: "This is where your description goes. Tell the viewer about this piece — when you made it, what inspired you, what tools you used.",
      position: "left",  // "left" or "right"
      size: "large",     // "small", "medium", or "large"
    },
    {
      src: "",
      name: "Second Work",
      description: "Another piece in your collection. Replace the src with a path to your image.",
      position: "right",
      size: "medium",
    },
    {
      src: "",
      name: "Third Work",
      description: "A third piece. You can keep adding as many as you like!",
      position: "left",
      size: "medium",
    },
    {
      src: "",
      name: "Fourth Work",
      description: "Placed on the right wall.",
      position: "right",
      size: "large",
    },
    {
      src: "",
      name: "Fifth Work",
      description: "Almost at the end of the corridor.",
      position: "left",
      size: "small",
    },
    {
      src: "",
      name: "Sixth Work",
      description: "The last frame in the main corridor.",
      position: "right",
      size: "medium",
    },
  ],

  // Doors that appear between frames in the corridor
  // afterFrame: the door appears AFTER frame at this index (0-based)
  //   e.g. afterFrame: 1 → appears after the 2nd frame
  // side: which wall the door is on ("left" or "right")
  // label: text shown above the door
  // href: which room file this door leads to
  doors: [
    {
      afterFrame: 1,     // ← appears after the 2nd frame
      side: "right",
      label: "The Studio",
      href: "gallery-room-studio.html",
    },
    {
      afterFrame: 3,     // ← appears after the 4th frame
      side: "left",
      label: "The Archive",
      href: "gallery-room-archive.html",
    },
    {
      afterFrame: 5,     // ← appears after the last frame (end of corridor)
      side: "right",
      label: "The Workshop",
      href: "gallery-room-workshop.html",
    },
  ],
};


// ── ROOMS ─────────────────────────────────────────────────────────────────────
// Each room is its own page. Duplicate gallery-room.html for each room.
// The "id" here must match the ROOM_ID variable at the top of that room's HTML file.

const ROOMS = {

  // ── Room 1: The Studio ───────────────────────────────────────────
  "studio": {
    title: "The Studio",
    subtitle: "Where ideas are born.",
    frames: [
      {
        src: "",
        name: "Studio Piece One",
        description: "A work from the studio. Add your image and description here.",
        position: "left",
        size: "large",
      },
      {
        src: "",
        name: "Studio Piece Two",
        description: "Another studio work.",
        position: "right",
        size: "medium",
      },
      {
        src: "",
        name: "Studio Piece Three",
        description: "A third studio piece.",
        position: "left",
        size: "medium",
      },
    ],
    // Doors back out or to other rooms
    doors: [
      {
        afterFrame: 2,
        side: "right",
        label: "← Back to Corridor",
        href: "gallery.html",
      },
    ],
  },

  // ── Room 2: The Archive ──────────────────────────────────────────
  "archive": {
    title: "The Archive",
    subtitle: "Older works, preserved.",
    frames: [
      {
        src: "",
        name: "Archived Piece One",
        description: "An older work from the archive.",
        position: "right",
        size: "large",
      },
      {
        src: "",
        name: "Archived Piece Two",
        description: "Another archived piece.",
        position: "left",
        size: "medium",
      },
      {
        src: "",
        name: "Archived Piece Three",
        description: "Preserved for posterity.",
        position: "right",
        size: "small",
      },
    ],
    doors: [
      {
        afterFrame: 2,
        side: "left",
        label: "← Back to Corridor",
        href: "gallery.html",
      },
    ],
  },

  // ── Room 3: The Workshop ─────────────────────────────────────────
  "workshop": {
    title: "The Workshop",
    subtitle: "Projects in progress.",
    frames: [
      {
        src: "",
        name: "Workshop Project One",
        description: "A project from the workshop. Could be a coding project, a WIP, anything.",
        position: "left",
        size: "large",
      },
      {
        src: "",
        name: "Workshop Project Two",
        description: "Another project.",
        position: "right",
        size: "large",
      },
    ],
    doors: [
      {
        afterFrame: 1,
        side: "left",
        label: "← Back to Corridor",
        href: "gallery.html",
      },
    ],
  },

};
