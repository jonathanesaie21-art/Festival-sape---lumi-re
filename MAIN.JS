// ===== Compte à rebours =====
const countdownEl = document.getElementById("countdown");
if (countdownEl) {
  const target = new Date(countdownEl.dataset.target).getTime();
  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMinutes");
  const sEl = document.getElementById("cdSeconds");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      dEl.textContent =
        hEl.textContent =
        mEl.textContent =
        sEl.textContent =
          "00";
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(minutes);
    sEl.textContent = pad(seconds);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}

// ===== Onglets Programme (J1 / J2 / J3) =====

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".day-panel")
      .forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("day-" + tab.dataset.day).classList.add("active");
  });
});

// ===== Filtres Line-up (Tous / Musique / Mode & Sape / Art Lumière) =====
const filterButtons = document.querySelectorAll(".filter-btn");
const artisteCards = document.querySelectorAll(".artiste-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    artisteCards.forEach((card) => {
      const match = filter === "tous" || card.dataset.category === filter;
      card.hidden = !match;
    });
  });
});

// ===== Menu mobile =====
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  const isClickInsideNav = mainNav.contains(e.target);
  const isClickOnToggle = navToggle.contains(e.target);

  if (
    mainNav.classList.contains("is-open") &&
    !isClickInsideNav &&
    !isClickOnToggle
  ) {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ===== Accordéon FAQ (exclusif : un seul ouvert à la fois) =====
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = question.getAttribute("aria-expanded") === "true";

    faqItems.forEach((other) => {
      other
        .querySelector(".faq-question")
        .setAttribute("aria-expanded", "false");
      other.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isOpen) {
      question.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// ===== Formulaire de contact : validation en temps réel =====
const form = document.getElementById("contactForm");
const banner = document.getElementById("formBanner");

const validators = {
  name: (value) =>
    value.trim().length >= 2 ? "" : "Merci d'indiquer votre nom complet.",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ""
      : "Adresse e-mail invalide.",
  phone: (value) =>
    value.trim() === "" || /^[+\d][\d\s.-]{6,}$/.test(value.trim())
      ? ""
      : "Numéro de téléphone invalide.",
  message: (value) =>
    value.trim().length >= 10
      ? ""
      : "Votre message doit contenir au moins 10 caractères.",
};

function validateField(input) {
  const name = input.name;
  const field = input.closest(".field");
  const errorEl = document.getElementById(name + "Error");
  const errorMsg = validators[name](input.value);

  field.classList.remove("error", "success");
  if (errorMsg) {
    field.classList.add("error");
    errorEl.textContent = errorMsg;
  } else {
    if (input.value.trim() !== "") field.classList.add("success");
    errorEl.textContent = "";
  }
  return !errorMsg;
}

["name", "email", "phone", "message"].forEach((fieldName) => {
  const input = form.elements[fieldName];
  input.addEventListener("input", () => validateField(input));
  input.addEventListener("blur", () => validateField(input));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let allValid = true;
  ["name", "email", "phone", "message"].forEach((fieldName) => {
    const input = form.elements[fieldName];
    if (!validateField(input)) allValid = false;
  });

  banner.hidden = false;
  if (allValid) {
    banner.textContent =
      "Merci ! Votre message a bien été envoyé, nous revenons vers vous rapidement.";
    banner.classList.remove("is-error");
    form.reset();
    form
      .querySelectorAll(".field")
      .forEach((f) => f.classList.remove("success", "error"));
  } else {
    banner.textContent =
      "Merci de corriger les champs indiqués avant d'envoyer le message.";
    banner.classList.add("is-error");
  }

  banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
