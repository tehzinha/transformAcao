// Função para abrir o modal
function verOrganograma() {
  document.getElementById("modalOrganograma").style.display = "block";
}

// Função para fechar o modal
function fecharOrganograma() {
  document.getElementById("modalOrganograma").style.display = "none";
}

// Espera o DOM carregar para pegar os elementos
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("organogramaImg");
  const lupa = document.getElementById("lupa");

  if (!img || !lupa) {
    console.error("Imagem ou lupa não encontradas no DOM.");
    return;
  }

  img.addEventListener("mousemove", (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lupa.style.display = "block";

    // Ajusta a posição da lupa relativo à imagem
    lupa.style.left = (x - lupa.offsetWidth / 2) + "px";
    lupa.style.top = (y - lupa.offsetHeight / 2) + "px";

    const zoom = 3;

    lupa.style.backgroundImage = `url(${img.src})`;
    lupa.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    lupa.style.backgroundPosition = `-${x * zoom - lupa.offsetWidth / 2}px -${y * zoom - lupa.offsetHeight / 2}px`;
  });

  img.addEventListener("mouseleave", () => {
    lupa.style.display = "none";
  });
});


document.getElementById("voluntario-form").addEventListener("submit", function(event) {
  event.preventDefault(); // impede envio padrão do formulário

  emailjs.sendForm("service_f3w95js", "template_xv8exuz", this)
    .then(function() {
      alert("Mensagem enviada com sucesso! Obrigado pelo contato.");
      document.getElementById("voluntario-form").reset();
    }, function(error) {
      alert("Ocorreu um erro: " + JSON.stringify(error));
    });
});
