// Imagens Oficiais Toyota GR Corolla (Pressroom)
const IMG = {
  white1: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_Core_IceCap_001-1500x1000.jpg',
  white2: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_Core_IceCap_002-1500x1000.jpg',
  black1: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_Black_001-1500x1000.jpg',
  black2: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_Black_002-1500x1000.jpg',
  metal1: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_HeavyMetal_001-1500x1000.jpg',
  metal2: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_HeavyMetal_002-1500x1000.jpg',
  red1: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_Premium_SupersonicRed_001-1500x1000.jpg',
  red2: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_Premium_SupersonicRed_002-1500x1000.jpg',
  interior1: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_HeavyMetal_010-1500x1000.jpg',
  interior2: 'https://pressroom.toyota.com/wp-content/uploads/2024/08/2025_Toyota_GRCorolla_PremiumPlus_HeavyMetal_012-1500x1000.jpg'
};

// [Nome da cor, Hexadecimal, [Imagens]]
const colors = [
  ['Ice Cap', '#ffffff', [IMG.white1, IMG.white2]],
  ['Black', '#111111', [IMG.black1, IMG.black2]],
  ['Heavy Metal', '#55585d', [IMG.metal1, IMG.metal2]],
  ['Supersonic Red', '#d60000', [IMG.red1, IMG.red2]]
];

const $ = id => document.getElementById(id);
const carImage = $('carImage'), colorPicker = $('colorPicker'), colorName =$('colorName');
let current = 0, index = 0;

// Visualizador de Cores
function showImage() {
  const list = colors[current][2];
  carImage.style.opacity = '0';
  setTimeout(() => {
    carImage.src = list[index % list.length];
    carImage.alt = `Toyota GR Corolla ${colors[current][0]}`;
    carImage.style.opacity = '1';
  }, 120);
}

function selectColor(i) {
  current = i; 
  index = 0;
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

$('prevImage').addEventListener('click', () => step(-1));$('nextImage').addEventListener('click', () => step(1));

// Interação de arrastar a imagem
let dragging = false, lastX = 0;
carImage.addEventListener('pointerdown', e => { 
  dragging = true; 
  lastX = e.clientX; 
  carImage.setPointerCapture(e.pointerId); 
});

carImage.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  if (Math.abs(dx) > 18) { 
    step(dx > 0 ? -1 : 1); 
    lastX = e.clientX; 
  }
});
['pointerup', 'pointercancel'].forEach(ev => carImage.addEventListener(ev, () => dragging = false));

// Menu Dropdown da Barra Superior
const toggle = document.querySelector('.dropdown-toggle');
const menu = $('menuOverview');
function setMenu(open) { 
  menu.hidden = !open; 
  toggle.setAttribute('aria-expanded', open); 
}
toggle.addEventListener('click', e => { 
  e.stopPropagation(); 
  setMenu(menu.hidden); 
});
document.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Esconder a barra superior ao rolar
const topbar = $('topbar');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  topbar.classList.toggle('hidden', y > lastY && y > 300);
  lastY = y;
}, { passive: true });

// Função genérica de Abas
function tabs(selector, attr, onChange) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { 
      b.classList.remove('active'); 
      b.setAttribute('aria-selected', 'false'); 
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    onChange(btn.dataset[attr]);
  }));
}

// Galeria de Fotos
const galleryImages = {
  exterior: [IMG.red1, IMG.metal1, IMG.black1, IMG.white1, IMG.red2, IMG.metal2],
  interior: [IMG.interior1, IMG.interior2, IMG.metal2],
  views: [IMG.red1, IMG.black1, IMG.metal1]
};

function renderGallery(key) {
  $('galleryGrid').innerHTML = galleryImages[key]
    .map((src, i) => `<img src="${src}" alt="GR Corolla Galeria ${i + 1}" loading="lazy">`).join('');
}
tabs('[data-gallery]', 'gallery', renderGallery);
renderGallery('exterior');

// Seção Desempenho / Tração
const perf = {
  performance: {
    label: 'DESEMPENHO',
    title: '300 HP e Transmissão Automática DAT.',
    text: 'Motor 1.6L Turbo de 3 cilindros otimizado para entregar 300 cavalos de potência com pico de torque expandido nas acelerações.',
    img: IMG.red1
  },
  handling: {
    label: 'SISTEMA DE TRAÇÃO',
    title: 'Tração AWD GR-FOUR Desenvolvida nos Ralis.',
    text: 'Ajuste a distribuição de torque entre as rodas dianteiras e traseiras com os modos Front/Rear em proporções de 60:40, 50:50 ou 30:70.',
    img: IMG.metal1
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

// Inicialização
selectColor(0);