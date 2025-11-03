export default class ScrollX {
    sectionX = null;
    sectionY = null;
    constructor(container) {
        this.container=document.querySelector(container);
        this.sectionX = document.querySelector('.sec-x',container);
        this.sectionY = document.querySelector('.sec-y',container);
        if(this.container === null){
            return;
        };
        
        this.init();
        console.log(this.sectionX);
    }
    init () {

        this.secXContainerSize();
        window.addEventListener("wheel",this.scrollChange.bind(this));
    }

    observerSection() {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    console.log(entry.target);
                    if(entry.target.classList.contains('sec-x')){
                        this.sectionX = entry.target;
                        this.sectionX.classList.add('container_horizontal');

                    } else if (entry.target.classList.contains('sec-y')){
                        this.sectionY = entry.target;
                        this.sectionX.classList.remove('container_horizontal');
                    }
                } else {
                    if(entry.target.classList.contains('sec-x')){
                        this.sectionX = null;
                    } else if (entry.target.classList.contains('sec-y')){
                        this.sectionY = null;
                    }
                }
            });
        })

        
    }

    sizeSection (element){
        const rect = element.observerSection();
        return rect.top <= 0 && rect.bottom > document.documentElement.clientHeight;
    }

    secXContainerSize() {
        document.querySelectorAll('.sec-x').forEach(function(container) {
            const secXContainerHeight = container.querySelector('.container_horizontal').scrollWight;
            container.setAttribute('style', 'height:' + secXContainerHeight + 'px');
        })
    }

    scrollChange (event) {
        const sectionScrollX = document.querySelectorAll('.sec-x').filter(function(container){
            return sizeSection(container);
        }); 
        if(!sectionScrollX){
            return;
        } 
        
        var isPlaceholderTop = sectionScrollX.offsetTop < document.documentElement.scrollTop;

        var isPlaceholderTop = sectionScrollX.offsetHeight > document.documentElement.scrollTop;

        let scrollHorizontally = isPlaceholderTop && isPlaceholderTop;

        if(scrollHorizontally){
            sectionScrollX.querySelector('.container_horizontal').scrollLeft += event.deltaY;
        }
    }

}