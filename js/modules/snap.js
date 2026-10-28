export default class ScrollSnap {
    // Récupère le container et ses sections, puis initialise l'observer
    constructor(container, sectionSelector = 'section', options = {}) {
        this.container = document.querySelector(container,'container');
        this.sections = this.container.querySelectorAll(sectionSelector);
        this.activeIndex = 0;
        this.options = {
            threshold: options.threshold || 0.7,
            onSectionChange: options.onSectionChange || null,
            duration: options.duration || 900,     // durée du passage d'une section à l'autre (ms)
            gestureGap: options.gestureGap || 200  // ms sans événement = nouveau geste
        };

        // État du scroll vertical animé
        this.isAnimating = false;
        this.gestureLocked = false;
        this.lastWheelTime = 0;
        this.handleWheel = this.handleWheel.bind(this);

        this.init();
    }

    // Crée l'IntersectionObserver qui détecte quelle section est active
    init() {
        // Observer pour détecter la section active
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Array.from(this.sections).indexOf(entry.target);
                        this.setActiveSection(index);
                    }
                });
            },
            { threshold: this.options.threshold }
        );

        // Observer chaque section (en dehors de la callback)
        this.sections.forEach((section) => {
            this.observer.observe(section);
        });

        // Écouté après ScrollX (créé avant) : on ne prend que les événements qu'il n'a pas gérés
        window.addEventListener('wheel', this.handleWheel, { passive: false });
    }

    // Remplace le snap natif (trop rapide) par un passage animé d'une section à l'autre
    handleWheel(e) {
        // Un nouveau geste commence après une pause : on lève le verrou
        const now = performance.now();
        if (now - this.lastWheelTime > this.options.gestureGap) this.gestureLocked = false;
        this.lastWheelTime = now;

        // Événement déjà utilisé par le scroll horizontal
        if (e.defaultPrevented || e.deltaY === 0) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const index = this.getCurrentIndex();
        const section = this.sections[index];

        // Section plus haute que l'écran : on laisse défiler normalement tant que le geste
        // ne dépasse pas son bord, sinon on s'arrête au début de la section suivante
        const deltaPx = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        const top = section.offsetTop - this.container.scrollTop;
        const bottom = top + section.offsetHeight;
        const viewHeight = this.container.clientHeight;
        if (direction > 0 && bottom - deltaPx >= viewHeight) return;
        if (direction < 0 && top - deltaPx <= 0) return;

        e.preventDefault();
        if (this.isAnimating || this.gestureLocked) return;

        const target = index + direction;
        if (target < 0 || target >= this.sections.length) return;

        // Un geste = une section : la suite du geste (inertie du pad) est ignorée
        this.gestureLocked = true;
        this.animateTo(this.sections[target].offsetTop);
    }

    // Index de la section qui occupe le haut de l'écran (même si elle est plus haute que l'écran)
    getCurrentIndex() {
        const scrollTop = this.container.scrollTop;
        let current = 0;
        this.sections.forEach((section, i) => {
            if (section.offsetTop <= scrollTop + 1) current = i;
        });
        return current;
    }

    // Anime scrollTop jusqu'à la position cible, snap natif coupé pendant l'animation
    animateTo(targetY) {
        const startY = this.container.scrollTop;
        const distance = targetY - startY;
        const start = performance.now();
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        this.isAnimating = true;
        this.container.style.scrollSnapType = 'none';

        const step = (now) => {
            const t = Math.min((now - start) / this.options.duration, 1);
            this.container.scrollTop = startY + distance * ease(t);

            if (t < 1) {
                this.frame = requestAnimationFrame(step);
            } else {
                this.container.style.scrollSnapType = '';
                this.isAnimating = false;
            }
        };
        this.frame = requestAnimationFrame(step);
    }

    // Méthode pour définir la section active
    setActiveSection(index) {
        if (this.activeIndex === index) return;
        
        this.activeIndex = index;
        
    }
    // Méthode pour faire défiler vers une section spécifique
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        this.sections[index].scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    // Méthodes pour naviguer entre les sections
    next() {
        this.scrollToSection(this.activeIndex + 1);
    }
    // Méthodes pour naviguer entre les sections
    previous() {
        this.scrollToSection(this.activeIndex - 1);
    }
    // Méthodes pour obtenir la section active et son index
    getActiveIndex() {
        return this.activeIndex;
    }
    // Méthodes pour obtenir la section active et son index
    getActiveSection() {
        return this.sections[this.activeIndex];
    }
    // Méthode de nettoyage
    destroy() {
        this.observer.disconnect();
        window.removeEventListener('wheel', this.handleWheel);
        cancelAnimationFrame(this.frame);
        this.container.style.scrollSnapType = '';
        this.isAnimating = false;
    }
}

