/*
  PORTFOLIO CONTENT
  This is the only file you need to edit to update the site.

  Media rules (work anywhere a media field appears):
    - Video: paste a Vimeo or YouTube link, e.g. "https://vimeo.com/123456789".
             An uploaded file also works: "media/my-project/film.mp4" (keep it small).
             Any other link (Instagram, etc.) shows as a "Watch" button.
    - Image: a local file, e.g. "media/my-project/cover.jpg", or any full image URL.
    - Leave a field as "" and the site shows a marked placeholder instead.

  To add a project: copy one { ... } block, paste it into the list, change the fields,
  and put its images in media/<slug>/.
  To hide a project without deleting it: add  hidden: true
  To link out (Instagram post, client page): add  link: "https://..."
  Vertical video (Reels, Shorts): add  aspect: "9:16"
*/

window.PORTFOLIO = {
  site: {
    name: "Fábio Araújo",
    role: "Filmmaker & Editor",
    intro: "[One-line intro. What you make and how you see it.]",
    email: "[EMAIL]",
    showreel: "",          // full reel: Vimeo or YouTube link, opens with "Play reel"
    showreelLoop: "",      // hero background: short muted .mp4 loop, e.g. "media/_site/reel-loop.mp4"
    heroImage: "",         // hero fallback / poster frame, e.g. "media/_site/hero.jpg"
    portrait: "",          // e.g. "media/_site/portrait.jpg"
    about: "[A short paragraph about you: what you make, how you work, what you care about.]",
    cvFile: "",            // optional PDF, e.g. "media/_site/fabio-araujo-cv.pdf"
    selectedCount: 6,      // how many films show in "Selected work" (featured first); the Index lists everything
    links: {
      instagram: "",
      vimeo: "",
      youtube: "",
      linkedin: ""
    }
  },

  // CV shown in the About section. Add, remove, or rename groups freely.
  cv: [
    {
      title: "Experience",
      items: [
        { what: "Video Editor & Filmmaker", where: "CXL", when: "[YEARS]" },
        { what: "[ROLE]", where: "[COMPANY]", when: "[YEARS]" }
      ]
    },
    {
      title: "Focus",
      items: [
        { what: "Creative development" },
        { what: "Filming" },
        { what: "Storytelling" },
        { what: "Post-production" }
      ]
    },
    {
      title: "Clients & collaborators",
      items: [
        { what: "[CLIENT]" },
        { what: "[CLIENT]" },
        { what: "[CLIENT]" }
      ]
    }
  ],

  // Filters shown on the site. Rename freely; each project uses one of these ids.
  categories: [
    { id: "course",       label: "Course content" },
    { id: "social",       label: "Social" },
    { id: "promo",        label: "Promotional" },
    { id: "job",          label: "Agency & In-house" },
    { id: "freelance",    label: "Freelance" },
    { id: "personal",     label: "Personal" }
  ],

  // Films appear in "Selected work" (featured ones first) and in the Index.
  // Photo series appear in "Stills" and in the Index.
  projects: [
    {
      slug: "film-placeholder-01",   // folder name in media/, also the link to this project
      type: "film",                  // "film" or "photo"
      category: "course",
      featured: true,                // featured films show first and largest
      title: "[Project title]",
      year: "[YEAR]",
      role: "[ROLE]",
      client: "[CLIENT]",
      description: "[One or two lines on the idea behind the film.]",
      cover: "",                     // e.g. "media/film-placeholder-01/cover.jpg"
      preview: "",                   // optional short muted .mp4 that plays on hover
      video: "",                     // Vimeo / YouTube link, or "media/.../film.mp4"
      gallery: []                    // extra stills: ["media/film-placeholder-01/01.jpg", ...]
    },
    {
      slug: "film-placeholder-02",
      type: "film",
      category: "promo",
      featured: false,
      title: "[Project title]",
      year: "[YEAR]",
      role: "[ROLE]",
      client: "[CLIENT]",
      description: "[One or two lines on the idea behind the film.]",
      cover: "",
      preview: "",
      video: "",
      gallery: []
    },
    {
      slug: "film-placeholder-03",
      type: "film",
      category: "social",
      featured: false,
      title: "[Project title]",
      year: "[YEAR]",
      role: "[ROLE]",
      client: "[CLIENT]",
      description: "[One or two lines on the idea behind the film.]",
      cover: "",
      preview: "",
      video: "",
      gallery: []
    },
    {
      slug: "piano-forum-2026",
      type: "film",
      category: "freelance",
      featured: false,
      title: "Piano Forum 2026 with Ricardo Costa",
      year: "2026",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "[CLIENT]",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/bbcLP7qq8nU/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=bbcLP7qq8nU",
      gallery: []
    },
    {
      slug: "supaserie-3",
      type: "film",
      category: "freelance",
      featured: false,
      title: "SUPASERIE #3 con Rodrigo Zalazar",
      year: "2025",
      role: "Filming, Color Grading",
      client: "SUPABROS",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/SOKJPrqEyws/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=SOKJPrqEyws",
      gallery: []
    },
    {
      slug: "supaserie-4",
      type: "film",
      category: "freelance",
      featured: false,
      title: "SUPASERIE #4 con Genaro Rodriguez",
      year: "2026",
      role: "Filming, Color Grading",
      client: "SUPABROS",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/TmTheiAbqCw/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=TmTheiAbqCw",
      gallery: []
    },
    {
      slug: "xpand-voices-of-innovation",
      type: "film",
      category: "job",
      featured: false,
      title: "Voices of Innovation - Xpand IT",
      year: "2024",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "Xpand IT",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/fLwOu2kiTf8/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=fLwOu2kiTf8",
      gallery: []
    },
    {
      slug: "xpand-accessibility",
      type: "film",
      category: "job",
      featured: false,
      title: "Xpand IT - Accessibility",
      year: "2024",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "Xpand IT",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/ZjXIYY6gT3o/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=ZjXIYY6gT3o",
      gallery: []
    },
    {
      slug: "xpand-jll-success-case",
      type: "film",
      category: "job",
      featured: false,
      title: "Xpand IT - JLL Success Case",
      year: "2024",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "Xpand IT",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/7KYL6vO8-Vw/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=7KYL6vO8-Vw",
      gallery: []
    },
    {
      slug: "lacaixa-sempre-acompanhados",
      type: "film",
      category: "job",
      featured: false,
      title: "LaCaixa - Sempre Acompanhados",
      year: "2023",
      role: "Camera Operator, Assistant Editor, Color Grading",
      client: "LaCaixa",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/DRKctvTGRSg/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=DRKctvTGRSg",
      gallery: []
    },
    {
      slug: "one-behind-the-scenes",
      type: "film",
      category: "job",
      featured: false,
      title: "ONE - Behind the Scenes",
      year: "2023",
      role: "Editor, Color Grading",
      client: "ONE",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/71YvvHngGJk/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=71YvvHngGJk",
      gallery: []
    },
    {
      slug: "one-lifestyle-campaign",
      type: "film",
      category: "job",
      featured: false,
      title: "ONE - Lifestyle Campaign",
      year: "2023",
      role: "Editor, Color Grading",
      client: "ONE",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/fE87Io1VQrg/hqdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=fE87Io1VQrg",
      aspect: "9:16",                // vertical video (YouTube Short)
      gallery: []
    },
    {
      slug: "cuf-medicina-dentaria",
      type: "film",
      category: "freelance",
      featured: false,
      title: "CUF",
      year: "2023",
      role: "Editor, Camera Assistant",
      client: "CUF",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/DEMNyHj35LQ/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=DEMNyHj35LQ",
      gallery: []
    },
    {
      slug: "rosa-teixeira-case",
      type: "film",
      category: "job",
      featured: false,
      title: "Rosa&Teixeira",
      year: "2024",
      role: "Camera Operator, Assistant Editor, Color Grading",
      client: "Rosa&Teixeira",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/sFgXe4C1rQQ/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=sFgXe4C1rQQ",
      gallery: []
    },
    {
      slug: "done-in-one-sec",
      type: "film",
      category: "freelance",
      featured: false,
      title: "Done in ONE Sec.",
      year: "2023",
      role: "Editor",
      client: "[CLIENT]",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/5PRIpddSsP8/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=5PRIpddSsP8",
      gallery: []
    },
    {
      slug: "sonae-our-day",
      type: "film",
      category: "freelance",
      featured: false,
      title: "SONAE Our Day",
      year: "2023",
      role: "Camera Operator, Editor",
      client: "SONAE",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/zPJJRwNvhRw/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=zPJJRwNvhRw",
      gallery: []
    },
    {
      slug: "zurich",
      type: "film",
      category: "job",
      featured: false,
      title: "Zurich",
      year: "2023",
      role: "Camera Operator, Assistant Editor, Color Grading",
      client: "Zurich",
      description: "[One or two lines on the project.]",
      cover: "https://i.ytimg.com/vi/KYs8D9QTMvU/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=KYs8D9QTMvU",
      gallery: []
    },
    {
      slug: "inertia",
      type: "film",
      category: "personal",
      featured: false,
      title: "Inertia: The Art of Procrastination",
      year: "2026",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "",
      description: "[One or two lines on the idea behind the film.]",
      cover: "https://i.ytimg.com/vi/8kJj86durxk/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=8kJj86durxk",
      gallery: []
    },
    {
      slug: "all-art-is-quite-useless",
      type: "film",
      category: "personal",
      featured: false,
      title: "“All art is quite useless.”",
      year: "2026",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "",
      description: "Oscar Wilde, 1891 (The Picture of Dorian Gray). [One or two lines on the idea behind the film.]",
      cover: "https://i.ytimg.com/vi/4xBIifrSPcw/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=4xBIifrSPcw",
      gallery: []
    },
    {
      slug: "oasis-more-than-music",
      type: "film",
      category: "personal",
      featured: false,
      title: "Oasis: More Than Music, A Way of Life",
      year: "2026",
      role: "Ideation, Filming, Color Grading, Editing",
      client: "",
      description: "[One or two lines on the idea behind the film.]",
      cover: "https://i.ytimg.com/vi/Dhjq57tZiLE/hqdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=Dhjq57tZiLE",
      gallery: []
    },
    {
      slug: "diamante",
      type: "film",
      category: "personal",
      featured: false,
      title: "Diamante",
      year: "2023",
      role: "Camera & Editing Assistant",
      client: "",
      description: "Short film. [One or two lines on the story.]",
      cover: "https://i.ytimg.com/vi/GGHXwTyL7HM/maxresdefault.jpg",
      preview: "",
      video: "https://www.youtube.com/watch?v=GGHXwTyL7HM",
      gallery: []
    },
    {
      slug: "photo-placeholder-01",
      type: "photo",
      category: "personal",
      title: "[Series title]",
      year: "[YEAR]",
      role: "Photography",
      client: "",
      description: "[One or two lines about the series.]",
      cover: "",
      gallery: []                    // the photos in this series, in display order
    },
    {
      slug: "freelance-photo-01",
      type: "photo",
      category: "freelance",
      title: "[Series title]",
      year: "[YEAR]",
      role: "Photography",
      client: "[CLIENT]",
      description: "[One or two lines about the shoot.]",
      link: "https://www.instagram.com/p/DQZ1fnciqtw/",   // shown as "View on Instagram"
      cover: "",
      gallery: []                    // export the photos to media/freelance-photo-01/ and list them here
    },
    {
      slug: "freelance-photo-02",
      type: "photo",
      category: "freelance",
      title: "[Series title]",
      year: "[YEAR]",
      role: "Photography",
      client: "[CLIENT]",
      description: "[One or two lines about the shoot.]",
      link: "https://www.instagram.com/p/DRkcZ-Hig-d/",   // shown as "View on Instagram"
      cover: "",
      gallery: []                    // export the photos to media/freelance-photo-02/ and list them here
    },
    {
      slug: "freelance-photo-03",
      type: "photo",
      category: "freelance",
      title: "[Series title]",
      year: "[YEAR]",
      role: "Photography",
      client: "[CLIENT]",
      description: "[One or two lines about the shoot.]",
      link: "https://www.instagram.com/p/DPWr2_aCoEx/",   // shown as "View on Instagram"
      cover: "",
      gallery: []                    // export the photos to media/freelance-photo-03/ and list them here
    },
    {
      slug: "freelance-photo-04",
      type: "photo",
      category: "freelance",
      title: "[Series title]",
      year: "[YEAR]",
      role: "Photography",
      client: "[CLIENT]",
      description: "[One or two lines about the shoot.]",
      link: "https://www.instagram.com/p/DNlaTWdNgzL/",   // shown as "View on Instagram"
      cover: "",
      gallery: []                    // export the photos to media/freelance-photo-04/ and list them here
    }
  ]
};
