// ==========================================================================
// GESTION DU LECTEUR DE MUSIQUE
// ==========================================================================
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let isPlaying = false;

function toggleAudio() {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.textContent = '▶';
    isPlaying = false;
  } else {
    bgMusic.play();
    musicBtn.textContent = '⏸';
    isPlaying = true;
  }
}

// ==========================================================================
// NAVIGATION & DÉFILEMENT AUTOMATIQUE ENTRE LES JEUX
// ==========================================================================
function goToNextScreen(currentId, nextId) {
  const currentScreen = document.getElementById(currentId);
  const nextScreen = document.getElementById(nextId);

  // Transition fluide de disparition
  currentScreen.style.opacity = '0';
  
  setTimeout(() => {
    currentScreen.classList.remove('active');
    nextScreen.classList.add('active');
    // Déclenche l'apparition sur le jeu suivant
    setTimeout(() => {
      nextScreen.style.opacity = '1';
    }, 50);
  }, 400);
}

function startExperience() {
  // Lancer la musique au premier clic
  bgMusic.play().then(() => { isPlaying = true; musicBtn.textContent = '⏸'; }).catch(() => {});
  goToNextScreen('screen-start', 'screen-game1');
}

// ==========================================================================
// JEU 1 : BOUTON FUYARD
// ==========================================================================
function fleeButton() {
  const btn = document.getElementById('btn-no');
  const container = document.getElementById('fleeContainer');
  const rect = container.getBoundingClientRect();
  
  // Calcule des coordonnées aléatoires dans la zone
  const x = (Math.random() - 0.5) * (rect.width - 100);
  const y = (Math.random() - 0.5) * 60;
  
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

function winGame(gameNumber) {
  if (gameNumber === 1) {
    goToNextScreen('screen-game1', 'screen-game2');
  }
}

// ==========================================================================
// JEU 2 : SCANNER DE MIGNONNERIE
// ==========================================================================
let scanTimer;
let scanProgress = 0;

function startScan() {
  scanProgress = 0;
  document.getElementById('scanStatus').textContent = "Analyse en cours...";
  scanTimer = setInterval(() => {
    scanProgress += 10;
    document.getElementById('scanBar').style.width = scanProgress + '%';
    if (scanProgress >= 100) {
      clearInterval(scanTimer);
      document.getElementById('scanStatus').textContent = "100% MIGNONNE DÉTECTÉE ! 😍";
      setTimeout(() => {
        goToNextScreen('screen-game2', 'screen-game3');
      }, 800);
    }
  }, 100);
}

function endScan() {
  if (scanProgress < 100) {
    clearInterval(scanTimer);
    scanProgress = 0;
    document.getElementById('scanBar').style.width = '0%';
    document.getElementById('scanStatus').textContent = "Maintiens ton doigt appuyé !";
  }
}

// ==========================================================================
// JEU 3 : ROULETTE DES DATES
// ==========================================================================
const opts1 = ['Resto 🍕', 'Cinéma 🍿', 'Pique-Nique 🧺'];
const opts2 = ['Glace 🍦', 'Sushis 🍱', 'Crêpes 🥞'];
const opts3 = ['Câlin 🤗', 'Bisou 💋', 'Massage 💆‍♂️'];

function spinSlots() {
  let count = 0;
  const interval = setInterval(() => {
    document.getElementById('slot1').textContent = opts1[Math.floor(Math.random() * opts1.length)];
    document.getElementById('slot2').textContent = opts2[Math.floor(Math.random() * opts2.length)];
    document.getElementById('slot3').textContent = opts3[Math.floor(Math.random() * opts3.length)];
    count++;
    if (count > 12) {
      clearInterval(interval);
      setTimeout(() => {
        goToNextScreen('screen-game3', 'screen-game4');
      }, 1000);
    }
  }, 100);
}

// ==========================================================================
// JEU 4 : QUIZ
// ==========================================================================
function checkQuiz(btn, isCorrect) {
  btn.style.background = '#7BBDE8';
  setTimeout(() => {
    goToNextScreen('screen-game4', 'screen-game5');
  }, 500);
}

// ==========================================================================
// JEU 5 : MEMORY DES CŒURS
// ==========================================================================
const emojis = ['💙', '💎', '🌊', '💙', '💎', '🌊'];
let shuffled = emojis.sort(() => 0.5 - Math.random());
let selected = [];
let matched = 0;

const grid = document.getElementById('memoryGrid');
shuffled.forEach((emoji, idx) => {
  const card = document.createElement('div');
  card.className = 'card-item';
  card.dataset.emoji = emoji;
  card.textContent = '❓';
  card.onclick = () => flipCard(card);
  grid.appendChild(card);
});

function flipCard(card) {
  if (selected.length >= 2 || card.classList.contains('flipped')) return;
  
  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  selected.push(card);

  if (selected.length === 2) {
    if (selected[0].dataset.emoji === selected[1].dataset.emoji) {
      matched += 2;
      selected = [];
      if (matched === emojis.length) {
        setTimeout(() => {
          goToNextScreen('screen-game5', 'screen-final');
        }, 800);
      }
    } else {
      setTimeout(() => {
        selected.forEach(c => {
          c.classList.remove('flipped');
          c.textContent = '❓';
        });
        selected = [];
      }, 700);
    }
  }
}

// ==========================================================================
// CARROUSEL ANIMÉ DES 10 PHOTOS
// ==========================================================================
let currentPhotoIndex = 1;
const totalPhotos = 10;

function changePhoto(direction) {
  currentPhotoIndex += direction;
  
  if (currentPhotoIndex > totalPhotos) currentPhotoIndex = 1;
  if (currentPhotoIndex < 1) currentPhotoIndex = totalPhotos;

  const imgElement = document.getElementById('currentPhoto');
  
  // Animation de fondu lors du changement de photo
  imgElement.style.opacity = '0';
  imgElement.style.transform = 'scale(0.95)';

  setTimeout(() => {
    imgElement.src = `images/photo${currentPhotoIndex}.jpg`;
    document.getElementById('photoCounter').textContent = `Photo ${currentPhotoIndex} / ${totalPhotos}`;
    imgElement.style.opacity = '1';
    imgElement.style.transform = 'scale(1)';
  }, 200);
}
