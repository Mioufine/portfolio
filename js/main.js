import Controller from "./modules/Controller.js";

try {
   document.addEventListener('DOMContentLoaded', () => {
      const controller = new Controller(
         'nav_bar',  
         'main',          
         '.container'     // Sélectionne toutes les sections avec class="container"
      );
   });
 } catch (error) {
    console.log(error);
 } finally {
    
 }