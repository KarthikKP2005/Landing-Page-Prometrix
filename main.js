/* DOM INITS, TELEMETRY LOOP, METRIC SPIN-UP AND CURSOR VISIBILITY ACTIONS */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Particles Background
    new SymmetricalGridParticles();
    
    // 2. Initialize Theme Preference Managers
    new ThemeManager();
    
    // 3. Initialize Navbar Actions
    new NavbarController();
    
    // 4. Initialize Interactive 3D Wireframe Torus in console card
    new InteractiveTorusMesh();
    
    // 5. Start Telemetry non-stop simulation loop
    startTelemetryLoop();

    // Set copyright year parameters
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 6. Initiate real-time cursor follow tracking (centered under the cursor)
    initCursorGlow();

    // 7. Start Intro Typewriting Sequence
    startIntroSequence();
});

// NON-STOP TELEMETRY VALUE SIMULATOR LOOP
function startTelemetryLoop() {
    const torqueEl = document.getElementById('tel-torque');
    const phaseEl = document.getElementById('tel-phase');
    if (!torqueEl || !phaseEl) return;
    
    // Torque value simulation loop (runs non-stop every 120ms)
    setInterval(() => {
        const torqueValue = (34.50 + Math.random() * 4.50).toFixed(2);
        torqueEl.textContent = `${torqueValue} Nm`;
    }, 120);
    
    // Phase value simulation loop (runs non-stop every 200ms)
    setInterval(() => {
        const phaseValue = (3.100 + Math.random() * 0.850).toFixed(3);
        phaseEl.textContent = `${phaseValue} rad`;
    }, 200);
}

// METRIC COUNT-UP SEQUENCER
function animateStatsCountUp() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1800; // Animation duration in milliseconds
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Decelerating easeOutQuadratic progress curve
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * target);

            counter.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target + suffix;
            }
        }
        requestAnimationFrame(update);
    });
}

// Centering the custom radial follow orb directly on pointer positions
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (currentX === -1000) {
            currentX = targetX;
            currentY = targetY;
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetX = e.touches[0].clientX;
            targetY = e.touches[0].clientY;
        }
    });

    window.addEventListener('mouseleave', () => {
        targetX = -1000;
        targetY = -1000;
    });

    function update() {
        if (currentX !== -1000) {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
        }
        requestAnimationFrame(update);
    }
    update();
}

function startIntroSequence() {
    // Typewrites PROMETRIX exactly as requested
    const typewriter = new EliteTypewriter('typewriter-text', 'PROMETRIX', 120);
    
    setTimeout(() => {
        typewriter.start(() => {
            // Stagger animations once typography is completely typed
            revealElement('.hero-badge-container');
            revealElement('.hero-desc');
            
            setTimeout(() => {
                revealElement('.hero-ctas');
                
                // Triggers count-up animation for console parameters
                animateStatsCountUp();

                // Initialize bento, parallax, scrolling triggers
                initHeroParallax();
                initBentoGlow();
                initScrollReveals();
                initHorizontalScrolling();
                initHowItWorks();
            }, 300);
        });
    }, 400);
}

function revealElement(selector) {
    const el = document.querySelector(selector);
    if (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0px)';
    }
}