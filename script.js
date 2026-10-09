const themes = {
  ocean: {
    decorations: [
      ["fish", "🐟"], ["bubble", ""], ["coral", "🪸"], ["shell", "🐚"],
      ["starfish", "✴"], ["bubble", ""], ["fish", "🐠"], ["kelp", "🌿"], ["jellyfish", "♆"], ["plankton", "·"]
    ],
    className: "theme-ocean",
    track: "Ocean Dreams",
    audio: "assets/ocean.wav"
  },
  spring: {
    decorations: [
      ["sakura", "🌸"], ["flower", "✿"], ["leaf", "🍃"], ["butterfly", "🦋"],
      ["petal", "❀"], ["flower", "🌷"], ["petal", "✧"], ["leaf", "🍃"]
    ],
    className: "theme-spring",
    track: "Spring Daydream",
    audio: "assets/spring.wav"
  },
  winter: {
    decorations: [
      ["snowflake", "❄"], ["crystal", "✧"], ["snowflake", "❅"], ["snowflake", "❄"],
      ["cloud", "☁"], ["crystal", "✦"], ["snowflake", "❆"], ["snowflake", "❅"]
    ],
    className: "theme-winter",
    track: "Winter Lullaby",
    audio: "assets/winter.wav"
  }
};

const certificates = [
  { title: "Pemrograman Web Front End dengan Bootstrap dan PHP Native", issuer: "Kelas Industri PT Humma Teknologi Indonesia", date: "7 Juli 2026", category: "web", description: "Lulus pembelajaran Kelas Industri dengan predikat Kompeten.", image: "assets/sertifikat 1.jpeg", credential: "" },
  { title: "Java Fundamental Programming", issuer: "Getskill.id", date: "Berlaku hingga 21 Desember 2028", category: "programming", description: "Sertifikat kelulusan kelas Java Fundamental Programming.", image: "assets/sertifikat 2.jpeg", credential: "" },
  { title: "Pelatihan Kepemimpinan MPLS Ramah untuk OSIS-MPK Se-Indonesia", issuer: "Forum OSIS Merah Putih", date: "28 Juni 2026", category: "other", description: "Berpartisipasi sebagai peserta dalam pelatihan kepemimpinan Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah yang diselenggarakan secara daring.", image: "assets/sertifikat 3.jpeg", credential: "" },
  { title: "Anggota Seksi Bidang V OSIS", issuer: "OSIS SMKN 8 Jember", date: "24 September 2026", category: "other", description: "Penghargaan atas dedikasi dan kontribusi sebagai Anggota Seksi Bidang V Pembinaan Kualitas Jasmani, Kesehatan, dan Gizi dalam kepengurusan OSIS masa bakti 2025–2026.", image: "assets/sertifikat 4.jpeg", credential: "" }
];

const themeButtons = document.querySelectorAll("[data-theme-choice]");
const ambient = document.querySelector("#ambient");
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const audio = document.querySelector("#theme-audio");
const musicPlay = document.querySelector("#music-play");
const musicStatus = document.querySelector("#music-status");
const musicProgress = document.querySelector("#music-progress");
const musicVolume = document.querySelector("#music-volume");
const musicTitle = document.querySelector("#music-title");
const certificateGrid = document.querySelector("#certificates-grid");
const certificateDialog = document.querySelector("#certificate-dialog");
const certificateDialogImage = document.querySelector("#certificate-dialog-image");
let activeTheme = document.documentElement.dataset.theme || "ocean";
let userStartedAudio = false;
let requestedTrack = "";
let cursorLastSpawn = 0;

function renderDecorations(theme) {
  const { decorations, className } = themes[theme];
  ambient.className = `ambient ${className}`;
  ambient.replaceChildren();

  for (let index = 0; index < 20; index += 1) {
    const [kind, symbol] = decorations[index % decorations.length];
    const item = document.createElement("span");
    item.className = `ambient-item ambient-item--${kind}`;
    item.textContent = symbol;
    item.setAttribute("aria-hidden", "true");
    const fishNumber = Math.floor(index / decorations.length);
    const left = kind === "fish" ? 4 + fishNumber * 14 : (index * 67 + 4) % 100;
    item.style.setProperty("--top", `${(index * 43 + 7) % 100}%`);
    item.style.setProperty("--left", `${left}%`);
    item.style.setProperty("--size", `${11 + (index % 5) * 5}px`);
    item.style.setProperty("--duration", `${kind === "fish" ? 20 + fishNumber * 3 : 8 + (index % 7)}s`);
    item.style.setProperty("--delay", `${-(index % 8)}s`);
    item.style.setProperty("--opacity", `${0.14 + (index % 4) * 0.07}`);
    item.style.setProperty("--direction", index % 2 === 0 ? "1" : "-1");
    ambient.append(item);
  }
}

