/* Shenglan Chen — site behaviour: copy email, project filters, slide viewer. */
(function () {
  "use strict";

  /* Copy-to-clipboard buttons: <button data-copy="#target"> */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute("data-copy"));
    if (!target) return;
    var label = btn.textContent;
    function done(text) {
      btn.textContent = text;
      setTimeout(function () { btn.textContent = label; }, 2000);
    }
    function selectText() {
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      done(btn.getAttribute("data-selected") || label);
    }
    btn.addEventListener("click", function () {
      var text = target.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          done(btn.getAttribute("data-copied") || label);
        }, selectText);
      } else {
        selectText();
      }
    });
  });

  /* Project filters: <button data-filter="id"> toggles <li data-field="id"> */
  var chips = document.querySelectorAll("[data-filter]");
  var tiles = document.querySelectorAll("li[data-field]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      tiles.forEach(function (li) { li.hidden = !(f === "all" || li.getAttribute("data-field") === f); });
    });
  });

  /* Slide viewer on a detail page: <section data-viewer data-deck data-count …> */
  var viewer = document.querySelector("[data-viewer]");
  if (!viewer) return;

  var base = viewer.getAttribute("data-base") + viewer.getAttribute("data-deck") + "/";
  var total = parseInt(viewer.getAttribute("data-count"), 10);
  var title = viewer.getAttribute("data-title");
  var tSlide = viewer.getAttribute("data-i18n-slide");
  var tOf = viewer.getAttribute("data-i18n-of");
  var stage = viewer.querySelector(".stage");
  var img = viewer.querySelector("#slide-img");
  var strip = viewer.querySelector("[data-strip]");
  var count = viewer.querySelector(".count");
  var bar = viewer.querySelector(".bar i");
  var prevBtn = viewer.querySelector('[data-step="-1"]');
  var nextBtn = viewer.querySelector('[data-step="1"]');
  var idx = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function src(i, thumb) { return base + (thumb ? "t" : "") + pad(i + 1) + ".jpg"; }

  function show(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    img.src = src(idx);
    img.alt = tSlide + " " + (idx + 1) + " " + tOf + " " + total + " · " + title;
    count.textContent = pad(idx + 1) + " / " + pad(total);
    bar.style.width = ((idx + 1) / total * 100) + "%";
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === total - 1;
    Array.prototype.forEach.call(strip.children, function (b, k) {
      b.setAttribute("aria-current", k === idx ? "true" : "false");
    });
    var cur = strip.children[idx];
    if (cur && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: cur.offsetLeft - strip.offsetLeft - (strip.clientWidth - cur.offsetWidth) / 2, behavior: "smooth" });
    }
    [idx + 1, idx - 1].forEach(function (k) {
      if (k >= 0 && k < total) { new Image().src = src(k); }
    });
  }

  for (var i = 0; i < total; i++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "thumb";
    b.setAttribute("aria-label", tSlide + " " + (i + 1));
    b.innerHTML = '<img src="' + src(i, true) + '" alt="" loading="lazy" width="320" height="180"><span>' + pad(i + 1) + "</span>";
    b.addEventListener("click", (function (k) { return function () { show(k); }; })(i));
    strip.appendChild(b);
  }

  prevBtn.addEventListener("click", function () { show(idx - 1); });
  nextBtn.addEventListener("click", function () { show(idx + 1); });

  stage.addEventListener("click", function (e) {
    var r = stage.getBoundingClientRect();
    show(idx + (e.clientX - r.left > r.width / 2 ? 1 : -1));
  });

  var touchX = null;
  stage.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) { e.preventDefault(); show(idx + (dx < 0 ? 1 : -1)); }
  });

  document.addEventListener("keydown", function (e) {
    var el = document.activeElement;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); show(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); show(idx - 1); }
    else if (e.key === "Home" && el === stage) { e.preventDefault(); show(0); }
    else if (e.key === "End" && el === stage) { e.preventDefault(); show(total - 1); }
  });

  var fsBtn = viewer.querySelector("[data-fullscreen]");
  if (!stage.requestFullscreen) {
    fsBtn.hidden = true;
  } else {
    fsBtn.addEventListener("click", function () {
      var p = stage.requestFullscreen();
      if (p && p.catch) { p.catch(function () {}); }
    });
    document.addEventListener("fullscreenchange", function () {
      if (document.fullscreenElement === stage) { stage.focus(); }
    });
  }

  show(0);
})();
