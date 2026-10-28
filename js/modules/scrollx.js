export default class ScrollX {
    // Initialise l'état du scroll horizontal et lance la configuration
    constructor(containerSelector) {
        // Trouve toutes les sections horizontales
        this.horizontalSections = [...document.querySelectorAll('.sec-x')];

        // Section et container actuellement actifs
        this.activeSection = null;
        this.activeContainer = null;

        // État
        this.isInHorizontalSection = false;
        this.horizontalScrollProgress = 0;
        this.totalWidth = 0;
        this.lastScrollDirection = 1; // 1 = vers le bas, -1 = vers le haut

        // Verrou de geste : bloque la fin d'un geste (inertie du pad) quand on arrive au bout
        this.gestureLocked = false;
        this.lastWheelTime = 0;

        // Configuration
        this.scrollSpeed = 0.0005;   // progression par pixel de deltaY
        this.maxDelta = 120;         // limite un événement trop gros (molette rapide)
        this.gestureGap = 200;       // ms sans événement = nouveau geste

        // Bind des méthodes pour garder le contexte
        this.handleScroll = this.handleScroll.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.onIntersection = this.onIntersection.bind(this);

        // Initialisation
        this.init();
    }

    // Met en place l'observer d'intersection et attache les écouteurs d'événements
    init() {
        if (this.horizontalSections.length === 0) {
            console.error('ScrollX: Aucune section .sec-x trouvée');
            return;
        }

        this.setupObserver();
        this.attachEvents();

        console.log('ScrollX initialized');
    }

    // Calcule le nombre de "pages" à scroller selon la largeur réelle du contenu
    calculateTotalWidth() {
        if (!this.activeContainer) return;
        // Calcule le nombre de "pages" à scroller selon la largeur réelle du contenu
        this.totalWidth = this.activeContainer.scrollWidth / window.innerWidth;
    }

    // Crée l'IntersectionObserver et l'attache à chaque section horizontale
    setupObserver() {
        this.observer = new IntersectionObserver(this.onIntersection, {
            // 0.95 est explicitement listé pour garantir qu'une notification est bien déclenchée
            // à ce niveau de visibilité (1 exact n'est quasiment jamais atteint à cause des
            // arrondis de rendu, donc un seuil basé uniquement sur "1" ne se déclenche jamais)
            threshold: [0, 0.5, 0.95, 1],
            rootMargin: '0px'
        });

        // Observe toutes les sections horizontales
        this.horizontalSections.forEach(section => this.observer.observe(section));
    }

    // Callback de l'observer : active/désactive la section horizontale courante selon sa visibilité
    onIntersection(entries) {
        entries.forEach(entry => {
            // On attend que la section soit quasi entièrement snappée avant d'activer le scroll
            // horizontal (0.95, aligné sur le threshold déclaré ci-dessus, dans les deux sens)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
                // Déjà active : le passage du seuil 1 → 0.99 au moment de sortir ne doit pas
                // la réinitialiser (sinon la frise saute au début / à la fin avant de partir)
                if (entry.target === this.activeSection) return;

                // Nouvelle section active
                this.isInHorizontalSection = true;
                this.activeSection = entry.target;
                this.activeContainer = entry.target.querySelector('.container_horizontal');

                        if (this.activeContainer) {
                    this.calculateTotalWidth();
                    // Démarrer à la fin si on remonte, au début si on descend
                    if (this.lastScrollDirection < 0) {
                        this.horizontalScrollProgress = this.totalWidth - 1;
                    } else {
                        this.horizontalScrollProgress = 0;
                    }
                    this.updateTransform();
                    // L'inertie du geste qui a amené ici ne doit pas faire avancer la frise
                    this.gestureLocked = true;
                }
            } else if (entry.target === this.activeSection) {
                // Désactivée dès qu'elle n'est plus quasi entièrement visible
                // (une section qui touche juste le bord de l'écran reste "isIntersecting")
                this.isInHorizontalSection = false;
                this.activeSection = null;
                this.activeContainer = null;
            }
        });
    }

    // Gère l'événement wheel/touch : convertit le scroll vertical en progression horizontale
    handleScroll(e) {
        // Toujours mémoriser la direction, même hors section horizontale
        if (e.deltaY !== 0) this.lastScrollDirection = e.deltaY > 0 ? 1 : -1;

        // Un nouveau geste commence après une pause : on lève le verrou
        const now = performance.now();
        if (now - this.lastWheelTime > this.gestureGap) this.gestureLocked = false;
        this.lastWheelTime = now;

        if (!this.isInHorizontalSection || !this.activeContainer) return;

        // Tant que le geste verrouillé continue, on n'avance pas et on ne laisse pas la page défiler
        if (this.gestureLocked) {
            e.preventDefault();
            return;
        }

        // Progression proportionnelle au geste (deltaMode 1 = lignes, ex. Firefox avec une molette)
        const deltaPx = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        const step = Math.min(Math.abs(deltaPx), this.maxDelta) * this.scrollSpeed;

        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        const isAtEnd = this.horizontalScrollProgress >= this.totalWidth - 1;
        const isAtStart = this.horizontalScrollProgress <= 0;

        // Scroll vers la droite
        if (isScrollingDown && !isAtEnd) {
            e.preventDefault();
            this.horizontalScrollProgress += step;
            this.horizontalScrollProgress = Math.min(
                this.horizontalScrollProgress,
                this.totalWidth - 1
            );
            this.updateTransform();
            // Arrivé au bout : il faudra un nouveau geste pour passer à la section suivante
            if (this.horizontalScrollProgress >= this.totalWidth - 1) this.gestureLocked = true;
        }
        // Scroll vers la gauche
        else if (isScrollingUp && !isAtStart) {
            e.preventDefault();
            this.horizontalScrollProgress -= step;
            this.horizontalScrollProgress = Math.max(this.horizontalScrollProgress, 0);
            this.updateTransform();
            if (this.horizontalScrollProgress <= 0) this.gestureLocked = true;
        }
    }

    // Applique la progression horizontale courante sous forme de translateX sur le container actif
    updateTransform() {
        if (!this.activeContainer) return;
        const translateX = -this.horizontalScrollProgress * 100;
        this.activeContainer.style.transform = `translateX(${translateX}vw)`;
        // La frise a bougé : on met à jour l'affichage des boutons "Passer la galerie"
        this.updatePassButtons();

    }

    // Boutons "Passer la galerie" : pose les classes lues par le CSS sur la section active
    // - show-pass-down : frise au début (progress à 0) -> bouton pour descendre
    // - show-pass-up : frise à la fin (progress à totalWidth - 1) -> bouton pour remonter
    updatePassButtons() {
        if (!this.activeSection) return;
        this.activeSection.classList.toggle('show-pass-down', this.horizontalScrollProgress <= 0);
        this.activeSection.classList.toggle('show-pass-up', this.horizontalScrollProgress >= this.totalWidth - 1);
    }

    // Mémorise la position Y de départ d'un toucher
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    // Traduit le déplacement tactile vertical en appel à handleScroll
    handleTouchMove(e) {
        if (!this.isInHorizontalSection) return;

        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;

        if (Math.abs(deltaY) > 5) {
            this.handleScroll({
                deltaY,
                preventDefault: () => e.preventDefault()
            });
            this.touchStartY = touchY;
        }
    }

    // Attache les écouteurs wheel/touch nécessaires au scroll horizontal
    attachEvents() {
        window.addEventListener('wheel', this.handleScroll, { passive: false });
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    }

    // Retire les écouteurs et déconnecte l'observer (nettoyage)
    detachEvents() {
        window.removeEventListener('wheel', this.handleScroll);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchmove', this.handleTouchMove);

        if (this.observer) {
            this.observer.disconnect();
        }
    }

    // Méthode publique pour reset
    reset() {
        this.horizontalScrollProgress = 0;
        this.updateTransform();
    }

    // Méthode publique pour obtenir la progression
    getProgress() {
        return {
            current: this.horizontalScrollProgress,
            total: this.totalWidth,
            percentage: this.totalWidth > 1 ? (this.horizontalScrollProgress / (this.totalWidth - 1)) * 100 : 100
        };
    }
}
