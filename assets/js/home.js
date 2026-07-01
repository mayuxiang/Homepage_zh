/* Homepage-only behaviour. Loaded with `defer` on the home page. */

/* ---- Research-direction typing effect ---- */
(function () {
  var el = document.getElementById('typingText');
  var cursor = document.querySelector('.typing-cursor');
  if (!el) return;

  // Tags come from the server-rendered text ("信息安全 · 智慧网络 · ...").
  var tags = el.textContent.split(' · ').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!tags.length) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    // Keep the full static list; just hide the blinking cursor.
    el.textContent = tags.join(' · ');
    if (cursor) cursor.style.display = 'none';
    return;
  }

  el.textContent = ''; // clear SSR text so the animation starts clean
  var tagIdx = 0, charIdx = 0, deleting = false, paused = false;
  function tick() {
    if (paused) return;
    var word = tags[tagIdx];
    if (!deleting) {
      el.textContent = word.substring(0, charIdx + 1); charIdx++;
      if (charIdx === word.length) {
        paused = true;
        setTimeout(function () { paused = false; deleting = true; tick(); }, 2200);
        return;
      }
      setTimeout(tick, 80 + Math.random() * 40);
    } else {
      el.textContent = word.substring(0, charIdx - 1); charIdx--;
      if (charIdx === 0) {
        deleting = false;
        tagIdx = (tagIdx + 1) % tags.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 40 + Math.random() * 30);
    }
  }
  setTimeout(tick, 600);
})();

/* ---- Count-up for metric numbers (updates .metric-value only, keeps .metric-suffix) ---- */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var counted = new Set();
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var box = entry.target;
        var num = parseInt(box.getAttribute('data-count'), 10);
        var valueEl = box.querySelector('.metric-value');
        if (isNaN(num) || !valueEl || counted.has(box)) return;
        counted.add(box);
        var duration = 1200, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          valueEl.textContent = Math.floor(num * eased);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.metric-number[data-count]').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ---- Timeline dot glow ---- */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('glow'); }, i * 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document
    .querySelectorAll('.timeline-h-item[data-timeline] .timeline-h-dot')
    .forEach(function (el) { observer.observe(el); });
})();
