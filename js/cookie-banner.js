/**
 * ═══════════════════════════════════════════════════════════════
 *  DSGVO Cookie Banner – Christine Rojek
 *  Basis: cookie-banner.js von Lisa Scheier | lisascheier.de
 *
 *  Steuert die Einwilligung für eingebettete Inhalte (Instagram,
 *  YouTube). Andere Skripte können per Event bzw. window.cookieConsent
 *  prüfen, ob der Besucher zugestimmt hat, bevor sie externe Embeds laden.
 * ═══════════════════════════════════════════════════════════════
 */

(function () {

  /* ─── CONFIG ──────────────────────────────────────────────── */
  var CONFIG = {
    storageKey: 'christine_rojek_consent',

    colors: {
      background:   '#241e17',
      backgroundEnd:'#4a3f34',
      border:       'rgba(201,169,160,.4)',
      text:         '#e8e4dc',
      textStrong:   '#faf6f0',
      link:         '#c9a9a0',
      btnAcceptBg:  '#a97c6b',
      btnAcceptBgEnd:'#8a6154',
      btnAcceptBorder:'#c9a9a0',
      btnAcceptText: '#faf6f0',
      btnDeclineText:'#e8e4dc',
      btnDeclineBorder:'rgba(232,228,220,.35)',
    },

    text: {
      headline:    'Diese Website verwendet Cookies.',
      body:        'Ich binde Instagram- und YouTube-Videos ein. Diese laden externe Inhalte erst, wenn du zustimmst – dabei werden Daten an Meta bzw. Google übertragen.',
      linkPrivacy:  'Datenschutzerklärung',
      linkImprint:  'Impressum',
      btnAccept:    'Alle akzeptieren',
      btnDecline:   'Ablehnen',
    },

    links: {
      privacy: 'datenschutz.html',
      imprint: 'impressum.html',
    },

    settingsLinkId: 'cookie-settings',
    maxAgeMs: 365 * 24 * 60 * 60 * 1000,
  };
  /* ─── Ende CONFIG ─────────────────────────────────────────── */


  var STORAGE_KEY      = CONFIG.storageKey;
  var STORAGE_DATE_KEY = CONFIG.storageKey + '_date';
  var C                = CONFIG.colors;
  var T                = CONFIG.text;
  var L                = CONFIG.links;

  /* ─── Gespeicherte Einwilligung lesen ─────────────────────── */
  function readStoredConsent() {
    try {
      var saved     = localStorage.getItem(STORAGE_KEY);
      var savedDate = localStorage.getItem(STORAGE_DATE_KEY);
      if (saved && savedDate && (Date.now() - parseInt(savedDate, 10)) < CONFIG.maxAgeMs) {
        return saved;
      }
    } catch (e) {}
    return null;
  }

  var storedConsent = readStoredConsent();

  /* Öffentlicher Status für andere Skripte (z.B. Instagram/YouTube-Embeds) */
  window.cookieConsent = { accepted: storedConsent === 'accepted' };

  /* ─── CSS in den <head> injizieren ───────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#cc-banner{',
      'display:none;position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:99999;',
      'width:min(720px,calc(100% - 2rem));',
      'background:linear-gradient(135deg,' + C.background + ' 0%,' + C.backgroundEnd + ' 100%);',
      'border:1.5px solid ' + C.border + ';border-radius:16px;padding:1.75rem 2rem;',
      'box-shadow:0 8px 40px rgba(0,0,0,.35);',
      'gap:1.5rem;align-items:center;flex-wrap:wrap;',
      'font-family:system-ui,sans-serif;',
    '}',
    '#cc-banner.cc-visible{display:flex}',
    '.cc-text{flex:1;min-width:240px}',
    '.cc-text p{font-size:.88rem;color:' + C.text + ';line-height:1.6;margin:0}',
    '.cc-text strong{color:' + C.textStrong + '}',
    '.cc-text a{color:' + C.link + ';text-decoration:underline;font-size:.82rem}',
    '.cc-btns{display:flex;gap:.75rem;flex-shrink:0;flex-wrap:wrap}',
    '#cc-accept{',
      'padding:.65rem 1.5rem;',
      'background:linear-gradient(160deg,' + C.btnAcceptBg + ' 0%,' + C.btnAcceptBgEnd + ' 100%);',
      'color:' + C.btnAcceptText + ';',
      'border:1.5px solid ' + C.btnAcceptBorder + ';border-radius:100px;',
      'font-size:.85rem;font-weight:500;cursor:pointer;',
      'transition:all .3s ease;white-space:nowrap;',
    '}',
    '#cc-accept:hover{opacity:.85}',
    '#cc-decline{',
      'padding:.65rem 1.5rem;background:transparent;',
      'color:' + C.btnDeclineText + ';',
      'border:1.5px solid ' + C.btnDeclineBorder + ';border-radius:100px;',
      'font-size:.85rem;font-weight:400;cursor:pointer;',
      'transition:all .3s ease;white-space:nowrap;',
    '}',
    '#cc-decline:hover{border-color:' + C.btnDeclineText + ';opacity:.85}',
    '@media(max-width:600px){',
      '#cc-banner{bottom:0;left:0;right:0;transform:none;width:100%;border-radius:16px 16px 0 0}',
      '.cc-btns{width:100%}',
      '#cc-accept,#cc-decline{flex:1;text-align:center}',
    '}',
  ].join('');
  document.head.appendChild(style);

  /* ─── Banner-HTML erzeugen ───────────────────────────────── */
  var banner = document.createElement('div');
  banner.id = 'cc-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Einstellungen');
  banner.innerHTML = [
    '<div class="cc-text">',
      '<p><strong>' + T.headline + '</strong> ' + T.body + '</p>',
      '<p style="margin-top:.5rem">',
        '<a href="' + L.privacy + '">' + T.linkPrivacy + '</a>',
        ' &nbsp;·&nbsp; ',
        '<a href="' + L.imprint + '">' + T.linkImprint + '</a>',
      '</p>',
    '</div>',
    '<div class="cc-btns">',
      '<button id="cc-decline">' + T.btnDecline + '</button>',
      '<button id="cc-accept">' + T.btnAccept + '</button>',
    '</div>',
  ].join('');

  /* ─── Banner ins DOM einfügen ─────────────────────────────── */
  function mount() {
    document.body.appendChild(banner);
    if (!storedConsent) {
      banner.classList.add('cc-visible');
    }
    attachListeners();
  }

  /* ─── Einwilligung speichern + andere Skripte benachrichtigen ─ */
  function setConsent(decision) {
    try {
      localStorage.setItem(STORAGE_KEY, decision);
      localStorage.setItem(STORAGE_DATE_KEY, Date.now().toString());
    } catch (e) {}
    window.cookieConsent = { accepted: decision === 'accepted' };
    window.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: window.cookieConsent }));
    banner.classList.remove('cc-visible');
  }

  function attachListeners() {
    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent('accepted');
    });
    document.getElementById('cc-decline').addEventListener('click', function () {
      setConsent('declined');
    });

    var settingsLink = document.getElementById(CONFIG.settingsLinkId);
    if (settingsLink) {
      settingsLink.addEventListener('click', function (e) {
        e.preventDefault();
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_DATE_KEY);
        } catch (e) {}
        banner.classList.add('cc-visible');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
