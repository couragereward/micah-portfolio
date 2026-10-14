
const pages = [...document.querySelectorAll("[data-view]")];
const navLinks = [...document.querySelectorAll("[data-page]")];
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const themeMeta = document.querySelector('meta[name="theme-color"]');

function readSavedTheme() {
  try {
    return window.localStorage.getItem("micah-portfolio-theme");
  } catch (error) {
    console.error("Unable to read the saved theme preference.", error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem("micah-portfolio-theme", theme);
  } catch (error) {
    console.error("Unable to save the theme preference.", error);
  }
}

function setTheme(theme, persist = true) {
  const isLight = theme === "light";

  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  document.querySelectorAll(
    ".brand-logo, .brand-symbol, .about-logo, .preview-brand-logo, .experience-logo"
  ).forEach(logo => {
    const isSymbol = logo.classList.contains("brand-symbol");
    logo.src = `images/skylocity-${isSymbol ? "symbol" : "logo"}-${isLight ? "light" : "dark"}.png`;
  });
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isLight ? "dark" : "light"} mode`
  );
  themeToggle.querySelector(".theme-icon").textContent = isLight ? "☾" : "☼";
  themeToggle.querySelector(".theme-label").textContent =
    `${isLight ? "Dark" : "Light"} mode`;
  themeMeta.content = isLight ? "#f4f5f6" : "#0a0d10";

  if (persist) {
    saveTheme(isLight ? "light" : "dark");
  }
}

setTheme(
  readSavedTheme() === "light" ? "light" : "dark",
  false
);

document.querySelectorAll(".brand").forEach(brand => {
  brand.addEventListener("click", () => {
    const isExpanded = brand.getAttribute("aria-expanded") !== "true";
    brand.setAttribute("aria-expanded", String(isExpanded));
    brand.setAttribute(
      "aria-label",
      `${isExpanded ? "Hide" : "Show"} SKYLOCITY wordmark and go home`
    );
  });
});

const projectData = {
  sharesat: {
    title: "Sharesat Application",
    category: "UI/UX DESIGN · FINTECH",
    description: "A crypto transaction app concept that makes transfers feel as simple and seamless as sending a message.",
    tags: ["UI/UX", "Fintech", "Crypto", "Product design"],
    problemTitle: "Simplifying transactions",
    problem: "Digital transactions can feel complicated when users encounter unfamiliar interfaces and unnecessary steps.",
    solutionTitle: "A familiar experience",
    solution: "Explore a clean interface, straightforward actions and a messaging-inspired approach to transaction flows.",
    role: "UI/UX concept, interface exploration, wireframing and visual direction.",
    theme: "sharesat-art"
  },
  momentum: {
    title: "Momentum Platform",
    category: "UI/UX DESIGN · EVENTS",
    description: "A networking platform concept that helps event attendees discover and connect with one another before the event begins.",
    tags: ["UI/UX", "Events", "Networking", "Community"],
    problemTitle: "Connecting before events",
    problem: "Attendees often wait until event day to discover people with similar interests or professional goals.",
    solutionTitle: "Connections that start early",
    solution: "Explore attendee discovery, interest-based introductions and an approachable interface for building connections before an event.",
    role: "Product concept, user journey exploration and interface design.",
    theme: "momentum-art"
  },
  northstar: {
    title: "Northstar Carousel",
    category: "GRAPHIC DESIGN · SOCIAL MEDIA",
    description: "A social media carousel concept designed to communicate a brand message through a sequence of clear, engaging visuals.",
    tags: ["Graphic design", "Social media", "Campaigns"],
    problemTitle: "Communicating clearly",
    problem: "Social media content needs a strong visual hierarchy to capture attention and communicate a message quickly.",
    solutionTitle: "A connected visual story",
    solution: "Explore a consistent colour system, strong typography and a sequence of visual panels designed to guide the audience through a message.",
    role: "Graphic design concept, layout exploration and visual storytelling.",
    theme: "northstar-art"
  },
  tuntac: {
    title: "Tuntac Brand Guideline",
    category: "BRAND IDENTITY · VISUAL SYSTEM",
    description: "A brand guideline concept exploring how typography, colour and visual consistency can work together to create a recognizable identity.",
    tags: ["Brand identity", "Typography", "Guidelines"],
    problemTitle: "Creating consistency",
    problem: "Without clear visual guidelines, brand materials can become inconsistent across different platforms and communication channels.",
    solutionTitle: "A cohesive identity system",
    solution: "Explore a structured guideline covering visual identity elements, colour combinations and typography to support consistent brand communication.",
    role: "Brand identity concept, visual system exploration and guideline layout.",
    theme: "tuntac-art"
  }
};

let currentPage = "home";
let previousPage = "projects";
let isTransitioning = false;

function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function updateNavigation(pageName) {
  document.querySelectorAll(".nav-link").forEach(link => {
    const isActive = link.dataset.page === pageName;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showPage(pageName, updateHistory = true) {
  if (isTransitioning) return;

  const target = document.querySelector(`[data-view="${pageName}"]`);

  if (!target) return;

  if (pageName === currentPage) {
    closeMenu();
    return;
  }

  isTransitioning = true;

  if (currentPage === "projects" && pageName === "detail") {
    previousPage = "projects";
  }

  pages.forEach(page => {
    page.classList.remove("active");
    page.setAttribute("aria-hidden", "true");
  });

  target.classList.add("active");
  target.setAttribute("aria-hidden", "false");

  currentPage = pageName;

  updateNavigation(pageName === "detail" ? "projects" : pageName);
  closeMenu();

  if (updateHistory) {
    history.pushState({ page: pageName }, "", `#${pageName}`);
  }

  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });

  window.setTimeout(() => {
    isTransitioning = false;
  }, 480);
}

