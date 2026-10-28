import ScrollPage from "./scrollpage.js"
import ScrollX from "./scrollx.js";
import ScrollSnap from "./snap.js";
import Gallery from "./gallery.js";
import Navigation from "./navigation.js";

export default class Controller {
    // Initialise la bannière, la galerie, le scroll horizontal et le scroll-snap, puis attache les écouteurs globaux
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

        this.initGallery();
        this.initScrollX(container);
        this.initScrollSnap(container, sectionSelector);

        // Affiche la section visible dans l'url (#sec..), sur mobile comme sur desktop
        this.navigation = new Navigation(container, sectionSelector);

        window.addEventListener('resize', () => this.handleResize(container, sectionSelector));
        if (this.mainContainer) {
            this.mainContainer.addEventListener('scroll', this.render.bind(this));
        }
    }

    // Instancie la galerie uniquement si l'élément #gallery existe dans la page
    initGallery() {
        if (document.getElementById('gallery')) {
            this.gallery = new Gallery();
        }
    }

    // Crée ou détruit le ScrollX selon que la largeur d'écran actuelle doit l'activer
    initScrollX(container) {
        const shouldEnableScrollX = this.shouldEnableScrollX();

        if (shouldEnableScrollX && !this.scrollX) {
            this.scrollX = new ScrollX(container);
        } else if (!shouldEnableScrollX && this.scrollX) {
            this.destroyScrollX();
            this.scrollX = null;
        }


    }

    // Détermine si le scroll horizontal doit être actif (desktop, ou forcé sur mobile via options)
    shouldEnableScrollX() {
        const isDesktop = window.innerWidth >= this.options.breakpoint;
        return this.options.enableScrollXOnMobile ? true : isDesktop;
    }

    // Crée ou détruit le ScrollSnap selon que la largeur d'écran actuelle doit l'activer
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

        // passsection() (boutons "Passer la galerie") utilise le ScrollSnap pour animer le passage
        // d'une section à l'autre ; null sur mobile, ce qui désactive passsection()
        this.scrollPage.scrollSnap = this.scrollSnap;
    }

    // Détermine si le scroll-snap doit être actif (desktop, ou forcé sur mobile via options)
    shouldEnableSnap() {
        const isDesktop = window.innerWidth >= this.options.breakpoint;
        return this.options.enableSnapOnMobile ? true : isDesktop;
    }

    // Au redimensionnement, réévalue l'activation du ScrollX et du ScrollSnap
    handleResize(container, sectionSelector) {
        this.initScrollX(container);
        this.initScrollSnap(container, sectionSelector);
    }

    // Appelée à chaque scroll de main : met à jour la bannière et récupère la progression du ScrollX
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
        this.navigation.destroy();
        
        if (this.mainContainer) {
            this.mainContainer.removeEventListener('scroll', this.render.bind(this));
        }
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}