class ScrollX {
    container=document.getElementById('sec-x');
    init () {
        this.secXContainerSize();
        window.addEventListener("wheel",this.scrollChange.bind(this));
    }
    sizeSection (element){
        const rect = element.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > document.documentElement.clientHeight;
    }

    secXContainerSize() {
        document.getElementById('sec-x').onbeforematch(function(container) {
            const secXContainerHeight = container.querySelector('.container_horizontal').scrollWight;
            container.setAttribute('style', 'height:' + secXContainerHeight + 'px');
        })
    }
    
    scrollChange (event) {
        const sectionScrollX = Array.from(document.getElementById('sec-x')).filter(function(container){
            return sizeSection(container);
        })[0]; 
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