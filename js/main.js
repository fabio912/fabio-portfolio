/*
  Builds the page from content.js. You should not need to edit this file.
*/
(function () {
  "use strict";

  var D = window.PORTFOLIO || { site: {}, cv: [], categories: [], projects: [] };
  var site = D.site || {};
  var cats = D.categories || [];
  // Photo series stay hidden until they have at least one image (cover or gallery)
  var projects = (D.projects || []).filter(function (p) {
    if (p.hidden) return false;
    if (p.type === "photo") return !!(p.cover || (p.gallery && p.gallery.length));
    return true;
  });
  var films = projects.filter(function (p) { return p.type !== "photo"; });
  var photos = projects.filter(function (p) { return p.type === "photo"; });

  // ---------- Helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function catLabel(id) {
    var c = cats.find(function (x) { return x.id === id; });
    return c ? c.label : (id || "");
  }
  function ph(label, ratio) {
    return '<div class="ph"' + (ratio ? ' style="aspect-ratio:' + ratio + '"' : "") +
      '><span>[ ' + esc(label) + ' ]</span></div>';
  }
  function img(src, alt) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy">';
  }
  // Justified photo rows: each photo keeps its own shape and every row fills the width.
  // Aspect ratios come from media/photo-sizes.js; photos missing there are measured on load.
  function ratioOf(src) { return (window.PHOTO_SIZES || {})[src] || 1.5; }
  function jitem(src, href, alt) {
    var tag = href ? "a" : "div";
    return "<" + tag + ' class="jitem"' + (href ? ' href="' + href + '"' : "") + ' style="--r:' + ratioOf(src) + '">' +
      img(src, alt) + "</" + tag + ">";
  }
  function fixRatios(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".jitem img"), function (im) {
      if ((window.PHOTO_SIZES || {})[im.getAttribute("src")]) return;
      function set() { if (im.naturalWidth) im.parentNode.style.setProperty("--r", im.naturalWidth / im.naturalHeight); }
      if (im.complete) set(); else im.addEventListener("load", set);
    });
  }

  function joinMeta(parts) {
    return parts.filter(Boolean).map(esc).join(" / ");
  }

  // Works out what kind of video link was pasted
  function mediaKind(url) {
    if (!url) return null;
    var m;
    if ((m = url.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/([a-z0-9]+))?/i))) return { kind: "vimeo", id: m[1], hash: m[2] };
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/))) return { kind: "youtube", id: m[1] };
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return { kind: "file", src: url };
    return { kind: "link", src: url };
  }

  function player(url, emptyLabel, aspect) {
    var k = mediaKind(url);
    if (!k) return ph(emptyLabel || "Video: add a Vimeo or YouTube link in content.js", "16/9");
    var html = playerFrame(k);
    return aspect === "9:16" ? html.replace('class="frame"', 'class="frame frame--vertical"') : html;
  }

  function playerFrame(k) {
    if (k.kind === "vimeo") {
      var q = (k.hash ? "h=" + k.hash + "&" : "") + "autoplay=1&title=0&byline=0&portrait=0&dnt=1";
      return '<div class="frame"><iframe src="https://player.vimeo.com/video/' + k.id + "?" + q +
        '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video player"></iframe></div>';
    }
    if (k.kind === "youtube") {
      return '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + k.id +
        '?autoplay=1&rel=0&playsinline=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video player"></iframe></div>';
    }
    if (k.kind === "file") {
      return '<div class="frame"><video src="' + esc(k.src) + '" controls autoplay playsinline></video></div>';
    }
    return '<div class="frame frame--link"><a href="' + esc(k.src) + '" target="_blank" rel="noopener">Watch on ' + esc(hostLabel(k.src)) + "</a></div>";
  }

  function hostLabel(url) {
    var host;
    try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return "external site"; }
    var names = { "instagram.com": "Instagram", "youtube.com": "YouTube", "youtu.be": "YouTube", "vimeo.com": "Vimeo" };
    return names[host] || host;
  }

  // ---------- Hero ----------
  var nameParts = String(site.name || "").trim().split(/\s+/);
  $("#hero-name").innerHTML = esc(nameParts[0] || "") + (nameParts.length > 1 ? "<br>" + esc(nameParts.slice(1).join(" ")) : "");
  $("#hero-role").textContent = site.role || "";
  $("#hero-intro").textContent = site.intro || "";
  $("#hero-services").innerHTML = (site.services || []).map(function (sv) {
    return '<li><a href="' + esc(sv.href || "#work") + '">' + esc(sv.label) + "</a></li>";
  }).join("");
  $("#nav-name").textContent = site.name || "";

  // "Play reel" only appears once site.showreel has a link
  var playBtn = $("#play-reel");
  if (site.showreel) {
    playBtn.hidden = false;
    playBtn.addEventListener("click", function () {
      openViewer('<div class="viewer__reel">' + player(site.showreel) + "</div>", "dark", "Showreel");
    });
  }

  // Slow-moving strip of film stills along the bottom of the hero
  function featuredFirst(list) {
    return list.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
  }
  var stripFilms = featuredFirst(films.filter(function (p) { return p.cover; })).slice(0, site.heroStripCount || 12);
  function stripItems(copy) {
    return stripFilms.map(function (p) {
      return '<a class="strip__item" href="#p/' + encodeURIComponent(p.slug) + '"' +
        (copy ? ' aria-hidden="true" tabindex="-1"' : "") + ">" + img(p.cover, copy ? "" : p.title) +
        '<span class="strip__label">' + esc(p.title) + "</span></a>";
    }).join("");
  }
  if (stripFilms.length) $("#strip-track").innerHTML = stripItems(false) + stripItems(true);
  else $("#strip").hidden = true;

  // ---------- Work, in groups (e.g. Personal & Freelance, Jobs) ----------
  function card(p, i, lead) {
    var media = p.cover ? img(p.cover, p.title) : ph(pad(i + 1) + " · Film still or muted loop");
    if (p.preview) media += '<video class="card__preview" src="' + esc(p.preview) + '" muted loop playsinline preload="none"></video>';
    return '<a class="card reveal' + (lead && i === 0 ? " card--lead" : "") + '" href="#p/' + encodeURIComponent(p.slug) + '">' +
      '<div class="card__media">' + media + "</div>" +
      '<div class="card__info"><h3 class="card__title">' + esc(p.title) + "</h3>" +
      '<p class="meta">' + joinMeta([catLabel(p.category), p.role, p.year]) + "</p></div></a>";
  }
  // For projects with several videos (e.g. CXL): a row of the vertical clips next to the card
  function cardSet(p) {
    if (!p.videos || !p.videos.length) return "";
    var tall = p.videos.filter(function (v) { return v.aspect === "9:16"; });
    var wide = p.videos.length - tall.length;
    if (!tall.length) return "";
    return '<div class="card-set reveal"><p class="meta">Shorts &amp; reels · 9:16</p><div class="card-set__row">' +
      tall.map(function (v) {
        var id = ytId(v.url);
        var thumb = v.thumb || (id ? "https://i.ytimg.com/vi/" + id + "/oar2.jpg" : "");
        return '<button class="card-set__item" type="button" data-url="' + esc(v.url) + '" data-title="' + esc(v.title) + '" aria-label="Play ' + esc(v.title) + '">' +
          (thumb ? img(thumb, "") : "") + '<span class="vset__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="currentColor"/></svg></span></button>';
      }).join("") + "</div>" +
      '<a class="card-set__more" href="#p/' + encodeURIComponent(p.slug) + '">View all ' + p.videos.length + " videos" +
      (wide ? " (" + wide + " promos, " + tall.length + " shorts)" : "") + "</a></div>";
  }

  var groups = D.groups && D.groups.length ? D.groups : [{ title: "Selected work", categories: cats.map(function (c) { return c.id; }) }];
  // A full-width lead card only when it leaves the rows even (odd counts), so no row has a gap
  function grid(list) {
    var lead = list.length % 2 === 1 && list.length > 1;
    return '<div class="work__grid">' + list.map(function (p, i) { return card(p, i, lead) + cardSet(p); }).join("") + "</div>";
  }
  // Counts videos, so a multi-video project (CXL) counts each of its clips
  function count(list) {
    var multi = list.some(function (p) { return p.videos && p.videos.length; });
    var n = list.reduce(function (t, p) { return t + (p.videos && p.videos.length ? p.videos.length : 1); }, 0);
    var word = multi ? "video" : "film";
    return pad(n) + " " + word + (n === 1 ? "" : "s");
  }
  $("#work-groups").innerHTML = groups.map(function (g) {
    var all = films.filter(function (p) { return g.categories.indexOf(p.category) !== -1; });
    if (!all.length) return "";
    var head = '<div class="section-head reveal"><h2 class="display-head">' + esc(g.title) + "</h2>" +
      '<p class="meta">' + count(all) + "</p></div>";
    if (!g.split) return '<div class="work-group">' + head + grid(featuredFirst(all)) + "</div>";
    return '<div class="work-group">' + head + g.categories.map(function (id) {
      var list = featuredFirst(all.filter(function (p) { return p.category === id; }));
      if (!list.length) return "";
      var c = cats.find(function (x) { return x.id === id; }) || { label: id };
      return '<div class="work-sub"><div class="work-sub__head reveal"><h3 class="work-sub__title">' + esc(c.label) + "</h3>" +
        (c.note ? '<p class="meta">' + esc(c.note) + "</p>" : "") + '<p class="meta work-sub__count">' + count(list) + "</p></div>" +
        grid(list) + "</div>";
    }).join("") + "</div>";
  }).join("");

  $("#work-groups").addEventListener("click", function (e) {
    var b = e.target.closest(".card-set__item");
    if (!b) return;
    openViewer('<div class="viewer__reel">' + player(b.dataset.url, null, "9:16") +
      '<p class="meta viewer__caption">' + esc(b.dataset.title) + "</p></div>", "dark", b.dataset.title);
  });

  Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
    var v = card.querySelector(".card__preview");
    if (!v) return;
    card.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
    card.addEventListener("mouseleave", function () { v.pause(); v.currentTime = 0; });
  });

  // ---------- Stills ----------
  $("#site-intro").textContent = site.stillsIntro || "";
  function photosOf(p) { return (p.gallery && p.gallery.length ? p.gallery : [p.cover]).filter(Boolean); }
  function realText(t) { return t && t.charAt(0) !== "[" ? t : ""; }   // skip "[placeholder]" copy

  if (!photos.length) {
    // No photos yet: hide the Stills section and its menu link
    $("#stills").hidden = true;
    var stillsLink = document.querySelector('.nav__links a[href="#stills"]');
    if (stillsLink) stillsLink.hidden = true;
  }

  // One tab per photo series: cover, title, count
  $("#series-tabs").innerHTML = photos.map(function (p, i) {
    var n = photosOf(p).length;
    return '<button class="series-tab" type="button" role="tab" id="tab-' + esc(p.slug) + '" aria-controls="series-panel" aria-selected="' + (i === 0) + '" data-slug="' + esc(p.slug) + '">' +
      '<span class="series-tab__img">' + (p.cover ? img(p.cover, "") : "") + "</span>" +
      '<span class="series-tab__text"><span class="series-tab__title">' + esc(p.title) + "</span>" +
      '<span class="series-tab__meta">' + n + (n === 1 ? " photo" : " photos") + "</span></span></button>";
  }).join("");

  function showSeries(slug) {
    var p = photos.find(function (x) { return x.slug === slug; }) || photos[0];
    if (!p) return;
    Array.prototype.forEach.call(document.querySelectorAll(".series-tab"), function (t) {
      t.setAttribute("aria-selected", String(t.dataset.slug === p.slug));
    });
    var all = photosOf(p);
    var shown = all.slice(0, site.stillsPerSeries || 12);
    var href = "#p/" + encodeURIComponent(p.slug);
    var panel = $("#series-panel");
    panel.setAttribute("aria-labelledby", "tab-" + p.slug);
    panel.innerHTML = '<div class="jgrid">' + shown.map(function (src) { return jitem(src, href, p.title); }).join("") + "</div>" +
      '<div class="series-panel__foot">' +
      (realText(p.description) ? '<p class="series-panel__desc">' + esc(p.description) + "</p>" : "<span></span>") +
      '<a class="series-panel__more" href="' + href + '">View all ' + all.length + " " + esc(p.title) + " photos</a></div>";
    fixRatios(panel);
    panel.classList.remove("is-switching");
    void panel.offsetWidth;   // restart the fade
    panel.classList.add("is-switching");
  }
  $("#series-tabs").addEventListener("click", function (e) {
    var t = e.target.closest(".series-tab");
    if (t) showSeries(t.dataset.slug);
  });
  if (photos.length) showSeries(photos[0].slug);

  // ---------- Index ----------
  // Only show filters that have at least one project
  var filters = [{ id: "all", label: "All" }].concat(cats.filter(function (c) {
    return projects.some(function (p) { return p.category === c.id; });
  }));
  $("#filters").innerHTML = filters.map(function (f, i) {
    return '<button class="filter" type="button" data-cat="' + esc(f.id) + '" aria-pressed="' + (i === 0) + '">' + esc(f.label) + "</button>";
  }).join("");

  $("#index-list").innerHTML = projects.map(function (p, i) {
    return '<li class="row" data-cat="' + esc(p.category) + '"><a href="#p/' + encodeURIComponent(p.slug) + '" data-cover="' + esc(p.cover || "") + '">' +
      '<span class="row__n">' + pad(i + 1) + "</span>" +
      '<span class="row__title">' + esc(p.title) + "</span>" +
      '<span class="row__cat">' + esc(catLabel(p.category)) + "</span>" +
      '<span class="row__role">' + esc(p.role) + "</span>" +
      '<span class="row__type">' + (p.type === "photo" ? "Photo" : "Film") + "</span>" +
      '<span class="row__year">' + esc(p.year) + "</span></a></li>";
  }).join("");

  $("#filters").addEventListener("click", function (e) {
    var btn = e.target.closest(".filter");
    if (!btn) return;
    var cat = btn.dataset.cat;
    Array.prototype.forEach.call(document.querySelectorAll(".filter"), function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    Array.prototype.forEach.call(document.querySelectorAll(".row"), function (r) { r.hidden = !(cat === "all" || r.dataset.cat === cat); });
  });

  // Floating preview that follows the cursor over the index
  var preview = $("#index-preview");
  var list = $("#index-list");
  list.addEventListener("mouseover", function (e) {
    var a = e.target.closest(".row a");
    if (!a) return;
    var src = a.dataset.cover;
    preview.innerHTML = src ? img(src, "") : ph("Preview");
    preview.classList.add("is-on");
  });
  list.addEventListener("mousemove", function (e) {
    preview.style.transform = "translate(" + (e.clientX + 28) + "px," + (e.clientY - 84) + "px)";
  });
  list.addEventListener("mouseleave", function () { preview.classList.remove("is-on"); });

  // ---------- About / CV ----------
  $("#portrait").innerHTML = site.portrait ? img(site.portrait, site.name) : ph("Portrait · 4:5");
  var about = [].concat(site.about || []);
  $("#about-text").textContent = about[0] || "";
  $("#about-body").innerHTML = about.slice(1).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
  $("#cv").innerHTML = (D.cv || []).map(function (g) {
    return '<div class="cv__group reveal"><h3 class="label">' + esc(g.title) + "</h3><ul>" +
      (g.items || []).map(function (it) {
        var sub = [it.where, it.when].filter(Boolean).map(esc).join(", ");
        return '<li><span class="cv__what">' + esc(it.what) + "</span>" + (sub ? '<span class="cv__sub">' + sub + "</span>" : "") + "</li>";
      }).join("") + "</ul></div>";
  }).join("");
  if (site.cvFile) $("#cv-file").innerHTML = '<a href="' + esc(site.cvFile) + '" target="_blank" rel="noopener">Download CV (PDF)</a>';

  // ---------- Contact ----------
  var email = $("#contact-email");
  email.textContent = site.email || "";
  email.href = /@/.test(site.email || "") ? "mailto:" + site.email : "#contact";
  var linkNames = { instagram: "Instagram", vimeo: "Vimeo", youtube: "YouTube", linkedin: "LinkedIn" };
  var links = site.links || {};
  $("#contact-links").innerHTML = Object.keys(links).filter(function (k) { return links[k]; }).map(function (k) {
    return '<a href="' + esc(links[k]) + '" target="_blank" rel="noopener">' + esc(linkNames[k] || k) + "</a>";
  }).join("");
  var contactMeta = [];
  if (site.phone) contactMeta.push('<a href="tel:' + esc(site.phone.replace(/\s+/g, "")) + '">' + esc(site.phone) + "</a>");
  if (site.location) contactMeta.push("<span>" + esc(site.location) + "</span>");
  $("#contact-meta").innerHTML = contactMeta.join("");
  $("#footer-copy").textContent = "© " + new Date().getFullYear() + " " + (site.name || "");

  // ---------- Viewer (project pages and reel) ----------
  var viewer = $("#viewer");
  var viewerBody = $("#viewer-body");

  function openViewer(html, theme, label) {
    viewerBody.innerHTML = html;
    viewer.dataset.theme = theme;
    viewer.setAttribute("aria-label", label || "Project");
    if (!viewer.open) viewer.showModal();
    viewer.scrollTop = 0;
    document.body.style.overflow = "hidden";
  }

  function openProject(slug) {
    var p = projects.find(function (x) { return x.slug === slug; });
    if (!p) return;
    var isPhoto = p.type === "photo";
    var meta = [["Role", p.role], ["Client", p.client], ["Category", catLabel(p.category)], ["Year", p.year]]
      .filter(function (m) { return m[1]; })
      .map(function (m) { return "<div><dt>" + m[0] + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("");
    var gallery = (isPhoto ? photosOf(p) : (p.gallery || [])).map(function (src) { return jitem(src, null, p.title); }).join("");
    var html = '<article class="proj">' +
      (isPhoto || (p.videos && p.videos.length) ? "" : player(p.video, null, p.aspect)) +
      '<div class="proj__head"><div><p class="meta">' + (isPhoto ? "Photography" : "Film") + "</p>" +
      '<h2 class="proj__title">' + esc(p.title) + "</h2></div>" +
      '<div><dl class="proj__meta">' + meta + '</dl>' + (realText(p.description) ? '<p class="proj__desc">' + esc(p.description) + "</p>" : "") +
      (p.link ? '<p class="proj__link"><a href="' + esc(p.link) + '" target="_blank" rel="noopener">View on ' + esc(hostLabel(p.link)) + "</a></p>" : "") +
      "</div></div>" +
      videoSet(p.videos) +
      (gallery ? '<div class="jgrid proj__gallery">' + gallery + "</div>" : "") +
      "</article>";
    openViewer(html, isPhoto ? "light" : "dark", p.title);
    fixRatios(viewerBody);
  }

  // A set of videos shown as thumbnails; a click swaps in the real player
  function ytId(url) { var k = mediaKind(url); return k && k.kind === "youtube" ? k.id : ""; }
  function videoSet(list) {
    if (!list || !list.length) return "";
    function block(label, items, cls) {
      if (!items.length) return "";
      return '<section class="vset"><p class="meta vset__label">' + label + "</p>" +
        '<div class="vset__grid ' + cls + '">' + items.map(function (v) {
          var id = ytId(v.url), vertical = v.aspect === "9:16";
          var thumb = v.thumb || (id ? "https://i.ytimg.com/vi/" + id + (vertical ? "/oar2.jpg" : "/maxresdefault.jpg") : "");
          return '<figure class="vset__item"><button class="vset__play' + (vertical ? " is-vertical" : "") + '" type="button" data-url="' + esc(v.url) + '" data-aspect="' + esc(v.aspect || "16:9") + '" aria-label="Play ' + esc(v.title) + '">' +
            (thumb ? img(thumb, "") : "") + '<span class="vset__icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="currentColor"/></svg></span></button>' +
            "<figcaption>" + esc(v.title) + "</figcaption></figure>";
        }).join("") + "</div></section>";
    }
    var wide = list.filter(function (v) { return v.aspect !== "9:16"; });
    var tall = list.filter(function (v) { return v.aspect === "9:16"; });
    return '<div class="vset-wrap">' + block("Promos · 16:9", wide, "vset__grid--wide") + block("Shorts &amp; reels · 9:16", tall, "vset__grid--tall") + "</div>";
  }
  viewerBody.addEventListener("click", function (e) {
    var b = e.target.closest(".vset__play");
    if (!b) return;
    var holder = document.createElement("div");
    holder.innerHTML = player(b.dataset.url, null, b.dataset.aspect);
    var frame = holder.firstChild;
    frame.classList.add("vset__frame");
    b.replaceWith(frame);
  });

  function closeViewer() { if (viewer.open) viewer.close(); }
  $("#viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", function (e) { if (e.target === viewer) closeViewer(); });
  viewer.addEventListener("close", function () {
    viewerBody.innerHTML = "";   // stops any playing video
    document.body.style.overflow = "";
    if (/^#p\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  });

  function route() {
    var m = location.hash.match(/^#p\/(.+)$/);
    if (m) return openProject(decodeURIComponent(m[1]));
    var st = location.hash.match(/^#stills\/(.+)$/);
    if (st && photos.length) {
      showSeries(decodeURIComponent(st[1]));
      $("#stills").scrollIntoView();
    }
  }
  window.addEventListener("hashchange", route);
  route();

  // ---------- Nav ----------
  var nav = $("#nav");
  var toggle = $("#nav-toggle");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";   // no scrolling behind the menu
    toggle.textContent = open ? "Close" : "Menu";
  });
  $("#nav-links").addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("is-open")) toggle.click();
  });

  // Everything rendered: now it is safe to enable the scroll-reveal animation.
  // (If anything above fails, content stays visible instead of hidden.)
  document.documentElement.classList.add("js");

  // ---------- Theme: dark screening room, then the lights come up ----------
  if ("IntersectionObserver" in window) {
    var themeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) document.body.dataset.theme = en.target.dataset.theme;
      });
    }, { rootMargin: "-45% 0px -55% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll("section[data-theme]"), function (s) { themeObs.observe(s); });

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { revealObs.observe(el); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { el.classList.add("is-in"); });
  }
})();
