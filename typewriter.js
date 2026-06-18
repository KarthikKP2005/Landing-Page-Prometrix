/* TYPEWRITER WRITING CADENCE MODULE */

class EliteTypewriter {
    constructor(elementId, text, speed = 100) {
        this.element = document.getElementById(elementId);
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start(callback) {
        if (!this.element) return;
        this.element.textContent = '';
        this.index = 0;
        this.type(callback);
    }

    type(callback) {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(callback), this.speed);
        } else if (callback) {
            callback();
        }
    }
}