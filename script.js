const API_URL = 'https://d4armory.io/api/events/upcoming/worldboss';

// Přibližné souřadnice světových bossů v systému lat/lon
const BOSS_LOCATIONS = {
  'Caen Adar': [60, -45],
  'The Crucible': [67.5, -115],
  'Saraan Caldera': [30.6, -10.0],
  'Seared Basin': [40, 23],
  'Fields of Desecration': [18, 100],
  'The Scar': [8, 50]
};

let map;

async function loadBoss() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const bossName = data.boss || data.worldBoss;
    const location = data.territory || data.zone || data.location;
    const expected = data.expected || data.spawn; // timestamp v ms

    document.getElementById('boss').textContent = `Další boss: ${bossName}`;
    document.getElementById('location').textContent = `Místo: ${location}`;

    if (expected) {
      startCountdown(expected);
    }

    showOnMap(location);
  } catch (err) {
    document.getElementById('boss').textContent = 'Nepodařilo se načíst data o bossovi.';
    console.error(err);
  }
}

function startCountdown(targetTime) {
  const target = typeof targetTime === 'number' && targetTime < 1e12 ? targetTime * 1000 : targetTime;

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById('timer').textContent = 'Boss je právě naživu!';
      clearInterval(interval);
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('timer').textContent = `Objeví se za ${h}h ${m}m ${s}s`;
  }

  update();
  const interval = setInterval(update, 1000);
}

function showOnMap(location) {
  const coords = BOSS_LOCATIONS[location];
  if (!coords) return;

  if (!map) {
    map = L.map('map').setView(coords, 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
  } else {
    map.setView(coords, 4);
  }
  L.marker(coords).addTo(map);
}

loadBoss();
