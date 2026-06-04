/*
  script.js
  - initSnow(): tạo hạt tuyết dạng particle trên canvas
  - createFirework(x,y): pháo hoa burst khi click
  - spawnHeart(x,y): trái tim bay nhẹ
  - fadeInObserver: quan sát để fade-in khi cuộn
  - scrollReveal: hiệu ứng ẩn hiện phức tạp khi scroll
*/

(() => {
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  let snowParticles = [];
  let fireworks = [];
  let snowOn = true;
  const heartsArea = document.getElementById('hearts-area');
  const toggleSnowBtn = document.getElementById('toggle-snow');

  // Resize
  window.addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  });

  // Utils
  function rand(min, max){ return Math.random()*(max-min)+min }

  // --- Snow (simple particle system) ---
  function createSnow(count=160){
    snowParticles = [];
    for(let i=0;i<count;i++){
      snowParticles.push({
        x: rand(0, W),
        y: rand(-H, H),
        r: rand(0.8, 3.6),
        speed: rand(0.2, 1.2),
        angle: rand(0, Math.PI*2),
        swing: rand(0.2, 0.9),
        alpha: rand(0.3, 0.95)
      });
    }
  }

  function drawSnow(){
    ctx.save();
    for(const p of snowParticles){
      p.y += p.speed;
      p.x += Math.sin(p.angle) * p.swing;
      p.angle += 0.01;
      if(p.y > H + 10){ p.y = -10; p.x = rand(0,W) }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Fireworks (burst particles) ---
  function createFirework(x, y, color=null){
    const hue = color || `hsl(${Math.floor(rand(0,360))} 90% 60%)`;
    const count = Math.floor(rand(18,36));
    const particles = [];
    for(let i=0;i<count;i++){
      const angle = rand(0, Math.PI*2);
      const speed = rand(1.8, 6);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: rand(40, 90),
        age: 0,
        color: hue,
        size: rand(1.4, 3.6)
      });
    }
    fireworks.push({particles});
  }

  function drawFireworks(){
    for(let i=fireworks.length-1;i>=0;i--){
      const fw = fireworks[i];
      for(const p of fw.particles){
        p.age++;
        p.vy += 0.06; // gravity
        p.x += p.vx;
        p.y += p.vy;
        const t = Math.max(0, 1 - p.age / p.life);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.pow(t, 1.2);
        ctx.arc(p.x, p.y, p.size * t * 1.4, 0, Math.PI*2);
        ctx.fill();

        // trailing glow
        ctx.beginPath();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.pow(t, 2) * 0.25;
        ctx.arc(p.x, p.y, p.size * 5 * t, 0, Math.PI*2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      // remove finished
      if(fw.particles.every(p => p.age > p.life)) fireworks.splice(i,1);
    }
    ctx.globalAlpha = 1;
  }

  // --- Heart spawn (DOM, CSS animated) ---
  function spawnHeart(x, y){
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.style.left = (x - 14) + 'px';
    el.style.top = (y - 14) + 'px';
    heartsArea.appendChild(el);
    setTimeout(()=> el.remove(), 2400);
  }

  // Animation loop
  function animate(){
    ctx.clearRect(0,0,W,H);
    // dim background softly for motion blur effect
    ctx.fillStyle = 'rgba(4,8,20,0.18)';
    ctx.fillRect(0,0,W,H);

    if(snowOn) drawSnow();
    drawFireworks();
    requestAnimationFrame(animate);
  }

  // Initialize
  function initSnow(){
    createSnow(Math.floor(Math.max(100, (W*H)/5000)));
  }

  // Interaction
  document.addEventListener('click', (e)=>{
    // Prevent fireworks on card flips
    if(e.target.closest('.card')) return;
    
    // spawn fireworks at click
    createFirework(e.clientX, e.clientY);
    // spawn small hearts occasionally
    if(Math.random() > 0.5) spawnHeart(e.clientX, e.clientY);
  });

  toggleSnowBtn.addEventListener('click', (e)=>{
    e.stopPropagation(); // prevent firework on button click
    snowOn = !snowOn;
    toggleSnowBtn.textContent = snowOn ? 'Tắt Tuyết ❄️' : 'Bật Tuyết ❄️';
  });

  // Enhanced scroll reveal with Intersection Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: unobserve after reveal to improve performance
        // revealObserver.unobserve(entry.target);
      } else {
        // Re-hide when scrolling back up for re-animation effect
        entry.target.classList.remove('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe all scroll-reveal elements
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Add parallax effect on scroll for cards
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.card');
        const scrolled = window.pageYOffset;
        
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const offset = rect.top + scrolled;
          const speed = 0.05 * (index % 3 + 1);
          const yPos = -(scrolled - offset) * speed;
          
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            card.style.transform = `translateY(${yPos}px)`;
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });

  // Start
  initSnow();
  animate();

  // Expose some functions for debugging or further use
  window.createFirework = createFirework;
  window.initSnow = initSnow;
})();