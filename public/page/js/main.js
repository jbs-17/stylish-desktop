const main = document.getElementById('main-content');
let loadCount = 0;

function createContentCard(index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="https://source.unsplash.com/600x400/?setup,technology&sig=${Date.now() + index}" alt="Setup Keren">
    <div class="card-actions">
      <button>Suka</button>
      <button>Bagikan</button>
      <button>Simpan</button>
    </div>
  `;
  return card;
}

function loadMoreContent() {
  for (let i = 0; i < 5; i++) {
    main.appendChild(createContentCard(i));
  }
  loadCount++;
}

function handleScroll() {
  const scrollY = window.scrollY + window.innerHeight;
  const height = document.documentElement.scrollHeight;
  if (scrollY >= height - 100) {
    loadMoreContent();
  }
}

window.addEventListener('scroll', handleScroll);

// Initial content load
loadMoreContent();
