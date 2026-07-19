// Dip-to-white page transitions.
// On load: fade in from white. On internal-link click: fade out to white, then navigate.
// The new page fades in on load, producing a fade-out -> white -> fade-in sequence.
(function () {
  var DURATION = 200; // ms — fade-out time; matches the ease-in duration set on click
  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function show() {
    if (document.body) document.body.style.opacity = '1';
  }

  // Fade in once the DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(show);
    });
  } else {
    requestAnimationFrame(show);
  }

  // Restore visibility when returning via the back/forward cache.
  window.addEventListener('pageshow', show);

  // Fade out to white before navigating to an internal page.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    if (a.target === '_blank') return;
    if (a.hostname !== location.hostname) return; // external link

    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return;
    if (reduce.matches) return; // respect reduced-motion: navigate normally

    e.preventDefault();
    // Accelerate into the white; the next page decelerates out of it (CSS ease-out).
    document.body.style.transition = 'opacity ' + DURATION + 'ms ease-in';
    document.body.style.opacity = '0';
    setTimeout(function () { location.href = a.href; }, DURATION);
  });
})();
