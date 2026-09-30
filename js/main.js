/*
  Builds the page from content.js. You should not need to edit this file.
*/
(function () {
  "use strict";

  var D = window.PORTFOLIO || { site: {}, cv: [], categories: [], projects: [] };
  var site = D.site || {};
  var cats = D.categories || [];
  var projects = (D.projects || []).filter(function (p) { return !p.hidden; });
  var films = projects.filter(function (p) { return p.type !== "photo"; });
  var photos = projects.filter(function (p) { return p.type === "photo"; });

  document.documentElement.classList.add("js");

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

  function player(url, emptyLabel) {
    var k = mediaKind(url);
    if (!k) return ph(emptyLabel || "Video: add a Vimeo or YouTube link in content.js", "16/9");
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
  var heroMedia = $("#hero-media");
  if (site.showreelLoop) {
    heroMedia.innerHTML = '<video src="' + esc(site.showreelLoop) + '" autoplay muted loop playsinline' +
      (site.heroImage ? ' poster="' + esc(site.heroImage) + '"' : "") + "></video>";
  } else if (site.heroImage) {
    heroMedia.innerHTML = img(site.heroImage, "");
  } else {
    heroMedia.innerHTML = ph("Showreel loop · autoplay, muted");
  }

  var nameParts = String(site.name || "").trim().split(/\s+/);
  $("#hero-name").innerHTML = esc(nameParts[0] || "") + (nameParts.length > 1 ? "<br>" + esc(nameParts.slice(1).join(" ")) : "");
  $("#hero-role").textContent = site.role || "";
  $("#nav-name").textContent = site.name || "";

  $("#play-reel").addEventListener("click", function () {
    openViewer('<div class="viewer__reel">' + player(site.showreel, "Showreel: add your reel link in content.js (site.showreel)") + "</div>", "dark", "Showreel");
  });

  // ---------- Selected work ----------
  var selected = films.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
  $("#work-count").textContent = pad(selected.length) + (selected.length === 1 ? " film" : " films");
  $("#work-grid").innerHTML = selected.map(function (p, i) {
    var media = p.cover ? img(p.cover, p.title) : ph(pad(i + 1) + " · Film still or muted loop");
    if (p.preview) media += '<video class="card__preview" src="' + esc(p.preview) + '" muted loop playsinline preload="none"></video>';
    return '<a class="card reveal' + (i === 0 ? " card--lead" : "") + '" href="#p/' + encodeURIComponent(p.slug) + '">' +
      '<div class="card__media">' + media + "</div>" +
      '<div class="card__info"><h3 class="card__title">' + esc(p.title) + "</h3>" +
      '<p class="meta">' + joinMeta([catLabel(p.category), p.role, p.year]) + "</p></div></a>";
  }).join("");

  Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
    var v = card.querySelector(".card__preview");
    if (!v) return;
    card.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
    card.addEventListener("mouseleave", function () { v.pause(); v.currentTime = 0; });
  });

  // ---------- Stills ----------
  $("#site-intro").textContent = site.intro || "";
  var plates = [];
  photos.forEach(function (p) {
    var list = (p.gallery || []).slice();
    if (!list.length && p.cover) list.push(p.cover);
    if (list.length) list.forEach(function (src) { plates.push({ p: p, src: src }); });
    else for (var i = 0; i < 3; i++) plates.push({ p: p, src: null });
  });
  $("#plates").innerHTML = plates.map(function (pl, i) {
    return '<figure class="plate reveal"><a href="#p/' + encodeURIComponent(pl.p.slug) + '" aria-label="' + esc(pl.p.title) + '">' +
      (pl.src ? img(pl.src, pl.p.title) : ph("Photo")) + "</a>" +
      "<figcaption><em>Plate " + pad(i + 1) + ".</em> " + esc(pl.p.title) + (pl.p.year ? ", " + esc(pl.p.year) : "") + "</figcaption></figure>";
  }).join("");

  // ---------- Index ----------
  var filters = [{ id: "all", label: "All" }].concat(cats);
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
  $("#about-text").textContent = site.about || "";
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
  $("#contact-links").innerHTML = Object.keys(links).map(function (k) {
    var url = links[k];
    var label = linkNames[k] || k;
    return url
      ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>"
      : '<a href="#contact">[' + esc(label.toUpperCase()) + "]</a>";
  }).join("");
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
    var gallery = (p.gallery || []).map(function (src) { return img(src, p.title); }).join("");
    if (!gallery && isPhoto) gallery = p.cover ? img(p.cover, p.title) : ph("Photo") + ph("Photo") + ph("Photo");
    var html = '<article class="proj">' +
      (isPhoto ? "" : player(p.video)) +
      '<div class="proj__head"><div><p class="meta">' + (isPhoto ? "Photography" : "Film") + "</p>" +
      '<h2 class="proj__title">' + esc(p.title) + "</h2></div>" +
      '<div><dl class="proj__meta">' + meta + '</dl><p class="proj__desc">' + esc(p.description) + "</p>" +
      (p.link ? '<p class="proj__link"><a href="' + esc(p.link) + '" target="_blank" rel="noopener">View on ' + esc(hostLabel(p.link)) + "</a></p>" : "") +
      "</div></div>" +
      (gallery ? '<div class="proj__gallery">' + gallery + "</div>" : "") +
      "</article>";
    openViewer(html, isPhoto ? "light" : "dark", p.title);
  }

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
    if (m) openProject(decodeURIComponent(m[1]));
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
    toggle.textContent = open ? "Close" : "Menu";
  });
  $("#nav-links").addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("is-open")) toggle.click();
  });

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
