export default class ScrollSnap {
    constructor(container, sectionSelector = 'section', options = {}) {
        this.container = document.querySelector(container,'container');
        this.sections = this.container.querySelectorAll(sectionSelector);
        this.activeIndex = 0;
        this.options = {
            threshold: options.threshold || 0.7,
            onSectionChange: options.onSectionChange || null
        };

        this.init();
    }

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
    }
}
