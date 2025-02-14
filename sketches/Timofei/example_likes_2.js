let mondrianColors = [];
let canvas;
let animations = [];
let autoFloatingWords = []; // Nouveau tableau pour gérer les mots flottants ajoutés automatiquement

let apparitionInterval = 50; // Temps initial entre les apparitions des mots en millisecondes
const couleursAleatoires = [
  "rgb(255, 0, 0)", // Rouge vif
  "rgb(0, 0, 255)", // Bleu électrique
  "rgb(255, 255, 0)", // Jaune poussin
  "rgb(0, 255, 0)", // Vert pétant fluo
  "rgb(64, 224, 208)", // Turquoise fluo
];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  console.log(metadatas.socialNetworks.socialNetworks);

  const socialHandles = metadatas.socialNetworks.socialNetworks
    .map((network) => {
      const urlParts = network.url.split("/");
      const handle = urlParts[urlParts.length - 1]; // Extract the handle from the URL
      return handle.trim(); // Trim to remove any whitespace
    })
    .filter((handle) => handle !== ""); // Remove empty handles

  const baseKeywords = [
    "FOLLOW ME",
    "SHARE THIS",
    "LIKE MY POST",
    "CHECK THIS LINK",
    "SWIPE UP",
    "WATCH MY STORY",
    "POSTED BY",
    "REPOST THIS",
    "USE HASHTAG",
    "LEAVE A COMMENT",
    "SEND A POKE",
    "MENTION ME",
  ]; // Liste des textes à choisir

  const variantesTexte = [];
  baseKeywords.forEach((keyword) => {
    socialHandles.forEach((handle) => {
      variantesTexte.push(`${keyword} ${handle}`);
    });
  });

  // add emojis to variatnesTexte array
  variantesTexte.push("❤️", "👍", "🆕", "😂", "😡", "😮", "😭", "😱", "😀");

  console.log("Generated text variants:", variantesTexte);

  const elementsTextuels = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, span"
  );

  elementsTextuels.forEach((element) => {
    const texteInitial = element.textContent; // Stocker le texte initial
    let hasChanged = false;

    element.addEventListener("mouseenter", () => {
      if (!hasChanged) {
        hasChanged = true;
        const texteSurvol = random(variantesTexte);

        // Capturer les coordonnées avant la modification
        const rectBefore = element.getBoundingClientRect();

        typewriterAnimation(element, texteInitial, texteSurvol, () => {
          const xInitial = rectBefore.left + window.scrollX;
          const yInitial = rectBefore.top + window.scrollY;
          const computedStyle = window.getComputedStyle(element);

          animations.push(
            new FloatingWord(xInitial, yInitial, texteSurvol, computedStyle)
          );
        });
      }
    });
  });

  // Ajouter des mots aléatoires un peu partout sur la page avec accélération progressive
  function scheduleNextFloatingWord() {
    ajouterMotsFlottantsAleatoires(variantesTexte);
    apparitionInterval = Math.max(100, apparitionInterval * 10); // Réduit l'intervalle progressivement jusqu'à 100ms minimum
    setTimeout(scheduleNextFloatingWord, apparitionInterval);
  }
  scheduleNextFloatingWord();
}

// Classe pour gérer les mots flottants
class FloatingWord {
  constructor(x, y, text, computedStyle) {
    this.startX = x;
    this.startY = y;
    this.x = this.startX;
    this.y = this.startY;
    this.text = text;

    this.fontSize = parseFloat(computedStyle.fontSize) || 16;
    this.color = choisirCouleurAleatoire(); // Couleur aléatoire parmi les couleurs spécifiées
    this.fontFamily = "Helvetica";
    this.fontWeight = "bold";

    this.following = false;
    this.visible = false;
    this.maxDistance = 300;
    this.blinking = false; // Nouveau pour clignotement

    setTimeout(() => {
      this.visible = true;
    }, 100);

    setTimeout(() => {
      this.following = true;
    }, 100);

    // Activer le clignotement après 15 secondes
    setTimeout(() => {
      this.startBlinking();
    }, 15000);
  }

