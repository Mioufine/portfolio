import ScrollPage from "./scrollpage.js"
import ScrollX from "./scrollx.js";
import ScrollSnap from "./snap.js";

export default class Controller {
    constructor(navId, container, sectionSelector = 'section', options = {}) {
              
        // Récupérer le container main
        this.mainContainer = document.querySelector(container);

        this.scrollPage = new ScrollPage(navId, this.mainContainer);

        this.options = {
            enableSnapOnMobile: options.enableSnapOnMobile || false,
            enableScrollXOnMobile: options.enableScrollXOnMobile || false, 
            breakpoint: options.breakpoint || 837,
            ...options
        };

        this.initScrollX(container);
        this.initScrollSnap(container, sectionSelector);
        
        window.addEventListener('resize', () => this.handleResize(container, sectionSelector));
        if (this.mainContainer) {
            this.mainContainer.addEventListener('scroll', this.render.bind(this));
        }
    }

    initScrollX(container) {
        const shouldEnableScrollX = this.shouldEnableScrollX();
        
        if (shouldEnableScrollX && !this.scrollX) {
            this.scrollX = new ScrollX(container);
        } else if (!shouldEnableScrollX && this.scrollX) {
            this.destroyScrollX();
            this.scrollX = null;
        }

        
    }
    
    shouldEnableScrollX() {
        const isDesktop = window.innerWidth >= this.options.breakpoint;
        return this.options.enableScrollXOnMobile ? true : isDesktop;
    }
    
    initScrollSnap(container, sectionSelector) {
        const shouldEnableSnap = this.shouldEnableSnap();
        
        if (shouldEnableSnap && !this.scrollSnap) {
            this.scrollSnap = new ScrollSnap(container, sectionSelector, {
                threshold: 0.5
            });
        } else if (!shouldEnableSnap && this.scrollSnap) {
            this.destroySnapScroll();
            this.scrollSnap = null;
        }
    }
    
    shouldEnableSnap() {
        const isDesktop = window.innerWidth >= this.options.breakpoint;
        return this.options.enableSnapOnMobile ? true : isDesktop;
    }
    
    handleResize(container, sectionSelector) {
        this.initScrollX(container);
        this.initScrollSnap(container, sectionSelector);
    }

    render() {
        this.scrollPage.onScroll();
        
        if (this.scrollX) {
            const progress = this.scrollX.getProgress();
            // Utilisez progress si nécessaire
        }
    }
    
    // Méthodes déléguées au ScrollSnap
    next() {
        this.scrollSnap.next();
    }
    // sert à aller à la section précédente
    previous() {
        this.scrollSnap.previous();
    }
    // sert à aller à une section spécifique
    scrollToSection(index) {
        this.scrollSnap.scrollToSection(index);
    }
    // sert à obtenir l'index de la section active
    getActiveIndex() {
        return this.scrollSnap.getActiveIndex();
    }
    // sert à obtenir la section active
    getActiveSection() {
        return this.scrollSnap.getActiveSection();
    }

    // Méthodes de nettoyage
    destroyScrollX() {
        this.scrollX.detachEvents();
    }
    // sert à détruire le ScrollSnap
    destroySnapScroll() {
        this.scrollSnap.destroy();
    }
    // sert à tout détruire
    destroy() {
        this.destroyScrollX();
        this.destroySnapScroll();
        
        if (this.mainContainer) {
            this.mainContainer.removeEventListener('scroll', this.render.bind(this));
        }
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}