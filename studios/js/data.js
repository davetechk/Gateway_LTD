/* =====================================================================
   GATEWAY STUDIOS — CONTENT
   This is the only file you need to edit to update the site.

   HOW TO ADD A PROJECT
   1. Scroll to WORKS below. Copy one whole block, from the "{" to the
      "}," and paste it just under the "[" at the top of the list.
   2. Change the fields:
        id           a short unique name, lowercase, no spaces (river-town)
        title        the project name
        category     exactly one of: "documentary"  "film"  "brand"
        year         e.g. "2026"
        runtime      e.g. "24 min"   (leave "" to hide it)
        logline      one sentence about the project
        thumbnail    the address of a 16:9 picture, at least 1280 px wide.
                     Tip: put your own pictures in a folder called "img"
                     inside studios/ and write "img/river-town.jpg".
        thumbnailAlt (optional) describe the picture for people who can't
                     see it. If left out, "Thumbnail for <title>" is used.
        videoUrl     a YouTube or Vimeo link. Leave "" and the card shows
                     "Coming soon" instead of opening a video.
        featured     true puts the project first with a "Featured" tag,
                     false leaves it in normal order.
   3. Delete the "// PLACEHOLDER" line above your block, save, refresh.
   To remove a sample project, delete its whole block. Keep the commas.

   SHOWREEL
   Paste a YouTube or Vimeo link into SITE.showreel.videoUrl and a
   "Play showreel" button appears in the hero. Leave it "" to hide it.

   CONTACT AND SOCIALS
   Anything left as "" is simply hidden on the site.
   ===================================================================== */

window.SITE = {
  // Source: parent index.html footer. NOTE: this address uses the domain
  // "gatewayltd.com" (no "the"), while the site itself lives on
  // thegatewayltd.com. Confirm the mailbox exists, or change it here.
  email: "hello@gatewayltd.com",

  // Source: parent index.html footer (address text and Google Maps link).
  address: "Suite 203A, Bahamas Plaza, Joseph Gomwalk St, Gudu, Abuja",
  mapsUrl: "https://maps.app.goo.gl/7uZ9m9jh6bGJCdau7",

  // Source: academy/index.html footer. These are the Gateway Academy's
  // profiles, tidied of tracking parameters. Swap in Studios' own
  // profiles when they exist.
  socials: {
    instagram: "https://www.instagram.com/academy.gatewayltd/",
    youtube: "",
    vimeo: "",
    facebook: "https://www.facebook.com/people/The-Gateway-Academy/61590091418388/",
    tiktok: "https://www.tiktok.com/@gate_wayacademy",
    linkedin: "https://www.linkedin.com/company/the-gateway-academy"
  },

  showreel: {
    // PLACEHOLDER: add the showreel title and a YouTube/Vimeo link. The
    // hero button stays hidden until videoUrl is filled in.
    title: "",
    videoUrl: ""
  }
};

window.WORKS = [
  // PLACEHOLDER, replace with real project
  {
    id: "untitled-documentary-01",
    title: "Untitled Documentary 01",
    category: "documentary",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the documentary goes here.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: true
  },

  // PLACEHOLDER, replace with real project
  {
    id: "untitled-documentary-02",
    title: "Untitled Documentary 02",
    category: "documentary",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the documentary goes here.",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: false
  },

  // PLACEHOLDER, replace with real project
  {
    id: "untitled-film-01",
    title: "Untitled Film 01",
    category: "film",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the film goes here.",
    thumbnail: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: false
  },

  // PLACEHOLDER, replace with real project
  {
    id: "untitled-film-02",
    title: "Untitled Film 02",
    category: "film",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the film goes here.",
    thumbnail: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: false
  },

  // PLACEHOLDER, replace with real project
  {
    id: "untitled-brand-film-01",
    title: "Untitled Brand Film 01",
    category: "brand",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the brand film goes here.",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: false
  },

  // PLACEHOLDER, replace with real project
  {
    id: "untitled-brand-film-02",
    title: "Untitled Brand Film 02",
    category: "brand",
    year: "20XX",
    runtime: "00 min",
    logline: "Placeholder logline. One sentence about the brand film goes here.",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=960&h=540&q=75&auto=format&fit=crop",
    videoUrl: "",
    featured: false
  }
];
