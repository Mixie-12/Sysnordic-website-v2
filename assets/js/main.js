/* Sysnordic UI micro-interactions:
   - Hero terminal typing
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

  // Terminal typing
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
  const speed = 18; // ms

  function tick(){
    if(lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    target.textContent += line.charAt(charIndex);
    charIndex++;
    if(charIndex > line.length){
      target.textContent += "\n";
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, 220);
      return;
    }
    setTimeout(tick, speed);
  }
  tick();
})();
