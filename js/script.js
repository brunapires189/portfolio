/*
  SCRIPT COMPLETO - PROJETO 3 (Glassmorphism)
  Contém:
  1. Efeito Máquina de Escrever (Bônus do Professor)
  2. Lógica do Modal (Req. 1)
  3. Lógica do Menu Hambúrguer (Req. 2)
  4. Lógica do Dark Mode com localStorage (Req. 3 - Upgrade)
  5. Lógica do Formulário AJAX (Req. 4)
*/

// Espera o HTML ser carregado antes de executar qualquer script
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. EFEITO MÁQUINA DE ESCREVER (Bônus) ---
  // Pega o elemento <p> com id "cargo"
  const cargoElement = document.getElementById("cargo");
  // Lista de textos para digitar
  const cargos = [
    "Programadora",
    "Estudante de ADS",
    "Analista de Sistemas em Formação",
  ];
  let cargoIndex = 0; // Índice do texto atual
  let charIndex = 0; // Índice da letra atual

  function typeWriter() {
    if (cargoElement && charIndex < cargos[cargoIndex].length) {
      cargoElement.textContent += cargos[cargoIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 100); // Velocidade de digitação
    } else {
      setTimeout(eraseText, 2000); // Pausa 2s antes de apagar
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      cargoElement.textContent = cargos[cargoIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseText, 50); // Velocidade para apagar
    } else {
      cargoIndex = (cargoIndex + 1) % cargos.length; // Vai para o próximo texto
      setTimeout(typeWriter, 500); // Pausa antes de digitar o próximo
    }
  }
  // Inicia o efeito
  if (cargoElement) typeWriter();

  // --- 2. LÓGICA DO MODAL (Req. 1) ---
  // Seleciona todos os cards de projeto e a "casca" do modal
  const cards = document.querySelectorAll(".project-item");
  const modal = document.getElementById("modal-projeto");
  const btnFechar = document.getElementById("modal-close-btn");

  cards.forEach((card) => {
    // Para cada card, adiciona um "ouvinte" de clique
    card.addEventListener("click", () => {
      // 1. Pega os dados guardados nos 'data-attributes' do HTML
      const titulo = card.getAttribute("data-titulo");
      const imagem = card.getAttribute("data-imagem");
      const descricao = card.getAttribute("data-descricao");
      const tecnologias = card.getAttribute("data-tecnologias");
      const linkProjeto = card.getAttribute("data-link-projeto");
      const linkGithub = card.getAttribute("data-link-github");

      // 2. Preenche o HTML do modal com esses dados
      document.getElementById("modal-titulo").textContent = titulo;
      document.getElementById("modal-imagem").src = imagem;
      document.getElementById("modal-descricao").textContent = descricao;
      document.getElementById("modal-tecnologias").textContent = tecnologias;
      document.getElementById("modal-link-projeto").href = linkProjeto;
      document.getElementById("modal-link-github").href = linkGithub;

      // 3. Mostra o modal (o CSS faz a animação)
      modal.classList.add("visivel");
    });
  });

  // Evento para fechar o modal no botão "X"
  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.classList.remove("visivel");
    });
  }

  // Evento para fechar o modal clicando fora (no overlay escuro)
  if (modal) {
    modal.addEventListener("click", (event) => {
      // Se o alvo do clique for o próprio fundo (e não o card de dentro)
      if (event.target === modal) {
        modal.classList.remove("visivel");
      }
    });
  }

  // --- 3. LÓGICA DO MENU HAMBÚRGUER (Req. 2) ---
  const btnMobile = document.getElementById("btn-mobile");
  const navLinks = document.getElementById("nav-links");

  if (btnMobile) {
    btnMobile.addEventListener("click", () => {
      // Adiciona/remove a classe que o CSS usa para mostrar o menu
      navLinks.classList.toggle("nav-ativa");
    });
  }
  // Bônus: Fecha o menu mobile ao clicar em um link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-ativa");
    });
  });

  // --- 4. LÓGICA DO DARK MODE com localStorage (Req. 3) ---
  // Esta é a versão ATUALIZADA do seu script
  const themeButton = document.getElementById("theme-toggle");
  const body = document.body;

  // Função para aplicar o tema salvo
  function aplicarTemaSalvo() {
    // 1. Verifica se há algo salvo no 'banco de dados' do navegador
    const temaSalvo = localStorage.getItem("theme");

    // 2. Se estava salvo como 'dark', aplica a classe
    if (temaSalvo === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }

  // 3. Aplica o tema assim que a página carrega
  aplicarTemaSalvo();

  // Evento de clique no botão de tema
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      // 4. Inverte o tema (liga ou desliga a classe)
      body.classList.toggle("dark-mode");

      // 5. Salva a preferência no localStorage
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  // --- 5. LÓGICA DO FORMULÁRIO AJAX (Fetch) (Req. 4) ---
  const form = document.getElementById("form-contato");
  const formStatus = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (event) => {
      // 1. Impede o recarregamento padrão da página
      event.preventDefault();

      const formData = new FormData(form);
      formStatus.innerHTML = "Enviando...";
      // Ajusta a cor do status para o tema atual
      formStatus.style.color = body.classList.contains("dark-mode")
        ? "white"
        : "black";

      // 2. Envia os dados para a URL do Formspree
      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          // 3. Se a resposta for OK (sucesso)
          if (response.ok) {
            formStatus.innerHTML = "Obrigado! Sua mensagem foi enviada.";
            formStatus.style.color = "green";
            form.reset(); // Limpa o formulário
          } else {
            // 4. Se der erro no servidor (ex: Formspree)
            response.json().then((data) => {
              formStatus.innerHTML = data.errors
                ? data.errors.map((err) => err.message).join(", ")
                : "Oops! Houve um problema.";
              formStatus.style.color = "red";
            });
          }
        })
        .catch((error) => {
          // 5. Se der erro de rede (ex: sem internet)
          formStatus.innerHTML = "Erro de rede. Tente novamente.";
          formStatus.style.color = "red";
        });
    });
  }
});
