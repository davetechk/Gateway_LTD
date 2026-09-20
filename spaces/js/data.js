/* =====================================================================
   GATEWAY SPACES — CONTENT
   This is the only file you need to edit to update the site.
   Anything left as "" (or an empty list) is simply hidden on the site.

   HOW TO ADD A SPACE
   1. Scroll to SPACES below. Copy one whole block, from the "{" to
      the "}," and paste it just under the "[" at the top of the list.
      Spaces are shown in the order you list them.
   2. Change the fields:
        id          a short unique name: lowercase letters, numbers and
                    dashes, no spaces (corner-office). It becomes the
                    share link:  https://spaces.thegatewayltd.com/#corner-office
                    It must NOT be one of: spaces, amenities, how-it-works,
                    faq, contact (those are the page sections).
        name        the space's name
        type        exactly one of: "coworking"  "office"  "meeting"
                    "event"
        description one line about the space
        capacity    optional, typed exactly as you want it shown,
                    e.g. "Up to 8 people". Leave "" to hide it.
        price       optional, typed exactly as you want it shown, with the
                    currency, e.g. "₦150,000". Leave "" and the site shows
                    "Price on request".
        priceUnit   optional, shown after the price, e.g. "per month" or
                    "per day". Ignored when price is empty.
        includes    the "What's included" list. One line per item. Leave
                    the list empty [] to hide the heading.
        cover       the picture on the space's card, about 1200 x 800 px
                    (3:2 shape).
        photos      the list of photos, see below.
   3. Delete the "// PLACEHOLDER" line above your block, save, refresh.
   To remove a sample space, delete its whole block. Keep the commas.

   HOW TO ADD PHOTOS TO A SPACE
   Inside a space, "photos" is a list. Copy one { ... } and paste it after
   another one (keep a comma between them). Each photo has:
        src    the full-size picture, about 1800 px wide.
        thumb  a small version, about 600 px wide. Shown softly while the
               full picture loads.
        alt    REQUIRED. One plain sentence describing what is in the
               picture, for people who can't see it.
   Photos are shown in the order you list them. They are cropped to a 3:2
   frame, so landscape photos work best.
   Tip: put your own pictures in a folder called "img" inside spaces/ and
   write "img/private-office-1.jpg" in src, thumb and cover.

   HOW TO EDIT THE AMENITIES
   AMENITIES is the grid of small icons. Each one has an icon and a label.
   Available icons: power, wifi, meeting, coffee, parking, security,
   desk, event, kitchen, lock, check. Add, remove or rename freely. If the
   list is empty, the whole section (and its links) is hidden.
   The labels below are PLACEHOLDERS until they are confirmed.

   HOW TO EDIT THE FAQ
   FAQS is the question-and-answer list. Each entry has a question (q) and
   an answer (a). If the list is empty, the whole section (and its links)
   is hidden.
   IMPORTANT: Google FAQ markup (FAQPage JSON-LD) is built automatically
   from this list, but ONLY from entries that do NOT have
   "placeholder: true". When you write a real answer, delete the
   "placeholder: true" line from that entry, and delete the
   "// PLACEHOLDER" comment above it. The markup then always matches what
   visitors read on the page. Never leave a real entry marked
   placeholder, and never remove the flag from an entry you haven't
   really answered. When you change a real answer, the markup follows
   automatically.

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
  // profiles, tidied of tracking parameters. Swap in Spaces' own
  // profiles when they exist.
  socials: {
    instagram: "https://www.instagram.com/academy.gatewayltd/",
    youtube: "",
    vimeo: "",
    facebook: "https://www.facebook.com/people/The-Gateway-Academy/61590091418388/",
    tiktok: "https://www.tiktok.com/@gate_wayacademy",
    linkedin: "https://www.linkedin.com/company/the-gateway-academy"
  }
};

window.SPACES = [
  // PLACEHOLDER, replace with real space
  {
    id: "sample-coworking",
    name: "Sample Co-working Desk",
    type: "coworking",
    description: "Placeholder description. One line about this space goes here.",
    capacity: "",
    price: "",
    priceUnit: "",
    includes: [
      "Placeholder: first thing included",
      "Placeholder: second thing included",
      "Placeholder: third thing included"
    ],
    cover: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=72&auto=format&h=800&fit=crop",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=70&auto=format&fit=max",
        alt: "Bright co-working area with a tall plant, a high shared table and floor-to-ceiling windows"
      },
      {
        src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70&auto=format&fit=max",
        alt: "Hands typing on a laptop at a desk"
      },
      {
        src: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=600&q=70&auto=format&fit=max",
        alt: "Colourful open-plan workspace with pendant lamps, shelving and a table tennis table"
      },
      {
        src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=70&auto=format&fit=max",
        alt: "Overhead view of a shared table with laptops, notebooks and hands at work"
      },
      {
        src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=70&auto=format&fit=max",
        alt: "Cafe-style workspace with plants, hanging lights, chairs and a long counter"
      }
    ]
  },

  // PLACEHOLDER, replace with real space
  {
    id: "sample-private-office",
    name: "Sample Private Office",
    type: "office",
    description: "Placeholder description. One line about this space goes here.",
    capacity: "",
    price: "",
    priceUnit: "",
    includes: [
      "Placeholder: first thing included",
      "Placeholder: second thing included",
      "Placeholder: third thing included"
    ],
    cover: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200&q=72&auto=format&h=800&fit=crop",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&q=70&auto=format&fit=max",
        alt: "Corridor of glass-partitioned offices with a pendant lamp"
      },
      {
        src: "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=600&q=70&auto=format&fit=max",
        alt: "Bright private office with a desk, leather chair and a wall clock"
      },
      {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70&auto=format&fit=max",
        alt: "Long office corridor with glass partitions and a dark blue wall"
      },
      {
        src: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=600&q=70&auto=format&fit=max",
        alt: "Office with green walls, a desk, a woven wall hanging and a large window"
      },
      {
        src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=70&auto=format&fit=max",
        alt: "Sunlit desk with a laptop, monitor, small plant and water bottle"
      }
    ]
  },

  // PLACEHOLDER, replace with real space
  {
    id: "sample-meeting-room",
    name: "Sample Meeting Room",
    type: "meeting",
    description: "Placeholder description. One line about this space goes here.",
    capacity: "",
    price: "",
    priceUnit: "",
    includes: [
      "Placeholder: first thing included",
      "Placeholder: second thing included",
      "Placeholder: third thing included"
    ],
    cover: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200&q=72&auto=format&h=800&fit=crop",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=70&auto=format&fit=max",
        alt: "Long meeting table with leather chairs in front of floor-to-ceiling windows"
      },
      {
        src: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&q=70&auto=format&fit=max",
        alt: "Meeting room with a long table beside a wall of windows and a green partition"
      },
      {
        src: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=70&auto=format&fit=max",
        alt: "Wooden meeting table with chairs beside large windows overlooking a city"
      },
      {
        src: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600&q=70&auto=format&fit=max",
        alt: "Oval meeting table with orange chairs and abstract artwork"
      },
      {
        src: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=600&q=70&auto=format&fit=max",
        alt: "Dark meeting room with pink chairs around a table and pendant lights"
      }
    ]
  },

  // PLACEHOLDER, replace with real space
  {
    id: "sample-event-space",
    name: "Sample Event Space",
    type: "event",
    description: "Placeholder description. One line about this space goes here.",
    capacity: "",
    price: "",
    priceUnit: "",
    includes: [
      "Placeholder: first thing included",
      "Placeholder: second thing included",
      "Placeholder: third thing included"
    ],
    cover: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=72&auto=format&h=800&fit=crop",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=70&auto=format&fit=max",
        alt: "Banquet hall with round tables, gold chairs and crystal chandeliers"
      },
      {
        src: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&q=70&auto=format&fit=max",
        alt: "Open loft space with hanging bulbs, a patterned rug and seating areas"
      },
      {
        src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=70&auto=format&fit=max",
        alt: "Plant-filled cafe and event space under a glass roof"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=70&auto=format&fit=max",
        alt: "Bar with pendant lamps, chalkboard menus and stools"
      },
      {
        src: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=600&q=70&auto=format&fit=max",
        alt: "Industrial loft with a leather sofa, brick walls and a mezzanine"
      },
      {
        src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=70&auto=format&fit=max",
        alt: "Sunlit atrium staircase with wooden steps and a black railing"
      }
    ]
  }
];

window.AMENITIES = [
  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "power", label: "Power" },

  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "wifi", label: "Internet" },

  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "meeting", label: "Meeting rooms" },

  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "coffee", label: "Refreshments" },

  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "parking", label: "Parking" },

  // PLACEHOLDER, replace with a confirmed amenity
  { icon: "security", label: "Security" }
];

window.FAQS = [
  // PLACEHOLDER, replace with a real question and answer, then delete the placeholder line
  {
    placeholder: true,
    q: "How do I book a visit?",
    a: "Placeholder answer. Replace with the real answer before launch."
  },

  // PLACEHOLDER, replace with a real question and answer, then delete the placeholder line
  {
    placeholder: true,
    q: "What is included in the price?",
    a: "Placeholder answer. Replace with the real answer before launch."
  },

  // PLACEHOLDER, replace with a real question and answer, then delete the placeholder line
  {
    placeholder: true,
    q: "How long can I book a space for?",
    a: "Placeholder answer. Replace with the real answer before launch."
  },

  // PLACEHOLDER, replace with a real question and answer, then delete the placeholder line
  {
    placeholder: true,
    q: "Are the spaces available for events?",
    a: "Placeholder answer. Replace with the real answer before launch."
  },

  // PLACEHOLDER, replace with a real question and answer, then delete the placeholder line
  {
    placeholder: true,
    q: "How do I pay?",
    a: "Placeholder answer. Replace with the real answer before launch."
  }
];