  startBlinking() {
    this.blinking = true;
    let blinkInterval = 500; // Intervalle initial pour le clignotement

    const blinkFaster = () => {
      if (blinkInterval > 50) {
        blinkInterval *= 0.9; // Réduction progressive de l'intervalle
        clearInterval(this.blinkTimer);
        this.blinkTimer = setInterval(() => {
          this.visible = !this.visible; // Alterner entre visible et invisible
        }, blinkInterval);
        setTimeout(blinkFaster, 2000); // Accélérer toutes les 2 secondes
      }
    };

    this.blinkTimer = setInterval(() => {
      this.visible = !this.visible; // Alterner entre visible et invisible
    }, blinkInterval);

    setTimeout(blinkFaster, 2000); // Commencer l'accélération après 2 secondes
  }

  update() {
    if (!this.visible && !this.blinking) return;

    const dx = mouseX - this.x; // Distance horizontale à la souris
    const dy = mouseY - this.y; // Distance verticale à la souris
    const distanceToMouse = sqrt(dx * dx + dy * dy);

    const followThreshold = 200; // Rayon où le mot commence à suivre la souris

    if (distanceToMouse < followThreshold) {
      const followSpeed = 0.1; // Vitesse de suivi
      this.x += dx * followSpeed;
      this.y += dy * followSpeed;
    } else {
      const returnSpeed = 0.05; // Retour à la position initiale
      this.x += (this.startX - window.scrollX - this.x) * returnSpeed;
      this.y += (this.startY - window.scrollY - this.y) * returnSpeed;
    }
  }

  display() {
    if (!this.visible) return;

    fill(this.color);
    noStroke();
    textSize(this.fontSize);
    textFont(this.fontFamily);
    textStyle(this.fontWeight);
    textAlign(CENTER, CENTER); // Centrer parfaitement le texte

    text(this.text, this.x, this.y); // Afficher le texte au centre de `this.x` et `this.y`
  }
}

function draw() {
  clear();
  animations.forEach((animation) => {
    animation.update();
    animation.display();
  });
  autoFloatingWords.forEach((word) => {
    word.update();
    word.display();
  });
}

// Fonction pour choisir une variante aléatoire
function choisirVariante(variantes) {
  return variantes[Math.floor(Math.random() * variantes.length)];
}

// Fonction pour choisir une couleur aléatoire
function choisirCouleurAleatoire() {
  return couleursAleatoires[
    Math.floor(Math.random() * couleursAleatoires.length)
  ];
}

// Ajouter des mots flottants à des positions aléatoires sur la page
function ajouterMotsFlottantsAleatoires(variantesTexte) {
  const pageHeight = document.documentElement.scrollHeight; // Hauteur totale de la page
  const xRandom = Math.random() * windowWidth; // Position horizontale aléatoire
  const yRandom = Math.random() * pageHeight; // Position verticale aléatoire sur toute la page
  const texteAleatoire = choisirVariante(variantesTexte);
  const fontSizeRandom = Math.random() * (150 - 10) + 10; // Taille aléatoire entre 10px et 200px

  autoFloatingWords.push(
    new FloatingWord(xRandom, yRandom, texteAleatoire, {
      fontSize: `${fontSizeRandom}px`,
      color: "#FFFFFF",
    })
  );
}

// Animation typewriter
function typewriterAnimation(element, texteEffacer, texteEcrire, callback) {
  let index = 0;
  const effacerInterval = setInterval(() => {
    if (index <= texteEffacer.length) {
      element.textContent = texteEffacer.slice(0, texteEffacer.length - index);
      index++;
    } else {
      clearInterval(effacerInterval);
      index = 0;
      element.style.fontFamily = "Helvetica, Arial, sans-serif";
      element.style.fontWeight = "bold";
      const ecrireInterval = setInterval(() => {
        if (index <= texteEcrire.length) {
          element.textContent = texteEcrire.slice(0, index);
          index++;
        } else {
          clearInterval(ecrireInterval);
          if (callback) callback();
          setTimeout(() => {
            element.textContent = Array(texteEcrire.length)
              .fill("\u00A0")
              .join("");
          }, 100);
        }
      }, 50);
    }
  }, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
