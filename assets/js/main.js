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
        
        if(distance < 150) {
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
    
    // Create particles
    const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
    for(let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Mouse tracking with parallax
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Draw connections
    function drawConnections() {
      for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if(distance < 150) {
            const opacity = (1 - distance / 150) * 0.3;
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

})();
