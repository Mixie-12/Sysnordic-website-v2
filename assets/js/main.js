/* Sysnordic UI micro-interactions:
   - Interactive terminal with command execution
   - Reveal on scroll
   - Smooth scroll for in-page anchors
   - Sticky navbar with scroll effects
*/

(function(){
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if(navbar) {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", (e)=>{
      const id = a.getAttribute("href");
      if(!id || id === "#") return;
      const el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior: prefersReduced ? "auto" : "smooth", block:"start"});
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add("show");
    });
  }, {threshold: 0.18});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

  // ===== Interactive Terminal System =====
  const target = document.getElementById("terminalText");
  if(!target) return;

  const commandOutputs = {
    init: [
      "sysnordic@oslo:~$ init --soc-as-a-service",
      "[ ok ] 24/7 overvåking • deteksjon • respons",
      "[ ok ] Incident Response & beredskap",
      "[ ok ] Digital etterforskning / forensics",
      "[ ok ] Compliance: NSM • NIS2 • ISO/IEC 27001",
      "",
      "Status: KLAR — vi bygger motstandsdyktige virksomheter."
    ],
    scan: [
      "sysnordic@oslo:~$ scan",
      "Initiating security scan...",
      "[ ████████░░░░░░░░░░░░ ] 35%",
      "[ ████████████░░░░░░░░ ] 62%",
      "[ ████████████████████ ] 100%",
      "",
      "✓ 847 endpoints scanned",
      "✓ 23 vulnerabilities detected (3 critical, 8 high, 12 medium)",
      "✓ 156 compliance checks passed",
      "! 4 anomalies flagged for review",
      "",
      "Next: Run 'compliance --status' or 'alerts --last 24h'"
    ],
    compliance: [
      "sysnordic@oslo:~$ compliance --status",
      "Fetching compliance status...",
      "",
      "━━━ Compliance Overview ━━━",
      "NSM Grunnprinsipper:    ████████░░ 85% [GOOD]",
      "NIS2 Directive:         ██████░░░░ 78% [IN PROGRESS]",
      "ISO/IEC 27001:2022:     █████████░ 92% [EXCELLENT]",
      "GDPR/DPIA:              ██████████ 98% [EXCELLENT]",
      "",
      "⚠ 3 controls require attention",
      "✓ Documentation: 94% complete",
      "✓ Next audit: Ready",
      "",
      "Run 'report --generate' for detailed compliance report"
    ],
    alerts: [
      "sysnordic@oslo:~$ alerts --last 24h",
      "Querying SIEM for last 24 hours...",
      "",
      "━━━ Security Alerts (Last 24h) ━━━",
      "",
      "[CRITICAL] 2024-12-25 14:32:18",
      "  Multiple failed auth attempts detected",
      "  Source: 203.0.113.42 → corporate-vpn",
      "  Action: IP blocked, IR team notified",
      "",
      "[HIGH] 2024-12-25 09:15:03",
      "  Unusual data exfiltration pattern",
      "  Host: workstation-247",
      "  Action: Quarantined, forensics initiated",
      "",
      "[MEDIUM] 2024-12-25 06:08:51",
      "  Outdated SSL certificate detected",
      "  Service: api.internal.corp",
      "  Action: Ticket created for renewal",
      "",
      "Total alerts: 47 (2 critical, 8 high, 37 medium)",
      "Mean time to detection: 4.2 minutes",
      "Mean time to response: 12.8 minutes"
    ],
    report: [
      "sysnordic@oslo:~$ report --generate",
      "Generating comprehensive security report...",
      "",
      "[ ████░░░░░░░░░░░░░░░░ ] Collecting data...",
      "[ ████████░░░░░░░░░░░░ ] Analyzing incidents...",
      "[ ████████████░░░░░░░░ ] Mapping compliance...",
      "[ ████████████████░░░░ ] Generating visualizations...",
      "[ ████████████████████ ] Finalizing report...",
      "",
      "━━━ Report Generated ━━━",
      "📊 Executive Summary: ready",
      "🔍 Technical Details: ready",
      "📋 Compliance Mapping: ready",
      "📈 KPI Dashboard: ready",
      "🎯 Recommendations: ready",
      "",
      "✓ Report saved: /reports/security-report-2024-12-25.pdf",
      "✓ Audit trail: complete",
      "✓ Evidence package: packaged",
      "",
      "Report ready for stakeholder review."
    ]
  };

  let currentCommand = 'init';
  let isTyping = false;
  let typingTimeout = null;

  // Typing animation
  function typeText(lines, callback) {
    if(prefersReduced) {
      target.textContent = lines.join("\n");
      if(callback) callback();
      return;
    }

    isTyping = true;
    target.textContent = '';
    let lineIndex = 0, charIndex = 0;
    const minSpeed = 15;
    const maxSpeed = 45;
    const lineDelay = 120;

    function getRandomSpeed() {
      return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
    }

    function shouldPause() {
      return Math.random() < 0.06;
    }

    function tick(){
      if(lineIndex >= lines.length) {
        isTyping = false;
        if(callback) callback();
        return;
      }
      
      const line = lines[lineIndex];
      
      if(charIndex === 0 && lineIndex > 0) {
        typingTimeout = setTimeout(tick, lineDelay);
        return;
      }
      
      if(charIndex < line.length) {
        target.textContent += line.charAt(charIndex);
        charIndex++;
        const delay = shouldPause() ? 180 : getRandomSpeed();
        typingTimeout = setTimeout(tick, delay);
      } else {
        target.textContent += "\n";
        lineIndex++;
        charIndex = 0;
        typingTimeout = setTimeout(tick, lineDelay);
      }
    }
    
    setTimeout(tick, 200);
  }

  // Run command
  function runCommand(cmd) {
    if(isTyping) {
      clearTimeout(typingTimeout);
      isTyping = false;
    }
    
    currentCommand = cmd;
    const output = commandOutputs[cmd] || commandOutputs.init;
    typeText(output);
  }

  // Initial run
  setTimeout(() => runCommand('init'), 400);

  // Command buttons
  document.querySelectorAll('.terminal-cmd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-cmd');
      runCommand(cmd);
    });
  });

  // Copy button
  const copyBtn = document.getElementById('terminalCopy');
  if(copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = target.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    });
  }

  // Rerun button
  const rerunBtn = document.getElementById('terminalRerun');
  if(rerunBtn) {
    rerunBtn.addEventListener('click', () => {
      runCommand(currentCommand);
    });
  }

  // ===== Microinteractions: Card Tilt Effect =====
  if(!prefersReduced) {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ===== Animated Particle Network Background =====
  const canvas = document.getElementById('particleCanvas');
  if(canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Constants for particle system
    const PARTICLE_DENSITY_DIVISOR = 15000; // Particles per pixel area (lower = more dense)
    const MOUSE_INTERACTION_RADIUS = 150; // Pixels
    const CONNECTION_DISTANCE = 150; // Maximum distance to draw connections between particles
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if(this.x < 0) this.x = canvas.width;
        if(this.x > canvas.width) this.x = 0;
        if(this.y < 0) this.y = canvas.height;
        if(this.y > canvas.height) this.y = 0;
        
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if(distance < MOUSE_INTERACTION_RADIUS) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 0.5;
          this.y -= Math.sin(angle) * 0.5;
        }
      }
      
      draw() {
        ctx.fillStyle = 'rgba(100, 255, 218, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles based on screen size
    const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / PARTICLE_DENSITY_DIVISOR));
    for(let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Mouse tracking with parallax
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Draw connections between nearby particles
    function drawConnections() {
      for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if(distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.3;
            ctx.strokeStyle = `rgba(122, 167, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawConnections();
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // ===== Animated Counters =====
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * easeProgress;
      
      element.textContent = Math.floor(current * 10) / 10;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  }

  // Observe metric cards for animation
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valueEl = entry.target;
        const target = parseFloat(valueEl.getAttribute('data-target'));
        if (!valueEl.classList.contains('animated')) {
          valueEl.classList.add('animated');
          animateCounter(valueEl, target);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-value').forEach(el => {
    metricsObserver.observe(el);
  });

  // ===== Konami Code Easter Egg =====
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let incidentModeActive = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        toggleIncidentMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function toggleIncidentMode() {
    incidentModeActive = !incidentModeActive;
    
    if (incidentModeActive) {
      document.body.classList.add('incident-mode');
      
      // Run alert command in terminal
      const scanBtn = document.querySelector('[data-cmd="alerts"]');
      if (scanBtn) scanBtn.click();
      
      // Show notification
      showNotification('🚨 INCIDENT MODE ACTIVATED', 'Security alert simulation enabled');
    } else {
      document.body.classList.remove('incident-mode');
      
      // Reset to init
      const initBtn = document.querySelector('[data-cmd="scan"]');
      if (initBtn) {
        runCommand('init');
      }
      
      showNotification('✓ INCIDENT MODE DEACTIVATED', 'Normal operations resumed');
    }
  }

  function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'easter-egg-notification';
    notification.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== Interactive Timeline =====
  const timelineItems = document.querySelectorAll('.t-item.clickable');
  const timelineProgress = document.getElementById('timelineProgress');
  
  if (timelineItems.length > 0 && timelineProgress) {
    let currentStep = 0;
    
    function updateTimeline(step) {
      // Remove active class from all
      timelineItems.forEach(item => item.classList.remove('active'));
      
      // Add active class to clicked step
      if (step > 0 && step <= timelineItems.length) {
        timelineItems[step - 1].classList.add('active');
        currentStep = step;
        
        // Update progress bar
        const itemHeight = timelineItems[0].offsetHeight;
        const progressHeight = (step - 1) * itemHeight + (itemHeight / 2);
        timelineProgress.style.height = progressHeight + 'px';
      }
    }
    
    // Click handlers
    timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        updateTimeline(index + 1);
      });
    });
    
    // Auto-animate timeline on scroll into view
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && currentStep === 0) {
          // Animate through steps
          let step = 1;
          const interval = setInterval(() => {
            updateTimeline(step);
            step++;
            if (step > timelineItems.length) {
              clearInterval(interval);
            }
          }, 600);
        }
      });
    }, { threshold: 0.3 });
    
    if (timelineItems[0]) {
      timelineObserver.observe(timelineItems[0].closest('.timeline'));
    }
  }

  // ===== Magnetic Button Effect =====
  if(!prefersReduced) {
    const magneticButtons = document.querySelectorAll('.btn-glow, .btn-primary-cta');
    
    magneticButtons.forEach(btn => {
      btn.classList.add('magnetic');
      
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ===== Animate Metric Bars on Scroll =====
  const metricBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.metric-bar');
        bars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.opacity = '1';
            // Trigger reflow to restart animation
            void bar.offsetWidth;
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.case-study-card').forEach(card => {
    const bars = card.querySelectorAll('.metric-bar');
    bars.forEach(bar => bar.style.opacity = '0');
    metricBarsObserver.observe(card);
  });

})();
