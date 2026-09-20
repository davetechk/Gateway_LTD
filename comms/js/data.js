/* =====================================================================
   GATEWAY COMMUNICATIONS — CONTENT
   This is the only file you need to edit to update the site.
   Anything left as "" (or an empty list) is simply hidden on the site.

   HOW TO ADD A CASE STUDY
   1. Scroll to CASES below. Copy one whole block, from the "{" to the
      "}," and paste it just under the "[" at the top of the list.
      Case studies are shown in the order you list them.
   2. Change the fields:
        id          a short unique name: lowercase letters, numbers and
                    dashes, no spaces (health-campaign). It becomes the
                    share link:  https://comms.thegatewayltd.com/#health-campaign
                    It must NOT be one of: services, approach, work,
                    clients, one-gateway, contact (those are page sections).
        title       the case study's name
        clientType  the kind of client, e.g. "Public sector", "NGO",
                    "Corporate". Do not put a client's name here unless
                    they have given permission.
        summary     one line shown on the card and at the top of the panel
        challenge   what the client needed. Leave "" to hide it.
        approach    what you did. Leave "" to hide it.
        outcome     what happened. Only write results you can prove.
                    Leave "" to hide it.
                    (For challenge, approach and outcome you can start a
                    new paragraph by putting \n\n in the text.)
        services    the services used, one string each, e.g.
                    ["PR & Media Relations", "Media Training"]. Leave the
                    list empty [] to hide it.
        cover       the picture on the card, about 1200 x 800 px (3:2).
        images      pictures shown at the top of the panel. More than one
                    gives a swipeable carousel, exactly one shows a single
                    picture, and an empty list [] shows the cover instead.
                    Each image has:
                      src    the full-size picture, about 1800 px wide
                      thumb  a small version, about 600 px wide
                      alt    REQUIRED. One plain sentence describing the
                             picture, for people who can't see it.
   3. Delete the "// PLACEHOLDER" line above your block, save, refresh.
   To remove a sample case study, delete its whole block. Keep the commas.
   If the list is empty, the whole Work section (and its links) is hidden.

   HOW TO ADD CLIENT LOGOS
   CLIENTS is the logo row. It is EMPTY on purpose, so the section is
   hidden. ONLY ADD A CLIENT WHO HAS GIVEN YOU PERMISSION to show their
   name and logo. Each entry has:
        name   the client's name (also used as the logo's alt text)
        logo   the picture: a wide logo, ideally an SVG or a PNG with a
               transparent background, about 320 px wide.
               Tip: put logos in a folder called "img" inside comms/ and
               write "img/client-name.svg".
        url    optional. The client's website. Leave "" for no link.
   Copy the example block inside CLIENTS, remove the // at the start of
   each line, and fill it in.

   HOW TO CHANGE THE CONTACT DETAILS
   email, address, mapsUrl and socials are shown in the footer. The two
   "subjects" are the subject lines of the email that opens when someone
   clicks "Start a conversation" or "Media enquiries". Anything left as
   "" is hidden.
   ===================================================================== */

window.SITE = {
  // Source: parent index.html footer. NOTE: this address uses the domain
  // "gatewayltd.com" (no "the"), while the site itself lives on
  // thegatewayltd.com. Confirm the mailbox exists, or change it here.
  email: "hello@gatewayltd.com",

  // Subject lines of the enquiry emails (the message body is filled in by
  // the site).
  subjects: {
    project: "Project enquiry, Gateway Communications",
    media: "Media enquiry, Gateway Communications"
  },

  // Source: parent index.html footer (address text and Google Maps link).
  address: "Suite 203A, Bahamas Plaza, Joseph Gomwalk St, Gudu, Abuja",
  mapsUrl: "https://maps.app.goo.gl/7uZ9m9jh6bGJCdau7",

  // Source: academy/index.html footer. These are the Gateway Academy's
  // profiles, tidied of tracking parameters. Swap in Communications' own
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

window.CASES = [
  // PLACEHOLDER, replace with a real case study
  {
    id: "sample-case-01",
    title: "Sample Case Study 01",
    clientType: "Public sector",
    summary: "Placeholder summary. One line about the project goes here.",
    challenge: "Placeholder: the client's challenge goes here.",
    approach: "Placeholder: what we did goes here.",
    outcome: "Placeholder: real outcome goes here.",
    services: ["Placeholder: service used", "Placeholder: another service used"],
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&q=72&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=70&auto=format&fit=max",
        alt: "Close-up of a vintage chrome microphone against warm, blurred lights"
      },
      {
        src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=70&auto=format&fit=max",
        alt: "Stage microphone facing a blurred audience in a hall"
      }
    ]
  },

  // PLACEHOLDER, replace with a real case study
  {
    id: "sample-case-02",
    title: "Sample Case Study 02",
    clientType: "NGO",
    summary: "Placeholder summary. One line about the project goes here.",
    challenge: "Placeholder: the client's challenge goes here.",
    approach: "Placeholder: what we did goes here.",
    outcome: "Placeholder: real outcome goes here.",
    services: ["Placeholder: service used"],
    cover: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=1200&h=800&q=72&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=1800&q=78&auto=format&fit=max",
        thumb: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&q=70&auto=format&fit=max",
        alt: "Meeting room with a long table beside a wall of windows and a green partition"
      }
    ]
  },

  // PLACEHOLDER, replace with a real case study
  {
    id: "sample-case-03",
    title: "Sample Case Study 03",
    clientType: "Corporate",
    summary: "Placeholder summary. One line about the project goes here.",
    challenge: "Placeholder: the client's challenge goes here.",
    approach: "Placeholder: what we did goes here.",
    outcome: "Placeholder: real outcome goes here.",
    services: ["Placeholder: service used", "Placeholder: another service used"],
    cover: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1200&h=800&q=72&auto=format&fit=crop",
    images: []
  }
];

window.CLIENTS = [
  // EMPTY ON PURPOSE. Only add clients who have given permission.
  // To add one, copy this block, remove the // from each line, and fill it in:
  // {
  //   name: "Client name",
  //   logo: "img/client-name.svg",
  //   url: "https://www.example.com/"
  // }
];
