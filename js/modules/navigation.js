export default class Navigation {
    // Récupère les sections et met l'url à jour avec le titre h2 de la section visible pendant le défilement
    // (sans # : /step8/mon-parcours, le .htaccess renvoie index.html au rechargement)
    constructor(container, sectionSelector = 'section', options = {}) {
        this.container = document.querySelector(container);
        this.sections = this.container ? [...this.container.querySelectorAll(sectionSelector)] : [];
        this.currentSlug = null;
        this.options = {
            threshold: options.threshold || 0.5,
            titleSelector: options.titleSelector || 'h2'   // section sans h2 (banner) : url du dossier
        };

        // Slug de chaque section, tiré de son titre
        this.slugs = new Map(this.sections.map((section) => [section, this.getSlug(section)]));

        // Dossier de la page (/step8/), que l'url soit /step8/, /step8/index.html ou /step8/mon-parcours
        this.basePath = location.pathname.replace(/[^/]*$/, '');

        this.init();
    }

    // Crée l'IntersectionObserver qui détecte la section visible
    init() {
        this.scrollToSlug();

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.updateUrl(this.slugs.get(entry.target));
                    }
                });
            },
            { threshold: this.options.threshold }
        );

        this.sections.forEach((section) => this.observer.observe(section));
    }

    // Transforme le titre de la section en texte pour l'url : "Mes Créations" -> "mes-creations"
    getSlug(section) {
        const title = section.querySelector(this.options.titleSelector);
        if (!title) return '';

        return title.textContent
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')   // enlève les accents
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')       // espaces et ponctuation -> tiret
            .replace(/^-+|-+$/g, '');
    }

    // À l'arrivée sur la page avec un titre dans l'url (/step8/mes-creations), va directement à la section
    scrollToSlug() {
        const slug = decodeURIComponent(location.pathname.slice(this.basePath.length));
        if (!slug) return;

        const section = this.sections.find((s) => this.slugs.get(s) === slug);
        if (section) section.scrollIntoView({ block: 'start' });
    }

    // Remplace le titre dans l'url sans ajouter d'entrée dans l'historique ni recharger la page
    updateUrl(slug) {
        if (this.currentSlug === slug) return;
        this.currentSlug = slug;

        history.replaceState(null, '', `${this.basePath}${slug}${location.search}`);
    }

    // Méthode de nettoyage
    destroy() {
        this.observer.disconnect();
    }
}
