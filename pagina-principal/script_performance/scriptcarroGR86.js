// ---------- Imagens ----------
// Fotos oficiais do Toyota USA Newsroom (pressroom.toyota.com) – uso editorial
const BLUE = n => `https://pressroom.toyota.com/wp-content/uploads/2026/05/2027_Toyota_GR86_Premium_TruenoBlue_${n}-1500x1000.jpg`;
const FF = 'https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2026/06/2027_Toyota_GR86_Fuel-Fest_';

const IMG = {
  official: 'https://delivery.tcom.assetscs.toyota.com/adobe/assets/urn:aaid:aem:a08b1474-a7a9-45b1-8657-528c85c622ce/as/image.png?width=930&quality=90&crop=5p,22p,90p,49p',
  front: 'https://www.totoyota.com/inventoryphotos/15357/jf1znbe12v9751101/sp/17.png?bg-color=FFFFFF&width=400',
  side: 'https://www.totoyota.com/inventoryphotos/15357/jf1znbe12v9751101/sp/14.png?bg-color=FFFFFF&width=400',
  // Trueno Blue (Premium)
  blue: 'https://pressroom.toyota.com/wp-content/uploads/2026/05/2027_Toyota_GR86_Premium_TruenoBlue_003-1500x997.jpg',
  blue1: 'https://pressroom.toyota.com/wp-content/uploads/2026/05/2027_Toyota_GR86_Premium_TruenoBlue_001-1500x998.jpg',
  blue2: BLUE('002'), blue4: BLUE('004'), blue5: BLUE('005'),
  blue11: BLUE('011'), blue12: BLUE('012'), blue13: BLUE('013'), blue15: BLUE('015'),
  blue300: BLUE('300'), blue306: BLUE('306'),
  // Fuel Fest (lançamento 2027)
  ff1: FF + '01-1500x1133.jpg', ff2: FF + '02-1500x1124.jpg', ff3: FF + '03-1500x1016.jpg',
  ff7: FF + '07-1500x1086.jpg', ff8: FF + '08-1500x1114.jpg', ff9: FF + '09-1500x933.jpg',
  ffHero: FF + 'HERO-1500x1001.jpg'
};

// [nome, cor hex, imagens]
const colors = [
  ['Raven',       '#111111', [IMG.official, IMG.front, IMG.side]],
  ['Pavement',    '#77777b', [IMG.front, IMG.side]],
  ['Steel',       '#50545b', [IMG.front]],
  ['Halo',        '#c9c9c7', [IMG.front]],
  ['Trueno Blue', '#263d88', [IMG.blue1, IMG.blue2, IMG.blue, IMG.blue4, IMG.blue5, IMG.blue11, IMG.blue12, IMG.blue13, IMG.blue15, IMG.blue300, IMG.blue306]],
  ['Track bRED',  '#d60000', [IMG.front]],
  ['Thunder',     '#aeb0b1', [IMG.ff1, IMG.ff2, IMG.ff3, IMG.ff7, IMG.ff8, IMG.ff9]]
];

const $ = id => document.getElementById(id);
const carImage = $('carImage'), colorPicker = $('colorPicker'), colorName = $('colorName');
let current = 0, index = 0;

// ---------- Visualizador ----------
function showImage() {
  const list = colors[current][2];
  carImage.style.opacity = '0';
  setTimeout(() => {
    carImage.src = list[index % list.length];
    carImage.alt = `Toyota GR86 2027 ${colors[current][0]}`;
    carImage.style.opacity = '1';
  }, 120);
}

function selectColor(i) {
  current = i; index = 0;
  colorName.textContent = colors[i][0];
  [...colorPicker.children].forEach((b, n) => {
    b.classList.toggle('active', n === i);
    b.setAttribute('aria-checked', n === i);
  });
  showImage();
}

function step(dir) {
  const len = colors[current][2].length;
  index = (index + dir + len) % len;
  showImage();
}

colors.forEach(([name, hex], i) => {
  const b = document.createElement('button');
  b.className = 'color-dot';
  b.style.background = hex;
  b.title = name;
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-label', name);
  b.addEventListener('click', () => selectColor(i));
  colorPicker.appendChild(b);
});

$('prevImage').addEventListener('click', () => step(-1));
$('nextImage').addEventListener('click', () => step(1));

// Arrastar para girar
let dragging = false, lastX = 0;
carImage.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; carImage.setPointerCapture(e.pointerId); });
carImage.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  if (Math.abs(dx) > 18) { step(dx > 0 ? -1 : 1); lastX = e.clientX; }
});
['pointerup', 'pointercancel'].forEach(ev => carImage.addEventListener(ev, () => dragging = false));

// ---------- Menu "Visão geral" ----------
const toggle = document.querySelector('.dropdown-toggle');
const menu = $('menuOverview');
function setMenu(open) { menu.hidden = !open; toggle.setAttribute('aria-expanded', open); }
toggle.addEventListener('click', e => { e.stopPropagation(); setMenu(menu.hidden); });
document.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Esconde a barra ao rolar para baixo, mostra ao subir
const topbar = $('topbar');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  topbar.classList.toggle('hidden', y > lastY && y > 300);
  lastY = y;
}, { passive: true });

// ---------- Abas (reutilizável) ----------
function tabs(selector, attr, onChange) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    onChange(btn.dataset[attr]);
  }));
}

// Galeria
const galleryImages = {
  exterior: [IMG.blue, IMG.blue2, IMG.blue4, IMG.ff2, IMG.ff3, IMG.ff7],
  interior: [IMG.blue11, IMG.blue12, IMG.blue13],
  views: colors[4][2]
};
function renderGallery(key) {
  $('galleryGrid').innerHTML = galleryImages[key]
    .map((src, i) => `<img src="${src}" alt="GR86 galeria ${i + 1}" loading="lazy">`).join('');
}
tabs('[data-gallery]', 'gallery', renderGallery);
renderGallery('exterior');

// Desempenho / Manuseio
const perf = {
  performance: {
    label: 'DESEMPENHO',
    title: 'Transmissão manual de 6 velocidades.',
    text: 'Acelerador com resposta mais linear e troca da quinta para a quarta mais precisa: uma conexão direta entre motorista e máquina.',
    img: IMG.blue
  },
  handling: {
    label: 'MANUSEIO',
    title: 'Equilíbrio em cada curva.',
    text: 'Tração traseira, centro de gravidade baixo e suspensão desenvolvida para respostas rápidas. O Pacote Performance adiciona freios Brembo® e amortecedores SACHS®.',
    img: IMG.blue300
  }
};
function renderPerf(key) {
  const p = perf[key];
  $('performanceLabel').textContent = p.label;
  $('performanceTitle').textContent = p.title;
  $('performanceText').textContent = p.text;
  $('performanceImage').src = p.img;
}
tabs('[data-performance]', 'performance', renderPerf);
renderPerf('performance');

// ---------- Início ----------
selectColor(0);