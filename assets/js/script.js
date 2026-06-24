document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("active")) {
          icon.className = "fas fa-times";
        } else {
          icon.className = "fas fa-bars";
        }
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        if (icon) icon.className = "fas fa-bars";
      });
    });
  }

  // ==========================================================================
  // NAVBAR SHRINK ON SCROLL (JS FALLBACK)
  // ==========================================================================
  const navbar = document.querySelector(".navbar");
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  // Initial check
  handleScroll();

  // Active link highlighter on scroll
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");
  
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href").substring(1) === current) {
        item.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // STATS COUNTER WITH INTERSECTION OBSERVER
  // ==========================================================================
  const counters = document.querySelectorAll(".stat-number");
  
  const startCounterAnimation = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";
    let current = 0;
    const duration = 2000; // 2 seconds
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

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px"
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // Trigger progress bar fills on scroll
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
  // CHART.JS INITIALIZATION (WITH OBSERVER)
  // ==========================================================================
  const chartCanvas = document.getElementById("companyChart");
  
  if (chartCanvas) {
    let chartInitialized = false;
    
    const initChart = () => {
      const ctx = chartCanvas.getContext("2d");
      
      // Custom styling for chart
      Chart.defaults.color = "#94a3b8";
      Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Efisiensi Mesin', 'Kualitas Produk (AX/A)', 'Kepatuhan K3', 'Ketersediaan Bahan Baku', 'Kemitraan Vokasi'],
          datasets: [{
            label: 'Indeks Kinerja (%)',
            data: [95, 92, 98, 88, 100],
            backgroundColor: [
              'rgba(59, 130, 246, 0.65)',  // Blue
              'rgba(6, 182, 212, 0.65)',   // Cyan
              'rgba(139, 92, 246, 0.65)',  // Purple
              'rgba(59, 130, 246, 0.65)',  // Blue
              'rgba(6, 182, 212, 0.65)'    // Cyan
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
            legend: {
              display: false
            },
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
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
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
  // GALLERY LIGHTBOX SYSTEM
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
        document.body.style.overflow = "hidden"; // Disable background scrolling
      });
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "auto"; // Re-enable background scrolling
    };
    
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }
    
    // Close on clicking outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Navigation arrows
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
    
    // Keyboard navigation
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
  // CONTACT FORM VALIDATION & INTERACTION
  // ==========================================================================
  const contactForm = document.getElementById("contactForm");
  
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("formName").value.strip || document.getElementById("formName").value;
      const email = document.getElementById("formEmail").value.strip || document.getElementById("formEmail").value;
      const message = document.getElementById("formMessage").value.strip || document.getElementById("formMessage").value;
      
      if (!name || !email || !message) {
        alert("Harap lengkapi semua bidang formulir.");
        return;
      }
      
      // Simulate submission success
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i> Mengirim...";
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
