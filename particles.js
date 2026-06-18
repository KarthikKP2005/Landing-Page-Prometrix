/* CANVAS DYNAMIC GRID PARTICLES SYSTEM WITH PREMIUM PROXIMITY WAVE PHYSICS */

class SymmetricalGridParticles {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
        
        // Physics variables for responsive elasticity
        this.gridSpacing = 45;      // Slightly denser grid layout
        this.repelRadius = 150;     // Extended radius for magnetic field
        this.pushStrength = 1.4;    // Progressive force amplitude
        this.springStrength = 0.08; // Rubber elasticity coefficient
        this.friction = 0.85;       // Velocity dampening
        
        this.tiltX = 0;
        this.tiltY = 0;
        
        this.init();
        this.setupListeners();
        this.animate();
    }

    init() {
        this.resize();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.createGrid();
    }

    // Dynamic contrast generator matching active modes
    getParticleColor(alpha) {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? `rgba(0, 0, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    }

    createGrid() {
        this.particles = [];
        const padding = 100; 
        for (let x = -padding; x < this.width + padding; x += this.gridSpacing) {
            for (let y = -padding; y < this.height + padding; y += this.gridSpacing) {
                this.particles.push({
                    ox: x,
                    oy: y,
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    size: 2.2 // Increased base dot size for clear definition
                });
            }
        }
    }

    setupListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
            
            // Mathematical tilt vectors for 3D depth feeling
            this.tiltX = (e.clientX - this.width / 2) * 0.03;
            this.tiltY = (e.clientY - this.height / 2) * 0.03;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.targetX = e.touches[0].clientX;
                this.mouse.targetY = e.touches[0].clientY;
            }
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.targetX = -1000;
            this.mouse.targetY = -1000;
            this.tiltX = 0;
            this.tiltY = 0;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Linear Interpolation tracking
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Base state values
            let alpha = 0.18;
            let currentRadius = p.size;
            
            // Proximity displacement calculations
            if (dist < this.repelRadius) {
                const force = (this.repelRadius - dist) / this.repelRadius;
                const angle = Math.atan2(dy, dx);
                
                // Exponential magnetic push vector
                const push = force * force * 35;
                p.vx += Math.cos(angle) * push * this.pushStrength * 0.15;
                p.vy += Math.sin(angle) * push * this.pushStrength * 0.15;
                
                // Proximity reactive visual changes
                alpha = 0.18 + force * 0.45;        // Increase opacity near cursor
                currentRadius = p.size + force * 1.5; // Scale up the dot size near cursor
            }
            
            // Spring force calculations back to anchor points
            const sx = (p.ox - p.x) * this.springStrength;
            const sy = (p.oy - p.y) * this.springStrength;
            
            p.vx = (p.vx + sx) * this.friction;
            p.vy = (p.vy + sy) * this.friction;
            
            p.x += p.vx;
            p.y += p.vy;

            // Apply 3D perspective shift on rendering path
            const renderX = p.x + this.tiltX;
            const renderY = p.y + this.tiltY;

            this.ctx.fillStyle = this.getParticleColor(alpha);
            this.ctx.beginPath();
            this.ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}