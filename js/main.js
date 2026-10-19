/* ============================================================
   CONFIG — fill these in before launch
   ============================================================ */
const WHATSAPP_NUMBER = "919423924459"; // <-- replace with Sonali's WhatsApp number (country code + number, digits only)
const INSTAGRAM_URL = "https://www.instagram.com/sonalisarode_makeover/";

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp links ---------- */
  function waURL(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }
  document.querySelectorAll(".wa-link").forEach(function (a) {
    // hrefs are hardcoded as a no-JS fallback; JS only upgrades them
    if (a.getAttribute("href") === "#") {
      a.href = waURL(a.getAttribute("data-text") || "Hi Sonali! I'd like to enquire about a booking.");
    }
  });

  /* ---------- Preloader + hero entrance ---------- */
  var preloader = document.getElementById("preloader");
  var hero = document.querySelector(".hero");
  function ready() {
    preloader.classList.add("done");
    // start hero headline animation once the preloader fades
    setTimeout(function () { hero.classList.add("play"); }, 250);
  }
  if (document.readyState === "complete") {
    ready();
  } else {
    window.addEventListener("load", ready);
    // safety: never trap the visitor behind the preloader
    setTimeout(ready, 4000);
  }

  /* ---------- Floating button hides over hero ---------- */
  var waFloat = document.querySelector(".wa-float");
  if (waFloat && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      waFloat.classList.toggle("hide", entries[0].isIntersecting);
    }, { threshold: 0.25 }).observe(hero);
  }

  /* ---------- Nav blur on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScrollNav() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile drawer ---------- */
  var hamburger = document.getElementById("hamburger");
  var drawer = document.getElementById("drawer");
  var drawerClose = document.getElementById("drawerClose");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { drawerClose.focus(); } else { hamburger.focus(); }
  }
  hamburger.addEventListener("click", function () { setDrawer(true); });
  drawerClose.addEventListener("click", function () { setDrawer(false); });
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setDrawer(false); });
  });

  /* ---------- Active nav link ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var secIds = navAnchors.map(function (a) { return a.getAttribute("href").slice(1); });
  if ("IntersectionObserver" in window && navAnchors.length) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secIds.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) secIO.observe(sec);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Hero portrait parallax ---------- */
  var portrait = document.getElementById("heroPortrait");
  if (portrait && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = Math.max(-40, Math.min(40, window.scrollY * 0.12));
          portrait.style.transform = "translateY(" + y.toFixed(1) + "px)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var btn = item.querySelector(".acc-btn");
    var panel = item.querySelector(".acc-panel");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      // close others
      document.querySelectorAll(".acc-btn[aria-expanded='true']").forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.parentElement.querySelector(".acc-panel").style.maxHeight = "0px";
        }
      });
      btn.setAttribute("aria-expanded", String(!open));
      panel.style.maxHeight = !open ? panel.scrollHeight + "px" : "0px";
    });
  });

  /* ---------- Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".work-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCaption = document.getElementById("lbCaption");
  var lbCount = document.getElementById("lbCount");
  var lbClose = document.getElementById("lbClose");
  var current = 0;
  var lastTrigger = null;

  function showLb(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = items[current].getAttribute("data-caption") || img.alt;
    if (lbCount) lbCount.textContent = (current + 1) + " / " + items.length;
  }
  function openLb(i, trigger) {
    lastTrigger = trigger || null;
    showLb(i);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }
  // simple focus trap
  lightbox.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = lightbox.querySelectorAll("button");
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLb(i, item); });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "View " + (item.getAttribute("data-caption") || "work image"));
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i, item); }
    });
  });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); showLb(current - 1); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); showLb(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(current - 1);
    if (e.key === "ArrowRight") showLb(current + 1);
  });

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById("enquiryForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var phone = document.getElementById("fPhone").value.trim();
    var service = document.getElementById("fService").value;
    var date = document.getElementById("fDate").value;
    var msg = document.getElementById("fMsg").value.trim();
    var errEl = document.getElementById("formError");
    if (!name || !phone) {
      if (!errEl) {
        errEl = document.createElement("p");
        errEl.id = "formError";
        errEl.className = "form-error";
        errEl.setAttribute("role", "alert");
        form.insertBefore(errEl, form.querySelector('button[type="submit"]'));
      }
      errEl.textContent = "Please add your name and phone number so we can reach you.";
      document.getElementById("fName").setAttribute("aria-invalid", String(!name));
      document.getElementById("fPhone").setAttribute("aria-invalid", String(!phone));
      (!name ? document.getElementById("fName") : document.getElementById("fPhone")).focus();
      return;
    }
    if (errEl) errEl.textContent = "";
    var lines = [
      "Hi Sonali! I'm " + name + ".",
      "Service: " + service + ".",
      date ? "Event date: " + date + "." : null,
      "My phone: " + phone + ".",
      msg ? msg : null
    ].filter(Boolean);
    window.open(waURL(lines.join(" ")), "_blank", "noopener");
  });

  /* ---------- Smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
