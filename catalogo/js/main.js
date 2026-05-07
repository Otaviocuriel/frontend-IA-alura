import { categories } from './data.js';

const MY_LIST_KEY = 'netflixMinhaLista';
const CONTINUE_KEY = 'netflixContinuarAssistindo';

let allItems = [];
let currentItem = null;
let progressTimer = null;

const getYoutubeId = (url = '') => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? match[1] : '';
};

const saveJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const loadJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

function normalizeCatalog() {
  allItems = categories.flatMap((category) =>
    category.items.map((item, index) => ({
      ...item,
      id: `${category.title}-${item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category.title,
      rank: item.top10 ? index + 1 : null,
      description:
        item.description ||
        `${item.title} é um destaque do catálogo com clima de streaming, trailer integrado e informações rápidas.`
    }))
  );
}

function setupProfile() {
  const nomePerfil = localStorage.getItem('perfilAtivoNome');
  const imagemPerfil = localStorage.getItem('perfilAtivoImagem');
  const kidsLink = document.querySelector('.kids-link');
  const profileIcon = document.querySelector('.profile-icon');

  if (nomePerfil && kidsLink) kidsLink.textContent = nomePerfil;
  if (imagemPerfil && profileIcon) profileIcon.src = imagemPerfil;
}

function playUiSound() {
  const sound = document.getElementById('ui-sound');
  if (!sound) return;
  sound.currentTime = 0;
  sound.volume = 0.15;
  sound.play().catch(() => {});
}

function createCard(item, options = {}) {
  const card = document.createElement('article');
  card.className = options.top10 ? 'movie-card top-card' : 'movie-card';
  card.dataset.id = item.id;

  const youtubeId = getYoutubeId(item.youtube);
  const poster = item.img || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  card.innerHTML = `
    ${options.top10 ? `<div class="rank-number">${options.rank}</div>` : ''}
    <div class="poster-wrap">
      <img src="${poster}" alt="Capa de ${item.title}" loading="lazy" />
      <iframe title="Trailer de ${item.title}" allow="autoplay; encrypted-media"></iframe>
      ${item.top10 ? '<span class="top-badge">TOP 10</span>' : ''}
      ${item.badge ? `<span class="bottom-badge ${item.badgeColor || 'red'}">${item.badge}</span>` : ''}
      ${item.progress ? `<div class="progress-track"><span style="width:${item.progress}%"></span></div>` : ''}
    </div>
    <div class="card-info">
      <div class="card-actions">
        <button class="round play-card" aria-label="Assistir"><i class="fas fa-play"></i></button>
        <button class="round list-card" aria-label="Adicionar a minha lista"><i class="fas fa-plus"></i></button>
        <button class="round details-card-btn" aria-label="Detalhes"><i class="fas fa-chevron-down"></i></button>
      </div>
      <div class="meta"><span class="match">${Math.floor(88 + Math.random() * 11)}% relevante</span><span>HD</span><span>16</span></div>
      <strong>${item.title}</strong>
      <p>${item.category}</p>
    </div>
  `;

  const iframe = card.querySelector('iframe');
  let hoverTimeout;

  card.addEventListener('mouseenter', () => {
    if (!youtubeId || window.innerWidth < 800) return;
    hoverTimeout = setTimeout(() => {
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1`;
      card.classList.add('is-playing');
    }, 550);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    iframe.src = '';
    card.classList.remove('is-playing');
  });

  card.querySelector('.play-card').addEventListener('click', (event) => {
    event.stopPropagation();
    openPlayer(item);
  });

  card.querySelector('.list-card').addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMyList(item);
  });

  card.querySelector('.details-card-btn').addEventListener('click', (event) => {
    event.stopPropagation();
    openDetails(item);
  });

  card.addEventListener('click', () => openDetails(item));

  return card;
}

function createRow(title, items, sectionId, options = {}) {
  if (!items.length) return null;

  const section = document.createElement('section');
  section.className = 'slider-section reveal';
  if (sectionId) section.id = sectionId;

  const row = document.createElement('div');
  row.className = 'movie-row';
  items.forEach((item, index) => row.appendChild(createCard(item, { ...options, rank: index + 1 })));

  section.innerHTML = `<div class="slider-header"><h2>${title}</h2><span>Explorar todos</span></div>`;
  section.appendChild(row);
  return section;
}

