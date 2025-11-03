export default class Scroll {
    banner = null;
    section2 = document.querySelector('#sec2');
    
    
    constructor(selector) {
        this.banner = document.querySelector(selector);

        if(this.banner === null){return;}; // surveiller le this

        window.addEventListener('scroll', this.bannerClassToggle.bind(this));
        this.section2.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.section2.scrollLeft += event.deltaY;
        } );

    }

    bannerClassToggle(){

        if (window.scrollY > this.banner.offsetTop) {
            this.banner.classList.add('is-fixed');

        } else {
            this.banner.classList.remove('is-fixed');
        }
    };

    
    

}
