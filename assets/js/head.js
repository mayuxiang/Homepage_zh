/* Runs in <head> before first paint. Keep it tiny and synchronous. */
(function () {
  // Redirect the old GitHub Pages host to the canonical domain.
  if (window.location.hostname === 'mayuxiang.github.io') {
    window.location.replace(
      'https://mayuxiang.com' +
        window.location.pathname +
        window.location.search +
        window.location.hash
    );
    return;
  }

  // Apply the saved (or system) theme before paint to avoid a flash of the wrong theme.
  var stored = null;
  try {
    stored = window.localStorage.getItem('theme');
  } catch (e) {
    /* localStorage may be blocked (private mode / disabled) */
  }
  if (!stored) {
    stored =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
  if (stored === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
