import ScrollPage from "./scrollpage.js"
import ScrollX from "./scrollx.js";
import ScrollSnap from "./snap.js";

export default class Controller {
    constructor(containerID, container, sectionSelector = 'section') {
        this.scrollPage = new ScrollPage(containerID);
        this.scrollX = new ScrollX(container);

        this.scrollSnap = new ScrollSnap(container, sectionSelector, {
            threshold: 0.7,
            
        });
        
        window.addEventListener('scroll', this.render.bind(this));
    }

    render() {
        this.scrollPage.onScroll();
        
        const progress = this.scrollX.getProgress();
        // Utilisez progress si nécessaire
    }
    
    // Méthodes déléguées au ScrollSnap
    next() {
        this.scrollSnap.next();
    }

    previous() {
        this.scrollSnap.previous();
    }

    scrollToSection(index) {
        this.scrollSnap.scrollToSection(index);
    }

    getActiveIndex() {
        return this.scrollSnap.getActiveIndex();
    }

    getActiveSection() {
        return this.scrollSnap.getActiveSection();
    }

    // Méthodes de nettoyage
    destroyScrollX() {
        this.scrollX.detachEvents();
    }

    destroySnapScroll() {
        this.scrollSnap.destroy();
    }

    destroy() {
        this.destroyScrollX();
        this.destroySnapScroll();
        window.removeEventListener('scroll', this.render.bind(this));
    }
}