
export default class ScrollPage {
    banner = null;
    scrollContainer = null;
    scrollSnap = null;      // ScrollSnap actif (desktop), utilisé par passsection()
    options = {
        class:'is-fixed',
        
    };
    

    // Récupère la bannière par son id et le container de scroll, puis fusionne les options
    constructor(id,scrollContainer,options) {
        this.banner = document.getElementById(id);
        this.scrollContainer = scrollContainer || document.querySelector('main');
        this.options = { ...this.options, ...options };

        // Passe directement à la section d'avant / d'après (data-pass-section="-1" ou "1")
        document.querySelectorAll('[data-pass-section]').forEach((button) => {
            button.addEventListener('click', () => this.passsection(Number(button.dataset.passSection)));
        });

        if(this.banner === null){return;};

    };

    // Appelée à chaque scroll pour mettre à jour l'état de la bannière
    onScroll(){
        this.bannerFixed();

    }


    // Bascule la classe "is-fixed" sur la bannière selon la position de scroll
    bannerFixed() {
        if (!this.banner || !this.scrollContainer) return;

        // Utiliser scrollTop du container main
        const scrollY = this.scrollContainer.scrollTop;
        const isFixed = (scrollY > this.banner.offsetHeight)? true: false;

        this.banner.classList.toggle(this.options.class, isFixed);
    }

    // Passe directement à la section d'avant (direction -1) ou d'après (direction 1),
    // avec la même animation que la molette (ScrollSnap, fourni par le Controller)
    passsection(direction) {
        const snap = this.scrollSnap;
        // Pas de ScrollSnap (mobile) ou animation déjà en cours : on ne fait rien
        if (!snap || snap.isAnimating) return;

        // Section voisine de celle qui occupe le haut de l'écran
        const target = snap.sections[snap.getCurrentIndex() + direction];
        // Pas de section avant la première / après la dernière : target est undefined
        if (target) snap.animateTo(target.offsetTop);
    }
    

};
