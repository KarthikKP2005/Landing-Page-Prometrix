/* SMOOTH NAVIGATIONAL ANCHORING & VIEWPORT SCROLLSPY DETECTOR */

class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.navbarHeight = 80; // Compensating for layout offset
        
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupScrollSpy();
        this.setupScrollVisibility();
    }

    /* ONLY SHOW NAVBAR SLIDING DOWN PAST THE HERO SECTION */
    setupScrollVisibility() {
        const checkVisibility = () => {
            const heroSection = document.getElementById('hero');
            // Check if scroll depth is beyond the height of the hero slide
            const threshold = heroSection ? heroSection.offsetHeight - 120 : 350;

            if (window.scrollY > threshold) {
                this.navbar.classList.add('visible');
            } else {
                this.navbar.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);
        checkVisibility(); // Initial check
    }

    /* SMOOTH SCROLLER IMPLEMENTATION */
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = targetPosition - this.navbarHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /* REAL-TIME SCROLLSPY HIGHLIGHT SYSTEM */
    setupScrollSpy() {
        const updateActiveSection = () => {
            const scrollPos = window.scrollY + this.navbarHeight + 100;

            if (this.navbar && window.scrollY > 150) {
                this.navbar.style.backgroundColor = 'var(--nav-bg)';
            }

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveSection);
        window.addEventListener('resize', updateActiveSection);
        updateActiveSection();
    }
}