function updateMusicTheme(theme) {
  musicTitle.textContent = themes[theme].track;
  if (!userStartedAudio) return;

  audio.pause();
  musicPlay.textContent = "▶";
  musicPlay.setAttribute("aria-label", "Putar musik");
  requestedTrack = "";
  audio.removeAttribute("src");
  audio.load();
  musicStatus.textContent = "Tema berubah · tekan play untuk mendengarkan";
}

function setTheme(theme) {
  if (!Object.hasOwn(themes, theme)) return;

  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === "spring" ? "#fff8f5" : theme === "winter" ? "#edf6ff" : "#092c46";

  themeButtons.forEach((button) => {
    const isActive = button.dataset.themeChoice === theme;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderDecorations(theme);
  updateMusicTheme(theme);
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Buka menu" : "Tutup menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
    navLinks.classList.remove("is-open");
  }
});

const header = document.querySelector(".site-header");
const backToTop = document.querySelector("#back-to-top");
window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener("click", () => {
  document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

async function playThemeMusic() {
  userStartedAudio = true;
  const source = themes[activeTheme].audio;

  if (!audio.getAttribute("src") || requestedTrack !== source) {
    requestedTrack = source;
    audio.src = source;
    audio.load();
  }

  musicStatus.textContent = "Memuat musik...";
  try {
    await audio.play();
    musicStatus.textContent = "Sedang diputar";
  } catch {
    if (requestedTrack !== source) return;
    showMusicUnavailable();
  }
}

function showMusicUnavailable() {
  musicStatus.textContent = "File musik tidak dapat dimuat";
  musicPlay.textContent = "▶";
  musicPlay.setAttribute("aria-label", "Putar musik");
}

musicPlay.addEventListener("click", () => {
  if (audio.paused) {
    playThemeMusic();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  musicPlay.textContent = "Ⅱ";
  musicPlay.setAttribute("aria-label", "Jeda musik");
  musicStatus.textContent = "Sedang diputar";
});

audio.addEventListener("pause", () => {
  musicPlay.textContent = "▶";
  musicPlay.setAttribute("aria-label", "Putar musik");
  if (audio.currentTime > 0 && !audio.ended) musicStatus.textContent = "Dijeda";
});

audio.addEventListener("error", () => {
  if (requestedTrack && userStartedAudio) showMusicUnavailable();
});

audio.addEventListener("timeupdate", () => {
  musicProgress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : "0";
  document.querySelector("#music-current").textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  document.querySelector("#music-duration").textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  musicStatus.textContent = "Selesai diputar";
  musicPlay.textContent = "▶";
  musicPlay.setAttribute("aria-label", "Putar musik");
});

musicProgress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(musicProgress.value) / 100) * audio.duration;
});

musicVolume.addEventListener("input", () => {
  audio.volume = Number(musicVolume.value);
  audio.muted = audio.volume === 0;
  document.querySelector("#music-mute").textContent = audio.muted ? "🔇" : "🔊";
});

document.querySelector("#music-mute").addEventListener("click", (event) => {
  audio.muted = !audio.muted;
  event.currentTarget.textContent = audio.muted ? "🔇" : "🔊";
  event.currentTarget.setAttribute("aria-label", audio.muted ? "Nyalakan suara" : "Bisukan musik");
});

const themeOrder = Object.keys(themes);
document.querySelector("#music-previous").addEventListener("click", () => {
  const index = (themeOrder.indexOf(activeTheme) - 1 + themeOrder.length) % themeOrder.length;
  setTheme(themeOrder[index]);
});

document.querySelector("#music-next").addEventListener("click", () => {
  const index = (themeOrder.indexOf(activeTheme) + 1) % themeOrder.length;
  setTheme(themeOrder[index]);
});

function makeCertificatePlaceholder(title, compact = false) {
  const placeholder = document.createElement("div");
  placeholder.className = `certificate-image-placeholder${compact ? " certificate-image-placeholder--compact" : ""}`;
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", `Placeholder gambar untuk ${title}`);
  const seal = document.createElement("span");
  seal.setAttribute("aria-hidden", "true");
  seal.textContent = "✦";
  const label = document.createElement("strong");
  label.textContent = "CERTIFICATE";
  const name = document.createElement("span");
  name.textContent = title;
  placeholder.append(seal, label, name);
  return placeholder;
}

