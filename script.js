function verOrganograma() {
  document.getElementById("modalOrganograma").style.display = "block";
}

function fecharOrganograma() {
  document.getElementById("modalOrganograma").style.display = "none";
}
// Lupa
const imagem = document.getElementById("imagemOrganograma");
const lupa = document.getElementById("lupa");
const zoomImagem = document.getElementById("zoomImagem");
const zoom = 3; // valor do zoom (pode aumentar se quiser)

imagem.addEventListener("mousemove", function(e) {
  lupa.style.display = "block";
  const rect = imagem.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  lupa.style.left = (e.clientX - lupa.offsetWidth / 2) + "px";
  lupa.style.top = (e.clientY - lupa.offsetHeight / 2) + "px";

  zoomImagem.style.width = imagem.width * zoom + "px";
  zoomImagem.style.height = imagem.height * zoom + "px";
  zoomImagem.style.left = -x * zoom + lupa.offsetWidth / 2 + "px";
  zoomImagem.style.top = -y * zoom + lupa.offsetHeight / 2 + "px";
});

imagem.addEventListener("mouseleave", function() {
  lupa.style.display = "none";
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
