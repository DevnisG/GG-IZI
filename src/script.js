(() => {
  const gate = document.querySelector('#gate');
  const rave = document.querySelector('#rave');
  const music = document.querySelector('#music');
  const fallback = document.querySelector('#crab-fallback');
  const layers = [...document.querySelectorAll('.stage__gif')];
  const sources = [1, 2, 3].map((number) => `assets/gif${number}.gif`);
  const available = new Set();
  let currentIndex = -1;
  let activeLayer = 1;
  let started = false;

  document.querySelector('#year').textContent = new Date().getFullYear();
  music.volume = 1;

  function showGif(index) {
    const nextLayer = 1 - activeLayer;
    const incoming = layers[nextLayer];
    const outgoing = layers[activeLayer];

    incoming.src = sources[index];
    incoming.classList.add('is-visible');
    outgoing.classList.remove('is-visible');
    incoming.alt = 'Cangrejo bailando';
    outgoing.alt = '';

    activeLayer = nextLayer;
    currentIndex = index;
    fallback.hidden = true;
  }

  function rotateGif() {
    for (let offset = 1; offset <= sources.length; offset += 1) {
      const nextIndex = (currentIndex + offset) % sources.length;
      if (available.has(nextIndex) && nextIndex !== currentIndex) {
        showGif(nextIndex);
        return;
      }
    }
  }

  sources.forEach((source, index) => {
    const image = new Image();
    image.addEventListener('load', () => {
      available.add(index);
      if (currentIndex === -1) showGif(index);
    });
    image.src = source;
  });

  function start() {
    if (started) return;
    started = true;

    music.play().catch(() => {});
    rave.inert = false;
    gate.classList.add('is-closed');
    gate.inert = true;
    gate.setAttribute('aria-hidden', 'true');

    window.setInterval(rotateGif, 4000);
  }

  gate.addEventListener('click', start);
  gate.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      start();
    }
  });
})();
