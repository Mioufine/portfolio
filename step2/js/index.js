'use strict';
class ScrollPage {

  banner = null;
  

  constructor(selector) {
    this.banner = document.querySelector(selector);

    if(this.banner === null){return;}; 
    window.addEventListener('scroll', this.bannerClassToggle.bind(this));
    this.sections = document.querySelectorAll('[id]');
  }
  bannerClassToggle(){
    const isFixed = (window.scrollY > this.banner.offsetHeight)? true: false;
    this.banner.classList.toggle(this.options.class,isFixed);
  }
}




const sec2Scroll = document.querySelector('#tl');
const cameraX = document.querySelector('.camera');




function navScroll(){

  let ban = document.getElementById('bannerNav');

  if (window.scrollY > ban.offsetTop) {
    ban.classList.add('banScroll');

  }
  else {
    ban.classList.remove('banScroll');
  }
};


/*
function timelineOver (){
  
  console.log('la souris survole la section');
  document.body.style.overflowY = 'hidden';
  
  }
function timelineOut (){
  document.body.style.overflowY = 'auto';
}
*/

function winSec2Scroll(event) {
  const section2 = document.querySelector('#sec2');
  const timeline = document.querySelector('#tl');

  console.log(event);
  if(window.scrollY > section2.offsetTop - 60){
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'auto';
    
    
    //timelineScrollX();
  } else if (window.scrollY < section2.offsetTop - 60) {
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
  }
  
   
}


window.addEventListener("scroll", navScroll);
// sec2Scroll.addEventListener('mouseover', timelineOver);
// sec2Scroll.addEventListener('mouseout', timelineOut);
window.addEventListener('scroll', winSec2Scroll)

// --- Exemple de l'evenement Wheel() --- //
const postScroll = document.getElementById("post-wrapper");
let scrollingHorizontally = true;

postScroll.addEventListener("wheel", (event) => {
  if (scrollingHorizontally) {
    postScroll.scrollBy({
      left: event.deltaY < 0 ? -70 : 70,
    });
    event.preventDefault();

    // check if the user has reached the end of the slider
    if (postScroll.scrollLeft >= postScroll.scrollWidth - postScroll.clientWidth) {
      scrollingHorizontally = false;
      postScroll.style.overflowY = "auto";
    }
  } else {
    // (scroll the page up/down)
    return true;
  }
});

