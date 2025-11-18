document.addEventListener("DOMContentLoaded", () => {
  const cargoElement = document.getElementById("cargo");
  const cargos = [
    "Programadora",
    "Estudante de ADS",
    "Analista de Sistemas em Formação",
  ];
  let cargoIndex = 0;
  let charIndex = 0;

  function typeWriter() {
    if (cargoElement && charIndex < cargos[cargoIndex].length) {
      cargoElement.textContent += cargos[cargoIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(eraseText, 2000);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      cargoElement.textContent = cargos[cargoIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseText, 50);
    } else {
      cargoIndex = (cargoIndex + 1) % cargos.length;
      setTimeout(typeWriter, 500);
    }
  }

  if (cargoElement) typeWriter();
  const cards = document.querySelectorAll(".project-item");
  const modal = document.getElementById("modal-projeto");
  const btnFechar = document.getElementById("modal-close-btn");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const titulo = card.getAttribute("data-titulo");
      const imagem = card.getAttribute("data-imagem");
      const descricao = card.getAttribute("data-descricao");
      const tecnologias = card.getAttribute("data-tecnologias");
      const linkProjeto = card.getAttribute("data-link-projeto");
      const linkGithub = card.getAttribute("data-link-github");

      document.getElementById("modal-titulo").textContent = titulo;
      document.getElementById("modal-imagem").src = imagem;
      document.getElementById("modal-descricao").textContent = descricao;
      document.getElementById("modal-tecnologias").textContent = tecnologias;
      document.getElementById("modal-link-projeto").href = linkProjeto;
      document.getElementById("modal-link-github").href = linkGithub;

      modal.classList.add("visivel");
    });
  });

  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.classList.remove("visivel");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("visivel");
      }
    });
  }

  const btnMobile = document.getElementById("btn-mobile");
  const navLinks = document.getElementById("nav-links");

  if (btnMobile) {
    btnMobile.addEventListener("click", () => {
      navLinks.classList.toggle("nav-ativa");
    });
  }
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-ativa");
    });
  });

  const themeButton = document.getElementById("theme-toggle");
  const body = document.body;

  function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem("theme");

    if (temaSalvo === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }

  aplicarTemaSalvo();

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  const form = document.getElementById("form-contato");
  const formStatus = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      formStatus.innerHTML = "Enviando...";
      formStatus.style.color = body.classList.contains("dark-mode")
        ? "white"
        : "black";

      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            formStatus.innerHTML = "Obrigado! Sua mensagem foi enviada.";
            formStatus.style.color = "green";
            form.reset();
          } else {
            response.json().then((data) => {
              formStatus.innerHTML = data.errors
                ? data.errors.map((err) => err.message).join(", ")
                : "Oops! Houve um problema.";
              formStatus.style.color = "red";
            });
          }
        })
        .catch((error) => {
          formStatus.innerHTML = "Erro de rede. Tente novamente.";
          formStatus.style.color = "red";
        });
    });
  }
});
