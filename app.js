// JavaScript Controller for Premium Pastel Portfolio

// --- Default Profile & Portfolio Data ---
const DEFAULT_PORTFOLIO_DATA = {
  subheading: "SUBHIKSHA",
  heading: "ABOUT ME",
  bio: "\"Every brand has a story, and I’m here to make yours visually captivating. Hi, I’m SUBHIKSHA, a graphic designer dedicated to bridging the gap between creativity and strategy.I don't just make things look good—I make them impossible to ignore. Let's build something unforgettable.\"",
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
      name: "Brand Identity",
      category: "Brand Identity",
      description: "A complete visual identity system featuring custom typography, a minimalist color palette, and premium brand guidelines for a modern brand.",
      link: "#"
    },
    {
      name: "Packaging design",
      category: "Packaging design",
      description: "Eco-friendly packaging concepts featuring bespoke illustrations, clean typographic hierarchy, and a natural, Earth-toned aesthetic.",
      link: "#"
    },
    {
      name: "Digital Illustration",
      category: "Digital Illustration",
      description: "A series of vector illustrations exploring modern city life, utilizing a vibrant synthwave color palette and dramatic lighting effects.",
      link: "#"
    }
  ]
};

// State Store
let portfolioData = {};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  loadData();
  setupTabListeners();
  setupCustomizerListeners();
  setupContactFormListener();
});

// --- Tab Swapping Navigation ---
function setupTabListeners() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".tab-content");
  const circleAccent = document.getElementById("card-circle-accent");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      // Set active nav button
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Display matching section
      sections.forEach(sec => {
        sec.classList.remove("active");
        if (sec.getAttribute("id") === `${targetTab}-section`) {
          sec.classList.add("active");
        }
      });

      // Subtle accent animation on change
      if (circleAccent) {
        if (targetTab === "portfolio") {
          circleAccent.style.transform = "scale(0.85) translate(40px, -40px)";
          circleAccent.style.opacity = "0.75";
        } else if (targetTab === "contact") {
          circleAccent.style.transform = "scale(0.7) translate(100px, -100px)";
          circleAccent.style.opacity = "0.5";
        } else {
          circleAccent.style.transform = "scale(1) translate(0, 0)";
          circleAccent.style.opacity = "0.95";
        }
      }
    });
  });
}

// --- Data Core Management ---

// Load data from LocalStorage or fallback to defaults
function loadData() {
  const cached = localStorage.getItem("pastel_portfolio_data");
  if (cached) {
    try {
      portfolioData = JSON.parse(cached);
      // Migrate legacy template details directly to user's credentials
      if (portfolioData.subheading === "Maxine Ficheux" || portfolioData.location === "Paris, France" || !portfolioData.linkedin || !portfolioData.instagram || !portfolioData.github || portfolioData.github === "https://github.com/") {
        portfolioData.subheading = "SUBHIKSHA";
        portfolioData.email = "sbsubhiksha139@gmail.com";
        portfolioData.phone = "6381309368";
        portfolioData.location = "Coimbatore";
        portfolioData.linkedin = "https://www.linkedin.com/in/subhiksha-sb-4854bb407/";
        portfolioData.instagram = "https://www.instagram.com/_subx._/";
        portfolioData.github = "https://github.com/Subhiksha-SB";
        portfolioData.bio = DEFAULT_PORTFOLIO_DATA.bio;
        localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
      }

      // Migrate existing Subhiksha entries to the new graphic designer details
      let changed = false;
      if (portfolioData.subheading === "Subhiksha") {
        portfolioData.subheading = "SUBHIKSHA";
        changed = true;
      }
      if (portfolioData.heading === "Portfolio" || !portfolioData.heading) {
        portfolioData.heading = "ABOUT ME";
        changed = true;
      }
      if (!portfolioData.bio || portfolioData.bio.includes("digital artisan") || portfolioData.bio.startsWith("I am a digital artisan") || portfolioData.bio.includes("high-fidelity interactive interfaces") || !portfolioData.bio.startsWith('"')) {
        portfolioData.bio = DEFAULT_PORTFOLIO_DATA.bio;
        changed = true;
      }
      if (changed) {
        localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
      }
      
      // Auto-migrate standard default projects to new design definitions
      if (portfolioData.projects && Array.isArray(portfolioData.projects)) {
        let updated = false;
        portfolioData.projects = portfolioData.projects.map(proj => {
          if (proj.category === "Web Application" || proj.name === "Neo-Brutalist Dashboard") {
            updated = true;
            return {
              name: "Brand Identity",
              category: "Brand Identity",
              description: "A complete visual identity system featuring custom typography, a minimalist color palette, and premium brand guidelines for a modern brand.",
              link: proj.link || "#"
            };
          }
          if (proj.category === "Mobile UI Design" || proj.name === "Glow - Meditation App") {
            updated = true;
            return {
              name: "Packaging design",
              category: "Packaging design",
              description: "Eco-friendly packaging concepts featuring bespoke illustrations, clean typographic hierarchy, and a natural, Earth-toned aesthetic.",
              link: proj.link || "#"
            };
          }
          if (proj.category === "Creative Coding" || proj.name === "Aurora Ecommerce") {
            updated = true;
            return {
              name: "Digital Illustration",
              category: "Digital Illustration",
              description: "A series of vector illustrations exploring modern city life, utilizing a vibrant synthwave color palette and dramatic lighting effects.",
              link: proj.link || "#"
            };
          }
          return proj;
        });
        if (updated) {
          localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
        }
      }
    } catch (e) {
      portfolioData = { ...DEFAULT_PORTFOLIO_DATA };
    }
  } else {
    portfolioData = { ...DEFAULT_PORTFOLIO_DATA };
  }
  renderData();
}

