(function () {
  var EMBEDS = {
    instagram: function (container) {
      container.innerHTML =
        '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DaiR5ZFo64O/" data-instgrm-version="14">' +
          '<a href="https://www.instagram.com/reel/DaiR5ZFo64O/" target="_blank" rel="noopener">Video auf Instagram ansehen</a>' +
        '</blockquote>';
      loadInstagramScript();
    },
    youtube: function (container) {
      container.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/y3pWorJQ7ZE" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width:100%; height:100%; border:0;"></iframe>';
    }
  };

  var instagramScriptLoaded = false;
  function loadInstagramScript() {
    if (instagramScriptLoaded) {
      if (window.instgrm) window.instgrm.Embeds.process();
      return;
    }
    instagramScriptLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = '//www.instagram.com/embed.js';
    document.body.appendChild(s);
  }

  function loadEmbed(container) {
    var type = container.getAttribute('data-embed');
    if (type && EMBEDS[type]) EMBEDS[type](container);
  }

  function loadAllEmbeds() {
    document.querySelectorAll('[data-embed]').forEach(loadEmbed);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.cookieConsent && window.cookieConsent.accepted) {
      loadAllEmbeds();
      return;
    }
    document.querySelectorAll('.embed-load-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        loadEmbed(btn.closest('[data-embed]'));
      });
    });
  });

  window.addEventListener('cookieconsentchange', function (e) {
    if (e.detail && e.detail.accepted) loadAllEmbeds();
  });
})();
