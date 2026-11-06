// Pixel Cyberpunk Interactive Script - Angga Irham
document.addEventListener('DOMContentLoaded', () => {
  // 1. 8-Bit Retro Audio Synthesizer (Instant 1-Click Sync & Clean Autoplay Handling)
  let audioContext = null;

  const getAudioContext = () => {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  };
  const initAudio = getAudioContext;

  const unlockAudioOnGesture = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };
  ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, unlockAudioOnGesture, { once: true, passive: true });
  });

  const playRetroSound = (type = 'click') => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'toast') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
        return;
      }

      osc.type = 'square';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio fallback
    }
  };


  // 2. Theme Management (DEFAULT: DARK MODE)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark'; // Strict Default: Dark Mode
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  };

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      initAudio();
      playRetroSound('click');
      const current = htmlElement.classList.contains('light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      initAudio();
      playRetroSound('click');
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 4. Retro Terminal Console Tabs
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const terminalOutput = document.getElementById('terminal-content');

  const terminalData = {
    overview: `
<span class="text-emerald-400 font-bold font-pixel">> SYSTEM_TOPOLOGY</span>
[VIRTUALIZATION] : Proxmox VE (KVM & LXC)
[WEB SERVERS]    : Nginx Proxy • Apache • SSL
[CACHING LAYER]  : Redis In-Memory Service
[DATABASE CORE]  : MariaDB & PostgreSQL 16
[OS PLATFORMS]   : Linux (Debian & Ubuntu)
[PAYMENTS]       : Multi-Bank Virtual Accounts
`.trim(),

    services: `
<span class="text-emerald-400 font-bold font-pixel">> ACTIVE_SERVICES</span>
• NGINX PROXY    : [ONLINE] SSL & Load Balancing
• PROXMOX VE     : [ONLINE] VMs & LXC Containers
• DB REPLICATION : [ONLINE] MariaDB & PostgreSQL 16
• APP ENGINES    : [ONLINE] Laravel, CI3 & Vue 3
• SECURITY/OPS   : [ACTIVE] SSH Keys & CI Pipelines
`.trim(),

    stack: `
<span class="text-emerald-400 font-bold font-pixel">> TECH_STACK</span>
[SYSADMIN/INFRA] : Proxmox VE, Linux, Nginx, Redis
[DATABASE CORE]  : MariaDB Replication, PostgreSQL 16
[BACKEND DEV]    : PHP, Laravel, CI3, REST APIs
[FRONTEND UI]    : Vue 3, TypeScript, Inertia, Tailwind
[TESTING/TOOLS]  : PHPUnit, Vitest, Git, GitLab
`.trim()
  };

  terminalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      initAudio();
      playRetroSound('click');
      terminalTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-tab');
      if (terminalOutput && terminalData[key]) {
        terminalOutput.innerHTML = terminalData[key];
      }
    });
  });

  // 5. Project Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudio();
      playRetroSound('click');
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
        } else {
          card.classList.add('hidden');
          card.style.opacity = '0';
        }
      });
    });
  });

  // 6. Toast & Clipboard Copy with Retro Sound
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toastNotice = document.getElementById('toast-notice');

  const showToast = (message) => {
    if (!toastNotice) return;
    initAudio();
    playRetroSound('toast');
    toastNotice.querySelector('.toast-text').textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'anggairham08@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('EMAIL COPIED: anggairham08@gmail.com');
      }).catch(() => {
        showToast('EMAIL: anggairham08@gmail.com');
      });
    });
  }

  // 7. Smooth Scroll Navbar Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((sec) => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('text-cyan-400', 'font-bold');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('text-cyan-400', 'font-bold');
          }
        });
      }
    });
  }, { passive: true });

});
