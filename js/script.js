/* ===== SCRIPT.JS — Swiper, GSAP, Counters, FABs, Services ===== */
(function () {
  "use strict";

  function debounce(fn, ms = 150) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  }

  /* Hero Swiper */
  function initHeroSwiper() {
    const el = document.querySelector(".hero-swiper");
    if (!el) return;
    new Swiper(el, {
      loop: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: 1200,
    });
  }

  /* Vertical Anti-Gravity Testimonial Swiper */
  function initTestimonialSwiper() {
    const el = document.querySelector(".testimonial-swiper-v");
    if (!el) return;

    new Swiper(el, {
      direction: "vertical",
      loop: true,
      slidesPerView: 2,
      spaceBetween: 20,
      grabCursor: true, // enables drag-to-slide on mobile/desktop

      /* Free-mode + no momentum = perfectly linear, constant drift */
      freeMode: {
        enabled: true,
        momentum: false,
      },

      /* Slow, continuous autoplay — the "anti-gravity" float */
      autoplay: {
        delay: 0, // no pause between slides
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // pause when user hovers
      },

      speed: 3000, // ms per slide-height — slow & weightless
    });
  }

  /* Industry Swiper (Logos) */
  function initIndustrySwiper() {
    const el = document.querySelector(".industry-swiper");
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      speed: 800,
      breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 5 },
        1200: { slidesPerView: 6 },
      },
    });
  }

  /* Synchronized Counters — all finish in exactly 2s */
  function animateCounters(selector = "[data-count]") {
    const counters = document.querySelectorAll(selector);
    const DURATION = 2000;
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count"));
      const suffix = counter.dataset.suffix || "";
      let current = 0;
      const increment = target / (DURATION / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + suffix;
      }, 16);
    });
  }

  /* GSAP Animations + Parallax */
  function initGSAP() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
    gsap.registerPlugin(ScrollTrigger);

    /* Fade-up */
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    /* Fade-left */
    document.querySelectorAll('[data-animate="fade-left"]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
    });
    /* Fade-right */
    document.querySelectorAll('[data-animate="fade-right"]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
    });
    /* Fade-zoom */
    document.querySelectorAll('[data-animate="fade-zoom"]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
    });
    /* Stagger groups */
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      gsap.fromTo(
        Array.from(group.children),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        },
      );
    });

    /* Parallax images (Banners & CTA) */
    gsap.utils.toArray(".parallax-image").forEach((img) => {
      const isHero = img.closest(".hero-swiper");
      gsap.to(img, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: isHero ? ".hero-section" : img,
          start: isHero ? "top top" : "top bottom",
          end: isHero ? "bottom top" : "bottom top",
          scrub: 1,
        },
      });
    });

    /* Float elements */
    gsap.utils.toArray(".float-element").forEach((el) => {
      gsap.to(el, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });
    /* Dotted squares rotation */
    gsap.utils.toArray(".dotted-square").forEach((sq) => {
      gsap.to(sq, {
        rotation: "+=5",
        ease: "none",
        scrollTrigger: {
          trigger: sq,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    });

    /* Counter triggers — animate banner counters immediately, others when scrolled into view */
    const heroMetrics = document.querySelector(".hero-metrics");
    if (heroMetrics) {
      animateCounters(".hero-metrics [data-count]");
    }

    const statsSec = document.querySelector(".stats-section,.metric-grid");
    if (statsSec) {
      ScrollTrigger.create({
        trigger: statsSec,
        start: "top 80%",
        once: true,
        onEnter: () => animateCounters(".stats-section [data-count],.metric-grid [data-count]"),
      });
    } else if (!heroMetrics) {
      animateCounters();
    }
  }

  /* FABs */
  function initFABs() {
    const fabHTML = `<div class="fab-container">
    <a href="https://wa.me/15878343689?text=${encodeURIComponent("Hi Abhi Innovations, I'd like to learn more about your services.")}" class="fab-btn fab-whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span class="iconify" data-icon="mdi:whatsapp"></span></a>
    <button class="fab-btn fab-top" id="backToTop" aria-label="Back to top"><span class="iconify" data-icon="mdi:chevron-up"></span></button>
  </div>`;
    document.body.insertAdjacentHTML("beforeend", fabHTML);
    const btn = document.getElementById("backToTop");
    window.addEventListener(
      "scroll",
      debounce(() => {
        btn.classList.toggle("visible", window.scrollY > 500);
      }, 100),
      { passive: true },
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  /* Service Cards — icon-based, single button */
  const SERVICES = [
    {
      id: "process-audit",
      title: "Process Audit & Diagnosis",
      desc: "Deep dive analysis of your current workflows and physical processes to identify bottlenecks, waste, and optimization potential.",
      icon: "tabler:zoom-check",
      tag: "ANALYSIS",
    },
    {
      id: "process-redesign",
      title: "Process Redesign & Optimization",
      desc: "Reimagine workflows to eliminate inefficiencies — both digital business processes and physical operations.",
      icon: "tabler:settings",
      tag: "OPTIMIZATION",
    },
    {
      id: "automation-strategy",
      title: "Automation Strategy",
      desc: "Identify which processes to automate, select the right technologies, and build a phased roadmap that delivers ROI.",
      icon: "tabler:robot",
      tag: "AUTOMATION",
    },
    {
      id: "tool-implementation",
      title: "Tool Implementation",
      desc: "End-to-end deployment of business and software solutions — from selection to integration with your tech stack.",
      icon: "tabler:tool",
      tag: "IMPLEMENTATION",
    },
    {
      id: "team-training",
      title: "Team Training & Enablement",
      desc: "Hands-on training that gets your team confidently operating new tools and processes.",
      icon: "tabler:users",
      tag: "TRAINING",
    },
    {
      id: "ongoing-support",
      title: "Ongoing Support & Scaling",
      desc: "Continuous insights and strategic guidance as your business scales.",
      icon: "tabler:chart-line",
      tag: "SUPPORT",
    },
  ];

  function initServices() {
    const container = document.getElementById("services-grid");
    if (!container) return;
    container.innerHTML = SERVICES.map(
      (s, i) => `
    <div class="col-lg-4 col-md-6" data-animate="fade-up" style="transition-delay:${i * 80}ms">
      <article class="svc-card float-element">
        <div class="svc-icon"><span class="iconify" data-icon="${s.icon}"></span></div>
        <span class="svc-tag">${s.tag}</span>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <button class="btn-svc wa-service" data-service="${s.title}" aria-label="Quick consultation for ${s.title}">Quick Consultation</button>
      </article>
    </div>`,
    ).join("");
  }

  /* Blog filter */
  function initBlogFilter() {
    const tabs = document.querySelectorAll(".filter-tab");
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.dataset.filter;
        document.querySelectorAll(".blog-card-wrap").forEach((card) => {
          card.style.display =
            filter === "all" || card.dataset.category === filter
              ? "block"
              : "none";
        });
      });
    });
  }

  /* Footer rendering */
  function initFooter() {
    const footerEl = document.getElementById("footer");
    if (!footerEl) return;
    const footerHTML = `
<div class="site-footer">
  <div class="container">
    <div class="row gy-4">
      <div class="col-lg-4 footer-col">
        <div class="footer-brand">
          <img src="images/AbhiInnovationIncLogo.webp" alt="Abhi Innovations Inc." width="200" height="80">
        </div>
        <p class="footer-desc">Empowering businesses with strategic operations consulting, workflow automation, and digital transformation solutions.</p>
        <div class="footer-social">
          <a href="#" aria-label="LinkedIn"><span class="iconify" data-icon="mdi:linkedin"></span></a>
          <a href="#" aria-label="Twitter"><span class="iconify" data-icon="mdi:twitter"></span></a>
          <a href="#" aria-label="Instagram"><span class="iconify" data-icon="mdi:instagram"></span></a>
          <a href="#" aria-label="Facebook"><span class="iconify" data-icon="mdi:facebook"></span></a>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-12 footer-col">
        <h5 class="footer-heading">Quick Links</h5>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="col-lg-3 col-md-4 col-12 footer-col">
        <h5 class="footer-heading">Services</h5>
        <ul class="footer-links">
          <li><a href="services.html">Operations Consulting</a></li>
          <li><a href="services.html">Workflow Automation</a></li>
          <li><a href="services.html">AI Integration</a></li>
          <li><a href="services.html">Digital Transformation</a></li>
        </ul>
      </div>
      <div class="col-lg-3 col-md-4 footer-col">
        <h5 class="footer-heading">Contact</h5>
        <ul class="footer-contact">
          <li><span class="iconify" data-icon="mdi:map-marker-outline"></span><a href="https://maps.app.goo.gl/Pzya845Ge3csgBV89" target="_blank" rel="noopener">Unit 430, 700 8 Ave SW, Calgary, AB T2P 1H2</a></li>
          <li><span class="iconify" data-icon="mdi:phone-outline"></span><a href="tel:+15878343689">+1 587-834-3689</a></li>
          <li><span class="iconify" data-icon="mdi:email-outline"></span><a href="mailto:Info@abhi-innovations.com">Info@abhi-innovations.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()}  All Rights Reserved By Abhi Innovations Inc. Designed And Developed By <a href="https://shriiitrackingsolution.in/" target="_blank"> <b>Shriii&nbsp;Tracking&nbsp;Solution</b></a></p>
    </div>
  </div>
</div>`;
    footerEl.innerHTML = footerHTML;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroSwiper();
    initTestimonialSwiper();
    initFABs();
    initServices();
    initBlogFilter();
    initFooter();
    initIndustrySwiper();
    setTimeout(initGSAP, 200);
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh();
    }, 250),
  );
})();
