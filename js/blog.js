/* ===== BLOG.JS ===== */
(function () {
  "use strict";

  let allBlogs = [];

  async function loadBlogs() {
    try {
      const res = await fetch("data/blogs.json");
      allBlogs = await res.json();
      renderFeatured(allBlogs);
      renderGrid(allBlogs.filter((b) => !b.featured));
    } catch (e) {
      console.warn("Blog load error:", e);
    }
  }

  function renderFeatured(blogs) {
    const featured = blogs.find((b) => b.featured);
    if (!featured) return;
    const el = document.getElementById("featured-post");
    if (!el) return;
    el.innerHTML = `
    <div class="featured-post">
      <div class="row g-0 align-items-stretch">
        <div class="col-md-5"><div class="fp-img h-100"><img src="${featured.image}" alt="${featured.title}" width="800" height="500" loading="lazy" class="scroll-zoom"></div></div>
        <div class="col-md-7 d-flex align-items-center">
          <div class="fp-content">
            <span class="featured-badge">Featured</span>
            <div class="blog-meta mt-2"><span class="blog-category">${featured.category}</span><span class="blog-date">${featured.date}</span></div>
            <h2 class="mt-2" style="font-size:clamp(1.2rem,2.5vw,1.8rem)">${featured.title}</h2>
            <p class="mt-2">${featured.excerpt}</p>
            <div class="d-flex align-items-center gap-3 mt-3">
              <span class="read-time">${featured.readTime}</span>
              <a href="#" class="btn-primary-glow" style="font-size:.78rem;padding:9px 22px">Read Article <span class="iconify" data-icon="mdi:arrow-right"></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderGrid(blogs) {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;
    grid.innerHTML = blogs
      .map(
        (b) => `
    <div class="col-lg-4 col-md-6 blog-card-wrap" data-category="${b.category.toLowerCase().replace(/\s+/g, "-")}">
      <article class="blog-card float-element">
        <div class="blog-image"><img src="${b.image}" alt="${b.title}" width="800" height="500" loading="lazy" class="scroll-zoom"></div>
        <div class="blog-content">
          <div class="blog-meta"><span class="blog-category">${b.category}</span><span class="blog-date">${b.date}</span></div>
          <h3 class="blog-title">${b.title}</h3>
          <p class="blog-excerpt">${b.excerpt}</p>
          <div class="blog-footer"><span class="read-time">${b.readTime}</span><a href="#" class="btn-read-more">Read More →</a></div>
        </div>
      </article>
    </div>`,
      )
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadBlogs();
    /* Filter tabs */
    document.addEventListener("click", function (e) {
      const tab = e.target.closest(".filter-tab");
      if (!tab) return;
      document
        .querySelectorAll(".filter-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      document.querySelectorAll(".blog-card-wrap").forEach((card) => {
        card.style.display =
          filter === "all" ||
          card.dataset.category === filter.toLowerCase().replace(/\s+/g, "-")
            ? "block"
            : "none";
      });
    });
  });
})();
