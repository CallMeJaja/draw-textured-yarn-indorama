document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // NAVBAR (Stisla toggle + scroll shrink)
  // ==========================================================================
  const navbar = document.getElementById("navbar");
  const navToggle = document.querySelector("[data-stisla-navbar-toggle]");
  const navMenu = document.querySelector(".navbar__menu");

  // Scroll shrink
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll(".navbar__button").forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
      }
    });
  });

  // Active link highlighter on scroll
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".navbar__button");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.removeAttribute("data-state");
      if (item.getAttribute("href").substring(1) === current) {
        item.setAttribute("data-state", "active");
      }
    });
  });

  // ==========================================================================
  // STATS COUNTER
  // ==========================================================================
  const counters = document.querySelectorAll(".stat-number");

  const startCounterAnimation = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";
    let current = 0;
    const duration = 2000;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.innerText = target + suffix;
        clearInterval(timer);
      } else {
        counter.innerText = Math.floor(current) + suffix;
      }
    }, stepTime);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // ==========================================================================
  // PROGRESS BAR FILLS ON SCROLL
  // ==========================================================================
  const progressBars = document.querySelectorAll(".progress-bar-fill");
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute("data-width");
        bar.style.width = `${targetWidth}%`;
      }
    });
  }, { threshold: 0.1 });

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });

  // ==========================================================================
  // CHART.JS (with observer)
  // ==========================================================================
  const chartCanvas = document.getElementById("companyChart");

  if (chartCanvas) {
    let chartInitialized = false;

    const initChart = () => {
      const ctx = chartCanvas.getContext("2d");

      Chart.defaults.color = "#94a3b8";
      Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Efisiensi Mesin', 'Kualitas Produk (AA/A)', 'Kepatuhan K3', 'Ketersediaan Bahan Baku', 'Kemitraan Vokasi'],
          datasets: [{
            label: 'Indeks Kinerja (%)',
            data: [95, 92, 98, 88, 100],
            backgroundColor: [
              'rgba(59, 130, 246, 0.65)',
              'rgba(6, 182, 212, 0.65)',
              'rgba(139, 92, 246, 0.65)',
              'rgba(59, 130, 246, 0.65)',
              'rgba(6, 182, 212, 0.65)'
            ],
            borderColor: [
              '#3b82f6',
              '#06b6d4',
              '#8b5cf6',
              '#3b82f6',
              '#06b6d4'
            ],
            borderWidth: 1.5,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#f8fafc',
              bodyColor: '#f8fafc',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 10,
              displayColors: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    };

    const chartObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !chartInitialized) {
          initChart();
          chartInitialized = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    chartObserver.observe(chartCanvas);
  }

  // ==========================================================================
  // GALLERY LIGHTBOX
  // ==========================================================================
  const galleryItems = document.querySelectorAll(".gallery-card-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const lightboxPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
  const lightboxNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;

  if (galleryItems.length > 0 && lightbox) {
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = index;
      const currentItem = galleryItems[currentIndex];
      const imgUrl = currentItem.getAttribute("data-image");
      const caption = currentItem.getAttribute("data-caption");

      lightboxImg.src = imgUrl;
      lightboxCaption.innerText = caption;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        showImage(index);
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = galleryItems.length - 1;
        showImage(prevIndex);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", (e) => {
        e.stopPropagation();
        let nextIndex = currentIndex + 1;
        if (nextIndex >= galleryItems.length) nextIndex = 0;
        showImage(nextIndex);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("active")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") {
          let prevIndex = currentIndex - 1;
          if (prevIndex < 0) prevIndex = galleryItems.length - 1;
          showImage(prevIndex);
        }
        if (e.key === "ArrowRight") {
          let nextIndex = currentIndex + 1;
          if (nextIndex >= galleryItems.length) nextIndex = 0;
          showImage(nextIndex);
        }
      }
    });
  }

  // ==========================================================================
  // CONTACT FORM
  // ==========================================================================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("formName").value.trim();
      const email = document.getElementById("formEmail").value.trim();
      const message = document.getElementById("formMessage").value.trim();

      if (!name || !email || !message) {
        alert("Harap lengkapi semua bidang formulir.");
        return;
      }

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = "<span class='spinner spinner--sm'></span> Mengirim...";
      submitBtn.disabled = true;

      setTimeout(() => {
        alert(`Terima kasih ${name}, pesan Anda telah simulasi terkirim! (Static Demo)`);
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});
