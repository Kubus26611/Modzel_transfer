document.body.classList.add("is-loading");

const loader = document.createElement("div");
loader.className = "page-loader";
loader.innerHTML = '<div class="loader-mark"><span class="loader-ring"></span><span>Modzel Transfer</span></div>';
document.body.prepend(loader);

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("hidden");
    document.body.classList.remove("is-loading");
  }, 520);
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const sections = [...document.querySelectorAll(".scroll-section[id]")];

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("modal-open")) {
    closeOfferModal();
    return;
  }

  if (event.key === "Escape" && nav?.classList.contains("open")) {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.focus();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.22 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-42% 0px -48% 0px", threshold: [0.15, 0.35, 0.6] }
);

sections.forEach((section) => sectionObserver.observe(section));

const backgrounds = [...document.querySelectorAll(".section-bg")];
backgrounds.forEach((image) => image.classList.add("parallax"));

const moveBackgrounds = () => {
  const vh = window.innerHeight || 1;
  backgrounds.forEach((image) => {
    const rect = image.parentElement.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / vh));
    image.style.transform = `scale(1.04) translateY(${progress * -14}px)`;
  });
};

moveBackgrounds();
window.addEventListener("scroll", moveBackgrounds, { passive: true });
window.addEventListener("resize", moveBackgrounds);

document.querySelectorAll(".booking-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("Zapytanie o transfer - Modzel Transfer");
    const body = encodeURIComponent(
      [
        `Imię i nazwisko: ${data.get("name") || ""}`,
        `Kontakt: ${data.get("contact") || ""}`,
        `Skąd: ${data.get("from") || ""}`,
        `Dokąd: ${data.get("to") || ""}`,
        `Data: ${data.get("date") || ""}`,
        `Liczba osób: ${data.get("passengers") || ""}`,
        `Wiadomość: ${data.get("message") || ""}`
      ].join("\n")
    );
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Przygotowaliśmy wiadomość e-mail z Twoim zapytaniem.";
    window.location.href = `mailto:biuro@modzeltransfer.pl?subject=${subject}&body=${body}`;
    form.reset();
  });
});

const offerDetails = {
  airport: {
    title: "Transfer lotniskowy",
    text: "Odbiór z Kraków Airport Balice, przejazd do hotelu, apartamentu lub pod wskazany adres oraz wygodny powrót na lotnisko.",
    points: [
      "Monitorowanie godziny przylotu i elastyczny odbiór po lądowaniu.",
      "Pomoc z bagażem oraz spokojny przejazd bez szukania taksówki.",
      "Stała komunikacja przed transferem i przejrzyste warunki rezerwacji."
    ]
  },
  city: {
    title: "Transfer miejski",
    text: "Komfortowe przejazdy po Krakowie dla klientów prywatnych, gości biznesowych i rodzin odwiedzających miasto.",
    points: [
      "Dojazdy do hoteli, restauracji, biur, wydarzeń i adresów prywatnych.",
      "Kierowca punktualnie czeka w ustalonym miejscu.",
      "Dyskretna obsługa i wygodne auto premium na krótkie oraz dłuższe przejazdy."
    ]
  },
  zakopane: {
    title: "Kraków - Zakopane",
    text: "Prywatny transfer z Krakowa do Zakopanego lub z Zakopanego do Krakowa, z naciskiem na komfort i przewidywalny czas podróży.",
    points: [
      "Trasa dopasowana do godziny odbioru, pogody i planu dnia.",
      "Możliwość przejazdu w jedną stronę lub rezerwacji powrotnej.",
      "Przestronne auto dla pasażerów i bagażu, także przy wyjazdach rodzinnych."
    ]
  },
  wieliczka: {
    title: "Kraków - Oświęcim / Wieliczka",
    text: "Sprawdzone trasy turystyczne do najważniejszych miejsc w Małopolsce, realizowane prywatnie i bez pośpiechu.",
    points: [
      "Transfer do Kopalni Soli Wieliczka, Auschwitz-Birkenau lub obu miejsc jednego dnia.",
      "Odbiór spod hotelu i powrót pod wskazany adres.",
      "Plan przejazdu dopasowany do godzin wejść, biletów i preferencji gości."
    ]
  },
  vip: {
    title: "Transport turystyczny / VIP",
    text: "Elegancka obsługa przejazdów specjalnych, delegacji, wydarzeń i prywatnych wycieczek z kierowcą.",
    points: [
      "Dyskretna, reprezentacyjna obsługa klientów VIP i gości biznesowych.",
      "Przejazdy godzinowe, całodniowe oraz według indywidualnego planu.",
      "Wysoki standard auta, spokojna komunikacja i pełna punktualność."
    ]
  }
};

const offerModal = document.querySelector(".offer-modal");
const offerModalPanel = document.querySelector(".offer-modal-panel");
const offerModalTitle = document.querySelector("#offer-modal-title");
const offerModalText = document.querySelector("#offer-modal-text");
const offerModalList = document.querySelector("#offer-modal-list");
let activeOfferButton = null;

function openOfferModal(key, trigger) {
  const detail = offerDetails[key];
  if (!detail || !offerModal || !offerModalTitle || !offerModalText || !offerModalList) return;
  activeOfferButton = trigger;
  offerModalTitle.textContent = detail.title;
  offerModalText.textContent = detail.text;
  offerModalList.replaceChildren(
    ...detail.points.map((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      return item;
    })
  );
  offerModal.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => offerModalPanel?.focus());
}

function closeOfferModal() {
  if (!offerModal || offerModal.hidden) return;
  offerModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeOfferButton?.focus();
  activeOfferButton = null;
}

document.querySelectorAll(".offer-card").forEach((button) => {
  button.addEventListener("click", () => {
    openOfferModal(button.dataset.offer, button);
  });
});

document.querySelectorAll("[data-modal-close]").forEach((control) => {
  control.addEventListener("click", () => closeOfferModal());
});

const backToTop = document.querySelector(".back-to-top");
backToTop?.addEventListener("click", () => {
  const home = document.querySelector("#home");
  if (home) {
    home.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
});