function renderCertificates(category = "all") {
  certificateGrid.replaceChildren();
  const filtered = certificates.filter((certificate) => category === "all" || certificate.category === category);

  filtered.forEach((certificate, index) => {
    const card = document.createElement("article");
    card.className = "glass-card certificate-card";
    card.dataset.reveal = "";
    card.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);

    const preview = document.createElement("div");
    preview.className = "certificate-preview";
    if (certificate.image) {
      const image = document.createElement("img");
      image.src = certificate.image;
      image.alt = `Sertifikat ${certificate.title}`;
      image.loading = "lazy";
      image.addEventListener("error", () => image.replaceWith(makeCertificatePlaceholder(certificate.title)), { once: true });
      preview.append(image);
    } else {
      preview.append(makeCertificatePlaceholder("Sertifikatmu ada di sini"));
    }

    const body = document.createElement("div");
    body.className = "certificate-card__body";
    const label = document.createElement("span");
    label.className = "certificate-card__label";
    label.textContent = certificate.category;
    const title = document.createElement("h3");
    title.textContent = certificate.title;
    const issuer = document.createElement("p");
    issuer.className = "certificate-card__issuer";
    issuer.textContent = `${certificate.issuer} · ${certificate.date}`;
    const view = document.createElement("button");
    view.className = "certificate-view";
    view.type = "button";
    view.textContent = "View Certificate ↗";
    view.addEventListener("click", () => openCertificate(certificate));
    body.append(label, title, issuer, view);
    card.append(preview, body);
    certificateGrid.append(card);
    revealElement(card);
  });

  if (filtered.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "certificate-empty";
    emptyMessage.textContent = "Belum ada sertifikat dalam kategori ini.";
    certificateGrid.append(emptyMessage);
  }
}

function openCertificate(certificate) {
  certificateDialogImage.replaceChildren();
  if (certificate.image) {
    const image = document.createElement("img");
    image.src = certificate.image;
    image.alt = `Sertifikat ${certificate.title}`;
    image.addEventListener("error", () => image.replaceWith(makeCertificatePlaceholder(certificate.title, true)), { once: true });
    certificateDialogImage.append(image);
  } else {
    certificateDialogImage.append(makeCertificatePlaceholder("Ganti dengan gambar sertifikat", true));
  }

  document.querySelector("#certificate-dialog-title").textContent = certificate.title;
  document.querySelector("#certificate-dialog-category").textContent = certificate.category;
  document.querySelector("#certificate-dialog-issuer").textContent = `${certificate.issuer} · ${certificate.date}`;
  document.querySelector("#certificate-dialog-description").textContent = certificate.description;
  document.querySelector("#certificate-dialog-date").textContent = certificate.date;
  const credentialLink = document.querySelector("#certificate-dialog-link");
  credentialLink.hidden = !certificate.credential;
  if (certificate.credential) credentialLink.href = certificate.credential;
  certificateDialog.showModal();
}

document.querySelectorAll("[data-certificate-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-certificate-filter]").forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderCertificates(button.dataset.certificateFilter);
  });
});

document.querySelector("[data-close-certificate]").addEventListener("click", () => certificateDialog.close());
certificateDialog.addEventListener("click", (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

function revealElement(element) {
  if (element.classList.contains("is-visible")) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.classList.add("is-visible");
    return;
  }
  revealObserver.observe(element);
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" })
  : null;

document.querySelectorAll(".section:not(.hero) .section-heading, .about-card, .mini-card, .quote-card, .skill-card, .learning-card, .project-card, .journey-step, .timeline-item, .contact-card")
  .forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${(index % 5) * 65}ms`);
    revealElement(element);
  });

const navigationSections = [...document.querySelectorAll("main section[id]")];
const navigationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.querySelectorAll("a[href^='#']").forEach((link) => {
      const isActive = link.getAttribute("href") === `#${entry.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-25% 0px -60% 0px" });
navigationSections.forEach((section) => navigationObserver.observe(section));

const cursorSymbols = { ocean: ["◦", "✧", "·"], spring: ["✿", "❀", "✧"], winter: ["❄", "✧", "✦"] };
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsFinePointer && !reduceMotion) {
  document.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - cursorLastSpawn < 85 || event.target.closest("input, textarea, select, button, a")) return;
    cursorLastSpawn = now;
    const particle = document.createElement("span");
    const symbols = cursorSymbols[activeTheme];
    particle.className = `cursor-particle cursor-particle--${activeTheme}`;
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${event.clientX}px`;
    particle.style.top = `${event.clientY}px`;
    particle.setAttribute("aria-hidden", "true");
    document.body.append(particle);
    window.setTimeout(() => particle.remove(), 950);
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();
audio.volume = Number(musicVolume.value);
renderDecorations(activeTheme);
renderCertificates();
