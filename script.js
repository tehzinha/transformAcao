function verOrganograma() {
  document.getElementById("modalOrganograma").style.display = "block";
}

function fecharOrganograma() {
  document.getElementById("modalOrganograma").style.display = "none";
}
// Função de lupa
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("organogramaImg");
  const lupa = document.getElementById("lupa");
  const lupaImg = document.getElementById("lupaImg");

  img.addEventListener("mousemove", function(e) {
    lupa.style.display = "block";

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // posição da lupa
    lupa.style.left = (e.pageX - 75) + "px";
    lupa.style.top = (e.pageY - 75) + "px";

    // mover imagem dentro da lupa
    lupaImg.style.left = (-x * 2 + 75) + "px";
    lupaImg.style.top = (-y * 2 + 75) + "px";
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
