(function () {
  var form = document.querySelector('.form');
  if (!form) return;

  var btn = form.querySelector('button[type="submit"]');
  var status = form.querySelector('.form-status');
  var originalBtnText = btn ? btn.textContent : '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn && btn.disabled) return;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';
    }
    if (status) {
      status.textContent = '';
      status.classList.remove('form-status--success', 'form-status--error');
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Formspark request failed');
        form.reset();
        if (status) {
          status.textContent = 'Danke für deine Nachricht! Ich melde mich so bald wie möglich persönlich bei dir.';
          status.classList.add('form-status--success');
        }
      })
      .catch(function () {
        if (status) {
          status.textContent = 'Etwas ist schiefgelaufen. Bitte versuch es noch einmal oder schreib mir direkt an info@christine-rojek.at.';
          status.classList.add('form-status--error');
        }
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      });
  });
})();
