(function () {
  'use strict';

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  var dialog = $('#walletDialog');
  var connectButton = $('#connectButton');
  var errorState = $('#errorState');
  var errorClose = $('#errorClose');
  var lastFocus = null;
  var toastTimer;

  function showToast(message) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 3300);
  }

  function openDialog() {
    if (!dialog) return;
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    var first = $('.wallet-option', dialog);
    if (first) setTimeout(function () { first.focus(); }, 40);
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  if (connectButton) connectButton.addEventListener('click', openDialog);
  $$('[data-close-wallet]').forEach(function (button) {
    button.addEventListener('click', closeDialog);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && dialog && !dialog.hidden) closeDialog();
    if (event.key !== 'Tab' || !dialog || dialog.hidden) return;
    var focusable = $$('.wallet-option, .dialog-close', dialog);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $$('.wallet-option').forEach(function (option) {
    option.addEventListener('click', function () {
      var wallet = option.getAttribute('data-wallet') || 'wallet';
      closeDialog();

      if (connectButton) {
        connectButton.disabled = true;
        connectButton.classList.add('is-loading');
        connectButton.querySelector('span:nth-child(2)').textContent = 'Connecting…';
        connectButton.querySelector('.connect-button__arrow').textContent = '• • •';
      }

      // This visual prototype deliberately does not request a real wallet connection.
      // The reference page displays the error state when a wallet is unavailable.
      setTimeout(function () {
        if (connectButton) {
          connectButton.disabled = false;
          connectButton.classList.remove('is-loading');
          connectButton.querySelector('span:nth-child(2)').textContent = 'Connect wallet';
          connectButton.querySelector('.connect-button__arrow').textContent = '→';
        }
        if (errorState) errorState.hidden = false;
        showToast(wallet + ' is not available in this preview');
      }, 850);
    });
  });

  if (errorClose) {
    errorClose.addEventListener('click', function () {
      if (errorState) errorState.hidden = true;
    });
  }

  var captchaButton = $('#captchaButton');
  var captchaTitle = $('#captchaTitle');
  var captchaHint = $('#captchaHint');
  var captchaProgress = $('#captchaProgress');
  if (captchaButton) {
    captchaButton.addEventListener('click', function () {
      if (captchaButton.classList.contains('is-verified')) return;
      captchaButton.disabled = true;
      captchaButton.classList.add('is-checking');
      captchaProgress.hidden = false;
      if (captchaTitle) captchaTitle.textContent = 'Verifying…';
      if (captchaHint) captchaHint.textContent = 'Checking your browser';

      setTimeout(function () {
        captchaProgress.hidden = true;
        captchaButton.classList.remove('is-checking');
        captchaButton.classList.add('is-verified');
        captchaButton.setAttribute('aria-label', 'Human verification complete');
        if (captchaTitle) captchaTitle.textContent = "You're a human";
        if (captchaHint) captchaHint.textContent = 'Verification complete';
        showToast('Human verification complete');
      }, 1650);
    });
  }
})();
