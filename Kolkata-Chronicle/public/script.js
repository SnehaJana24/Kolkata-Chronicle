// DOM elements
const locationsList = [
  "college street",
  "howrah bridge",
  "dhakhineswar",
  "esplanade",
  "park street",
  "kumartuli",
  "princep ghat",
  "kalighat",
  "shobhabazar",
  "borobazar",
  "jorasanko",
  "gariahat",
  "sealdah",
  "victoria",
  "tram depot",
  "ganga ghat",
  "dalhousie",
  "cathedral",
  "belur math",
  "fort william",
  "indian museum",
  "indian coffee house",
  "metcalfe hall",
  "shaheed minar",
];

const locationSelect = document.getElementById("locationSelect");
const previewGrid = document.getElementById("previewGrid");
const yearSlider = document.getElementById("yearSlider");
const yearValue = document.getElementById("yearValue");
const generateBtn = document.getElementById("generateBtn");
const oldImg = document.getElementById("oldImg");
const modernImg = document.getElementById("modernImg");
const storyText = document.getElementById("storyText");
const galleryGrid = document.getElementById("galleryGrid");
const storiesList = document.getElementById("storiesList");

const audio = document.getElementById("soundscape");
const playPauseBtn = document.getElementById("playPauseBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const loopCheck = document.getElementById("loopCheck");

let historyData = {};
let typingTimer = null;

// Dropdown & preview buttons
locationsList.forEach((loc) => {
  const name = cap(loc);
  const opt = document.createElement("option");
  opt.value = loc;
  opt.textContent = name;
  locationSelect.appendChild(opt);

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = name;
  btn.onclick = () => {
    locationSelect.value = loc;
    document
      .getElementById("time-travel")
      .scrollIntoView({ behavior: "smooth" });
  };
  previewGrid.appendChild(btn);
});

// Load history.json
fetch("/data/history.json")
  .then((res) => res.json())
  .then((data) => {
    historyData = data;
    populateStoriesList();
  });

// Year slider effect
yearSlider.addEventListener("input", () => {
  yearValue.textContent = yearSlider.value;
  applyYearEffect(yearSlider.value);
});

// Generate location
generateBtn.addEventListener("click", () => {
  const loc = locationSelect.value;
  if (!loc) return alert("Select a location first");

  const folder = loc.replace(/ /g, "_");
  setImageSrc(
    oldImg,
    `/assets/locations/${folder}_old.jpg`,
    "/assets/fallback/historical.jpg"
  );
  setImageSrc(
    modernImg,
    `/assets/locations/${folder}_modern.jpg`,
    "/assets/fallback/modern.jpg"
  );

  showStoryFor(loc);
  playLocationSound(loc);
  addToGallery(loc);
});

// Helper: Load image with fallback
function setImageSrc(el, src, fallback) {
  el.src = src;
  el.onerror = () => (el.src = fallback);
}

// Location → Sound mapping
const soundMap = {
  sealdah: "train",
  "howrah bridge": "river",
  gariahat: "streets",
  esplanade: "tram",
  "park street": "streets",
  "college street": "streets",
  dhakhineswar: "dhaak",
  "princep ghat": "river",
  "ganga ghat": "river",
  kalighat: "dhaak",
  shobhabazar: "dhaak",
  jorasanko: "streets",
  "tram depot": "tram",
  victoria: "tram",
  kumartuli: "streets",
  borobazar: "streets",
  dalhousie: "tram",
  cathedral: "tram",
  "belur math": "river",
  "fort william": "streets",
  "indian museum": "streets",
  "indian coffee house": "streets",
  "metcalfe hall": "tram",
  "shaheed minar": "tram",
};

// Play location sound
function playLocationSound(loc) {
  const key = loc.toLowerCase();
  const src = `/sounds/${soundMap[key] || "streets"}.mp3`;

  audio.pause();
  audio.src = src;
  audio.currentTime = 0;
  audio.loop = loopCheck.checked;
  audio.volume = Number(volumeSlider.value);

  audio.play().catch(() => {
    audio.muted = true;
    audio.play().then(() => {
      setTimeout(() => (audio.muted = false), 200);
    });
  });

  playPauseBtn.textContent = "⏸ Pause";
}

// Sound controls
playPauseBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸ Pause";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶ Play";
  }
};
muteBtn.onclick = () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇 Unmute" : "🔈 Mute";
};
volumeSlider.oninput = () => (audio.volume = Number(volumeSlider.value));

// Visual year filter
function applyYearEffect(year) {
  if (year <= 1939) {
    oldImg.style.filter = "sepia(0.6) contrast(0.85)";
    modernImg.style.filter = "sepia(0.5)";
  } else if (year <= 1969) {
    oldImg.style.filter = "sepia(0.3)";
    modernImg.style.filter = "sepia(0.2)";
  } else {
    oldImg.style.filter = "none";
    modernImg.style.filter = "none";
  }
}

