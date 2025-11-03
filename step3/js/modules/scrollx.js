export default class ScrollX {
    constructor(container) {
        // Éléments DOM
        this.horizontalSection = document.querySelector('.sec-x');
        this.horizontalContainer = document.querySelector('.container_horizontal');
        this.scrollIndicator = document.querySelector('.sec-y');
        
        // État
        this.isInHorizontalSection = false;
        this.horizontalScrollProgress = 0;
        this.totalWidth = 0;
        
        // Configuration
        this.scrollSpeed = 0.05;
        
        // Bind des méthodes pour garder le contexte
        this.handleScroll = this.handleScroll.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.onIntersection = this.onIntersection.bind(this);
      
        
        // Initialisation
        this.init();
    }
    
    init() {
        if (!this.horizontalSection || !this.horizontalContainer) {
            console.error('ScrollX: Elements not found');
            return;
        }
        
        // Calcule la largeur totale à scroller
        this.calculateTotalWidth();
        
        // Configure l'IntersectionObserver
        this.setupObserver();
        
        // Attache les événements
        this.attachEvents();
        
        console.log('ScrollX initialized');
    }
    
    calculateTotalWidth() {
        // Compte le nombre d'éléments enfants dans le container
        const children = this.horizontalContainer.children;
        this.totalWidth = children.length;
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver(this.onIntersection, {
            threshold: [0, 0.5, 1],
            rootMargin: '0px'
        });
        
        this.observer.observe(this.horizontalSection);
    }
    
    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                this.isInHorizontalSection = true;
            } else {
                this.isInHorizontalSection = false;
            }
        });
    }
    
    handleScroll(e) {
        if (!this.isInHorizontalSection) return;
        
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        const isAtEnd = this.horizontalScrollProgress >= this.totalWidth - 1;
        const isAtStart = this.horizontalScrollProgress <= 0;
        
        // Scroll vers la droite
        if (isScrollingDown && !isAtEnd) {
            e.preventDefault();
            this.horizontalScrollProgress += this.scrollSpeed;
            this.horizontalScrollProgress = Math.min(
                this.horizontalScrollProgress, 
                this.totalWidth - 1
            );
            this.updateTransform();
        }
        // Scroll vers la gauche
        else if (isScrollingUp && !isAtStart) {
            e.preventDefault();
            this.horizontalScrollProgress -= this.scrollSpeed;
            this.horizontalScrollProgress = Math.max(this.horizontalScrollProgress, 0);
            this.updateTransform();
        }
        // Laisser le scroll vertical reprendre
        else if ((isScrollingDown && isAtEnd) || (isScrollingUp && isAtStart)) {
            return;
        }
    }
    
    updateTransform() {
        const translateX = -this.horizontalScrollProgress * 100;
        this.horizontalContainer.style.transform = `translateX(${translateX}vw)`;
    }
    
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }
    
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
    
    attachEvents() {
        window.addEventListener('wheel', this.handleScroll, { passive: false });
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    }
    
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
            percentage: (this.horizontalScrollProgress / (this.totalWidth - 1)) * 100
        };
    }

    
}