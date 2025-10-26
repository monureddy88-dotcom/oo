/* script.js
   Handles:
    - tab switching (data/dev)
    - project modal population
    - theme toggle (light/dark) persisted in localStorage
    - contact form: builds mailto link (simple) and shows confirmation
*/

document.addEventListener('DOMContentLoaded', () => {
  // elements
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

    // ---------- Mobile Menu Toggle ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  // Close menu on link click (for smooth UX)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.textContent = '☰';
    });
  });

  
  const modalClose = document.getElementById('modalClose');
  const viewBtns = Array.from(document.querySelectorAll('.view'));
  const yearEl = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');
  const contactForm = document.getElementById('contactForm');

  yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const THEME_KEY = 'site-theme';
  function setTheme(isDark){
    if(isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }
  // init
  setTheme(localStorage.getItem(THEME_KEY) === 'dark');

  themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
  });

  
/* ---------- Tabs ---------- */
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const type = btn.getAttribute('data-tab');
    projectCards.forEach(card => {
      card.hidden = card.dataset.type !== type;
    });
  });
});


/* ---------- Projects data (simple map) ---------- */
  const projects = {
    'sales-dashboard': {
      title: 'Product Sales Dashboard',
      subtitle: 'Power BI — Sales Analytics',
      description: `<p>This interactive Power BI dashboard visualizes sales across regions, categories, and time. Features filters, KPIs, trend charts, and drill-through insights to help stakeholders identify top-performing SKUs and optimize promotions.</p>
                    <ul><li>Tools: Power BI, Power Query, DAX, Excel</li><li>Work: Data cleaning, modeling, KPI design, storytelling</li><li>Impact: Clear insights for sales strategy and inventory planning</li></ul>`
    },
    'img-features': {
      title: 'Image Feature Extraction',
      subtitle: 'SURF, HOG, LBP — Python / OpenCV',
      description: `<p>A pipeline to preprocess images and extract robust features using SURF, HOG and LBP. Useful for object detection and texture classification experiments.</p>
                    <ul><li>Libraries: OpenCV, NumPy</li><li>Focus: preprocessing, feature engineering, visualization</li></ul>`
    },
    'travel-eazy': {
      title: 'Travel Eazy',
      subtitle: 'Flask + ML — Personalized Travel Recommender',
      description: `<p>Python & Flask app that recommends travel plans based on user preferences and constraints (health, mobility, allergies). Includes admin/user modules and ML models (Random Forest, KNN, Gradient Boosting).</p>
                    <ul><li>Features: Personalization, accessibility filters, admin dashboard</li><li>Tech: Python, Flask, Bootstrap</li></ul>`
    },
    'portfolio-site': {
      title: 'Portfolio Site (this)',
      subtitle: 'HTML, CSS, JS',
      description: `<p>Recruiter-friendly portfolio showcasing both data and development work. Responsive, accessible, and focused on clarity and impact.</p>
                    <ul><li>Highlights: Projects, skills, resume download</li></ul>`
    }
  };

  /* ---------- Modal logic ---------- */
  function openModal(projectId){
    const p = projects[projectId];
    if(!p) return;
    modalContent.innerHTML = `<h2>${p.title}</h2><p class="muted">${p.subtitle}</p>${p.description}`;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // trap focus lightly
    modal.querySelector('.modal-close').focus();
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.project;
      openModal(id);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  /* ---------- Contact form (simple mailto fallback) ---------- */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(contactForm);
    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const message = form.get('message') || '';
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    // open default mail client
    window.location.href = `mailto:ambatimokeshreddy@gmail.com?subject=${subject}&body=${body}`;
    // show small confirmation (accessible)
    alert('Your email client should open — if not, email me at ambatimokeshreddy@gmail.com');
  });

});
// Animate sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach((section) => observer.observe(section));


// Highlight active nav link while scrolling
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});



/* ---------- Tabs ---------- */
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset all tabs
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    // Activate clicked tab
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const selectedType = btn.dataset.tab;

    // Toggle project cards based on tab
    projectCards.forEach(card => {
      card.hidden = card.dataset.type !== selectedType;
    });
  });
});




const tabs = document.querySelectorAll('.tab');
const projects = document.querySelectorAll('.project-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    // Add active class to clicked tab
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Show/hide projects based on data-type
    const type = tab.dataset.tab;
    projects.forEach(project => {
      if (project.dataset.type === type) {
        project.hidden = false;
      } else {
        project.hidden = true;
      }
    });
  });
});

