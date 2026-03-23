// ================================================================
//  GALLERY DATA — gallery-data.js
//  ----------------------------------------------------------------
//  THIS IS THE ONLY FILE YOU NEED TO EDIT.
//
//  HOW TO ADD / EDIT A FRAME:
//  ─────────────────────────────────────────────────────────────────
//  Each frame is one object in the frames array below.
//
//    id          – unique short name (no spaces), used internally
//    src         – path to your image, e.g. "images/mywork.png"
//                  Leave "" to show a placeholder
//    name        – title shown on the metal plaque below the frame
//    description – longer text shown on the paper scroll when clicked
//    wall        – which wall to hang it on:
//                    "north" = back wall (facing you as you walk in)
//                    "south" = entrance wall (behind you at start)
//                    "east"  = right wall
//                    "west"  = left wall
//    position    – where along the wall:
//                    -1.0 = far left end of that wall
//                     0.0 = dead centre
//                    +1.0 = far right end
//                  Tip: keep ~0.35+ spacing between frames on the same wall
//    height      – vertical nudge (0 = eye level, + = higher, - = lower)
//    size        – "small" | "medium" | "large"
//
//  HOW TO REARRANGE: just change wall / position / height values.
//  HOW TO ADD MORE:  copy any block, paste at end of array, give new id.
//  HOW TO REMOVE:    delete its { ... } block.
// ================================================================

const GALLERY_CONFIG = {

  // Room intro text (shown in the HUD at the start)
  roomTitle:    "The Gallery",
  roomSubtitle: "WASD to walk  •  Mouse to look  •  Click a frame to inspect",

  frames: [

    // ══ NORTH WALL (back wall) ════════════════════════════════
    {
      id: "n1", src: "", name: "First Work",
      description: "Describe this piece here — what it is, when you made it, what tools or techniques you used. This text appears on the scroll when a visitor clicks the frame.",
      wall: "north", position: -0.62, height: 0.0, size: "large",
    },
    {
      id: "n2", src: "", name: "Second Work",
      description: "Description for your second piece. Replace src with the path to your image file.",
      wall: "north", position: 0.0, height: 0.0, size: "large",
    },
    {
      id: "n3", src: "", name: "Third Work",
      description: "Description for your third piece.",
      wall: "north", position: 0.62, height: 0.0, size: "large",
    },

    // ══ EAST WALL (right wall) ════════════════════════════════
    {
      id: "e1", src: "", name: "Fourth Work",
      description: "A piece on the right wall.",
      wall: "east", position: -0.58, height: 0.0, size: "medium",
    },
    {
      id: "e2", src: "", name: "Fifth Work",
      description: "Centre of the right wall.",
      wall: "east", position: 0.0, height: 0.0, size: "large",
    },
    {
      id: "e3", src: "", name: "Sixth Work",
      description: "Right side of the right wall.",
      wall: "east", position: 0.58, height: 0.0, size: "medium",
    },

    // ══ WEST WALL (left wall) ═════════════════════════════════
    {
      id: "w1", src: "", name: "Seventh Work",
      description: "A piece on the left wall.",
      wall: "west", position: -0.58, height: 0.0, size: "medium",
    },
    {
      id: "w2", src: "", name: "Eighth Work",
      description: "Centre of the left wall.",
      wall: "west", position: 0.0, height: 0.0, size: "large",
    },
    {
      id: "w3", src: "", name: "Ninth Work",
      description: "Right side of the left wall.",
      wall: "west", position: 0.58, height: 0.0, size: "medium",
    },

    // ══ SOUTH WALL (entrance wall — centre has the arch) ══════
    {
      id: "s1", src: "", name: "Tenth Work",
      description: "Entrance wall, left of the arch.",
      wall: "south", position: -0.70, height: 0.0, size: "medium",
    },
    {
      id: "s2", src: "", name: "Eleventh Work",
      description: "Entrance wall, right of the arch.",
      wall: "south", position: 0.70, height: 0.0, size: "medium",
    },

  ],
};