// Story display
function showStoryFor(loc) {
  const key = loc.toLowerCase();
  const info = historyData[key];
  if (!info) {
    storyTypewriter(`📍 ${cap(loc)}\n\nHistory coming soon…`);
    return;
  }

  let t = `📍 ${cap(loc)}\n\n🪶 Identity: ${
    info.identity
  }\n\n📜 Golden Moments:\n`;
  info.timeline?.forEach((ev) => (t += `  🟡 ${ev}\n`));
  t += `\n✨ Uniqueness: ${info.uniqueness}\n\n🎥 Story: ${info.narrative}`;

  storyTypewriter(t);
}

// Typewriter effect
function storyTypewriter(text) {
  if (typingTimer) clearInterval(typingTimer);
  storyText.textContent = "";
  let i = 0;
  typingTimer = setInterval(() => {
    storyText.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(typingTimer);
  }, 15);
}

// Add to gallery
function addToGallery(loc) {
  const folder = loc.replace(/ /g, "_");
  const oldURL = `/assets/locations/${folder}_old.jpg`;
  const modernURL = `/assets/locations/${folder}_modern.jpg`;
  galleryGrid.prepend(
    Object.assign(document.createElement("img"), { src: oldURL })
  );
  galleryGrid.prepend(
    Object.assign(document.createElement("img"), { src: modernURL })
  );
  while (galleryGrid.children.length > 50)
    galleryGrid.removeChild(galleryGrid.lastChild);
}

// STORY cards
function populateStoriesList() {
  storiesList.innerHTML = "";
  Object.entries(historyData).forEach(([key, info]) => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <h4>${cap(key)}</h4>
      <p><b>${info.identity}</b></p>
      <p>${info.narrative.slice(0, 140)}…</p>
      <button class="btn" onclick="showModalStory('${key}')">Read</button>`;
    storiesList.appendChild(card);
  });
}

// Modal
window.showModalStory = (key) => {
  const info = historyData[key];
  document.getElementById("modalStoryTitle").textContent = cap(key);
  document.getElementById("modalStoryIdentity").textContent = info.identity;
  document.getElementById("modalStoryNarrative").textContent = info.narrative;

  const ul = document.getElementById("modalStoryTimeline");
  ul.innerHTML = "";
  info.timeline?.forEach((ev) => {
    const li = document.createElement("li");
    li.textContent = ev;
    ul.appendChild(li);
  });

  document.getElementById("storyModal").style.display = "flex";
};
document.getElementById("closeStoryModal").onclick = () =>
  (storyModal.style.display = "none");

// 🚀 MAP SYSTEM
const map = L.map("map").setView([22.5726, 88.3639], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const mapLocations = {
  "College Street": [22.5744, 88.364],
  "Howrah Bridge": [22.585, 88.3468],
  Dakshineswar: [22.655, 88.3593],
  Esplanade: [22.5651, 88.3532],
  "Park Street": [22.5534, 88.3529],
  Kumartuli: [22.6071, 88.362],
  "Prinsep Ghat": [22.5521, 88.3316],
  Kalighat: [22.5203, 88.342],
  Shobhabazar: [22.6055, 88.363],
  Borobazar: [22.589, 88.357],
  Jorasanko: [22.5943, 88.3644],
  Gariahat: [22.5145, 88.365],
  Sealdah: [22.5685, 88.3747],
  "Victoria Memorial": [22.5448, 88.3426],
  "Tram Depot": [22.579, 88.365],
  "Ganga Ghat": [22.6375, 88.3577],
  Dalhousie: [22.5722, 88.3504],
  Cathedral: [22.5482, 88.3491],
  "Belur Math": [22.6315, 88.357],
  "Fort William": [22.543, 88.3388],
  "Indian Museum": [22.557, 88.3512],
  "Indian Coffee House": [22.5847, 88.3635],
  "Metcalfe Hall": [22.571, 88.3469],
  "Shaheed Minar": [22.5655, 88.3515],
};

// Add markers
Object.entries(mapLocations).forEach(([name, coords]) => {
  L.marker(coords).addTo(map).bindPopup(`
      <b>${name}</b><br>
      <button class="map-open" data-loc="${name.toLowerCase()}">Open Time Travel 🚀</button>
    `);
});

// Popup button → scroll + load location
map.on("popupopen", () => {
  document.querySelectorAll(".map-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.loc;
      locationSelect.value = val;
      generateBtn.click();
      document
        .getElementById("time-travel")
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});

// helper
function cap(str) {
  return str
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
window.addEventListener("load", () => {
  map.invalidateSize();
});
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    document.body.style.overflow = "auto";
  }, 2500);
});
