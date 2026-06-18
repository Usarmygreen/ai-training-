// ============================================================
// AI Training Hub — Shared JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ───────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Mobile nav toggle ──────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      // Animate hamburger → X
      const spans = navToggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      }
    });
  }

  // ── Active nav link ────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll-triggered animations ───────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ── Counter animation for stats ────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const start    = performance.now();
    const update   = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

  // ── Floating particle canvas (hero pages only) ─────────────
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '252,238,10' : '0,240,255',
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ── Policy accordion ───────────────────────────────────────
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen  = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-content').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ── Card spotlight movement effect ────────────────────────
  document.addEventListener('mousemove', e => {
    const cards = document.querySelectorAll('.card, .level-card, .tool-card, .ecosystem-card, .case-study-card, .pb-output-box, .terminal');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ── Prompt Builder composer ──────────────────────────────
  const pbPersona = document.getElementById('pbPersona');
  const pbContext = document.getElementById('pbContext');
  const pbTask = document.getElementById('pbTask');
  const pbFormat = document.getElementById('pbFormat');
  const pbDetails = document.getElementById('pbDetails');
  const pbText = document.getElementById('pbText');
  const pbCopy = document.getElementById('pbCopy');

  if (pbPersona && pbContext && pbTask && pbFormat && pbText && pbCopy) {
    const updatePrompt = () => {
      const p = pbPersona.value;
      const c = pbContext.value;
      const t = pbTask.value;
      const f = pbFormat.value;
      const d = pbDetails.value.trim();

      let prompt = `Act as ${p}.\n\n`;
      prompt += `Context: ${c}.`;
      if (d) {
        prompt += ` Additional details: ${d}`;
      }
      prompt += `\n\nTask: ${t}.\n\n`;
      prompt += `Response Format: ${f}.`;

      pbText.textContent = prompt;
    };

    [pbPersona, pbContext, pbTask, pbFormat, pbDetails].forEach(el => {
      el.addEventListener('change', updatePrompt);
      el.addEventListener('input', updatePrompt);
    });

    pbCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(pbText.textContent).then(() => {
        const originalText = pbCopy.textContent;
        pbCopy.textContent = '✓ Copied!';
        pbCopy.style.background = 'var(--green)';
        pbCopy.style.borderColor = 'var(--green)';
        pbCopy.style.color = '#fff';
        setTimeout(() => {
          pbCopy.textContent = originalText;
          pbCopy.style.background = '';
          pbCopy.style.borderColor = '';
          pbCopy.style.color = '';
        }, 2000);
      });
    });

    updatePrompt(); // initialize
  }

  // ── Terminal Simulator typing effect ────────────────────────
  document.querySelectorAll('.terminal').forEach(term => {
    const diagBtn = term.querySelector('.term-btn-diag');
    const fixBtn = term.querySelector('.term-btn-fix');
    const termBody = term.querySelector('.terminal-body');

    if (termBody) {
      const runTerminalAnimation = async (lines, isFix) => {
        termBody.innerHTML = '';
        termBody.classList.add('term-typing');
        
        if (diagBtn) diagBtn.disabled = true;
        if (fixBtn) fixBtn.disabled = true;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const div = document.createElement('div');
          div.className = 'term-line ' + (line.className || '');
          termBody.appendChild(div);

          if (line.isCmd) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 't-prompt';
            promptSpan.textContent = 'PS C:\\> ';
            div.appendChild(promptSpan);

            const cmdSpan = document.createElement('span');
            cmdSpan.className = 't-cmd';
            div.appendChild(cmdSpan);

            await typeText(cmdSpan, line.text, 35);
          } else {
            div.innerHTML = line.text;
          }
          await sleep(line.delay || 250);
        }

        termBody.classList.remove('term-typing');
        if (diagBtn) diagBtn.disabled = false;
        if (fixBtn) fixBtn.disabled = false;
      };

      const typeText = (element, text, speed) => {
        return new Promise(resolve => {
          let i = 0;
          const typing = setInterval(() => {
            if (i < text.length) {
              element.textContent += text.charAt(i);
              i++;
            } else {
              clearInterval(typing);
              resolve();
            }
          }, speed);
        });
      };

      const sleep = (ms) => new Promise(r => setTimeout(r, ms));

      if (diagBtn) {
        diagBtn.addEventListener('click', () => {
          const termId = term.id;
          let script = [];
          if (termId === 'act1-term') {
            script = [
              { isCmd: true, text: 'Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-30)} -Properties LastLogonDate | Disable-ADAccount', delay: 400 },
              { text: '<span class="t-err">Get-ADUser : Error parsing query: \'LastLogonDate -lt ...\' Error Message: \'Property \'LastLogonDate\' is not filterable.\'</span>', delay: 300 },
              { text: '<span class="t-err">At line:1 char:1</span>', delay: 100 },
              { text: '<span class="t-err">+ Get-ADUser -Filter {LastLogonDate -lt (Get-Date).AddDays(-30)} ...</span>', delay: 100 },
              { text: '<span class="t-err">+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>', delay: 100 },
              { text: '<span class="t-err">    + CategoryInfo          : InvalidArgument: (:) [Get-ADUser], ArgumentException</span>', delay: 100 },
              { text: '<span class="t-err">    + FullyQualifiedErrorId : ActiveDirectoryCmdlet:Microsoft.ActiveDirectory.Management.Commands.GetADUser</span>', delay: 400 },
              { text: '<span class="t-warn"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL CRASH: Script halted. No accounts disabled.</span>', delay: 600 }
            ];
          } else if (termId === 'act2-term') {
            script = [
              { isCmd: true, text: 'sudo nvram -c ; sudo pmset -c smc', delay: 500 },
              { text: '<span class="t-comment">Password: **********</span>', delay: 400 },
              { text: '<span class="t-err">nvram: Error resetting variables: (iokit/common) not permitted</span>', delay: 300 },
              { text: '<span class="t-err">pmset: SMC reset command not recognized on Apple Silicon platforms.</span>', delay: 300 },
              { text: '<span class="t-comment">Checking hardware identifier...</span>', delay: 400 },
              { text: '<span class="t-warn">Apple M2 MacBook Pro detected. SMC/NVRAM resets are deprecated on Apple Silicon.</span>', delay: 600 }
            ];
          } else if (termId === 'act3-term') {
            script = [
              { isCmd: true, text: 'bcdedit /set {default} safeboot minimal', delay: 450 },
              { text: '<span class="t-err">An error occurred while attempting to reference the specified entry.</span>', delay: 300 },
              { text: '<span class="t-err">The system cannot find the file specified.</span>', delay: 200 },
              { text: '<span class="t-comment">Checking BCD store...</span>', delay: 400 },
              { text: '<span class="t-warn">Warning: UEFI secure boot enabled. Fast startup bypasses F8 sequence.</span>', delay: 500 },
              { text: '<span class="t-err">Safe Mode sequence failed. PC booted in Normal mode.</span>', delay: 600 }
            ];
          } else if (termId === 'act4-term') {
            script = [
              { isCmd: true, text: 'Resolve-DnsName -Name internalserver.corp -Server 157.58.0.0', delay: 450 },
              { text: '<span class="t-comment">Resolving internalserver.corp via DNS resolver 157.58.0.0...</span>', delay: 600 },
              { text: '<span class="t-err">Resolve-DnsName : internalserver.corp : DNS server failure</span>', delay: 300 },
              { text: '<span class="t-err">Error: DNS query timed out (157.58.0.0 is unreachable on Port 53).</span>', delay: 400 }
            ];
          }
          runTerminalAnimation(script, false);
        });
      }

      if (fixBtn) {
        fixBtn.addEventListener('click', () => {
          const termId = term.id;
          let script = [];
          if (termId === 'act1-term') {
            script = [
              { isCmd: true, text: '$cutoff = (Get-Date).AddDays(-30); Get-ADUser -Filter {Enabled -eq $true} -Properties LastLogonDate | Where-Object {$_.LastLogonDate -lt $cutoff -and $_.LastLogonDate -ne $null} | Disable-ADAccount -WhatIf', delay: 500 },
              { text: '<span class="t-good">WhatIf: Performing operation "Disable-ADAccount" on target "CN=John Doe,OU=Users,DC=company,DC=com".</span>', delay: 200 },
              { text: '<span class="t-good">WhatIf: Performing operation "Disable-ADAccount" on target "CN=Test Account,OU=Users,DC=company,DC=com".</span>', delay: 200 },
              { text: '<span class="t-good">WhatIf: Performing operation "Disable-ADAccount" on target "CN=Stale Service,OU=ServiceAccounts,DC=company,DC=com".</span>', delay: 200 },
              { text: '<span class="t-good">Audit complete: 3 accounts identified for disabling. No changes applied (WhatIf enabled).</span>', delay: 500 }
            ];
          } else if (termId === 'act2-term') {
            script = [
              { isCmd: true, text: 'rm -f ~/Library/Preferences/com.apple.Bluetooth.plist ; sudo killall -9 bluetoothd', delay: 400 },
              { text: '<span class="t-comment">Removing Bluetooth system configuration file...</span>', delay: 300 },
              { text: '<span class="t-comment">Restarting bluetooth daemon...</span>', delay: 300 },
              { text: '<span class="t-good">Bluetooth daemon restarted successfully. plist file regenerated.</span>', delay: 300 },
              { text: '<span class="t-good">Bluetooth adapter online. Paired devices re-registered.</span>', delay: 500 }
            ];
          } else if (termId === 'act3-term') {
            script = [
              { isCmd: true, text: 'shutdown /r /o /f /t 00', delay: 400 },
              { text: '<span class="t-comment">Initiating system shutdown for Recovery Options boot menu...</span>', delay: 300 },
              { text: '<span class="t-good">PowerState: RESTART_RECOVERY_ENGAGED</span>', delay: 350 },
              { text: '<span class="t-good">System rebooting to Windows Recovery Environment (WinRE)...</span>', delay: 500 }
            ];
          } else if (termId === 'act4-term') {
            script = [
              { isCmd: true, text: '$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}; Get-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex', delay: 400 },
              { text: '<span class="t-comment">InterfaceIndex  InterfaceAlias  AddressFamily  ServerAddresses</span>', delay: 150 },
              { text: '12              Ethernet        IPv4           {10.0.0.10, 10.0.0.11}', delay: 200 },
              { isCmd: true, text: 'Resolve-DnsName -Name internalserver.corp -Server 10.0.0.10', delay: 400 },
              { text: '<span class="t-comment">Name                  Type   TTL   Section    IPAddress</span>', delay: 100 },
              { text: 'internalserver.corp   A      3600  Answer     10.0.0.55', delay: 200 },
              { text: '<span class="t-good">DNS name resolved successfully. Connection verified on port 53.</span>', delay: 500 }
            ];
          }
          runTerminalAnimation(script, true);
        });
      }
    }
  });

  // ── Policy Matrix Validator ────────────────────────────────
  const pmRole = document.getElementById('pmRole');
  const pmData = document.getElementById('pmData');
  const pmBox = document.getElementById('pmVerdictBox');

  if (pmRole && pmData && pmBox) {
    const updateVerdict = () => {
      const role = pmRole.value;
      const data = pmData.value;
      
      pmBox.className = 'verdict-box'; // reset
      
      if (role === 'l1') {
        if (data === 'public') {
          pmBox.classList.add('verdict-approved');
          pmBox.innerHTML = `
            <div class="verdict-icon">✅</div>
            <div>
              <div class="verdict-title">APPROVED (Atlassian Rovo)</div>
              <div class="verdict-desc">As a New L1 employee, you are approved to process public syntax questions, generic PowerShell inquiries, and sanitized error logs using <strong>Atlassian Rovo</strong>. Consumer AI (free ChatGPT/Claude) remains blocked for all work tasks.</div>
            </div>
          `;
        } else if (data === 'restricted') {
          pmBox.classList.add('verdict-warn');
          pmBox.innerHTML = `
            <div class="verdict-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div>
              <div class="verdict-title">SANETIZE & USE ROVO ONLY</div>
              <div class="verdict-desc">Approved for processing inside <strong>Atlassian Rovo</strong>. However, you must first sanitize the input. Replace internal server hostnames, specific subnet IDs, and paths with placeholders. Do not use external tools.</div>
            </div>
          `;
        } else {
          pmBox.classList.add('verdict-blocked');
          pmBox.innerHTML = `
            <div class="verdict-icon">❌</div>
            <div>
              <div class="verdict-title">CRITICAL: INPUT BLOCKED</div>
              <div class="verdict-desc"><strong>DO NOT USE:</strong> Never input customer names, emails, credentials, private keys, contracts, or internal financials into any AI tool (including Rovo). If sensitive data is input accidentally, notify security immediately.</div>
            </div>
          `;
        }
      } else {
        // Senior L1 / L2+
        if (data === 'public') {
          pmBox.classList.add('verdict-approved');
          pmBox.innerHTML = `
            <div class="verdict-icon">✅</div>
            <div>
              <div class="verdict-title">APPROVED (Any Tool)</div>
              <div class="verdict-desc">You are approved to use Rovo, Claude, or Gemini for general inquiries and public error logs. Ensure all generated cmdlets, routes, or configurations are vetted against official docs before deployment.</div>
            </div>
          `;
        } else if (data === 'restricted') {
          pmBox.classList.add('verdict-warn');
          pmBox.innerHTML = `
            <div class="verdict-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div>
              <div class="verdict-title">SANETIZE FIRST & VET OUTPUT</div>
              <div class="verdict-desc">Approved for use on Claude, Gemini, or Rovo, but <strong>strict sanitization is required</strong>. Strip all specific network IPs, server hostnames, AD domains, and passwords. Verify PowerShell cmdlets on Microsoft Learn.</div>
            </div>
          `;
        } else {
          pmBox.classList.add('verdict-blocked');
          pmBox.innerHTML = `
            <div class="verdict-icon">❌</div>
            <div>
              <div class="verdict-title">CRITICAL: INPUT BLOCKED</div>
              <div class="verdict-desc"><strong>DO NOT USE:</strong> Never input customer PII, client contract specifics, proprietary credentials, internal budgets, or trade secrets into consumer AI tools. Public cloud logs show these queries are leaked easily.</div>
            </div>
          `;
        }
      }
    };

    pmRole.addEventListener('change', updateVerdict);
    pmData.addEventListener('change', updateVerdict);
    updateVerdict(); // initialize
  }

});


