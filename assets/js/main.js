/* Sysnordic UI micro-interactions:
   - Hero terminal typing (enhanced with realistic delays)
   - Reveal on scroll
   - Smooth scroll for in-page anchors
*/

(function(){
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Enhanced Terminal typing with realistic delays
  const target = document.getElementById("terminalText");
  if(!target) return;

  const lines = [
    "sysnordic@oslo:~$ init --soc-as-a-service",
    "[ ok ] 24/7 overvåking • deteksjon • respons",
    "[ ok ] Incident Response & beredskap",
    "[ ok ] Digital etterforskning / forensics",
    "[ ok ] Compliance: NSM • NIS2 • ISO/IEC 27001",
    "",
    "Status: KLAR — vi bygger motstandsdyktige virksomheter."
  ];

  if(prefersReduced){
    target.textContent = lines.join("\n");
    return;
  }

  let lineIndex = 0, charIndex = 0;
  const minSpeed = 25;  // ms - minimum typing speed
  const maxSpeed = 65;  // ms - maximum typing speed
  const lineDelay = 180; // ms - delay between lines

  // Random typing speed for more realistic feel
  function getRandomSpeed() {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
  }

  // Simulate occasional pauses (like thinking)
  function shouldPause() {
    return Math.random() < 0.08; // 8% chance of pause
  }

  function tick(){
    if(lineIndex >= lines.length) {
      // Terminal complete - could add a completion callback here
      return;
    }
    
    const line = lines[lineIndex];
    
    if(charIndex === 0 && lineIndex > 0) {
      // Small delay before starting a new line
      setTimeout(tick, lineDelay);
      return;
    }
    
    if(charIndex < line.length) {
      target.textContent += line.charAt(charIndex);
      charIndex++;
      
      // Occasional pause for realism
      const delay = shouldPause() ? 200 : getRandomSpeed();
      setTimeout(tick, delay);
    } else {
      // Line complete, move to next
      target.textContent += "\n";
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, lineDelay);
    }
  }
  
  // Small initial delay before starting
  setTimeout(tick, 400);
})();
