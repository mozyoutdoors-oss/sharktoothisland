// Google Analytics 4 for SharkToothIsland.org (property "sharktoothisland.org", account Mozy Outdoors).
// Loads only on the real domain, so local previews and GitHub's own URLs don't count as visits.
// Pages call stiTrack('sign_up', {...}) after a successful email signup or field guide request.
(function () {
  var GA4_ID = 'G-P86NK5YM3J';
  var LIVE_HOSTS = ['sharktoothisland.org', 'www.sharktoothisland.org'];

  window.stiTrack = function (name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  };

  if (LIVE_HOSTS.indexOf(location.hostname) === -1) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
  // Fetch the tag after the page has loaded, so it never competes with the first paint. Events queue until then.
  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
  }
  function idle() { if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 4000 }); else setTimeout(load, 2000); }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true });
})();
