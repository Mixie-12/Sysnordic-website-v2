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

  // Dynamic Terminal Emulator
  const terminalElement = document.getElementById("terminalText");
  if(!terminalElement) return;

  // If user prefers reduced motion, show static content
  if(prefersReduced){
    terminalElement.innerHTML = 
      '<div class="terminal_emulator__command">sysnordic@oslo:~$ init --soc-service</div>' +
      '<div class="terminal_emulator__response">[ ok ] SOC as a Service initialized</div>' +
      '<div class="terminal_emulator__response">[ ok ] 24/7 monitoring active</div>' +
      '<div class="terminal_emulator__response">[ ok ] Compliance frameworks loaded</div>';
    return;
  }

  var TerminalEmulator = {
    init: function(screen) {
      var inst = Object.create(this);
      inst.screen = screen;
      inst.createInput();
      return inst;
    },

    createInput: function() {
      var inputField = document.createElement('div');
      var inputWrap = document.createElement('div');
      
      inputField.className = 'terminal_emulator__field';
      inputField.innerHTML = '';
      inputWrap.appendChild(inputField);
      this.screen.appendChild(inputWrap);
      this.field = inputField;
      this.fieldwrap = inputWrap;
    },

    enterInput: function(input) {
      return new Promise((resolve, reject) => {
        var randomSpeed = (max, min) => { 
          return Math.random() * (max - min) + min; 
        }
        
        var speed = randomSpeed(70, 90);
        var i = 0;
        var str = '';
        var type = () => {
          str = str + input[i];
          this.field.innerHTML = str.replace(/ /g, '&nbsp;');
          i++;
          
          setTimeout(() => {
            if(i < input.length){
              if(i % 5 === 0) speed = randomSpeed(80, 120);
              type();
            } else {
              setTimeout(() => {
                resolve();
              }, 400);
            } 
          }, speed);
        };
        
        type();
      });
    },
    
    enterCommand: function() {
      return new Promise((resolve, reject) => {
        var resp = document.createElement('div');
        resp.className = 'terminal_emulator__command';
        resp.innerHTML = this.field.innerHTML;
        this.screen.insertBefore(resp, this.fieldwrap);
        
        this.field.innerHTML = '';
        resolve();
      });
    },

    enterResponse: function(response) {
      return new Promise((resolve, reject) => {
        var resp = document.createElement('div');
        resp.className = 'terminal_emulator__response';
        resp.innerHTML = response;
        this.screen.insertBefore(resp, this.fieldwrap);
        
        resolve();
      });
    },
    
    wait: function(time, busy) {
      busy = (busy === undefined) ? true : busy;
      return new Promise((resolve, reject) => {
        if (busy){
          this.field.classList.add('waiting');
        } else {
          this.field.classList.remove('waiting');
        }
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    
    reset: function() {
      return new Promise((resolve, reject) => {
        this.field.classList.remove('waiting');
        resolve();
      });
    },

    clear: function() {
      return new Promise((resolve, reject) => {
        // Remove all content except the input field wrapper
        while (this.screen.firstChild && this.screen.firstChild !== this.fieldwrap) {
          this.screen.removeChild(this.screen.firstChild);
        }
        this.field.innerHTML = '';
        this.field.classList.remove('waiting');
        resolve();
      });
    }
  };

  // Initialize terminal emulator
  var TE = TerminalEmulator.init(terminalElement);

  // Animation configuration
  var ANIMATION_PAUSE_DURATION = 3000; // Pause between animation loops (ms)

  // Define the animation sequence as a function
  function runTerminalAnimation() {
    TE.wait(1000, false)
      .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ init --soc-service'))
      .then(TE.enterCommand.bind(TE))
      .then(TE.enterResponse.bind(TE, '[ ok ] SOC as a Service initializing...'))
      .then(TE.wait.bind(TE, 1500))
      .then(TE.enterResponse.bind(TE, '[ ok ] Loading security frameworks'))
      .then(TE.wait.bind(TE, 600))
      .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;├─ NSM Grunnprinsipper'))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;├─ NIS2 Directive'))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;└─ ISO/IEC 27001'))
      .then(TE.wait.bind(TE, 800))
      .then(TE.enterResponse.bind(TE, '[ ok ] Compliance modules loaded'))
      .then(TE.wait.bind(TE, 1200, false))
      .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ start-monitoring --24x7'))
      .then(TE.enterCommand.bind(TE))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, 'Starting security operations center...'))
      .then(TE.wait.bind(TE, 1800))
      .then(TE.enterResponse.bind(TE, '[ ok ] SIEM integration active'))
      .then(TE.wait.bind(TE, 600))
      .then(TE.enterResponse.bind(TE, '[ ok ] EDR monitoring enabled'))
      .then(TE.wait.bind(TE, 600))
      .then(TE.enterResponse.bind(TE, '[ ok ] Threat detection online'))
      .then(TE.wait.bind(TE, 1200, false))
      .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ status'))
      .then(TE.enterCommand.bind(TE))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> System Status: <span style="color:#64ffda">OPERATIONAL</span>'))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> 24/7 Monitoring: <span style="color:#64ffda">ACTIVE</span>'))
      .then(TE.wait.bind(TE, 400))
      .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> Incident Response: <span style="color:#64ffda">READY</span>'))
      .then(TE.wait.bind(TE, 1000))
      .then(TE.enterResponse.bind(TE, ''))
      .then(TE.enterResponse.bind(TE, 'Vi bygger motstandsdyktige virksomheter.'))
      .then(TE.reset.bind(TE))
      .then(TE.wait.bind(TE, ANIMATION_PAUSE_DURATION, false))
      .then(TE.clear.bind(TE))
      .then(() => {
        // Use setTimeout to avoid stack overflow from recursive promises
        setTimeout(runTerminalAnimation, 0);
      });
  }

  // Start the animation loop
  runTerminalAnimation();
})();
