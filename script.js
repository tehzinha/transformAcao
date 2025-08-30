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

// ---- JOGO: variáveis base ----
document.getElementById('btnJogo').addEventListener('click', abrirJogo);
document.getElementById('fecharJogo').addEventListener('click', fecharJogo);

let jogo = {
  ativo: false,
  pausado: false,
  rafId: null,
  canvas: null,
  ctx: null,
  keys: {},
  placar: 0,
  metaVencedor: 10,
  mensagens: [
    "Jovem Aprendiz: comece sua carreira com experiência prática!",
    "Aprenda enquanto trabalha: teoria e prática lado a lado.",
    "Direitos garantidos: estudo e formação profissional.",
    "Desenvolva habilidades digitais e comportamentais essenciais.",
    "Mentoria e rotina real de trabalho — na medida certa.",
    "Oportunidade de crescimento e networking desde o início.",
    "Adquira experiência profissional valiosa e reconhecida.",
    "Descubra talentos e desenvolva competências no ambiente real."
  ],
  player: { x: 40, y: 40, w: 40, h: 40, vel: 3.2 }, // player maior
  papers: [],
  paperSize: 28 // papéis maiores
};

// ---- Abrir / fechar modal do jogo ----
function abrirJogo() {
  const modal = document.getElementById('modalJogo');
  modal.classList.add('aberto');
  modal.setAttribute('aria-hidden', 'false');

  if (!jogo.canvas) {
    jogo.canvas = document.getElementById('gameCanvas');
    jogo.ctx = jogo.canvas.getContext('2d');
    ajustarCanvasHD(jogo.canvas);
  }

  iniciarJogo();
  mostrarToast("Bem-vinda(o)! Colete os papéis e descubra informações sobre Jovem Aprendiz.");
}

function fecharJogo() {
  pararLoop();
  const modal = document.getElementById('modalJogo');
  modal.classList.remove('aberto');
  modal.setAttribute('aria-hidden', 'true');
}

// ---- Responsividade ----
function ajustarCanvasHD(canvas) {
  const w = window.innerWidth * 0.95; // largura maior (95% da tela)
  const h = window.innerHeight * 0.5; // mantém metade da altura
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  jogo.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener('resize', () => {
  if (jogo.canvas) ajustarCanvasHD(jogo.canvas);
});

// ---- Setup & Loop ----
function iniciarJogo() {
  jogo.ativo = true;
  jogo.pausado = false;
  jogo.placar = 0;
  jogo.player.x = 40;
  jogo.player.y = 40;
  atualizarPlacar();

  jogo.papers = Array.from({ length: 5 }, () => papelAleatorio());

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  document.getElementById('btnPausar').onclick = alternarPausa;

  loop();
}

function pararLoop() {
  jogo.ativo = false;
  jogo.pausado = false;
  cancelAnimationFrame(jogo.rafId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
}

function loop() {
  if (!jogo.ativo) return;
  jogo.rafId = requestAnimationFrame(loop);
  if (jogo.pausado) return;
  atualizar();
  desenhar();
}

// ---- Controles ----
function onKeyDown(e) { jogo.keys[e.key.toLowerCase()] = true; }
function onKeyUp(e)   { jogo.keys[e.key.toLowerCase()] = false; }

function alternarPausa() {
  jogo.pausado = !jogo.pausado;
  document.getElementById('btnPausar').textContent = jogo.pausado ? "Retomar" : "Pausar";
}

// ---- Jogo: lógica ----
function atualizar() {
  const { player, canvas } = jogo;
  let dx = 0, dy = 0;

  if (jogo.keys['arrowleft'] || jogo.keys['a']) dx -= player.vel;
  if (jogo.keys['arrowright'] || jogo.keys['d']) dx += player.vel;
  if (jogo.keys['arrowup'] || jogo.keys['w']) dy -= player.vel;
  if (jogo.keys['arrowdown'] || jogo.keys['s']) dy += player.vel;

  player.x += dx;
  player.y += dy;

  const maxX = canvas.clientWidth - player.w;
  const maxY = canvas.clientHeight - player.h;
  player.x = Math.max(0, Math.min(player.x, maxX));
  player.y = Math.max(0, Math.min(player.y, maxY));

  for (let i = 0; i < jogo.papers.length; i++) {
    const p = jogo.papers[i];
    if (colide(player, p)) {
      jogo.placar++;
      atualizarPlacar();
      jogo.papers[i] = papelAleatorio();
      mostrarToast(mensagemAleatoria());

      if (jogo.placar % 5 === 0) jogo.player.vel = Math.min(jogo.player.vel + 0.3, 6);

      if (jogo.placar >= jogo.metaVencedor) {
        mostrarToast("🎉 Parabéns! Você coletou todos os papéis e venceu!");
        pararLoop();
      }
    }
  }
}

function desenhar() {
  const ctx = jogo.ctx;
  const w = jogo.canvas.clientWidth;
  const h = jogo.canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0, 0, w, h);

  // grade suave
  ctx.strokeStyle = '#eeeeee';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  // papéis
  jogo.papers.forEach(p => {
    ctx.fillStyle = '#dfe9ff';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#9fb9ff';
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    ctx.beginPath();
    ctx.moveTo(p.x+4, p.y+6); ctx.lineTo(p.x+p.w-4, p.y+6);
    ctx.moveTo(p.x+4, p.y+11); ctx.lineTo(p.x+p.w-4, p.y+11);
    ctx.moveTo(p.x+4, p.y+16); ctx.lineTo(p.x+p.w-6, p.y+16);
    ctx.strokeStyle = '#b3c8ff';
    ctx.stroke();
  });

  // player
  const pl = jogo.player;
  ctx.fillStyle = '#1BA1E2';
  roundRect(ctx, pl.x, pl.y, pl.w, pl.h, 6, true, false);
}

// ---- Utilitários ----
function colide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function papelAleatorio() {
  const margin = 16;
  const w = Math.max(100, jogo.canvas.clientWidth);
  const h = Math.max(100, jogo.canvas.clientHeight);
  return {
    x: Math.random() * (w - jogo.paperSize - margin) + margin,
    y: Math.random() * (h - jogo.paperSize - margin) + margin,
    w: jogo.paperSize,
    h: jogo.paperSize
  };
}

function mensagemAleatoria() {
  const msgs = jogo.mensagens;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function atualizarPlacar() {
  document.getElementById('placar').textContent = `Papéis: ${jogo.placar}`;
}

function mostrarToast(texto) {
  const el = document.getElementById('toast');
  el.textContent = texto;
  el.classList.add('visivel');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('visivel'), 5000);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === "number") r = {tl:r,tr:r,br:r,bl:r};
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

