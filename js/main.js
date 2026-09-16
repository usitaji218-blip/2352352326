/**
 * StonkFun - Trader Reward Pool Interactive Controller
 * Handles wallet connection, eligibility checking, scanner animation,
 * confetti, toast notifications, and dynamic UI state.
 */

(function () {
  'use strict';

  var C = window.STONK_CONFIG || {};

  // DOM Helpers
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel) { return Array.from(document.querySelectorAll(sel)); };

  // App State
  var state = {
    connectedWallet: null,
    isClaimed: false
  };

  /* ============================================================
     1. INITIALIZE DATA FROM CONFIG
     ============================================================ */
  function initConfigData() {
    if (!C.pool) return;

    if ($('poolBadge') && C.pool.badge) $('poolBadge').textContent = C.pool.badge;
    if ($('heroHeadline') && C.pool.headline) $('heroHeadline').textContent = C.pool.headline;
    if ($('heroDesc') && C.pool.description) $('heroDesc').textContent = C.pool.description;

    if ($('statPoolValue') && C.pool.totalValue) $('statPoolValue').textContent = C.pool.totalValue;
    if ($('statPoolSub') && C.pool.totalValueSub) $('statPoolSub').textContent = C.pool.totalValueSub;

    if ($('statEligibleTokens') && C.pool.eligibleTokens) {
      $('statEligibleTokens').innerHTML = C.pool.eligibleTokens.replace(/\n/g, '<br>');
    }
    if ($('statEligibleSub') && C.pool.eligibleTokensSub) $('statEligibleSub').textContent = C.pool.eligibleTokensSub;

    if ($('statClaimWindow') && C.pool.claimWindow) $('statClaimWindow').textContent = C.pool.claimWindow;
    if ($('statClaimSub') && C.pool.claimWindowSub) $('statClaimSub').textContent = C.pool.claimWindowSub;

    if ($('cardCheckTitle') && C.checker && C.checker.title) $('cardCheckTitle').textContent = C.checker.title;
    if ($('cardCheckDesc') && C.checker && C.checker.description) $('cardCheckDesc').textContent = C.checker.description;
    if ($('btnCheckEligibility') && C.checker && C.checker.ctaButton) $('btnCheckEligibility').textContent = C.checker.ctaButton;

    // Rules list
    var list = $('qualifiesList');
    if (list && Array.isArray(C.rules) && C.rules.length > 0) {
      list.innerHTML = C.rules.map(function (rule) {
        return '<li class="qualifies-item">' +
          '<span class="qualifies-bullet">•</span>' +
          '<span class="qualifies-text"><strong>' + escapeHtml(rule.highlight) + ' </strong>' + escapeHtml(rule.text) + '</span>' +
          '</li>';
      }).join('');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function truncateAddress(addr) {
    if (!addr || addr.length < 10) return addr || '';
    return addr.slice(0, 4) + '...' + addr.slice(-4);
  }

  /* ============================================================
     2. TOAST NOTIFICATIONS
     ============================================================ */
  function showToast(msg, duration) {
    duration = duration || 3200;
    var container = $('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#67B7ED" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' +
      '<span>' + escapeHtml(msg) + '</span>';

    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  /* ============================================================
     3. WALLET CONNECTION MANAGEMENT
     ============================================================ */
  var btnConnect = $('btnConnectWallet');
  var walletMenu = $('walletMenu');
  var walletModal = $('walletModal');
  var btnCloseWallet = $('btnCloseWalletModal');

  function openWalletModal() {
    closeWalletMenu();
    if (walletModal) {
      walletModal.classList.add('is-open');
      var input = $('inputWalletAddress');
      if (input) setTimeout(function () { input.focus(); }, 100);
    }
  }

  function closeWalletModal() {
    if (walletModal) walletModal.classList.remove('is-open');
  }

  function toggleWalletMenu() {
    if (walletMenu) walletMenu.classList.toggle('is-visible');
  }

  function closeWalletMenu() {
    if (walletMenu) walletMenu.classList.remove('is-visible');
  }

  function setWalletConnected(address, providerName) {
    state.connectedWallet = address;
    closeWalletModal();
    closeWalletMenu();

    var label = $('walletBtnLabel');
    var dot = $('walletDot');

    if (label) label.textContent = truncateAddress(address);
    if (dot) dot.style.display = 'inline-block';
    if (btnConnect) btnConnect.classList.add('is-connected');

    showToast('Connected to ' + (providerName || 'Solana Wallet') + ' (' + truncateAddress(address) + ')');
  }

  function disconnectWallet() {
    state.connectedWallet = null;
    closeWalletMenu();

    var label = $('walletBtnLabel');
    var dot = $('walletDot');

    if (label) label.textContent = 'Connect wallet';
    if (dot) dot.style.display = 'none';
    if (btnConnect) btnConnect.classList.remove('is-connected');

    showToast('Wallet disconnected');
  }

  // Header Connect Wallet button click
  if (btnConnect) {
    btnConnect.addEventListener('click', function (e) {
      e.stopPropagation();
      if (state.connectedWallet) {
        toggleWalletMenu();
      } else {
        openWalletModal();
      }
    });
  }

  // Close wallet menu on outside click
  document.addEventListener('click', function (e) {
    if (walletMenu && !walletMenu.contains(e.target) && e.target !== btnConnect) {
      closeWalletMenu();
    }
  });

  if (btnCloseWallet) {
    btnCloseWallet.addEventListener('click', closeWalletModal);
  }

  // Wallet provider options in modal
  $$('[data-wallet]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var provider = btn.getAttribute('data-wallet');
      // Assign realistic demo address for connected provider
      var demoAddr = '7xKXvP9m1Q2W3E4R5T6Y7U8I9O0PaS2d';
      setWalletConnected(demoAddr, provider);
      // Auto-run eligibility check after connecting
      setTimeout(function () {
        runEligibilityCheck(demoAddr);
      }, 400);
    });
  });

  // Wallet dropdown menu buttons
  var btnCopy = $('btnCopyAddress');
  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      if (!state.connectedWallet) return;
      navigator.clipboard.writeText(state.connectedWallet).then(function () {
        showToast('Wallet address copied to clipboard ✓');
        closeWalletMenu();
      }).catch(function () {
        showToast(state.connectedWallet);
        closeWalletMenu();
      });
    });
  }

  var btnDisconnect = $('btnDisconnectWallet');
  if (btnDisconnect) {
    btnDisconnect.addEventListener('click', disconnectWallet);
  }

  var btnCheckMenu = $('btnCheckEligibilityMenu');
  if (btnCheckMenu) {
    btnCheckMenu.addEventListener('click', function () {
      closeWalletMenu();
      if (state.connectedWallet) {
        runEligibilityCheck(state.connectedWallet);
      } else {
        openWalletModal();
      }
    });
  }

  /* ============================================================
     4. ELIGIBILITY CHECKER FLOW & SCANNER
     ============================================================ */
  var resultModal = $('resultModal');
  var btnCloseResult = $('btnCloseResultModal');
  var scanScreen = $('scanScreen');
  var resultContent = $('resultContent');
  var scanStepText = $('scanStepText');

  function openResultModal() {
    closeWalletModal();
    if (resultModal) resultModal.classList.add('is-open');
  }

  function closeResultModal() {
    if (resultModal) resultModal.classList.remove('is-open');
  }

  if (btnCloseResult) {
    btnCloseResult.addEventListener('click', closeResultModal);
  }

  function getWalletData(address) {
    var demos = (C.demoWallets) || {};
    var trimmed = address.trim();

    // Direct match by key
    for (var k in demos) {
      if (demos[k].address && demos[k].address.toLowerCase() === trimmed.toLowerCase()) {
        return demos[k];
      }
    }

    // Check if ends with INELIGIBLE or contains 0 trades
    if (trimmed.toUpperCase().indexOf('INELIGIBLE') !== -1 || trimmed === '5kR8sT1uV2wX3yZ4aB5cD6eF7gH8jKmN') {
      return {
        address: trimmed,
        eligible: false,
        reason: "No buy or sell transactions detected on StonkFun-launched tokens before the snapshot.",
        advice: "Holding alone does not qualify — only wallets with verified trade history are eligible for this reward pool."
      };
    }

    // If random address provided, generate deterministic realistic data
    var charSum = 0;
    for (var i = 0; i < trimmed.length; i++) {
      charSum += trimmed.charCodeAt(i);
    }
    var isEligible = (charSum % 7 !== 0); // ~85% eligible

    if (!isEligible) {
      return {
        address: trimmed,
        eligible: false,
        reason: "No buy or sell transactions detected on StonkFun-launched tokens before the snapshot.",
        advice: "Holding alone does not qualify — only wallets with verified trade history are eligible for this reward pool."
      };
    }

    var tokens = 3 + (charSum % 15);
    var volume = 1200 + (charSum * 43) % 45000;
    var rewardUsd = Math.round((volume * 0.045 + 150) * 100) / 100;
    var rewardTokens = Math.round(rewardUsd * 3.3);

    return {
      address: trimmed,
      eligible: true,
      tier: volume > 20000 ? "Tier 1 (Top 5%)" : volume > 5000 ? "Tier 2 (Active Trader)" : "Tier 3 (Trader)",
      tokensTraded: tokens,
      totalVolume: "$" + volume.toLocaleString('en-US'),
      rewardUsd: "$" + rewardUsd.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      rewardTokens: rewardTokens.toLocaleString('en-US') + " $STONK",
      txCount: Math.round(tokens * 2.8),
      multiplier: volume > 20000 ? "2.0x" : volume > 5000 ? "1.4x" : "1.0x",
      sybilCheck: "Passed ✓"
    };
  }

  function runEligibilityCheck(address) {
    if (!address) {
      openWalletModal();
      return;
    }

    openResultModal();

    // Show scanner screen
    if (scanScreen) scanScreen.style.display = 'block';
    if (resultContent) resultContent.style.display = 'none';

    var steps = [
      'Connecting to Solana RPC cluster...',
      'Scanning DEX trade history on StonkFun launches...',
      'Verifying buy & sell volume (holding excluded)...',
      'Filtering wash-trading & calculating allocation...'
    ];

    var stepIndex = 0;
    var interval = setInterval(function () {
      stepIndex++;
      if (stepIndex < steps.length && scanStepText) {
        scanStepText.textContent = steps[stepIndex];
      } else {
        clearInterval(interval);
        displayResult(getWalletData(address));
      }
    }, 450);
  }

  function displayResult(data) {
    if (scanScreen) scanScreen.style.display = 'none';
    if (resultContent) resultContent.style.display = 'block';

    var dispAddr = $('resultWalletDisplay');
    if (dispAddr) dispAddr.textContent = truncateAddress(data.address);

    var eligibleView = $('eligibleView');
    var ineligibleView = $('ineligibleView');

    if (data.eligible) {
      if (eligibleView) eligibleView.style.display = 'block';
      if (ineligibleView) ineligibleView.style.display = 'none';

      if ($('resRewardUsd')) $('resRewardUsd').textContent = data.rewardUsd;
      if ($('resRewardTokens')) $('resRewardTokens').textContent = data.rewardTokens;
      if ($('resTier')) $('resTier').textContent = data.tier;
      if ($('resTokensTraded')) $('resTokensTraded').textContent = data.tokensTraded + ' tokens';
      if ($('resVolume')) $('resVolume').textContent = data.totalVolume;
      if ($('resTxCount')) $('resTxCount').textContent = data.txCount;
      if ($('resMultiplier')) $('resMultiplier').textContent = data.multiplier;

      // Reset claim button if not claimed
      var btnClaim = $('btnClaimReward');
      if (btnClaim) {
        btnClaim.disabled = false;
        btnClaim.textContent = 'Claim Reward';
        btnClaim.style.opacity = '1';
      }
    } else {
      if (eligibleView) eligibleView.style.display = 'none';
      if (ineligibleView) ineligibleView.style.display = 'block';

      if ($('ineligibleReason') && data.reason) $('ineligibleReason').textContent = data.reason;
      if ($('ineligibleAdvice') && data.advice) $('ineligibleAdvice').textContent = data.advice;
    }
  }

  // Main CTA button "Check my eligibility"
  var btnMainCheck = $('btnCheckEligibility');
  if (btnMainCheck) {
    btnMainCheck.addEventListener('click', function () {
      if (state.connectedWallet) {
        runEligibilityCheck(state.connectedWallet);
      } else {
        openWalletModal();
      }
    });
  }

  // Address form submit
  var addressForm = $('addressForm');
  if (addressForm) {
    addressForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('inputWalletAddress');
      var val = input ? input.value.trim() : '';
      if (!val) {
        showToast('Please enter a Solana wallet address');
        return;
      }
      runEligibilityCheck(val);
    });
  }

  // Quick Demo Presets
  $$('[data-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-demo');
      var demos = C.demoWallets || {};
      for (var k in demos) {
        if (k.indexOf(type) !== -1) {
          var w = demos[k];
          runEligibilityCheck(w.address);
          return;
        }
      }
    });
  });

  // Check Another Wallet button
  var btnCheckAnother = $('btnCheckAnother');
  if (btnCheckAnother) {
    btnCheckAnother.addEventListener('click', function () {
      closeResultModal();
      setTimeout(openWalletModal, 200);
    });
  }

  // Claim Reward button
  var btnClaim = $('btnClaimReward');
  if (btnClaim) {
    btnClaim.addEventListener('click', function () {
      btnClaim.disabled = true;
      btnClaim.textContent = 'Claiming...';
      btnClaim.style.opacity = '0.7';

      setTimeout(function () {
        btnClaim.textContent = 'Claimed ✓';
        btnClaim.style.background = '#34D399';
        btnClaim.style.color = '#062817';
        btnClaim.style.opacity = '1';

        launchConfetti();
        showToast('Reward claimed successfully! Tokens queued for distribution.');
      }, 900);
    });
  }

  // Share on X button
  var btnShare = $('btnShareX');
  if (btnShare) {
    btnShare.addEventListener('click', function () {
      var text = encodeURIComponent('Just verified my allocation for the $1,000,000 @StonkFun Trader Reward Pool! 🚀 Check if your trading history qualifies:');
      var url = encodeURIComponent(window.location.href);
      window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'noopener,noreferrer');
    });
  }

  // ESC key to close all modals
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeWalletModal();
      closeResultModal();
      closeWalletMenu();
    }
  });

  // Click on modal backdrop to close
  [walletModal, resultModal].forEach(function (m) {
    if (m) {
      m.addEventListener('click', function (e) {
        if (e.target === m) {
          closeWalletModal();
          closeResultModal();
        }
      });
    }
  });

  /* ============================================================
     5. CONFETTI CELEBRATION ENGINE
     ============================================================ */
  function launchConfetti() {
    var canvas = $('confettiCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var W = (canvas.width = window.innerWidth);
    var H = (canvas.height = window.innerHeight);

    var count = 90;
    var particles = [];
    var colors = ['#67B7ED', '#7DC4F4', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#FFFFFF'];

    for (var i = 0; i < count; i++) {
      particles.push({
        x: W / 2,
        y: H / 2,
        w: 7 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 20 - 4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    var animId;
    function render() {
      ctx.clearRect(0, 0, W, H);
      var alive = false;

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0 && p.y < H + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (alive) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, W, H);
        cancelAnimationFrame(animId);
      }
    }

    render();
  }

  // Handle window resize for confetti canvas
  window.addEventListener('resize', function () {
    var canvas = $('confettiCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  /* ============================================================
     6. BOOTSTRAP
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initConfigData();
  });

})();
