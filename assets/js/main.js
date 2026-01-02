/* Sysnordic UI micro-interactions:
   - Hero terminal typing (enhanced with realistic delays)
   - Reveal on scroll
   - Smooth scroll for in-page anchors
*/

(function(){
  // Ensure DOM is fully loaded before running
  function initializeApp() {
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener("click", function(e){
        var id = a.getAttribute("href");
        if(!id || id === "#") return;
        var el = document.querySelector(id);
        if(!el) return;
        e.preventDefault();
        el.scrollIntoView({behavior: prefersReduced ? "auto" : "smooth", block:"start"});
      });
    });

    // Reveal on scroll
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting) en.target.classList.add("show");
      });
    }, {threshold: 0.18});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});

    // Dynamic Terminal Emulator
    var terminalElement = document.getElementById("terminalText");
    if(!terminalElement) return;
    
    // Ensure the terminal's parent reveal element is visible immediately
    var terminalReveal = terminalElement.closest('.reveal');
    if(terminalReveal) {
      terminalReveal.classList.add('show');
    }

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

      /**
       * Types input text into the terminal field
       * @param {string} input - The full text to type (including prompt if present)
       * @param {boolean} skipPrompt - If true, instantly displays the prompt part (before '$ ') 
       *                                and only types the command. This simulates realistic 
       *                                terminal behavior where the prompt appears immediately.
       */
      enterInput: function(input, skipPrompt) {
        var self = this;
        return new Promise(function(resolve, reject) {
          if (skipPrompt) {
            // Skip the prompt part and only type the command
            var promptEnd = input.indexOf('$ ');
            if (promptEnd !== -1) {
              var prompt = input.substring(0, promptEnd + 2);
              var command = input.substring(promptEnd + 2);
              
              // Set prompt immediately
              self.field.innerHTML = prompt;
              
              // Type only the command part
              var randomSpeed = function(max, min) { 
                return Math.random() * (max - min) + min; 
              };
              
              var speed = randomSpeed(70, 90);
              var i = 0;
              var str = prompt;
              var type = function() {
                str = str + command[i];
                self.field.innerHTML = str.replace(/ /g, '&nbsp;');
                i++;
                
                setTimeout(function() {
                  if(i < command.length){
                    if(i % 5 === 0) speed = randomSpeed(80, 120);
                    type();
                  } else {
                    setTimeout(function() {
                      resolve();
                    }, 400);
                  } 
                }, speed);
              };
              
              type();
            } else {
              // No prompt found, type everything
              var randomSpeed = function(max, min) { 
                return Math.random() * (max - min) + min; 
              };
              
              var speed = randomSpeed(70, 90);
              var i = 0;
              var str = '';
              var type = function() {
                str = str + input[i];
                self.field.innerHTML = str.replace(/ /g, '&nbsp;');
                i++;
                
                setTimeout(function() {
                  if(i < input.length){
                    if(i % 5 === 0) speed = randomSpeed(80, 120);
                    type();
                  } else {
                    setTimeout(function() {
                      resolve();
                    }, 400);
                  } 
                }, speed);
              };
              
              type();
            }
          } else {
            // Original behavior - type everything
            var randomSpeed = function(max, min) { 
              return Math.random() * (max - min) + min; 
            };
            
            var speed = randomSpeed(70, 90);
            var i = 0;
            var str = '';
            var type = function() {
              str = str + input[i];
              self.field.innerHTML = str.replace(/ /g, '&nbsp;');
              i++;
              
              setTimeout(function() {
                if(i < input.length){
                  if(i % 5 === 0) speed = randomSpeed(80, 120);
                  type();
                } else {
                  setTimeout(function() {
                    resolve();
                  }, 400);
                } 
              }, speed);
            };
            
            type();
          }
        });
      },
      
      enterCommand: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var resp = document.createElement('div');
          resp.className = 'terminal_emulator__command';
          resp.innerHTML = self.field.innerHTML;
          self.screen.insertBefore(resp, self.fieldwrap);
          
          self.field.innerHTML = '';
          
          // Auto-scroll to follow the output
          self.scrollToBottom();
          
          resolve();
        });
      },

      enterResponse: function(response) {
        var self = this;
        return new Promise(function(resolve, reject) {
          var resp = document.createElement('div');
          resp.className = 'terminal_emulator__response';
          resp.innerHTML = response;
          self.screen.insertBefore(resp, self.fieldwrap);
          
          // Auto-scroll to follow the output
          self.scrollToBottom();
          
          resolve();
        });
      },
      
      wait: function(time, busy) {
        var self = this;
        busy = (busy === undefined) ? true : busy;
        return new Promise(function(resolve, reject) {
          if (busy){
            self.field.classList.add('waiting');
          } else {
            self.field.classList.remove('waiting');
          }
          setTimeout(function() {
            resolve();
          }, time);
        });
      },
      
      reset: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          self.field.classList.remove('waiting');
          resolve();
        });
      },

      clear: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          // Remove all content except the input field wrapper
          while (self.screen.firstChild && self.screen.firstChild !== self.fieldwrap) {
            self.screen.removeChild(self.screen.firstChild);
          }
          self.field.innerHTML = '';
          self.field.classList.remove('waiting');
          
          // Reset scroll position
          self.screen.parentElement.scrollTop = 0;
          
          resolve();
        });
      },
      
      scrollToBottom: function() {
        var self = this;
        // Auto-scroll to the bottom to follow output like a real terminal
        // Smooth scrolling behavior is handled by CSS scroll-behavior property
        var container = self.screen.parentElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }
    };

    // Initialize terminal emulator
    var TE = TerminalEmulator.init(terminalElement);

    // Animation configuration
    var ANIMATION_PAUSE_DURATION = 2500; // Pause between animation loops (ms)

    // Define the animation sequence as a function
    function runTerminalAnimation() {
      TE.wait(800, false)
        .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ init --soc-service', true))
        .then(TE.enterCommand.bind(TE))
        .then(TE.enterResponse.bind(TE, '[ ok ] SOC as a Service initializing...'))
        .then(TE.wait.bind(TE, 1200))
        .then(TE.enterResponse.bind(TE, '[ ok ] Loading security frameworks'))
        .then(TE.wait.bind(TE, 500))
        .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;├─ NSM Grunnprinsipper'))
        .then(TE.wait.bind(TE, 350))
        .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;├─ NIS2 Directive'))
        .then(TE.wait.bind(TE, 350))
        .then(TE.enterResponse.bind(TE, '&nbsp;&nbsp;&nbsp;&nbsp;└─ ISO/IEC 27001'))
        .then(TE.wait.bind(TE, 700))
        .then(TE.enterResponse.bind(TE, '[ ok ] Compliance modules loaded'))
        .then(TE.wait.bind(TE, 1000, false))
        .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ start-monitoring --24x7', true))
        .then(TE.enterCommand.bind(TE))
        .then(TE.wait.bind(TE, 300))
        .then(TE.enterResponse.bind(TE, 'Starting security operations center...'))
        .then(TE.wait.bind(TE, 1500))
        .then(TE.enterResponse.bind(TE, '[ ok ] SIEM integration active'))
        .then(TE.wait.bind(TE, 500))
        .then(TE.enterResponse.bind(TE, '[ ok ] EDR monitoring enabled'))
        .then(TE.wait.bind(TE, 500))
        .then(TE.enterResponse.bind(TE, '[ ok ] Threat detection online'))
        .then(TE.wait.bind(TE, 1000, false))
        .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ status', true))
        .then(TE.enterCommand.bind(TE))
        .then(TE.wait.bind(TE, 300))
        .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> System Status: <span style="color:#64ffda">OPERATIONAL</span>'))
        .then(TE.wait.bind(TE, 350))
        .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> 24/7 Monitoring: <span style="color:#64ffda">ACTIVE</span>'))
        .then(TE.wait.bind(TE, 350))
        .then(TE.enterResponse.bind(TE, '<span style="color:var(--accent)">●</span> Incident Response: <span style="color:#64ffda">READY</span>'))
        .then(TE.wait.bind(TE, 800))
        .then(TE.enterResponse.bind(TE, ''))
        .then(TE.enterResponse.bind(TE, 'Vi bygger motstandsdyktige virksomheter.'))
        .then(TE.reset.bind(TE))
        .then(TE.wait.bind(TE, ANIMATION_PAUSE_DURATION, false))
        .then(TE.enterInput.bind(TE, 'sysnordic@oslo:~$ clear', true))
        .then(TE.enterCommand.bind(TE))
        .then(TE.wait.bind(TE, 400))
        .then(TE.clear.bind(TE))
        .then(TE.wait.bind(TE, 300, false))
        .then(function() {
          // Use setTimeout to avoid stack overflow from recursive promises
          setTimeout(runTerminalAnimation, 0);
        });
    }

    // Start the animation loop
    runTerminalAnimation();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already ready
    initializeApp();
  }
})();
