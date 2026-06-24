/* =============================================
   Grace corner takeaway — script.js
   =============================================
   Includes:
   1. Slideshow (bug fixed)
   2. burger / mobile nav
   3. Contact form validation + toast feedback
   4. Newsletter form validation + toast feedback
   5. Scroll-to-top button
   6. Sticky navbar on scroll
   7. Smooth scroll for anchor links
   8. Lazy image loading observer
   9. Active nav link highlighting
   ============================================= */


/* ─── 1. SLIDESHOW ──────────────────────────── */
let slideIndex = 1;

// Only initialise the slideshow if slide elements exist on this page
if (document.getElementsByClassName("mySlides").length > 0) {
  showSlides(slideIndex);
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots   = document.getElementsByClassName("dot");

  if (slides.length === 0) return; // guard: no slideshow on this page

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1)             { slideIndex = slides.length; }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  if (dots.length > 0) {
    dots[slideIndex - 1].className += " active"; // fixed: was "slidesIndex"
  }
}

// Auto-advance the slideshow every 5 seconds
let autoSlideInterval = setInterval(() => {
  if (document.getElementsByClassName("mySlides").length > 0) {
    plusSlides(1);
  }
}, 5000);

// Pause auto-slide when user manually navigates
document.querySelectorAll(".prev, .next, .dot").forEach(el => {
  el.addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => plusSlides(1), 5000);
  });
});


/* ─── 2. HAMBURGER / MOBILE NAV ─────────────── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
const submenuToggles = document.querySelectorAll(".submenu-toggle");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Allow keyboard activation of hamburger
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hamburger.click();
    }
  });
}

// Close nav when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (hamburger && navLinks &&
      !hamburger.contains(e.target) &&
      !navLinks.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  }
});

// Toggle submenus on mobile tap
submenuToggles.forEach(toggle => {
  toggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;
      submenu.classList.toggle("open");
    }
  });
});


/* ─── 3. TOAST NOTIFICATION SYSTEM ─────────── */
/**
 * showToast(message, type)
 * type: "success" | "error" | "info"
 */
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className   = `toast toast--${type} toast--visible`;

  setTimeout(() => {
    toast.className = "toast";
  }, 4000);
}


/* ─── 4. FORM VALIDATION HELPERS ───────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setFieldError(fieldId, hasError) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  if (hasError) {
    el.classList.add("field--error");
  } else {
    el.classList.remove("field--error");
  }
}


/* ─── 5. CONTACT FORM HANDLER ───────────────── */
function handleContactSubmit() {
  const fname   = document.getElementById("fname");
  const lname   = document.getElementById("lname");
  const ename   = document.getElementById("ename");
  const subject = document.getElementById("subject");
  const btn     = document.getElementById("submitBtn");

  if (!fname || !lname || !ename || !subject) return;

  // Clear previous errors
  ["fname","lname","ename","subject"].forEach(id => setFieldError(id, false));

  let valid = true;
  const errors = [];

  if (fname.value.trim().length < 2) {
    setFieldError("fname", true);
    errors.push("First name must be at least 2 characters.");
    valid = false;
  }
  if (lname.value.trim().length < 2) {
    setFieldError("lname", true);
    errors.push("Last name must be at least 2 characters.");
    valid = false;
  }
  if (!isValidEmail(ename.value)) {
    setFieldError("ename", true);
    errors.push("Please enter a valid email address.");
    valid = false;
  }
  if (subject.value.trim().length < 10) {
    setFieldError("subject", true);
    errors.push("Message must be at least 10 characters.");
    valid = false;
  }

  if (!valid) {
    showToast("⚠️ " + errors[0], "error");
    return;
  }

  // Simulate sending — replace with real fetch() / AJAX call
  btn.disabled    = true;
  btn.textContent = "Sending…";

  setTimeout(() => {
    // Simulate 90% success rate for demo purposes
    const success = Math.random() > 0.1;

    if (success) {
      showToast("✅ Message sent! We'll get back to you within 24 hours.", "success");
      fname.value   = "";
      lname.value   = "";
      ename.value   = "";
      subject.value = "";
    } else {
      showToast("❌ Something went wrong. Please try again or call us directly.", "error");
    }

    btn.disabled    = false;
    btn.textContent = "Send Message";
  }, 1200);
}


/* ─── 6. NEWSLETTER FORM HANDLER ────────────── */
function handleNewsletterSubmit() {
  const emailInput = document.getElementById("newsletterEmail");
  if (!emailInput) return;

  if (!isValidEmail(emailInput.value)) {
    showToast("⚠️ Please enter a valid email address.", "error");
    emailInput.classList.add("field--error");
    return;
  }

  emailInput.classList.remove("field--error");

  // Simulate subscription — replace with real API call
  setTimeout(() => {
    showToast("🎉 You're subscribed! Look out for exclusive offers.", "success");
    emailInput.value = "";
  }, 600);
}


/* ─── 7. SCROLL-TO-TOP BUTTON ───────────────── */
function createScrollTopButton() {
  const btn = document.createElement("button");
  btn.id        = "scrollTopBtn";
  btn.innerHTML = "&#8679;";
  btn.title     = "Back to top";
  btn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
createScrollTopButton();


/* ─── 8. STICKY NAVBAR WITH SHADOW ON SCROLL ── */
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* ─── 9. SMOOTH SCROLL FOR ANCHOR LINKS ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ─── 10. LAZY LOAD IMAGES ───────────────────── */
function initLazyImages() {
  const images = document.querySelectorAll("img[data-src]");
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  }, { rootMargin: "100px" });

  images.forEach(img => observer.observe(img));
}
initLazyImages();


/* ─── 11. ACTIVE NAV LINK HIGHLIGHTER ───────── */
(function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === currentPage) {
      link.classList.add("active");
    }
  });
})();
let slideIndex = 1;
showSlides(slideIndex);

// Thumbnail image control
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  // Hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Remove active class from dots
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Show current slide
  slides[slideIndex - 1].style.display = "block";

  // Activate current dot
  dots[slideIndex - 1].className += " active";
}