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

let posicaoCarrossel = 0;

function moverCarrossel(direcao) {
  const carrossel = document.querySelector(".carrossel");
  const imagens = document.querySelectorAll(".carrossel img");
  const imagemLargura = imagens[0].clientWidth;
  const totalImagens = imagens.length;

  posicaoCarrossel += direcao;

  if (posicaoCarrossel < 0) {
    posicaoCarrossel = totalImagens - 1;
  } else if (posicaoCarrossel >= totalImagens) {
    posicaoCarrossel = 0;
  }

  const deslocamento = -posicaoCarrossel * imagemLargura;
  carrossel.style.transform = `translateX(${deslocamento}px)`;
}
// Lógica separada para o segundo carrossel
let indiceCarrossel2 = 0;

function moverCarrossel2(direcao) {
  const carrossel = document.querySelector(".carrossel2");
  const imagens = carrossel.querySelectorAll("img");

  indiceCarrossel2 += direcao;

  if (indiceCarrossel2 < 0) {
    indiceCarrossel2 = imagens.length - 1;
  } else if (indiceCarrossel2 >= imagens.length) {
    indiceCarrossel2 = 0;
  }

  const deslocamento = -indiceCarrossel2 * 300; // mesma largura do carrossel
  carrossel.style.transform = `translateX(${deslocamento}px)`;
}





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
