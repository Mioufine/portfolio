
export default class Gallery {
    // Construit dynamiquement les cartes de la galerie 
    constructor() {

    const projects = [
        {
        title: "Vidéo information Future Health Summit à Abu Dhabi - 2026",
        description: "Vidéo de motion design réalisée sur After Effects, pour informer et présenter le sommet Future Health se tenant à Abu Dhabi.",
        images: [
            "img/gallery/loop_video_1.mp4",
            "img/gallery/IMG_20261019_193522.jpg"
        ]
        },
        {
        title: "Packaging Biotwin - 2026",
        description: "Réalisation graphique pour l'entreprise Biotwin lors de l'évènement Future Health Summit : création d'un packaging contenant un cadeau offert à certains invités de l'évènement.",
        images: [
            "img/gallery/FH_TwinMe_Enveloppe-kit-C4_print.jpg",
            "img/gallery/Fh_Card_A4_RECTO_print.jpg",
            "img/gallery/Fh_Card_A4_VERSO_print.jpg",
            "img/gallery/4.jpg",
        ]
        },
        {
        title: "Affiche pour le Comité 13 de tennis - 2026",
        description: "Illustration réalisée dans le cadre d'une commande pour le Comité 13 de tennis. Celle-ci sert à informer et à alerter de manière pédagogique les jeunes licenciés des clubs de tennis sur les situations de violence et de harcèlement à éviter.",
        images: [
            "img/gallery/affiche_ecouter_respecter_proteger.png"
        ]
        },
        {
        title: "Site Web - 2026",
        description: "Site web réalisé pour la société Sofrat à Marseille dans le cadre d'un stage.",
        link: "https://www.climatisation-sofrat.fr/",
        images: [
            "img/gallery/site01.JPG",
            "img/gallery/site02.JPG"
        ]
        },
        {
        title: "Event Abu Dhabi Global Health Week - 2025",
        description: "Conception d'éléments graphiques diffusés pendant les interventions de chercheurs dans le domaine médical lors de l'évènement Abu Dhabi Global Health Week, commandé par le département de la Santé (UAE).",
        images: [
            "img/gallery/IMG_20260701_135658.jpg",
            "img/gallery/IMG_20260701_135645.jpg"
        ]
        },
        {
        title: "INTI Film d'animation - 2022",
        description: "Projet conçu par une équipe de 10 personnes. Après avoir écrit le scénario, je me suis chargée du rigging, du système de blendshape et des rendus.",
        link: "https://youtu.be/Ywd__GttIkU",
        images: [
            "img/gallery/INTI_Rig.mp4"
        ]
        },
        {
        title: "EVEN Jeu vidéo - 2022",
        description: "Sur ce projet j'ai pu apporter mon aide sur la réalisation du rig du personnage.",
        images: [
            "img/gallery/EVEN_JV.mp4"
        ]
        },
        {
        title: "Golhem - 2022",
        description: "Projet commun réalisé à 3 (un modeleur/textureur, un animateur et un riggeur). Je me suis occupée de toute la structure de rigging du personnage.",
        images: [
            "img/gallery/golem.mp4"
        ]
        }
    ];
    
    const SLIDE_INTERVAL = 4000; // ms entre chaque changement d'image
    const gallery = document.getElementById('gallery');
 
    // Pour chaque projet : construit la carte (images, repères, légende) et l'ajoute à la galerie
    projects.forEach((project, projectIndex) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.tabIndex = 0;
    
        const frame = document.createElement('div');
        frame.className = 'frame';
    
        // Crée une balise par image du projet, la première étant active :
        // <video> pour un .mp4 (anciens GIF, bien plus légers en vidéo), <img> sinon
        project.images.forEach((src, i) => {
            let media;
            if (src.endsWith('.mp4')) {
                media = document.createElement('video');
                // muted + playsInline : obligatoires pour la lecture automatique (surtout sur mobile)
                media.muted = true;
                media.loop = true;
                media.autoplay = true;
                media.playsInline = true;
                media.setAttribute('aria-label', project.title);
            } else {
                media = document.createElement('img');
                media.alt = project.title;
            }
            media.src = src;
            if (i === 0) media.classList.add('is-active');
            frame.appendChild(media);
        });
        card.appendChild(frame);
    
        // repères de type planche-contact, un seul si une seule image
        if (project.images.length > 1) {
        const indexRow = document.createElement('div');
        indexRow.className = 'frame-index';
        // Crée un repère (point) par image, pour indiquer visuellement l'image en cours
        project.images.forEach((_, i) => {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('is-active');
            indexRow.appendChild(dot);
        });
        card.appendChild(indexRow);
        }
    
        const caption = document.createElement('div');
        caption.className = 'caption';
        const linkHtml = project.link
            ? `<a class="caption-link" href="${project.link}" target="_blank" rel="noopener noreferrer"><span class="icon-display"></span></a>`
            : '';
        caption.innerHTML = `
        <div class="rule"></div>
        <h3>${project.title}</h3>
        <p>${project.description}</p> 
        <p>${linkHtml}</p>
        `;
        card.appendChild(caption);
    
        gallery.appendChild(card);
    
        // défilement automatique pour les projets à plusieurs images
        if (project.images.length > 1) {
            let current = 0;
            const imgs = frame.querySelectorAll('img, video');
            const dots = card.querySelectorAll('.frame-index span');
        
            // décalage aléatoire au démarrage pour que les cartes ne
            // défilent pas toutes en même temps
            const startDelay = Math.random() * SLIDE_INTERVAL;
        
            // Après le délai initial, fait défiler les images/repères toutes les SLIDE_INTERVAL ms
            setTimeout(() => {
                setInterval(() => {
                imgs[current].classList.remove('is-active');
                dots[current].classList.remove('is-active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('is-active');
                dots[current].classList.add('is-active');
                }, SLIDE_INTERVAL);
            }, startDelay);
        }
    })
    } 
} 
