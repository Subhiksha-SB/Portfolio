// JavaScript Controller for Premium Grainy Mesh Portfolio

// --- Web3Forms Access Key ---
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

// --- Default Profile & Portfolio Data ---
const DEFAULT_PORTFOLIO_DATA = {
  subheading: "SUBHIKSHA",
  heading: "Creative <i>visual</i> designer",
  bio: "I am SUBHIKSHA, i create <i>unconventional</i> yet functional & visually pleasing interfaces for the mobile and web",
  phone: "6381309368",
  email: "sbsubhiksha139@gmail.com",
  location: "Coimbatore",
  linkedin: "https://www.linkedin.com/in/subhiksha-sb-4854bb407/",
  instagram: "https://www.instagram.com/_subx._/",
  github: "https://github.com/Subhiksha-SB",
  skills: [
    "UI/UX Design",
    "Front-End Development",
    "Web Aesthetics",
    "Figma Prototyping"
  ],
  projects: [
    {
      name: "Illustrations",
      category: "Illustrations",
      description: "Custom digital illustrations exploring modern interfaces, outline sketch vectors, and fine geometric compositions.",
      link: "#"
    },
    {
      name: "Brand Identity",
      category: "Branding",
      description: "A complete visual identity system featuring custom typography, a minimalist color palette, and premium brand guidelines.",
      link: "#"
    },
    {
      name: "Mobile & Web",
      category: "UI/UX Design",
      description: "Eco-friendly mobile designs featuring bespoke UI layout components, hierarchy systems, and organic typography structures.",
      link: "#"
    }
  ]
};

// State Store
let portfolioData = {};
let activeIndex = 0;
let isAutoplay = true;
const AUTOPLAY_DURATION = 5000; // 5 seconds
let progressStartTime = 0;
let animationFrameId = null;

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadData();
  setupTabListeners();
  setupLensTracker();
  setupCustomizerListeners();
  setupContactFormListener();
});

// --- Auto-Drifting Magnifying Glass Lens ---
function setupLensTracker() {
  const trigger = document.getElementById("hero-interactive-trigger");
  if (!trigger) return;

  let isMouseInside = false;
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  const lensStartTime = Date.now();

  // Auto-drift path: smooth sinusoidal figure-8 across the title area
  function getAutoDriftPos(time) {
    const rect = trigger.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    // Slow, organic drift using combined sine waves
    const t = time * 0.0004; // Speed factor
    const x = w * 0.15 + (w * 0.7) * (0.5 + 0.5 * Math.sin(t * 1.1 + 0.3));
    const y = h * 0.2 + (h * 0.6) * (0.5 + 0.5 * Math.sin(t * 0.7 + 1.7));
    return { x, y };
  }

  // Animation loop: blend between auto-drift and mouse position
  function animateLens() {
    const elapsed = Date.now() - lensStartTime;
    let targetX, targetY;

    if (isMouseInside) {
      targetX = mouseX;
      targetY = mouseY;
    } else {
      const auto = getAutoDriftPos(elapsed);
      targetX = auto.x;
      targetY = auto.y;
    }

    // Smooth interpolation (ease toward target)
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    trigger.style.setProperty("--lens-x", `${currentX}px`);
    trigger.style.setProperty("--lens-y", `${currentY}px`);

    requestAnimationFrame(animateLens);
  }

  // Start the lens animation immediately
  const initPos = getAutoDriftPos(0);
  currentX = initPos.x;
  currentY = initPos.y;
  requestAnimationFrame(animateLens);

  // Track mouse when hovering over the title
  trigger.addEventListener("mousemove", (e) => {
    const rect = trigger.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isMouseInside = true;
  });

  trigger.addEventListener("mouseleave", () => {
    isMouseInside = false;
  });

  // Click anywhere on hero section → scroll to page 2
  const heroSection = document.getElementById("about-section");
  if (heroSection) {
    heroSection.addEventListener("click", (e) => {
      // Don't trigger on nav buttons, theme toggle, or links
      if (e.target.closest(".site-header") || 
          e.target.closest(".customizer-trigger") ||
          e.target.closest("a") || 
          e.target.closest("button")) return;
      
      const targetSection = document.getElementById("portfolio-section");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Smooth scroll helper for down arrow
  const scrollBtn = document.getElementById("hero-scroll-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.getElementById("portfolio-section");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Reveal bio text and skills with slide-up animation on scroll
  setupPortfolioReveal();
}

// --- Animated Text Reveal for Page 2 ---
function setupPortfolioReveal() {
  const bio = document.querySelector(".bio-paragraph");
  const skills = document.querySelector(".skills-block");
  if (!bio && !skills) return;

  const scrollContainer = document.getElementById("main-container");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      } else {
        // Reset when scrolling away so it re-animates on return
        entry.target.classList.remove("revealed");
      }
    });
  }, { 
    root: scrollContainer,
    threshold: 0.2 
  });

  if (bio) observer.observe(bio);
  if (skills) observer.observe(skills);
}

