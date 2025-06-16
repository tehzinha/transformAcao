function verOrganograma() {
  document.getElementById("modalOrganograma").style.display = "block";
}

function fecharOrganograma() {
  document.getElementById("modalOrganograma").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("organogramaImg");
  const lupa = document.getElementById("lupa");

  if (!img || !lupa) {
    console.error("Imagem ou lupa não encontradas no DOM.");
    return;
  }

  const zoom = 2.5; // zoom da lupa

  img.addEventListener("mousemove", (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Se estiver fora da imagem, não exibe a lupa
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lupa.style.display = "none";
      return;
    }

    lupa.style.display = "block";

    // Posiciona a lupa em relação ao container
    lupa.style.left = `${x - lupa.offsetWidth / 2}px`;
    lupa.style.top = `${y - lupa.offsetHeight / 2}px`;

    // Configura a imagem de fundo da lupa
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
