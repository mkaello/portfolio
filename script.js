document.body.classList.add("has-js");

const mediaDesktop = window.matchMedia("(min-width: 981px)");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const revealCards = document.querySelectorAll(".reveal-card");
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card[data-category]");
const projectShowcases = document.querySelectorAll(".project-showcase[data-category]");
const gallerySlots = document.querySelectorAll("button.gallery-slot");
const modal = document.querySelector(".gallery-modal");
const modalTitle = document.querySelector("#gallery-modal-title");
const modalCopy = document.querySelector(".gallery-modal-copy");
const heroCopy = document.querySelector(".hero-copy");
const heroCard = document.querySelector(".hero-card");

const updateActiveNav = () => {
    let activeId = sections[0]?.id;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
    });
};

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

revealCards.forEach((card) => revealObserver.observe(card));

const filterProjects = (category) => {
    const matchAll = category === "all";

    filterChips.forEach((chip) => {
        chip.classList.toggle("is-active", chip.dataset.filter === category);
    });

    projectCards.forEach((card) => {
        const match = matchAll || card.dataset.category === category;
        card.classList.toggle("is-dimmed", !match);
    });

    projectShowcases.forEach((showcase) => {
        const match = matchAll || showcase.dataset.category === category;
        showcase.classList.toggle("is-dimmed", !match);
    });
};

filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        filterProjects(chip.dataset.filter);
    });
});

const highlightShowcase = (id) => {
    const showcase = document.getElementById(id);
    if (!showcase) return;

    projectShowcases.forEach((item) => item.classList.remove("is-highlighted"));
    showcase.classList.add("is-highlighted");
    showcase.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
        showcase.classList.remove("is-highlighted");
    }, 2400);
};

projectCards.forEach((card) => {
    card.addEventListener("click", () => highlightShowcase(card.dataset.target));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            highlightShowcase(card.dataset.target);
        }
    });
});

const openModal = (title) => {
    if (!modal || !modalTitle || !modalCopy) return;
    modalTitle.textContent = title;
    modalCopy.textContent = `Previewing "${title}" from the portfolio gallery.`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
};

gallerySlots.forEach((slot) => {
    slot.addEventListener("click", () => openModal(slot.textContent.trim()));
});

modal?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

document.addEventListener("mousemove", (event) => {
    if (!mediaDesktop.matches || !heroCopy || !heroCard) return;

    const { innerWidth, innerHeight } = window;
    const offsetX = (event.clientX / innerWidth - 0.5) * 14;
    const offsetY = (event.clientY / innerHeight - 0.5) * 10;

    heroCopy.style.transform = `translate3d(${offsetX * -0.45}px, ${offsetY * -0.45}px, 0)`;
    heroCard.style.transform = `translate3d(${offsetX * 0.55}px, ${offsetY * 0.55}px, 0)`;
});

window.addEventListener("mouseleave", () => {
    if (!heroCopy || !heroCard) return;
    heroCopy.style.transform = "";
    heroCard.style.transform = "";
});
