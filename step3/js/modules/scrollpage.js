
export default class ScrollPage {
    banner = null;
    options = {
        class:'is-fixed',
        
    };
    

    constructor(selector,id,options = this.options) {
        this.banner = document.getElementById('nav_bar',id);
        this.section = document.querySelector(selector);
        this.options = options; //comment je fais pour que je le replace par defaut si options est undefined
        if(this.banner === null){return;};
        window.addEventListener('scroll', this.onScroll.bind(this));
        
        
    };
    onScroll(){
        this.bannerFixed();
        
    }
     

    bannerFixed() {
       
        const isFixed = (window.scrollY > this.banner.offsetHeight)? true: false; 
        this.banner.classList.toggle(this.options.class,isFixed);
    }
    
    snapSection () {

    }
};
