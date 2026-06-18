// Redirect mayuxiang.github.io → mayuxiang.com
(function () {
  var host = window.location.hostname;
  if (host === 'mayuxiang.github.io') {
    var target = 'https://mayuxiang.com' + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(target);
  }
})();