// --- Tab Scroll Navigation and Active Highlights ---
function setupTabListeners() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const scrollContainer = document.getElementById("main-container");

  navButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-tab");
      const targetSection = document.getElementById(`${targetTab}-section`);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }

      // Update active styling
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Highlight navigation button based on scrolling using IntersectionObserver
  if (scrollContainer) {
    const sections = document.querySelectorAll(".snap-section");
    const observerOptions = {
      root: scrollContainer,
      rootMargin: "-25% 0px -50% 0px", // Trigger when section fills middle of container
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (!id) return;
          const tabName = id.replace("-section", "");
          
          navButtons.forEach(btn => {
            if (btn.getAttribute("data-tab") === tabName) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// --- Data Core Management ---

// Load data from LocalStorage or fallback to defaults
function loadData() {
  const cached = localStorage.getItem("pastel_portfolio_data");
  if (cached) {
    try {
      portfolioData = JSON.parse(cached);
      
      // Migrate legacy text format to visual designer format
      let changed = false;
      if (portfolioData.subheading === "Maxine Ficheux" || portfolioData.subheading === "Subhiksha" || !portfolioData.linkedin) {
        portfolioData.subheading = "SUBHIKSHA";
        portfolioData.email = "sbsubhiksha139@gmail.com";
        portfolioData.phone = "6381309368";
        portfolioData.location = "Coimbatore";
        portfolioData.linkedin = DEFAULT_PORTFOLIO_DATA.linkedin;
        portfolioData.instagram = DEFAULT_PORTFOLIO_DATA.instagram;
        portfolioData.github = DEFAULT_PORTFOLIO_DATA.github;
        changed = true;
      }
      
      if (!portfolioData.heading || portfolioData.heading === "ABOUT ME" || portfolioData.heading === "Portfolio") {
        portfolioData.heading = DEFAULT_PORTFOLIO_DATA.heading;
        changed = true;
      }
      
      if (!portfolioData.bio || portfolioData.bio.includes("brand has a story") || portfolioData.bio.includes("digital artisan")) {
        portfolioData.bio = DEFAULT_PORTFOLIO_DATA.bio;
        changed = true;
      }
      
      if (changed) {
        localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
      }
    } catch (e) {
      portfolioData = { ...DEFAULT_PORTFOLIO_DATA };
    }
  } else {
    portfolioData = { ...DEFAULT_PORTFOLIO_DATA };
  }
  
  // Set default active index to 0
  activeIndex = 0;
  renderData();
}

// Write current state to LocalStorage
function saveData(newData) {
  portfolioData = newData;
  localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
  activeIndex = 0; // Reset carousel index
  renderData();
  showToast("Portfolio details successfully applied & saved!");
}

// Reset LocalStorage and restore defaults
function resetData() {
  localStorage.removeItem("pastel_portfolio_data");
  portfolioData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  activeIndex = 0; // Reset carousel index
  renderData();
  showToast("Restored all elements to original template defaults.");
}

// Renders the entire profile based on current state variables
function renderData() {
  // Update browser page Title and Meta Description dynamically for SEO
  document.title = `${portfolioData.subheading} | Creative Portfolio`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", `Discover the creative portfolio of ${portfolioData.subheading}.`);
  }

  // Bind values to UI elements
  document.getElementById("display-subheading").textContent = portfolioData.subheading;
  const subTag = document.getElementById("display-subheading-tag");
  if (subTag) subTag.textContent = portfolioData.subheading;
  
  // Display heading layers (mag lens support HTML tags like <i>)
  document.getElementById("display-heading-bg").innerHTML = portfolioData.heading;
  document.getElementById("display-heading-lens").innerHTML = portfolioData.heading;
  
  // Display bio (supports HTML tags)
  document.getElementById("display-bio").innerHTML = portfolioData.bio;
  
  // Set Contact quick-bars
  const displayLoc = document.getElementById("display-location");
  if (displayLoc) displayLoc.textContent = portfolioData.location;

  // Set LinkedIn link
  const linkedinBtn = document.getElementById("social-linkedin");
  if (linkedinBtn) {
    linkedinBtn.setAttribute("href", portfolioData.linkedin || "#");
  }

  // Set Instagram link
  const instagramBtn = document.getElementById("social-instagram");
  if (instagramBtn) {
    instagramBtn.setAttribute("href", portfolioData.instagram || "#");
  }

  // Set GitHub link
  const githubBtn = document.getElementById("social-github");
  if (githubBtn) {
    githubBtn.setAttribute("href", portfolioData.github || "#");
  }

  // Set detailed contact section values
  document.getElementById("display-contact-email").textContent = portfolioData.email;
  document.getElementById("display-contact-phone").textContent = portfolioData.phone;

  // Render Skill Tags
  const skillsContainer = document.getElementById("display-skills");
  skillsContainer.innerHTML = "";
  if (portfolioData.skills && portfolioData.skills.length > 0) {
    portfolioData.skills.forEach(skill => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = skill;
      skillsContainer.appendChild(tag);
    });
  } else {
    skillsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.9rem;">No skills specified yet.</span>`;
  }

  // Render Stacked Project Cards & Controls
  renderProjectsCarousel();
}

// --- 3D Stacked Card Deck Carousel Operations ---
function renderProjectsCarousel() {
  const projectsGrid = document.getElementById("display-projects");
  const dotsContainer = document.getElementById("carousel-dots-container");
  
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = "";
  if (dotsContainer) dotsContainer.innerHTML = "";
  
  const projects = portfolioData.projects || [];
  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 0; width: 100%;">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No projects added yet.</p>
        <p style="font-size: 0.85rem;">Open the Customizer to insert work details!</p>
      </div>
    `;
    const controls = document.querySelector(".carousel-controls");
    if (controls) controls.style.display = "none";
    return;
  }

  const controls = document.querySelector(".carousel-controls");
  if (controls) controls.style.display = "flex";

  const N = projects.length;
  projects.forEach((proj, idx) => {
    const card = document.createElement("div");
    
    // Set 3D deck depth stack class names initially
    let stackClass = "card-hidden";
    if (idx === activeIndex) {
      stackClass = "card-0";
    } else if (idx === (activeIndex + 1) % N) {
      stackClass = "card-1";
    } else if (idx === (activeIndex + 2) % N) {
      stackClass = "card-2";
    }
    
    card.className = `project-card ${stackClass}`;
    
    let projectImgHTML;
    const lowerName = (proj.name || "").toLowerCase().trim();
    const lowerCat = (proj.category || "").toLowerCase().trim();

    if (lowerName === "brand identity" || lowerCat === "brand identity" || lowerName.includes("brand")) {
      projectImgHTML = `
        <div class="card-visual">
          <img class="theme-img-dark" src="brand-identity-dark.jpg" alt="Brand Identity – Dark Preview">
          <img class="theme-img-light" src="brand-identity-light.jpg" alt="Brand Identity – Light Preview">
        </div>
      `;
    } else if (lowerName === "packaging design" || lowerCat === "packaging design" || lowerName.includes("packaging")) {
      projectImgHTML = `
        <div class="card-visual">
          <img class="theme-img-dark" src="packaging-design-dark.png" alt="Packaging Design – Dark Preview">
          <img class="theme-img-light" src="packaging-design-light.png" alt="Packaging Design – Light Preview">
        </div>
      `;
    } else if (lowerName === "digital illustration" || lowerCat === "digital illustration" || lowerName.includes("illustration") || lowerName === "illustrations") {
      projectImgHTML = `
        <div class="card-visual">
          <img class="theme-img-dark" src="digital-illustration-dark.png" alt="Digital Illustration – Dark Preview">
          <img class="theme-img-light" src="digital-illustration-light.png" alt="Digital Illustration – Light Preview">
        </div>
      `;
    } else {
      projectImgHTML = `
        <div class="card-visual">
          <div class="card-placeholder-art">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-header-block">
        <div class="card-title-group">
          <span class="card-tag">${proj.category || 'PROJECT'}</span>
          <h3 class="card-name">${proj.name || 'Untitled Project'}</h3>
        </div>
        <a href="${proj.link || '#'}" class="card-action-btn" target="_blank" rel="noopener" aria-label="View live project">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
      <div class="card-body-block">
        <p class="card-desc">${proj.description || 'No description provided.'}</p>
        ${projectImgHTML}
      </div>
    `;

    // Click background cards to advance deck
    card.addEventListener("click", (e) => {
      if (e.target.closest(".card-action-btn")) return;
      if (card.classList.contains("card-1") || card.classList.contains("card-2")) {
        nextSlide();
      }
    });

    projectsGrid.appendChild(card);

    // Build slide indicator dots
    if (dotsContainer) {
      const dot = document.createElement("button");
      dot.className = `dot ${idx === activeIndex ? 'active' : ''}`;
      dot.setAttribute("aria-label", `Go to project ${idx + 1}`);
      dot.addEventListener("click", () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    }
  });

  // Reset and start animation loop
  resetProgressBar();
}

function nextSlide() {
  const cards = document.querySelectorAll(".project-card");
  if (cards.length <= 1) return;

  const N = cards.length;
  const prevIndex = activeIndex;

  // 1. Swipe current card out
  const currentCard = cards[prevIndex];
  if (currentCard) {
    currentCard.className = "project-card card-out";
  }

  // 2. Advance pointer
  activeIndex = (activeIndex + 1) % N;

  // 3. Shift background cards forward
  cards.forEach((card, idx) => {
    if (idx === prevIndex) return;

    if (idx === activeIndex) {
      card.className = "project-card card-0";
    } else if (idx === (activeIndex + 1) % N) {
      card.className = "project-card card-1";
    } else if (idx === (activeIndex + 2) % N) {
      card.className = "project-card card-2";
    } else {
      card.className = "project-card card-hidden";
    }
  });

  // 4. Move swiped card to hidden back after layout paint (650ms)
  setTimeout(() => {
    if (currentCard && currentCard.className.includes("card-out")) {
      currentCard.className = "project-card card-hidden";
    }
  }, 650);

  updateDots();
  resetProgressBar();
}

function goToSlide(targetIdx) {
  const cards = document.querySelectorAll(".project-card");
  if (cards.length === 0 || targetIdx === activeIndex) return;

  activeIndex = targetIdx;
  const N = cards.length;

  cards.forEach((card, idx) => {
    if (idx === activeIndex) {
      card.className = "project-card card-0";
    } else if (idx === (activeIndex + 1) % N) {
      card.className = "project-card card-1";
    } else if (idx === (activeIndex + 2) % N) {
      card.className = "project-card card-2";
    } else {
      card.className = "project-card card-hidden";
    }
  });

  updateDots();
  resetProgressBar();
}

function updateDots() {
  const dots = document.querySelectorAll(".carousel-dots .dot");
  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function animateProgress() {
  if (!isAutoplay) return;

  const elapsed = Date.now() - progressStartTime;
  const pct = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);

  const fill = document.getElementById("carousel-progress-fill");
  if (fill) fill.style.width = `${pct}%`;

  if (elapsed >= AUTOPLAY_DURATION) {
    nextSlide();
  } else {
    animationFrameId = requestAnimationFrame(animateProgress);
  }
}

function resetProgressBar() {
  cancelAnimationFrame(animationFrameId);
  const fill = document.getElementById("carousel-progress-fill");
  if (fill) fill.style.width = "0%";
  
  if (isAutoplay) {
    progressStartTime = Date.now();
    animationFrameId = requestAnimationFrame(animateProgress);
  }
}

function toggleAutoplay() {
  const playPauseBtn = document.getElementById("carousel-play-pause");
  if (!playPauseBtn) return;

  const pauseIcon = playPauseBtn.querySelector(".icon-pause");
  const playIcon = playPauseBtn.querySelector(".icon-play");

  isAutoplay = !isAutoplay;
  console.log("toggleAutoplay triggered. isAutoplay =", isAutoplay);
  
  // Toggle aria-label for accessibility
  playPauseBtn.setAttribute("aria-label", isAutoplay ? "Pause Autoplay" : "Play Autoplay");

  if (isAutoplay) {
    if (pauseIcon) pauseIcon.style.display = "block";
    if (playIcon) playIcon.style.display = "none";
    progressStartTime = Date.now();
    animationFrameId = requestAnimationFrame(animateProgress);
  } else {
    if (pauseIcon) pauseIcon.style.display = "none";
    if (playIcon) playIcon.style.display = "block";
    cancelAnimationFrame(animationFrameId);
    const fill = document.getElementById("carousel-progress-fill");
    if (fill) fill.style.width = "0%";
  }
}

// --- Live Customizer Operations ---
function setupCustomizerListeners() {
  const drawer = document.getElementById("customizer-drawer");
  const overlay = document.getElementById("drawer-overlay");
  
  const openBtn = document.getElementById("customizer-open-btn");
  const closeBtn = document.getElementById("customizer-close-btn");
  const saveBtn = document.getElementById("btn-save-customizer");
  const resetBtn = document.getElementById("btn-reset-customizer");
  const addProjectBtn = document.getElementById("btn-add-project-editor");

  // Open Customizer
  openBtn.addEventListener("click", () => {
    populateCustomizerForm();
    drawer.classList.add("open");
    overlay.classList.add("open");
  });

  // Close Customizer
  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  };
  
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Add Dynamic Project row
  addProjectBtn.addEventListener("click", () => {
    appendProjectEditorBlock({ name: "", category: "", description: "", link: "#" });
  });

  // Save Customizations
  saveBtn.addEventListener("click", () => {
    const updatedSkills = document.getElementById("edit-skills").value
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const projectBlocks = document.querySelectorAll(".editor-project-item");
    const updatedProjects = [];
    
    projectBlocks.forEach(block => {
      const name = block.querySelector(".edit-proj-name").value.trim();
      const category = block.querySelector(".edit-proj-category").value.trim();
      const description = block.querySelector(".edit-proj-desc").value.trim();
      const link = block.querySelector(".edit-proj-link").value.trim();

      if (name) {
        updatedProjects.push({ name, category, description, link });
      }
    });

    const updatedData = {
      subheading: document.getElementById("edit-subheading").value.trim() || DEFAULT_PORTFOLIO_DATA.subheading,
      heading: document.getElementById("edit-heading").value.trim() || DEFAULT_PORTFOLIO_DATA.heading,
      bio: document.getElementById("edit-bio").value.trim() || DEFAULT_PORTFOLIO_DATA.bio,
      phone: document.getElementById("edit-phone").value.trim() || DEFAULT_PORTFOLIO_DATA.phone,
      email: document.getElementById("edit-email").value.trim() || DEFAULT_PORTFOLIO_DATA.email,
      location: document.getElementById("edit-location").value.trim() || DEFAULT_PORTFOLIO_DATA.location,
      linkedin: document.getElementById("edit-linkedin").value.trim() || DEFAULT_PORTFOLIO_DATA.linkedin,
      instagram: document.getElementById("edit-instagram").value.trim() || DEFAULT_PORTFOLIO_DATA.instagram,
      github: document.getElementById("edit-github").value.trim() || DEFAULT_PORTFOLIO_DATA.github,
      skills: updatedSkills,
      projects: updatedProjects
    };

    saveData(updatedData);
    closeDrawer();
  });

  // Reset Customizations
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all modifications to defaults?")) {
      resetData();
      closeDrawer();
    }
  });
}

function populateCustomizerForm() {
  document.getElementById("edit-subheading").value = portfolioData.subheading;
  document.getElementById("edit-heading").value = portfolioData.heading;
  document.getElementById("edit-bio").value = portfolioData.bio;
  document.getElementById("edit-phone").value = portfolioData.phone;
  document.getElementById("edit-email").value = portfolioData.email;
  document.getElementById("edit-location").value = portfolioData.location;
  document.getElementById("edit-linkedin").value = portfolioData.linkedin || "";
  document.getElementById("edit-instagram").value = portfolioData.instagram || "";
  document.getElementById("edit-github").value = portfolioData.github || "";
  document.getElementById("edit-skills").value = portfolioData.skills.join(", ");

  const listContainer = document.getElementById("editor-projects-list");
  listContainer.innerHTML = "";
  if (portfolioData.projects && portfolioData.projects.length > 0) {
    portfolioData.projects.forEach(proj => {
      appendProjectEditorBlock(proj);
    });
  }
}

function appendProjectEditorBlock(project) {
  const listContainer = document.getElementById("editor-projects-list");
  const block = document.createElement("div");
  block.className = "editor-project-item";
  
  block.innerHTML = `
    <button type="button" class="editor-project-delete" aria-label="Delete project">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </button>
    <div class="form-group" style="margin-bottom: 0.75rem;">
      <label class="form-label" style="font-size: 0.75rem;">Project Name</label>
      <input type="text" class="form-input edit-proj-name" placeholder="Project Title" value="${project.name || ''}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
    </div>
    <div class="form-group" style="margin-bottom: 0.75rem;">
      <label class="form-label" style="font-size: 0.75rem;">Category</label>
      <input type="text" class="form-input edit-proj-category" placeholder="e.g. Web Design" value="${project.category || ''}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
    </div>
    <div class="form-group" style="margin-bottom: 0.75rem;">
      <label class="form-label" style="font-size: 0.75rem;">Link / URL</label>
      <input type="text" class="form-input edit-proj-link" placeholder="e.g. https://domain.com" value="${project.link || '#'}" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;">
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label" style="font-size: 0.75rem;">Brief Description</label>
      <textarea class="form-input edit-proj-desc" placeholder="Details..." style="padding: 0.5rem 0.8rem; font-size: 0.85rem; min-height: 60px; height: 60px;">${project.description || ''}</textarea>
    </div>
  `;

  block.querySelector(".editor-project-delete").addEventListener("click", () => {
    block.remove();
  });

  listContainer.appendChild(block);
}

// --- Contact Form Submissions (via Web3Forms) ---
function setupContactFormListener() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("btn-submit-message");

  const keyField = document.getElementById("web3forms-key");
  if (keyField) {
    keyField.value = WEB3FORMS_ACCESS_KEY;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senderName = document.getElementById("form-name").value.trim();
    const senderEmail = document.getElementById("form-email").value.trim();
    const senderMsg = document.getElementById("form-message").value.trim();

    if (!senderName || !senderEmail || !senderMsg) return;

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      showToast("⚠️ Web3Forms access key not configured. Set key in app.js.");
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    try {
      const formData = new FormData(form);
      const dataObject = Object.fromEntries(formData);
      const jsonPayload = JSON.stringify(dataObject);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: jsonPayload
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        showToast(`Thank you ${senderName}! Message sent successfully.`);
        form.reset();
      } else {
        showToast(`Failed to send: ${result.message || "Try again later."}`);
      }
    } catch (error) {
      showToast("Network error. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }
  });
}

// --- Toast Popup Alert Trigger ---
function showToast(message) {
  const toast = document.getElementById("custom-toast");
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// --- Theme Handling (Dark/Light Mode) ---
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const cachedTheme = localStorage.getItem("pastel_portfolio_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialDark = cachedTheme === "dark" || (!cachedTheme && prefersDark) || !cachedTheme; // Default to dark

  if (initialDark) {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    if (themeToggleBtn) themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    if (themeToggleBtn) themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
  }
}

function toggleTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  document.body.classList.add("theme-transitioning");
  const isDark = document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme", !isDark);
  
  localStorage.setItem("pastel_portfolio_theme", isDark ? "dark" : "light");
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }
  console.log("toggleTheme triggered. isDark =", isDark);
  
  setTimeout(() => {
    document.body.classList.remove("theme-transitioning");
  }, 800);
}