function renderCatalog(filter = '') {
  const container = document.getElementById('main-content');
  const empty = document.getElementById('empty-search');
  if (!container) return;

  container.innerHTML = '';
  const query = filter.trim().toLowerCase();

  if (query) {
    const results = allItems.filter((item) =>
      [item.title, item.category, item.badge, item.description]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );

    empty.hidden = results.length > 0;
    const row = createRow(`Resultados para "${filter}"`, results, 'busca');
    if (row) container.appendChild(row);
    observeReveals();
    return;
  }

  empty.hidden = true;
  const continueItems = loadJson(CONTINUE_KEY);
  const myListItems = loadJson(MY_LIST_KEY);
  const topItems = allItems.filter((item) => item.top10).slice(0, 10);

  const continueRow = createRow('Continuar assistindo', continueItems, 'continuar');
  const myListRow = createRow('Minha Lista', myListItems, 'minha-lista');
  const topRow = createRow('Top 10 no Brasil hoje', topItems, 'top10', { top10: true });

  if (continueRow) container.appendChild(continueRow);
  if (myListRow) container.appendChild(myListRow);
  if (topRow) container.appendChild(topRow);

  categories.forEach((category) => {
    const id = category.title.toLowerCase().includes('série') ? 'series' : category.title.toLowerCase().includes('filme') ? 'filmes' : '';
    const items = category.items.map((item) => allItems.find((catalogItem) => catalogItem.title === item.title)).filter(Boolean);
    const row = createRow(category.title, items, id);
    if (row) container.appendChild(row);
  });

  observeReveals();
}

function toggleMyList(item) {
  const list = loadJson(MY_LIST_KEY);
  const exists = list.some((saved) => saved.id === item.id);
  const nextList = exists ? list.filter((saved) => saved.id !== item.id) : [...list, item];
  saveJson(MY_LIST_KEY, nextList);
  playUiSound();
  renderCatalog(document.getElementById('search-input')?.value || '');
}

function addContinue(item) {
  const list = loadJson(CONTINUE_KEY).filter((saved) => saved.id !== item.id);
  const nextItem = { ...item, progress: Math.max(item.progress || 0, Math.floor(18 + Math.random() * 55)) };
  saveJson(CONTINUE_KEY, [nextItem, ...list].slice(0, 12));
}

function openDetails(item) {
  currentItem = item;
  const modal = document.getElementById('details-modal');
  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-description').textContent = item.description;
  document.getElementById('modal-meta').innerHTML = `<span class="match">98% relevante</span><span>${item.category}</span><span>HD</span><span>Som imersivo</span>`;
  document.getElementById('modal-backdrop-img').style.backgroundImage = `linear-gradient(to top,#181818 5%,transparent 80%), url('${item.img}')`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  playUiSound();
}

function closeDetails() {
  const modal = document.getElementById('details-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function openPlayer(item) {
  currentItem = item;
  addContinue(item);
  const player = document.getElementById('fake-player');
  const frame = document.getElementById('player-frame');
  const progress = document.getElementById('player-progress-value');
  const youtubeId = getYoutubeId(item.youtube);

  document.getElementById('player-title').textContent = item.title;
  frame.src = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&modestbranding=1` : '';
  player.classList.add('open');
  player.setAttribute('aria-hidden', 'false');
  playUiSound();

  let width = 0;
  clearInterval(progressTimer);
  progress.style.width = '0%';
  progressTimer = setInterval(() => {
    width = Math.min(width + 1.5, 100);
    progress.style.width = `${width}%`;
    if (width >= 100) clearInterval(progressTimer);
  }, 450);
}

function closePlayer() {
  clearInterval(progressTimer);
  const player = document.getElementById('fake-player');
  document.getElementById('player-frame').src = '';
  player.classList.remove('open');
  player.setAttribute('aria-hidden', 'true');
  renderCatalog();
}

function setupHero() {
  const heroItem = allItems.find((item) => item.title.toLowerCase().includes('stranger')) || allItems[0];
  if (!heroItem) return;
  currentItem = heroItem;
  document.getElementById('hero-title').textContent = heroItem.title;
  document.getElementById('hero-description').textContent = heroItem.description;
  document.querySelector('.hero').style.backgroundImage = `linear-gradient(to top,#141414 0%,rgba(20,20,20,.05) 45%), linear-gradient(to right,rgba(0,0,0,.86),rgba(0,0,0,.15)), url('${heroItem.img}')`;
  document.getElementById('hero-play').addEventListener('click', () => openPlayer(heroItem));
  document.getElementById('hero-info').addEventListener('click', () => openDetails(heroItem));
}

function setupSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', (event) => renderCatalog(event.target.value));
}

function setupMobileMenu() {
  const sidebar = document.getElementById('mobile-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const open = () => { sidebar.classList.add('open'); backdrop.classList.add('open'); };
  const close = () => { sidebar.classList.remove('open'); backdrop.classList.remove('open'); };

  document.getElementById('mobile-menu-btn').addEventListener('click', open);
  document.getElementById('close-sidebar').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

function setupNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function setupModalActions() {
  document.getElementById('modal-close').addEventListener('click', closeDetails);
  document.getElementById('modal-play').addEventListener('click', () => currentItem && openPlayer(currentItem));
  document.getElementById('modal-list').addEventListener('click', () => currentItem && toggleMyList(currentItem));
  document.getElementById('player-close').addEventListener('click', closePlayer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDetails();
      closePlayer();
    }
  });
}

function hideLoading() {
  setTimeout(() => {
    document.getElementById('loading-screen')?.classList.add('hidden');
  }, 900);
}

document.addEventListener('DOMContentLoaded', () => {
  normalizeCatalog();
  setupProfile();
  setupHero();
  setupSearch();
  setupMobileMenu();
  setupNavbar();
  setupModalActions();
  renderCatalog();
  hideLoading();
});
