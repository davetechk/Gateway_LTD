/* =====================================================================
   GATEWAY PHOTOGRAPHY — CONTENT
   This is the only file you need to edit to update the site.

   HOW TO ADD AN ALBUM
   1. Scroll to ALBUMS at the bottom. Copy one whole album block, from
      the "{" to the "}," and paste it just under the "[" at the top of
      the list. (Order in the file doesn't matter: the gallery sorts by
      date, newest first.)
   2. Change the fields:
        id           a short unique name: lowercase letters, numbers and
                     dashes, no spaces (lagos-fashion-week). It becomes the
                     share link:  gallery.html#lagos-fashion-week
                     It must NOT be one of: events, portraits, commercial,
                     editorial, brand, brand-campaigns (those are the
                     filter tabs).
        title        the album name
        category     exactly one of: "events"  "portraits"  "commercial"
                     "editorial"  "brand"   ("brand" shows as
                     "Brand Campaigns")
        date         "2026-05-14" or "2026-05" or "2026". It is shown as
                     "May 2026". Anything else is shown exactly as typed.
        location     optional, e.g. "Abuja". Leave "" to hide it.
        description  optional, one line. Leave "" to hide it.
        cover        the picture shown on the album box, about 1200 px
                     wide, 4:3 shape works best.
        featured     true shows the album on the home page (the first 3
                     featured albums, newest first). false keeps it in
                     the gallery only.
        photos       the list of photos, see below.
   3. Delete the "// PLACEHOLDER" line above your block, save, refresh.
   To remove a sample album, delete its whole block. Keep the commas.
   The "24 photos" count is worked out for you.

   HOW TO ADD PHOTOS TO AN ALBUM
   Inside an album, "photos" is a list. Copy one { ... } and paste it
   after another one (keep a comma between them). Each photo has:
        src      the full-size picture, about 2000 px wide. Only opens
                 inside the lightbox.
        thumb    a small version, about 600 px wide. Used for the strip
                 under the lightbox photo.
        alt      REQUIRED. One plain sentence describing what is in the
                 picture, for people who can't see it.
        caption  optional. A line shown under the photo. Leave the line
                 out if you don't need it.
   Tip: put your own pictures in a folder called "img" inside
   photography/ and write "img/my-photo.jpg" in src, thumb and cover.
   Photos are shown in the order you list them.

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
  // profiles, tidied of tracking parameters. Swap in Photography's own
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

window.ALBUMS = [
  // PLACEHOLDER, replace with real album
  {
    id: "untitled-event-01",
    title: "Untitled Event 01",
    category: "events",
    date: "20XX-01",
    location: "",
    description: "Placeholder description. One line about the event goes here.",
    cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: true,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=70&auto=format&fit=max",
        alt: "Concert crowd with raised hands forming a heart shape under stage lights"
      },
      {
        src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=70&auto=format&fit=max",
        alt: "Crowd silhouetted against warm yellow stage lights at a concert"
      },
      {
        src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=70&auto=format&fit=max",
        alt: "Audience facing a burst of orange light on stage"
      },
      {
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70&auto=format&fit=max",
        alt: "Confetti falling over a crowd lit in blue and purple"
      },
      {
        src: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=600&q=70&auto=format&fit=max",
        alt: "DJ booth with pink smoke and a dancing crowd"
      },
      {
        src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=70&auto=format&fit=max",
        alt: "Concert-goers with phones raised toward a stage lit in red and orange"
      },
      {
        src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=70&auto=format&fit=max",
        alt: "Crowd with hands up in front of a purple-lit festival stage"
      },
      {
        src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=70&auto=format&fit=max",
        alt: "Colourful laser-lit stage seen from the crowd"
      },
      {
        src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70&auto=format&fit=max",
        alt: "Silhouetted crowd facing a stage lit in pink and blue"
      },
      {
        src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=70&auto=format&fit=max",
        alt: "Concert crowd under falling confetti and white stage lights"
      }
    ]
  },

  // PLACEHOLDER, replace with real album
  {
    id: "untitled-event-02",
    title: "Untitled Event 02",
    category: "events",
    date: "20XX-02",
    location: "",
    description: "Placeholder description. One line about the event goes here.",
    cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: false,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=70&auto=format&fit=max",
        alt: "Black and white photo of a couple in wedding attire embracing under a veil"
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=70&auto=format&fit=max",
        alt: "Long banquet tables set with glassware and yellow flowers under a striped canopy"
      },
      {
        src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=70&auto=format&fit=max",
        alt: "Couple's hands with wedding rings holding a peach bouquet"
      },
      {
        src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=70&auto=format&fit=max",
        alt: "Wedding aisle lined with gold chairs and flower arrangements leading to an arch"
      },
      {
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=70&auto=format&fit=max",
        alt: "Couple seen from behind at a poolside celebration with red flowers and balloons"
      },
      {
        src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70&auto=format&fit=max",
        alt: "Long table set with plates, glasses and small flower arrangements"
      },
      {
        src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=70&auto=format&fit=max",
        alt: "Hands holding wine glasses in a warm toast"
      },
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=70&auto=format&fit=max",
        alt: "Bride holding a bouquet in warm backlight"
      },
      {
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=70&auto=format&fit=max",
        alt: "Two white chairs decorated with flowers on a green lawn"
      },
      {
        src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70&auto=format&fit=max",
        alt: "Bunch of colourful balloons against a pale wall"
      }
    ]
  },

  // PLACEHOLDER, replace with real album
  {
    id: "untitled-portrait-01",
    title: "Untitled Portrait 01",
    category: "portraits",
    date: "20XX-03",
    location: "",
    description: "Placeholder description. One line about the portrait shoot goes here.",
    cover: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: true,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70&auto=format&fit=max",
        alt: "Silhouette of a person meditating in front of a sunset-lit window"
      },
      {
        src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=70&auto=format&fit=max",
        alt: "Person with arms raised amid smoke and red-and-blue light"
      },
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=70&auto=format&fit=max",
        alt: "Person in a yellow tracksuit beside a basketball hoop, framed from the chest down"
      },
      {
        src: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=70&auto=format&fit=max",
        alt: "Man in a black leather jacket seated by a chain fence, looking away from the camera"
      },
      {
        src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=70&auto=format&fit=max",
        alt: "Man in a tan leather jacket, shirt and tie, framed from the sunglasses down"
      },
      {
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=70&auto=format&fit=max",
        alt: "Woman in a floral dress on a beach, framed from the shoulders down"
      },
      {
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=70&auto=format&fit=max",
        alt: "Woman in a red top and black jacket against a teal wall, head tilted back"
      },
      {
        src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=70&auto=format&fit=max",
        alt: "Woman in a light blue coat with a pink bag in front of a gothic cathedral, seen from behind"
      },
      {
        src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=70&auto=format&fit=max",
        alt: "Woman in profile lit in purple and pink light"
      },
      {
        src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=70&auto=format&fit=max",
        alt: "Photographer standing on a rocky peak above a sea of clouds, seen from behind"
      }
    ]
  },

  // PLACEHOLDER, replace with real album
  {
    id: "untitled-commercial-01",
    title: "Untitled Commercial 01",
    category: "commercial",
    date: "20XX-04",
    location: "",
    description: "Placeholder description. One line about the commercial shoot goes here.",
    cover: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: false,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=70&auto=format&fit=max",
        alt: "Black sneaker floating against a white background"
      },
      {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=70&auto=format&fit=max",
        alt: "Two watches with white straps laid flat on a white surface"
      },
      {
        src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=70&auto=format&fit=max",
        alt: "Green t-shirts on wooden hangers"
      },
      {
        src: "https://images.unsplash.com/photo-1503602642458-232111445657?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=70&auto=format&fit=max",
        alt: "White wooden stool against a blue background"
      },
      {
        src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70&auto=format&fit=max",
        alt: "Teal green sofa in a bright, minimal room"
      },
      {
        src: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=70&auto=format&fit=max",
        alt: "White tufted armchair against a white wall"
      },
      {
        src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=70&auto=format&fit=max",
        alt: "Teal suede shoe on a pastel geometric backdrop"
      },
      {
        src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=70&auto=format&fit=max",
        alt: "Bright interior with a black desk lamp, armchairs and wood shelving"
      },
      {
        src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=70&auto=format&fit=max",
        alt: "Living room with a sofa, pink armchairs, plants and a woven wall hanging"
      },
      {
        src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=70&auto=format&fit=max",
        alt: "Black headphones, keyboard and mouse on a white desk"
      }
    ]
  },

  // PLACEHOLDER, replace with real album
  {
    id: "untitled-editorial-01",
    title: "Untitled Editorial 01",
    category: "editorial",
    date: "20XX-05",
    location: "",
    description: "Placeholder description. One line about the editorial shoot goes here.",
    cover: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: false,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=70&auto=format&fit=max",
        alt: "White angular building against a pale sky"
      },
      {
        src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=70&auto=format&fit=max",
        alt: "Curved blue and white striped tower seen from below"
      },
      {
        src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&q=70&auto=format&fit=max",
        alt: "Black and white view looking up between glass skyscrapers"
      },
      {
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70&auto=format&fit=max",
        alt: "Dark glass skyscrapers seen from below against a blue sky"
      },
      {
        src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=70&auto=format&fit=max",
        alt: "Lower Manhattan skyline at dusk across the water"
      },
      {
        src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=70&auto=format&fit=max",
        alt: "Aerial view of a dense city skyline beside water at dusk"
      },
      {
        src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=70&auto=format&fit=max",
        alt: "City street at dusk with traffic between tall buildings"
      },
      {
        src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=70&auto=format&fit=max",
        alt: "Colourful cliffside village above the sea"
      },
      {
        src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=70&auto=format&fit=max",
        alt: "Aerial view of turquoise waves washing onto a beach"
      },
      {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=70&auto=format&fit=max",
        alt: "Empty road running through red rock desert toward mountains"
      }
    ]
  },

  // PLACEHOLDER, replace with real album
  {
    id: "untitled-brand-campaign-01",
    title: "Untitled Brand Campaign 01",
    category: "brand",
    date: "20XX-06",
    location: "",
    description: "Placeholder description. One line about the brand campaign goes here.",
    cover: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=70&auto=format&h=900&fit=crop",
    featured: true,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=max",
        alt: "Plated dinner on a table set with wine glasses and cutlery"
      },
      {
        src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=70&auto=format&fit=max",
        alt: "Clothing rail in a bright boutique with pendant lamps"
      },
      {
        src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70&auto=format&fit=max",
        alt: "Hands raising coffee cups in a toast over a wooden table"
      },
      {
        src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=70&auto=format&fit=max",
        alt: "Cappuccino with latte art beside a leafy plant"
      },
      {
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70&auto=format&fit=max",
        alt: "Restaurant interior with wooden tables and black chairs"
      },
      {
        src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=70&auto=format&fit=max",
        alt: "Bar with hanging filament bulbs and shelves of bottles"
      },
      {
        src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=70&auto=format&fit=max",
        alt: "Industrial-style cafe with long tables and large windows"
      },
      {
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=70&auto=format&fit=max",
        alt: "Seaside terrace restaurant with blue chairs at golden hour"
      },
      {
        src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=70&auto=format&fit=max",
        alt: "Desk with laptop, coffee mug, notepad and phone"
      },
      {
        src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2000&q=80&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=70&auto=format&fit=max",
        alt: "Overhead view of a shared desk with laptops, headphones and hands typing"
      }
    ]
  }
];
