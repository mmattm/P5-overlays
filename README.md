# P5 Overlays

## Installation

- Importer le dossier dans **Extensions**

- Installer l'extension Chrome advanced-extension-reload https://chromewebstore.google.com/detail/advanced-extension-reload/hagknokdofkmojolcpbddjfdjhnjdkae

- Configurer un raccourci clavier pour recharger les fichiers du sketch(Reload extension main). Par exemple: Command + Maj + A.

## Changer le projet

- Ajouter vos tests dans le dossier **/sketches**

- Remplacer le nom du projet dans **manifest.json** (object content_scripts)

## Limiter l'extension à certains sites

- Changer les objets dans manifest.json

`"matches": ["<all_urls>"] // Tous les urls par défaut`

    "matches": ["https://ecal.ch/*"] // Toutes les pages de ecal.ch

## Les Meta Datas (Variables p5)

- images

- links

- headlines

- meta_datas

## Fonctions Javascript utiles

#### Changer de page

    window.location.href = 'www.ecal.ch';

#### Mode de fusion du canvas

    myCanvas.style("mix-blend-mode", "difference");

#### Rendre la page sous le canvas interactible

    myCanvas.style("pointer-events", "none");

## Utiliser une Font Google

https://fonts.google.com/

- Choisir une font et récupérer le lien href dans l'onglet "Use on the web"

Par exemple:

    <link  href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&family=Rubik+Bubbles&display=swap"  rel="stylesheet">

- Copier le lien href dans votre navigateur et copier le CSS de cette page dans styles.css. Récupérer le nom de la font.

- Changer la font avec p5: textFont("Rubik Bubbles");
