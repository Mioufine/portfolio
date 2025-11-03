
export default class ScrollPage {
    banner = null;
    scrollContainer = null;
    options = {
        class:'is-fixed',
        
    };
    

    constructor(id,scrollContainer,options) {
        this.banner = document.getElementById(id);
        this.scrollContainer = scrollContainer || document.querySelector('main');
        this.options = { ...this.options, ...options }; 
        if(this.banner === null){return;};       
        
    };

    onScroll(){
        this.bannerFixed();
        
    }
     

    bannerFixed() {
        if (!this.banner || !this.scrollContainer) return;
        
        // Utiliser scrollTop du container main
        const scrollY = this.scrollContainer.scrollTop;
        const isFixed = (scrollY > this.banner.offsetHeight)? true: false;
        
        this.banner.classList.toggle(this.options.class, isFixed);
    }
    

};
