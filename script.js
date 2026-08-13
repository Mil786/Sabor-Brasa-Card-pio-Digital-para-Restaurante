(function () {
  "use strict";

  /* ============================================================
     DADOS DE CONTATO
     ============================================================ */

  // Número fictício apenas para demonstração — troque pelo número real
  const WHATSAPP_NUMBER = "5500000000000";

  const WHATSAPP_MESSAGE =
    "Olá! Vi o site do Sabor & Brasa e gostaria de saber mais sobre o restaurante e fazer uma reserva.";

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(WHATSAPP_MESSAGE);

  [
    "whatsappHeaderBtn",
    "whatsappInfoLink",
    "whatsappVisitBtn",
    "whatsappFooterLink",
    "whatsappMobileBtn",
  ].forEach(function (id) {
    const el = document.getElementById(id);

    if (el) {
      el.href = whatsappURL;
    }
  });

  /* ============================================================
     ANO AUTOMÁTICO NO RODAPÉ
     ============================================================ */

  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     NAVEGAÇÃO MOBILE
     ============================================================ */

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");

      navToggle.setAttribute("aria-expanded", String(isOpen));

      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );

      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu de navegação");
        document.body.style.overflow = "";
      });
    });

    // Fecha o menu com a tecla Esc
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu de navegação");
        document.body.style.overflow = "";
        navToggle.focus();
      }
    });
  }

  /* ============================================================
     FILTRO DE CATEGORIAS DO CARDÁPIO
     ============================================================ */

  const tabButtons = document.querySelectorAll(".tab-btn");
  const dishCards = document.querySelectorAll(".dish-card");

  function applyFilter(category) {
    dishCards.forEach(function (card) {
      const match = card.getAttribute("data-category") === category;

      card.style.display = match ? "flex" : "none";

      if (match) {
        card.classList.remove("is-visible");

        // Pequeno atraso para a animação rodar de novo ao trocar de aba
        requestAnimationFrame(function () {
          card.classList.add("is-visible");
        });
      }
    });
  }

  if (tabButtons.length && dishCards.length) {
    const firstCategory = tabButtons[0].getAttribute("data-category");

    applyFilter(firstCategory);

    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabButtons.forEach(function (button) {
          button.classList.remove("is-active");
          button.setAttribute("aria-selected", "false");
        });

        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        applyFilter(btn.getAttribute("data-category"));
      });
    });
  }

  /* ============================================================
     REVELAÇÃO SUAVE DOS CARDS
     ============================================================ */

  let cardObserver = null;

  if ("IntersectionObserver" in window) {
    cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    dishCards.forEach(function (card) {
      cardObserver.observe(card);
    });
  } else {
    dishCards.forEach(function (card) {
      card.classList.add("is-visible");
    });
  }

  /* ============================================================
     SOMBRA DO HEADER AO ROLAR
     ============================================================ */

  const header = document.querySelector(".site-header");

  if (header) {
    function updateHeaderShadow() {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
    updateHeaderShadow();
  }

  /* ============================================================
     PARTÍCULAS DE BRASA NO HERO
     ============================================================ */

  const canvas = document.getElementById("emberCanvas");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (canvas && canvas.getContext && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const hero = document.getElementById("hero");

    if (hero) {
      let particles = [];
      let width = 0;
      let height = 0;
      let rafId = null;

      function resize() {
        const rect = hero.getBoundingClientRect();

        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));

        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }

      function createParticle() {
        return {
          x: Math.random() * width,
          y: height + Math.random() * 60,
          r: 1 + Math.random() * 2.4,
          speed: 0.4 + Math.random() * 0.9,
          drift: (Math.random() - 0.5) * 0.6,
          life: 0,
          maxLife: 220 + Math.random() * 220,
          hue: Math.random() > 0.5 ? "196,64,28" : "232,120,60",
        };
      }

      function initParticles() {
        resize();
        particles = [];

        const count = window.innerWidth < 700 ? 22 : 46;

        for (let i = 0; i < count; i++) {
          const particle = createParticle();
          particle.life = Math.random() * particle.maxLife;
          particles.push(particle);
        }
      }

      function tick() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(function (particle) {
          particle.y -= particle.speed;
          particle.x += particle.drift;
          particle.life++;

          const lifeRatio = particle.life / particle.maxLife;
          let opacity;

          if (lifeRatio < 0.15) {
            opacity = lifeRatio / 0.15;
          } else {
            opacity = 1 - (lifeRatio - 0.15) / 0.85;
          }

          opacity = Math.max(0, Math.min(1, opacity));

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" + particle.hue + "," + opacity * 0.85 + ")";
          ctx.fill();

          if (particle.life >= particle.maxLife || particle.y < -20) {
            Object.assign(particle, createParticle());
          }
        });

        rafId = requestAnimationFrame(tick);
      }

      let resizeTimer;

      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        } else if (!rafId) {
          rafId = requestAnimationFrame(tick);
        }
      });

      initParticles();
      tick();
    }
  }
})();
