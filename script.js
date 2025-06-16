// Função para abrir o modal
function verOrganograma() {
  document.getElementById("modalOrganograma").style.display = "block";
}

// Função para fechar o modal
function fecharOrganograma() {
  document.getElementById("modalOrganograma").style.display = "none";
}

// Função da lupa (zoom) na imagem do organograma
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("organogramaImg");
  const lupa = document.getElementById("lupa");

  if (!img || !lupa) {
    console.error("Imagem ou lupa não encontradas no DOM.");
    return;
  }

  img.addEventListener("mousemove", function(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left; // posição x dentro da imagem
    const y = e.clientY - rect.top;  // posição y dentro da imagem

    lupa.style.display = "block";
    // Ajusta a posição da lupa para seguir o mouse
    lupa.style.left = (e.pageX - lupa.offsetWidth / 2) + "px";
    lupa.style.top = (e.pageY - lupa.offsetHeight / 2) + "px";

    // Configura o fundo da lupa para zoom na imagem original
    lupa.style.backgroundImage = `url(${img.src})`;
    lupa.style.backgroundSize = `${img.width * 2}px ${img.height * 2}px`;
    lupa.style.backgroundPosition = `-${x * 2 - lupa.offsetWidth / 2}px -${y * 2 - lupa.offsetHeight / 2}px`;
  });

  img.addEventListener("mouseleave", function() {
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
