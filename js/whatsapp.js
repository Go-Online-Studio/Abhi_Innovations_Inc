/* ===== WHATSAPP.JS — Form Handling & WhatsApp Integration ===== */
(function() {
  "use strict";

  const WA_NUMBER = "15878343689";

  /**
   * Determine if the user is on a mobile device based on userAgent and viewport width.
   */
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }

  /**
   * Generate the appropriate WhatsApp URL based on the device.
   */
  function getWhatsAppUrl(text = "") {
    const encoded = encodeURIComponent(text);
    return isMobileDevice()
      ? `https://wa.me/${WA_NUMBER}?text=${encoded}`
      : `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${encoded}`;
  }

  /**
   * Open WhatsApp in a new tab.
   */
  function openWA(message) {
    const url = getWhatsAppUrl(message);
    window.open(url, "_blank", "noopener");
  }

  /**
   * Show a toast notification.
   */
  function showToast(msg, type = "success") {
    let t = document.querySelector(".toast-notification");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast-notification";
      document.body.appendChild(t);
    }
    const icon = type === "success" ? "mdi:check-circle" : "mdi:alert-circle";
    t.innerHTML = `<span class="toast-icon"><span class="iconify" data-icon="${icon}"></span></span><span>${msg}</span>`;
    t.classList.remove("error", "success");
    t.classList.add(type);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
    }, 3500);
  }

  /**
   * Debounce helper.
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Dynamically update all WhatsApp links on the page.
   */
  const updateWALinks = debounce(function() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], .wa-dynamic-link').forEach(link => {
      // If the link has a specific text in its current href, preserve it
      let currentHref = link.getAttribute('href') || "";
      let text = "";
      if (currentHref.includes("text=")) {
        text = decodeURIComponent(currentHref.split("text=")[1]);
      }
      // Update href
      link.setAttribute('href', getWhatsAppUrl(text));
      link.classList.add('wa-dynamic-link'); // Mark as dynamic
    });
  }, 250);

  // Initial update and resize listener
  window.addEventListener("resize", updateWALinks);
  document.addEventListener("DOMContentLoaded", updateWALinks);

  /* ---------- Global Click Listener for WhatsApp Links ---------- */
  document.addEventListener("click", function(e) {
    const waBtn = e.target.closest(".wa-service, .wa-dynamic-link");
    if (!waBtn) return;

    // For .wa-service buttons that aren't <a> tags, handle them manually
    if (waBtn.classList.contains("wa-service") && waBtn.tagName !== "A") {
      const service = waBtn.dataset.service || "your services";
      openWA(`Hi Abhi Innovations,\n\nI'm interested in your "${service}" service. Could you please provide more details and schedule a consultation?\n\nThank you.`);
    }
  });

  /* ---------- Contact Form Handling ---------- */
  document.addEventListener("submit", function(e) {
    const form = e.target.closest("#contactForm");
    if (!form) return;
    
    e.preventDefault();
    
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const service = form.querySelector('[name="service"]');
    const message = form.querySelector('[name="message"]');
    
    /* Validate */
    let valid = true;
    form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    
    if (!name || !name.value.trim()) {
      name && name.classList.add("is-invalid");
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email && email.classList.add("is-invalid");
      valid = false;
    }
    if (!phone || !phone.value.trim()) {
      phone && phone.classList.add("is-invalid");
      valid = false;
    }
    if (!service || !service.value || service.value === "") {
      service && service.classList.add("is-invalid");
      valid = false;
    }
    
    if (!valid) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    const n = name.value.trim();
    const em = email.value.trim();
    const ph = phone ? phone.value.trim() : "N/A";
    const sv = service ? service.value : "General Inquiry";
    const msg = message ? message.value.trim() : "";
    
    const waMsg = `Hi Abhi Innovations,\n\n--- New Consultation Request ---\nName: ${n}\nEmail: ${em}\nPhone: ${ph}\nService: ${sv}\nMessage: ${msg}\n\nSent from website contact form.`;
    
    openWA(waMsg);
    form.reset();
    showToast("Redirecting to WhatsApp...", "success");
  });

  /* ---------- Input real-time validation clear ---------- */
  document.addEventListener("input", function(e) {
    if (e.target.classList.contains("is-invalid")) {
      e.target.classList.remove("is-invalid");
    }
  });

  /* ---------- Select placeholder color toggle ---------- */
  function updateSelectColor(select) {
    if (!select) return;
    if (select.value === "") {
      select.classList.add("is-placeholder");
    } else {
      select.classList.remove("is-placeholder");
    }
  }

  document.addEventListener("change", function(e) {
    if (e.target.classList.contains("form-select")) {
      updateSelectColor(e.target);
    }
  });

  // Initialize all selects
  document.querySelectorAll(".form-select").forEach(updateSelectColor);

})();
