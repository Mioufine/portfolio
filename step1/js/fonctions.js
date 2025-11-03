'use strict';

// Navigation scroll functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    toggleMobileMenu();
    
    // Form submission handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Form is valid, handle submission
                console.log('Form submitted successfully');
                // Add your form submission logic here
            }
        });
    }
});

// Changer le scrollY en scrollX au moment ou l'utilisateur arrive à la section 2
// Quand il arrive a la fin du contenu, il repasse en scrollY


let isHorizontalScrolling = false;
let section2 = document.getElementById('sec2'); // Assuming section 2 has this class
let timelineContent = document.getElementById('timelineScrollX');

window.addEventListener("scroll", handleScrollDirection);

function handleScrollDirection() {
  let section2Top = section2.offsetTop;
  let section2Bottom = section2Top + section2.offsetHeight;
  let currentScrollY = window.scrollY;
  
  // Check if user reaches section 2
  if (currentScrollY >= section2Top && currentScrollY <= section2Bottom && !isHorizontalScrolling) {
    // Switch to horizontal scrolling
    isHorizontalScrolling = true;
    document.body.style.overflowY = 'hidden';
    
    // Convert vertical scroll to horizontal movement
    let scrollProgress = (currentScrollY - section2Top) / (section2Bottom - section2Top);
    
    timelineContent.style.transform = `translateX(-${scrollProgress * maxTranslateX}px)`;
  }
  
  // Check if user reaches end of horizontal content
  if (currentScrollY > section2Bottom && isHorizontalScrolling) {
    // Switch back to vertical scrolling
    isHorizontalScrolling = false;
    document.body.style.overflowY = 'auto';
    timelineContent.style.transform = 'translateX(0px)';
  }
}


// avec scroll snap changing

const mainElem = document.querySelector("main");
const sectionCount = 21;
let n = 1;


mainElem.addEventListener("scrollsnapchanging", (event) => {
  const previousPending = document.querySelector(".pending");
  if (previousPending) {
    previousPending.classList.remove("pending");
  }

  event.snapTargetBlock.classList.add("pending");
});
mainElem.addEventListener("scrollsnapchange", (event) => {
  const currentlySnapped = document.querySelector(".select-section");
  if (currentlySnapped) {
    currentlySnapped.classList.remove("select-section");
  }

  event.snapTargetBlock.classList.add("select-section");
});

onClickBanner(event) {
        // element.matches() renvoie true lorsque l'élément peut être selectionné
        if (!event.target.matches('a[href^="#"]')) {return;};
        event.preventDefault(); // Il arrête l'action du navigateur sur l'élément ciblé

        // Accéder à la section ciblée par le lien
        const selectorSection = event.target.getAttribute('href');
        const section = document.querySelector(selectorSection);

        window.scrollTo({
            top: section.offsetTop, // offsetTop : coordonnée relative de la section par rapport à l'élément parente
            left:0, // pour scroller horizontallement en troisieme argument
            behavior:'smooth',});

    }