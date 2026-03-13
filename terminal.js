document.addEventListener('DOMContentLoaded', () => {

  // Blinking cursor on the last terminal
  const cursor = document.querySelector('.cursor-blink');
  if (cursor) {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 530);
  }

  // Typewriter effect for terminal lines - triggered on scroll into view
  const terminals = document.querySelectorAll('.terminal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateTerminal(entry.target);
      }
    });
  }, { threshold: 0.3 });

  terminals.forEach(term => observer.observe(term));

  function animateTerminal(terminal) {
    const body = terminal.querySelector('.terminal-body');
    const lines = body.querySelectorAll('.line');

    // Hide all lines initially
    lines.forEach(line => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(4px)';
      line.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    });

    // Reveal lines one by one
    let delay = 0;
    lines.forEach((line, i) => {
      const isPrompt = line.querySelector('.prompt');
      const isCmd = line.querySelector('.cmd');

      if (isPrompt && isCmd) {
        // Command lines appear faster, then the command "types"
        delay += 100;
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, delay);
        delay += 300;
      } else {
        // Output lines cascade in
        delay += 50;
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }

  // Matrix-style rain in the background (subtle)
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.03;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, columns, drops;

  function initMatrix() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const fontSize = 14;
    columns = Math.floor(w / fontSize);
    drops = Array(columns).fill(1);
  }

  initMatrix();
  window.addEventListener('resize', initMatrix);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  function drawMatrix() {
    ctx.fillStyle = 'rgba(22, 23, 24, 0.05)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#528937';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 14, drops[i] * 14);

      if (drops[i] * 14 > h && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  // Subtle green glow that follows scroll position
  const page = document.querySelector('.page');
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(82, 137, 55, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: top 0.3s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.top = e.clientY + 'px';
    glow.style.left = e.clientX + 'px';
  });
});
