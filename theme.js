/* LOCALSTORAGE THEMING & PREFERENCES ENGINE */

class ThemeManager {
    constructor() {
        this.toggleButton = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => {
                const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(nextTheme);
            });
        }
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Broadcast updates to canvas and visualization scripts
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        window.dispatchEvent(event);
    }
}