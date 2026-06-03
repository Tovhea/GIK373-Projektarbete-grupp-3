// Sandra Eriksson Gustav Westman Tove Hübinette


/* 

Sidan börjar ladda
 → overflow: hidden → inget sticker ut
Allt är laddat → JS lägger till .loaded på body
overflow: visible aktiveras → sidan visas normalt

*/

window.addEventListener('load', function() {
  document.querySelector('[data-preloader]').classList.add('loaded');
  document.body.classList.add('loaded');
});

/*för att se loadern om det går för snabbt:
window.addEventListener('load', function() {
    setTimeout(function() {
      document.querySelector('[data-preloader]').classList.add('loaded');
      document.body.classList.add('loaded');
    }, 3000); // väntar 3 sekunder
  }); */


  /**
 * MOBILE NAV TOGGLE
 */

  /*hämtar elementen för hamburgermenyn*/
const navToggler = document.querySelector('[data-nav-toggler]');/*vi hämtar in nav-toggle-btn från html*/
const navbar = document.querySelector('[data-navbar]'); /*vi hämtar in */
const header = document.querySelector('[data-header]'); 
const navLinks = document.querySelectorAll('[data-nav-link]'); 

/*öppna och stänga hamburgermenyn*/
navToggler .addEventListener('click', function () {
navbar .classList.toggle('active');
header .classList.toggle('active'); 

  /*byt ikon mellan menyn och kryss*/
  const isOpen = navbar.classList.contains('active');
  navToggler.querySelector('ion-icon').setAttribute (
    'name',
    isOpen ? 'close-outline' : 'menu-outline'
  );

});

/*stäng menyn när man klickar en länk*/
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navbar.classList.remove('active');
    header.classList.remove('active');
    navToggler.querySelector('ion-icon').setAttribute('name', 'menu-outline');

  });
});



  /**
   * HEADER
 * Aktiv header när fönstret scrollas till 50 px
 */

const activeHeader = function () {
  window.scrollY > 50 ? header.classList.add("active")
  : header.classList.remove("active");
}

window.addEventListener("scroll", activeHeader);
