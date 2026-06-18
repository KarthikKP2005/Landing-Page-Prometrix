/* CLIENT INTERACTIONS, ARISES, SLIDERS AND 3D PROJECTED WIREFRAME TORUS */

// 1. Bento Cards Glowing Hover Trackers
function initBentoGlow() {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 2. Intersection Observer Arising Reveals (Fade up slide on scroll)
function initScrollReveals() {
    const options = {
        root: null,
        threshold: 0.10,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('arising-active');
                observer.unobserve(entry.target); 
            }
        });
    }, options);

    const arisingElements = document.querySelectorAll('.arising-element');
    arisingElements.forEach(el => observer.observe(el));
}

// 3. Apple/Framer Horizontal Storytelling Slider (REPAIRED SCROLLRANGE)
function initHorizontalScrolling() {
    const section = document.querySelector('.benefits-section');
    const track = document.getElementById('horizontal-track');
    
    if (!section || !track) return;

    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        if (window.innerWidth <= 768) {
            track.style.transform = '';
            return;
        }

        // Corrected single assignment expression
        const scrollRange = sectionHeight - viewportHeight;
        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress)); 

        const maxTranslate = track.scrollWidth - window.innerWidth;
        const translateX = progress * maxTranslate;

        track.style.transform = `translate3d(-${translateX}px, 0, 0)`;
    });
}

// 4. Parallax 3D Depth Card Tilting with Live Heading Interaction
function initHeroParallax() {
    const hero = document.getElementById('hero');
    const depthElements = document.querySelectorAll('.depth-element');
    const title = document.querySelector('.hero-title');
    
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const px = (e.clientX / width) - 0.5;
        const py = (e.clientY / height) - 0.5;

        // Subtle 3D tilting on standard layers
        depthElements.forEach(el => {
            const depth = parseFloat(el.getAttribute('data-depth')) || 0.12;
            const moveX = px * depth * 80;
            const moveY = py * depth * 80;
            
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
        });

        // Makes heading slightly move towards the cursor direction for live feedback
        if (title) {
            const headingX = px * 22; 
            const headingY = py * 22;
            title.style.transform = `translate3d(${headingX}px, ${headingY}px, 80px)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        depthElements.forEach(el => {
            el.style.transform = `translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)`;
        });
        if (title) {
            title.style.transform = `translate3d(0px, 0px, 0px)`;
        }
    });
}

// 5. Accordion Steps blueprint stack order controller
function initHowItWorks() {
    const steps = document.querySelectorAll('.process-step');
    const stackContainer = document.querySelector('.image-stack-container');
    const stackCards = document.querySelectorAll('.stack-card');

    if (!steps.length || !stackContainer) return;

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            steps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');

            stackContainer.setAttribute('data-active-step', index);

            stackCards.forEach(c => c.classList.remove('active'));
            const activeCard = document.querySelector(`.stack-card.card-${index}`);
            if (activeCard) activeCard.classList.add('active');
        });
    });
}

// 6. LIVE SPINNING DYNAMIC 3D MESH TORUS
class InteractiveTorusMesh {
    constructor() {
        this.canvas = document.getElementById('torus-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.points = [];
        this.angleX = 0.3;
        this.angleY = 0.4;
        
        this.R = 120; 
        this.r = 45;  
        
        this.segmentsU = 32; 
        this.segmentsV = 16; 
        
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;

        this.init();
        this.setupListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.generateTorus();
    }

    resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    generateTorus() {
        this.points = [];
        for (let i = 0; i < this.segmentsU; i++) {
            const u = (i / this.segmentsU) * Math.PI * 2;
            const cosU = Math.cos(u);
            const sinU = Math.sin(u);
            
            const ring = [];
            for (let j = 0; j < this.segmentsV; j++) {
                const v = (j / this.segmentsV) * Math.PI * 2;
                const cosV = Math.cos(v);
                const sinV = Math.sin(v);
                
                const x = (this.R + this.r * cosV) * cosU;
                const y = (this.R + this.r * cosV) * sinU;
                const z = this.r * sinV;
                
                ring.push({ x, y, z });
            }
            this.points.push(ring);
        }
    }

    setupListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            const normX = (e.clientX / window.innerWidth) - 0.5;
            const normY = (e.clientY / window.innerHeight) - 0.5;
            this.mouseOffsetX = normX * 0.5;
            this.mouseOffsetY = normY * 0.5;
        });
    }

    getMeshColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
    }

    getDotColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(59, 130, 246, 0.55)';
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.angleY += 0.003 + this.mouseOffsetX * 0.01;
        this.angleX += 0.002 + this.mouseOffsetY * 0.01;

        const cosX = Math.cos(this.angleX);
        const sinX = Math.sin(this.angleX);
        const cosY = Math.cos(this.angleY);
        const sinY = Math.sin(this.angleY);

        const projected = [];
        const scale = 1.15; 
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < this.segmentsU; i++) {
            const ring = this.points[i];
            const projectedRing = [];
            
            for (let j = 0; j < this.segmentsV; j++) {
                const pt = ring[j];
                
                let x1 = pt.x * cosY - pt.z * sinY;
                let z1 = pt.x * sinY + pt.z * cosY;
                
                let y2 = pt.y * cosX - z1 * sinX;
                let z2 = pt.y * sinX + z1 * cosX;
                
                const distance = 400;
                const perspective = distance / (distance + z2);
                
                const px = centerX + x1 * perspective * scale;
                const py = centerY + y2 * perspective * scale;
                
                projectedRing.push({ x: px, y: py, zDepth: z2 });
            }
            projected.push(projectedRing);
        }

        const meshColor = this.getMeshColor();
        const dotColor = this.getDotColor();

        this.ctx.strokeStyle = meshColor;
        this.ctx.fillStyle = dotColor;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.segmentsU; i++) {
            const nextI = (i + 1) % this.segmentsU;
            
            for (let j = 0; j < this.segmentsV; j++) {
                const nextJ = (j + 1) % this.segmentsV;
                
                const p1 = projected[i][j];
                const p2 = projected[i][nextJ];
                const p3 = projected[nextI][j];

                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p3.x, p3.y);
                this.ctx.stroke();

                if (i % 2 === 0 && j % 2 === 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}