function openProject(projectId) {
  const project = projectData[projectId];

  if (!project) return;

  document.getElementById("detailTitle").textContent = project.title;
  document.getElementById("detailCategory").textContent = project.category;
  document.getElementById("detailDescription").textContent = project.description;
  document.getElementById("detailProblemTitle").textContent = project.problemTitle;
  document.getElementById("detailProblem").textContent = project.problem;
  document.getElementById("detailSolutionTitle").textContent = project.solutionTitle;
  document.getElementById("detailSolution").textContent = project.solution;
  document.getElementById("detailRole").textContent = project.role;

  const tags = document.getElementById("detailTags");
  tags.replaceChildren();

  project.tags.forEach(tag => {
    const element = document.createElement("span");
    element.textContent = tag;
    tags.appendChild(element);
  });

  const preview = document.getElementById("detailPreview");
  const projectCard = document.querySelector(
    `.project-card [data-project="${projectId}"]`
  );

  const projectArt = projectCard?.classList.contains("project-art")
    ? projectCard
    : projectCard?.closest(".project-card")?.querySelector(".project-art");

  const backgrounds = {
    "sharesat-art": "radial-gradient(ellipse at 50% 50%, #075d4d, #081b19 70%)",
    "momentum-art": "linear-gradient(135deg, #d7b8f6, #a8a4fc 55%, #f0c3d8)",
    "northstar-art": "linear-gradient(135deg, #0d2a68, #4033b8 65%, #8c4ddb)",
    "tuntac-art": "linear-gradient(140deg, #d9d0c3, #183334)"
  };

  preview.style.background = backgrounds[project.theme] || "";
  showPage("detail");
}

document.addEventListener("click", event => {
  const pageLink = event.target.closest("[data-page]");

  if (pageLink) {
    event.preventDefault();
    showPage(pageLink.dataset.page);
    return;
  }

  const projectButton = event.target.closest("[data-project]");

  if (projectButton) {
    event.preventDefault();
    openProject(projectButton.dataset.project);
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.getElementById("backToProjects").addEventListener("click", () => {
  showPage(previousPage);
});

document.getElementById("backToTop").addEventListener("click", () => {
  showPage("home");
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    projectCards.forEach(card => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("filtered-out", !matches);
    });
  });
});

window.addEventListener("popstate", () => {
  const requestedPage = location.hash.slice(1) || "home";

  if (projectData[requestedPage]) {
    openProject(requestedPage);
    return;
  }

  const validPage = pages.some(page => page.dataset.view === requestedPage);

  if (validPage) {
    showPage(requestedPage, false);
  } else {
    showPage("home", false);
  }
});

document.getElementById("downloadResume").addEventListener("click", () => {
  const profile = [
    "SKYLOCITY",
    "MICAH AGADA",
    "Graphic & UI Designer",
    "Jalingo, Taraba State, Nigeria",
    "",
    "PROFILE",
    "Graphic and UI designer focused on clear visual communication, thoughtful interfaces and purposeful brand identities.",
    "",
    "SERVICES",
    "UI/UX Design",
    "Graphic Design",
    "Brand Consultation",
    "Content Creation",
    "Video Editing",
    "Project Management",
    "",
    "SELECTED PROJECTS",
    "Sharesat Application — UI/UX, Fintech",
    "Momentum Platform — UI/UX, Events and Networking",
    "Northstar Carousel — Graphic Design",
    "Tuntac Brand Guideline — Brand Identity",
    "",
    "EXPERIENCE",
    "Designer, Northstar — Volunteer",
    "Volunteer Designer, Sandlip",
    "",
    "CONTACT",
    "Email: micahagada8@gmail.com",
    "Phone: +234 814 860 6250",
    "Location: Jalingo, Taraba State, Nigeria"
  ].join("\n");

  const blob = new Blob([profile], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "SKYLOCITY-Micah-Agada-Profile.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const service = formData.get("service");
  const message = formData.get("message").trim();
  const note = document.getElementById("formNote");

  const subject = encodeURIComponent(`Portfolio enquiry: ${service}`);
  const body = encodeURIComponent(
    `Hello Micah,\n\nMy name is ${name}.\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}\n\nLooking forward to hearing from you.`
  );

  note.textContent = "Opening your email application...";

  window.location.href =
    `mailto:micahagada8@gmail.com?subject=${subject}&body=${body}`;

  window.setTimeout(() => {
    note.textContent = "If your email app did not open, email micahagada8@gmail.com directly.";
  }, 1500);
});

document.getElementById("year").textContent = new Date().getFullYear();

pages.forEach(page => {
  page.setAttribute("aria-hidden", String(!page.classList.contains("active")));
});

const initialPage = location.hash.slice(1);

if (projectData[initialPage]) {
  openProject(initialPage);
} else if (pages.some(page => page.dataset.view === initialPage)) {
  showPage(initialPage, false);
} else {
  updateNavigation("home");
}
