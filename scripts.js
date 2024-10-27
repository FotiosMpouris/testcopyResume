// scripts.js

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* ===========================
   Matrix Effect using Canvas
   =========================== */
function initializeMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeMatrix();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Characters to display
    const chars = '守らリケーシタアプョン01{}#$@987';
    const fontSize = 16;
    let columns;
    let drops;

    function initializeMatrix() {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    // Draw characters
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)'; // Slight trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(0, 183, 255, 0.75)'; // Matrix color
        ctx.font = `${fontSize}px Courier New`;

        for(let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if(drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }

        requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
}

/* ===========================
   Profile Stats Functions
   =========================== */
function initializeProfileStats() {
    const statsData = [
        "Multimedia Specialist: Level 7",
        "AI Development: Level 6",
        "Creative Suite Mastery: 92%",
        "Project Management: Level 8",
        "Innovation Index: 94%"
    ];
    
    const overlay = document.querySelector('.profile-stats-overlay');
    overlay.innerHTML = ''; // Clear existing stats
    
    statsData.forEach((stat) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.dataset.stat = stat;
        overlay.appendChild(statItem);
    });
}

function typeStatEffect(element, text) {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, 30);
        }
    };
    
    type();
}

/* ===========================
   Particle Effects
   =========================== */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    container.appendChild(particle);
    
    gsap.to(particle, {
        y: -500,
        x: Math.random() * 100 - 50,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        ease: "power1.out",
        onComplete: () => particle.remove()
    });
}

function createEnergyWave(x, y, container) {
    const wave = document.createElement('div');
    wave.className = 'energy-wave';
    wave.style.left = `${x - 100}px`;
    wave.style.top = `${y - 100}px`;
    container.appendChild(wave);
    
    setTimeout(() => wave.remove(), 6000);
}

/* ===========================
   Throttle Function
   =========================== */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/* ===========================
   Initialize Everything
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix
    initializeMatrixEffect();
    
    // Initialize Profile Stats
    initializeProfileStats();
    
    // Profile Image Interactions
    const profileImg = document.querySelector('.about-profile-img');
    const statsOverlay = document.querySelector('.profile-stats-overlay');
    
    profileImg.addEventListener('mouseenter', () => {
        statsOverlay.style.opacity = '1';
        statsOverlay.style.transform = 'translateX(0)';
        
        const statItems = statsOverlay.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            setTimeout(() => {
                typeStatEffect(item, item.dataset.stat);
            }, index * 500);
        });
    });
    
    profileImg.addEventListener('mouseleave', () => {
        statsOverlay.style.opacity = '0';
        statsOverlay.style.transform = 'translateX(20px)';
    });

    // GSAP Animations
    gsap.to('.title', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5
    });

    gsap.to('.subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8
    });

    // Skill Icons Animation
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach((icon, index) => {
        gsap.to(icon, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: 1.2 + (index * 0.1),
            ease: "back.out(1.7)"
        });
    });

    // Section Animations
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.2 * index
        });
    });

    // Initialize Particles
    const particlesContainers = document.querySelectorAll('.particles-container');
    particlesContainers.forEach(container => {
        setInterval(() => createParticle(container), 200);
    });

    // Throttled Mouse Movement Handler
    const throttledMouseMove = throttle((e) => {
        particlesContainers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                if (Math.random() < 0.1) { // Adjusted probability
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    createEnergyWave(x, y, container);
                }
            }
        });
    }, 100); // Throttled to once every 100ms

    document.addEventListener('mousemove', throttledMouseMove);
});
