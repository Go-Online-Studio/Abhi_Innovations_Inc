/* ===== CRITICAL.JS — Navbar, Footer, Preloader, Scroll Effects ===== */
(function(){
"use strict";

/* ---------- Preloader ---------- */
const preloaderHTML=`<div class="preloader" id="preloader"><div class="preloader-spinner"></div></div>`;
document.body.insertAdjacentHTML("afterbegin",preloaderHTML);
window.addEventListener("load",()=>{
  const p=document.getElementById("preloader");
  if(p){p.classList.add("loaded");setTimeout(()=>p.remove(),600)}
});

/* ---------- Navbar ---------- */
const currentPage=window.location.pathname.split("/").pop()||"index.html";
function isActive(page){return currentPage===page?"active":""}
function navActive(page){return currentPage===page?"active":""}

const navLinks = `
  <li class="nav-item"><a class="nav-link ${navActive("index.html")}" href="index.html">Home</a></li>
  <li class="nav-item"><a class="nav-link ${navActive("about.html")}" href="about.html">About</a></li>
  <li class="nav-item"><a class="nav-link ${navActive("services.html")}" href="services.html">Services</a></li>
  <li class="nav-item"><a class="nav-link ${navActive("blog.html")}" href="blog.html">Blog</a></li>
  <li class="nav-item"><a class="nav-link ${navActive("contact.html")}" href="contact.html">Contact</a></li>
  <li class="nav-item"><a class="btn-svc mt-4 mt-lg-0" href="contact.html" >Book a Call</a></li>
`;

const navbarHTML = `
<!-- Desktop Navbar -->
<nav class="navbar navbar-expand-lg" aria-label="Main navigation">
  <div class="container">
    <a class="navbar-brand" href="index.html" aria-label="Abhi Innovations Home">
      <img src="images/AbhiInnovationIncLogo.webp" alt="Abhi Innovations Inc. Logo" width="200" height="80">
    </a>
    <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-label="Toggle navigation">
      <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
    </button>
    
    <!-- Desktop Menu (Hidden on mobile) -->
    <div class="collapse navbar-collapse" id="desktopMenu">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-4">
        ${navLinks}
      </ul>
    </div>
  </div>
</nav>

<!-- Mobile Offcanvas Menu (Outside navbar container) -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="mobileMenuLabel" style="color:var(--gold)">Menu</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <ul class="navbar-nav d-flex flex-column gap-1">
      ${navLinks}
    </ul>
  </div>
</div>
`;
document.getElementById("mainNavbar").innerHTML=navbarHTML;

/* ---------- Navbar Scroll Effect ---------- */
const nav=document.querySelector(".navbar");
let lastScroll=0;
function handleScroll(){
  const y=window.scrollY;
  if(y>60){nav.classList.add("scrolled")}else{nav.classList.remove("scrolled")}
  lastScroll=y;
}
window.addEventListener("scroll",handleScroll,{passive:true});
handleScroll();



})();