// Write current state to LocalStorage
function saveData(newData) {
  portfolioData = newData;
  localStorage.setItem("pastel_portfolio_data", JSON.stringify(portfolioData));
  renderData();
  showToast("Portfolio details successfully applied & saved!");
}

// Reset LocalStorage and restore defaults
function resetData() {
  localStorage.removeItem("pastel_portfolio_data");
  portfolioData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  renderData();
  showToast("Restored all elements to original template defaults.");
}

// Calculate name initials for the visual profile avatar badge
function getInitials(nameString) {
  if (!nameString) return "MF";
  const words = nameString.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return nameString.substring(0, 2).toUpperCase();
}

// Renders the entire profile based on current state variables
function renderData() {
  // Update browser page Title and Meta Description dynamically for SEO
  document.title = `${portfolioData.subheading} | Creative Portfolio`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", `Discover the creative portfolio of ${portfolioData.subheading}. ${portfolioData.bio.substring(0, 120)}...`);
  }

  // Bind values to UI elements
  document.getElementById("display-subheading").textContent = portfolioData.subheading;
  document.getElementById("display-heading").textContent = portfolioData.heading;
  document.getElementById("display-bio").textContent = portfolioData.bio;
  
  // Set Contact quick-bars
  document.getElementById("display-phone").textContent = portfolioData.phone;
  document.getElementById("display-email").textContent = portfolioData.email;
  document.getElementById("display-location").textContent = portfolioData.location;

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

  // Set Profile Avatar initials
  document.getElementById("display-avatar").textContent = getInitials(portfolioData.subheading);

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
    skillsContainer.innerHTML = `<span style="color: var(--text-light); font-size: 0.9rem;">No skills specified yet.</span>`;
  }

  // Render Dynamic Projects Grid
  const projectsGrid = document.getElementById("display-projects");
  projectsGrid.innerHTML = "";
  
  if (portfolioData.projects && portfolioData.projects.length > 0) {
    portfolioData.projects.forEach((proj, idx) => {
      const card = document.createElement("div");
      card.className = "project-card";
      
      // Select beautiful gradient styles per index for variance
      const gradients = [
        "linear-gradient(135deg, #ffd5d5 0%, #ffb8b8 100%)",
        "linear-gradient(135deg, #ffe1d5 0%, #ffc5b8 100%)",
        "linear-gradient(135deg, #ffd5e7 0%, #ffb8cf 100%)"
      ];
      const selectedGradient = gradients[idx % gradients.length];
      
      // Build the image area — theme-specific real images for select projects
      let projectImgHTML;
      if (proj.name === "Brand Identity") {
        projectImgHTML = `
          <div class="project-img">
            <img class="theme-img-dark" src="brand-identity-dark.jpg" alt="Brand Identity – Dark Theme Preview">
            <img class="theme-img-light" src="brand-identity-light.jpg" alt="Brand Identity – Light Theme Preview">
          </div>
        `;
      } else if (proj.name === "Packaging design") {
        projectImgHTML = `
          <div class="project-img">
            <img class="theme-img-dark" src="packaging-design-dark.png" alt="Packaging Design – Dark Theme Preview">
            <img class="theme-img-light" src="packaging-design-light.png" alt="Packaging Design – Light Theme Preview">
          </div>
        `;
      } else {
        projectImgHTML = `
          <div class="project-img">
            <div class="project-placeholder" style="background: ${selectedGradient}">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.85"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>
          </div>
        `;
      }

      // Inline template formatting for Project Cards
      card.innerHTML = `
        ${projectImgHTML}
        <div class="project-info">
          <span class="project-tag">${proj.category || 'PROJECT'}</span>
          <h3 class="project-name">${proj.name || 'Untitled Project'}</h3>
          <p class="project-description">${proj.description || 'No description available for this creative display.'}</p>
          <a href="${proj.link || '#'}" class="project-link" target="_blank" rel="noopener">
            View Live Artifact
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  } else {
    projectsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: var(--text-light);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No projects added yet.</p>
        <p style="font-size: 0.9rem;">Open Customizer below to add creative pieces!</p>
      </div>
    `;
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

  // Add Dynamic Project form row inside customizer
  addProjectBtn.addEventListener("click", () => {
    appendProjectEditorBlock({ name: "", category: "", description: "", link: "#" });
  });

  // Save Customizations
  saveBtn.addEventListener("click", () => {
    const updatedSkills = document.getElementById("edit-skills").value
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Parse all dynamically rendered project forms
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
    if (confirm("Are you sure you want to reset all modifications to default layouts?")) {
      resetData();
      closeDrawer();
    }
  });
}

// Prefills inputs in the customizer slider to synchronize with store state
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
  
  // Join skills list array into comma separated string
  document.getElementById("edit-skills").value = portfolioData.skills.join(", ");

  // Populate dynamic projects editor
  const listContainer = document.getElementById("editor-projects-list");
  listContainer.innerHTML = "";
  if (portfolioData.projects && portfolioData.projects.length > 0) {
    portfolioData.projects.forEach(proj => {
      appendProjectEditorBlock(proj);
    });
  }
}

// Appends editable form rows for a dynamic project in the editor
function appendProjectEditorBlock(project) {
  const listContainer = document.getElementById("editor-projects-list");
  const block = document.createElement("div");
  block.className = "editor-project-item";
  
  block.innerHTML = `
    <button type="button" class="editor-project-delete" aria-label="Delete project from list">
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
      <textarea class="form-input edit-proj-desc" placeholder="Details of this design..." style="padding: 0.5rem 0.8rem; font-size: 0.85rem; min-height: 60px; height: 60px;">${project.description || ''}</textarea>
    </div>
  `;

  // Attach delete event directly
  block.querySelector(".editor-project-delete").addEventListener("click", () => {
    block.remove();
  });

  listContainer.appendChild(block);
}

// --- Contact Form Submissions ---
function setupContactFormListener() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const senderName = document.getElementById("form-name").value.trim();
    const senderEmail = document.getElementById("form-email").value.trim();
    const senderMsg = document.getElementById("form-message").value.trim();

    if (senderName && senderEmail && senderMsg) {
      showToast(`Thank you ${senderName}! Message sent to ${portfolioData.subheading}.`);
      form.reset();
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
function setupTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (!themeToggleBtn) return;

  // Retrieve cached theme or match system settings
  const cachedTheme = localStorage.getItem("pastel_portfolio_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const initialDark = cachedTheme === "dark" || (!cachedTheme && prefersDark);

  if (initialDark) {
    document.body.classList.add("dark-theme");
    themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
  } else {
    document.body.classList.remove("dark-theme");
    themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
  }

  // Toggle Theme Event Listener
  themeToggleBtn.addEventListener("click", () => {
    const isDarkNow = document.body.classList.toggle("dark-theme");
    
    // Save to LocalStorage
    localStorage.setItem("pastel_portfolio_theme", isDarkNow ? "dark" : "light");
    
    // Update Accessibility Label
    themeToggleBtn.setAttribute("aria-label", isDarkNow ? "Switch to light theme" : "Switch to dark theme");
  });

  // Listen for system preference updates
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    // Only apply if user hasn't explicitly chosen a theme override
    if (!localStorage.getItem("pastel_portfolio_theme")) {
      if (e.matches) {
        document.body.classList.add("dark-theme");
        themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
      } else {
        document.body.classList.remove("dark-theme");
        themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
      }
    }
  });
}
