// ===============================
// LOADER
// ===============================
(function () {
    var DURATION  = 1500; // durée minimale affichage (ms)
    var startTime = Date.now();
    var pageReady = false;
    var countDone = false;
    var exited    = false;

    function exitLoader() {
        if (exited) return;
        exited = true;
        var loader = document.getElementById('loader');
        if (!loader) return;
        loader.classList.add('loader-exit');
        setTimeout(function () { loader.style.display = 'none'; }, 900);
    }

    // Anime le compteur 00 → 100
    function tick() {
        var elapsed  = Date.now() - startTime;
        var progress = Math.min(1, elapsed / DURATION);
        var val      = Math.floor(progress * 100);
        var el       = document.getElementById('loader-count');
        if (el) el.textContent = val < 10 ? '0' + val : String(val);
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            countDone = true;
            if (pageReady) exitLoader();
        }
    }

    // Démarre le compteur dès que le DOM est prêt
    document.addEventListener('DOMContentLoaded', function () {
        requestAnimationFrame(tick);
    });

    // Attend aussi que les ressources soient chargées
    window.addEventListener('load', function () {
        pageReady = true;
        if (countDone) exitLoader();
    });

    // Fallback de sécurité : 4 s max même si window.load tarde
    setTimeout(function () { pageReady = true; if (countDone) exitLoader(); }, 4000);
})();

// ===============================
// THEME (LIGHT / DARK)
// ===============================
(function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

function switchThemeVideo(isLight) {
    const video = document.getElementById('video-bg');
    if (!video) return;
    const src = video.querySelector('source');
    if (!src) return;
    // ⬇️ MÊME CHEMINS QUE DANS LE SCRIPT INLINE DES HTML
    const atox = 'CHEMIN_VIDEO_CLAIRE';   // ← vidéo mode clair
    const vids = ['CHEMIN_VIDEO_SOMBRE', atox]; // ← [mode sombre, mode clair]
    const next = isLight ? atox : vids[0|(Math.random()*vids.length)];
    if (src.getAttribute('src') === next) return;
    src.src = next;
    video.load();
    video.play().catch(() => {});
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isLight = document.body.classList.contains('light-mode');
    document.querySelectorAll('#theme-toggle i').forEach(icon => {
        icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    });
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        btn.setAttribute('aria-label', isLight ? 'Activer le mode sombre' : 'Activer le mode clair');
    });
}

function initializeThemeButtons() {
    updateThemeIcon();
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

// ===============================
// VARIABLES GLOBALES
// ===============================

let currentSection = 'main'; // 'main' ou nom de l'UE active

// ===============================
// ANIMATION D'INTRODUCTION
// ===============================

document.addEventListener('DOMContentLoaded', function () {
    initializeThemeButtons();
    initializePortfolio();
});

// ===============================
// INITIALISATION DU PORTFOLIO
// ===============================

function initializePortfolio() {
    initializeVideo();
    initializeNavigation();
    initializeScrollAnimations();
    initializeUECards();
    initializeContactForm();
    initializeScrollToTop();
    initializeCVModal();
    initializeCustomCursor();
    initializeUECarousels();
    initReadymagStacking();
    initSkillsReel();
    initAmbientBlob();
    initReveal();
    initProjectDetails();
    initUETabs();
    initInterfaceCarousel();
    initHeroRotate();
    if (typeof AOS !== 'undefined') AOS.init({ duration: 700, once: true, offset: 80 });
    console.log('Portfolio initialisé avec succès');
}

// ===============================
// CURSEUR PERSONNALISÉ (PHASE 2)
// ===============================
function initializeCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 150, fill: "forwards" });
    });
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .menu-icon, .cv-close-btn, .project-btn, .glass-social-btn, .scroll-to-top');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });
}

// ===============================
// GESTION DE LA VIDÉO
// ===============================

function initializeVideo() {
    const video = document.getElementById('video-bg');
    if (!video) return;

    // La source est posee par le script inline dans le HTML.
    // On ne la remplace jamais ici - on declenche juste le chargement.
    video.muted = true;
    video.playsInline = true;
    video.load();

    video.addEventListener('loadeddata', function onLoaded() {
        video.classList.add('loaded');
        video.play().catch(() => {});
        video.removeEventListener('loadeddata', onLoaded);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) video.pause();
        else video.play().catch(() => {});
    });

    const alternanceSection = document.getElementById('alternance');
    if (alternanceSection) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!video.paused) video.pause();
                } else if (document.visibilityState === 'visible') {
                    video.play().catch(() => {});
                }
            });
        }, { threshold: 0 });
        obs.observe(alternanceSection);
    }
}

// ===============================
// NAVIGATION PRINCIPALE
// NOTE : L'ouverture/fermeture de la sidebar est gérée UNIQUEMENT
// par nav-premium.js pour éviter les conflits de double-listener.
// Cette fonction ne gère que le scroll vers les sections.
// ===============================

function initializeNavigation() {
    window.scrollToSectionGlobal = scrollToSection;
    window.currentSectionGlobal  = () => currentSection;
    window.showMainSkillsGlobal  = showMainSkills;

    // Burger menu mobile
    const burger  = document.getElementById('nav-burger');
    const nav     = document.getElementById('nav');
    const navLinks = document.getElementById('nav-links');
    if (!burger || !nav) return;

    function closeMobileMenu() {
        nav.classList.remove('nav-mobile-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        burger.focus();
    }

    burger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('nav-mobile-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen && navLinks) {
            const firstLink = navLinks.querySelector('a');
            if (firstLink) setTimeout(function() { firstLink.focus(); }, 50);
        }
    });

    // Ferme le menu quand on clique un lien
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav-mobile-open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Ferme au clic en dehors
    document.addEventListener('click', function (e) {
        if (nav.classList.contains('nav-mobile-open') && !nav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Ferme avec Échap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('nav-mobile-open')) {
            closeMobileMenu();
        }
    });
}

// ===============================
// GESTION DES CARTES UE
// ===============================

function initializeUECards() {
    // Nouveau design liste éditoriale — chaque .ue-list-row est cliquable
    // Note : .skill-card est géré par délégation dans initSkillsReel (originals + clones)
    document.querySelectorAll('.ue-row[data-ue], .ue-list-row[data-ue], .ue-tile[data-ue]').forEach(row => {
        const ueName = row.getAttribute('data-ue');
        if (!ueName) return;

        function activate() { showUEProjects(ueName); }

        row.addEventListener('click', activate);

        // Support clavier (role=button + tabindex déjà dans le HTML)
        row.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    // Support clavier pour les skill-cards du carrousel (originaux uniquement)
    document.querySelectorAll('.skill-card[data-ue]').forEach(card => {
        const ueName = card.getAttribute('data-ue');
        if (!ueName) return;
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showUEProjects(ueName);
            }
        });
    });

    // Compatibilité — ancien design .ue-card-new (fallback si présent)
    document.querySelectorAll('.ue-card-new').forEach(card => {
        const ueBtn = card.querySelector('.ue-btn-new');
        const ueName = card.parentElement.getAttribute('data-ue');
        card.addEventListener('click', function () { showUEProjects(ueName); });
        if (ueBtn) ueBtn.addEventListener('click', function(e) { e.stopPropagation(); showUEProjects(ueName); });
        card.addEventListener('mouseenter', function() { this.classList.add('hovered'); });
        card.addEventListener('mouseleave', function() { this.classList.remove('hovered'); });
    });

    // Compatibilité — ancien design .ue-card
    document.querySelectorAll('.ue-card').forEach(card => {
        const ueName = card.getAttribute('data-ue');
        card.addEventListener('click', function() { showUEProjects(ueName); });
    });
}

// ===============================
// INITIALISATION DES CAROUSELS DES COMPÉTENCES
// ===============================

function initializeUECarousels() {
    const ueSections = document.querySelectorAll('.ue-projects-section');
    ueSections.forEach(section => {
        const grid = section.querySelector('.projects-grid');
        if (grid) {
            grid.classList.remove('projects-grid');
            grid.classList.add('carousel-track');
            
            const wrapper = document.createElement('div');
            wrapper.className = 'carousel-wrapper';
            
            const container = document.createElement('div');
            container.className = 'carousel-container';
            
            grid.parentNode.insertBefore(wrapper, grid);
            wrapper.appendChild(container);
            container.appendChild(grid);
            
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.className = 'carousel-nav prev-btn glass-btn';
            
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.className = 'carousel-nav next-btn glass-btn';
            
            wrapper.appendChild(prevBtn);
            wrapper.appendChild(nextBtn);
            
            const scrollAmount = window.innerWidth <= 768 ? 315 : 380; 
            
            prevBtn.addEventListener('click', () => {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });
}

// ===============================
// CAROUSEL HORIZONTAL COMPÉTENCES
// ===============================

function initSkillsReel() {
    const reel = document.getElementById('skills-reel');
    if (!reel) return;

    // Duplicate cards for infinite loop — garder data-ue pour la délégation
    const origCards = Array.from(reel.querySelectorAll('.skill-card'));
    origCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('tabindex');
        reel.appendChild(clone);
    });

    let pos = 0;
    let isDragging = false;
    let isPaused = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let lastMouseX = 0;
    let velocity = 0;
    let halfWidth = 0;
    let cardStep = 0;
    let hasDragged = false;
    const SPEED = 0.55;

    requestAnimationFrame(() => {
        halfWidth = reel.scrollWidth / 2;
        const firstCard = reel.querySelector('.skill-card');
        cardStep = firstCard ? firstCard.offsetWidth + 16 : 292;
        requestAnimationFrame(tick);
    });

    function tick() {
        if (!isDragging && !isPaused) {
            pos += SPEED + Math.abs(velocity) * 0.1;
            velocity *= 0.9;
        }
        if (halfWidth > 0 && pos >= halfWidth) pos -= halfWidth;
        if (pos < 0) pos += halfWidth;
        reel.style.transform = `translateX(-${pos}px)`;
        requestAnimationFrame(tick);
    }

    reel.addEventListener('mouseenter', () => { isPaused = true; });
    reel.addEventListener('mouseleave', () => { isPaused = false; });

    // — Mouse drag —
    reel.addEventListener('mousedown', e => {
        isDragging = true;
        hasDragged = false;
        dragStartX = e.clientX;
        dragStartPos = pos;
        lastMouseX = e.clientX;
        velocity = 0;
        reel.classList.add('is-dragging');
        e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        if (Math.abs(e.clientX - dragStartX) > 5) hasDragged = true;
        velocity = (lastMouseX - e.clientX) * 0.3;
        lastMouseX = e.clientX;
        pos = dragStartPos + (dragStartX - e.clientX);
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        reel.classList.remove('is-dragging');
    });

    // — Touch drag —
    reel.addEventListener('touchstart', e => {
        isDragging = true;
        hasDragged = false;
        dragStartX = e.touches[0].clientX;
        dragStartPos = pos;
        lastMouseX = e.touches[0].clientX;
        velocity = 0;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        if (!isDragging) return;
        if (Math.abs(e.touches[0].clientX - dragStartX) > 5) hasDragged = true;
        velocity = (lastMouseX - e.touches[0].clientX) * 0.3;
        lastMouseX = e.touches[0].clientX;
        pos = dragStartPos + (dragStartX - e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    // Délégation : gère les clics sur cartes originales ET clones, bloque seulement si drag réel
    reel.addEventListener('click', e => {
        if (hasDragged) { hasDragged = false; return; }
        const card = e.target.closest('.skill-card[data-ue]');
        if (card) showUEProjects(card.dataset.ue);
    });

    // Prev / Next arrow navigation
    function smoothStep(delta) {
        velocity = 0;
        pos += delta;
        if (halfWidth > 0) {
            if (pos >= halfWidth) pos -= halfWidth;
            if (pos < 0) pos += halfWidth;
        }
    }
    const prevBtn = document.getElementById('reel-prev');
    const nextBtn = document.getElementById('reel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => smoothStep(-cardStep));
    if (nextBtn) nextBtn.addEventListener('click', () => smoothStep(cardStep));

    // ---- Navigation clavier dans le carrousel ----
    const origCardsKb = Array.from(reel.querySelectorAll('.skill-card[data-ue]'));
    let rovingIdx = 0;

    function setRoving(i) {
        origCardsKb.forEach(function(c, j) { c.setAttribute('tabindex', j === i ? '0' : '-1'); });
        rovingIdx = i;
    }
    setRoving(0);

    origCardsKb.forEach(function(card, i) {
        card.addEventListener('focus', function() {
            isPaused = true;
            setRoving(i);
            var containerW = (reel.parentElement || reel).offsetWidth;
            var target = card.offsetLeft - Math.max(0, (containerW - cardStep) / 2);
            pos = Math.max(0, target);
        });
        card.addEventListener('blur', function() {
            setTimeout(function() {
                var still = origCardsKb.some(function(c) { return c === document.activeElement; });
                if (!still) isPaused = false;
            }, 50);
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                origCardsKb[(rovingIdx + 1) % origCardsKb.length].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                origCardsKb[(rovingIdx - 1 + origCardsKb.length) % origCardsKb.length].focus();
            }
        });
    });
}

// ===============================
// NAVIGATION ENTRE SECTIONS UE
// ===============================

var _lastSkillCard = null;

var UE_TABS = [
    { id: 'comprendre',   label: 'Comprendre' },
    { id: 'concevoir',    label: 'Concevoir' },
    { id: 'exprimer',     label: 'Exprimer' },
    { id: 'developper',   label: 'Développer' },
    { id: 'entreprendre', label: 'Entreprendre' }
];

function initUETabs() {
    document.querySelectorAll('.ue-projects-section').forEach(function(section) {
        var sectionId = section.id.replace('ue-', '');
        var backBtn = section.querySelector('.ue-back');
        if (!backBtn) return;

        var tabsWrap = document.createElement('div');
        tabsWrap.className = 'ue-nav-tabs';

        UE_TABS.forEach(function(tab) {
            var btn = document.createElement('button');
            btn.className = 'ue-nav-tab' + (tab.id === sectionId ? ' active' : '');
            btn.textContent = tab.label;
            btn.setAttribute('data-ue-tab', tab.id);
            btn.addEventListener('click', function() {
                showUEProjects(tab.id);
            });
            tabsWrap.appendChild(btn);
        });

        backBtn.after(tabsWrap);
    });
}

function updateUETabs(activeName) {
    document.querySelectorAll('.ue-nav-tab').forEach(function(tab) {
        tab.classList.toggle('active', tab.getAttribute('data-ue-tab') === activeName);
    });
}

function showUEProjects(ueName) {
    var ueSection = document.getElementById('ue-' + ueName);
    if (!ueSection) { console.error('Section UE introuvable :', ueName); return; }

    // Mémoriser la carte qui a déclenché l'ouverture
    _lastSkillCard = document.activeElement;

    // Fermer nav mobile
    var nav = document.getElementById('nav');
    if (nav) nav.classList.remove('nav-mobile-open');

    // Cacher toutes les sections UE ouvertes
    document.querySelectorAll('.ue-projects-section').forEach(function(s) {
        s.classList.add('hidden');
        s.style.opacity = '';
        s.style.transition = '';
    });

    // Afficher la section cible : d'abord retirer hidden (display devient visible),
    // puis animer l'opacité dans le prochain frame
    ueSection.classList.remove('hidden');
    ueSection.style.opacity = '0';
    ueSection.style.transition = 'none';

    // Double rAF pour que le navigateur applique display avant la transition
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            ueSection.style.transition = 'opacity 0.35s ease';
            ueSection.style.opacity = '1';
        });
    });

    // Scroll vers la section puis focus le bouton Retour
    setTimeout(function() {
        window.scrollTo({ top: ueSection.offsetTop - 60, behavior: 'smooth' });
        var backBtn = ueSection.querySelector('.ue-back');
        if (backBtn) backBtn.focus();
    }, 50);

    currentSection = ueName;
    updateUETabs(ueName);
    history.pushState({ section: ueName }, '', '#ue-' + ueName);
}

function showMainSkills() {
    if (currentSection === 'main') return;
    const currentUESection = document.getElementById('ue-' + currentSection);
    const skillsSection = document.getElementById('skills');
    if (currentUESection) {
        currentUESection.style.opacity = '0';
        setTimeout(() => {
            currentUESection.classList.add('hidden');
            currentUESection.style.display = '';
            currentUESection.style.opacity = '';
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            currentSection = 'main';
            // Retour du focus à la carte d'origine
            if (_lastSkillCard && typeof _lastSkillCard.focus === 'function') {
                _lastSkillCard.focus();
                _lastSkillCard = null;
            }
        }, 250);
    }
    history.pushState({ section: 'main' }, '', '#skills');
}

// ===============================
// GESTION DE L'HISTORIQUE NAVIGATEUR
// ===============================

window.addEventListener('popstate', function (event) {
    if (event.state && event.state.section) {
        if (event.state.section === 'main') {
            showMainSkills();
        } else {
            showUEProjects(event.state.section);
        }
    }
});

// ===============================
// GESTION DE LA MODAL CV - COMPLÈTEMENT CORRIGÉE
// ===============================

function initializeCVModal() {
    var modal = document.getElementById('cv-modal');
    if (modal) {
        modal.classList.add('hidden', 'cv-force-hidden');
        modal.style.display = 'none';
    }
    var loadBtn = document.getElementById('load-cv-btn');
    if (loadBtn) loadBtn.addEventListener('click', loadCV);
}

var _cvModalTrigger = null;
function openCV() {
    var modal = document.getElementById('cv-modal');
    if (!modal) return;
    _cvModalTrigger = document.activeElement;
    modal.classList.remove('hidden', 'cv-force-hidden');
    modal.style.display = 'flex';
    modal.style.opacity = '';
    modal.style.visibility = '';
    modal.style.pointerEvents = '';
    modal.style.zIndex = '';
    setTimeout(function() {
        modal.classList.add('open');
        var closeBtn = modal.querySelector('.cv-modal-close');
        if (closeBtn) closeBtn.focus();
        trapFocus(modal);
    }, 10);
    document.body.style.overflow = 'hidden';
    var iframe = document.getElementById('cv-iframe');
    if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
    var loading = document.getElementById('cv-loading');
    if (loading) loading.style.display = 'none';
    var preview = document.getElementById('cv-preview');
    if (preview) preview.style.display = '';
}

// FONCTION POUR CHARGER LE CV UNIQUEMENT SUR CLIC EXPLICITE
function loadCV() {
    const iframe = document.getElementById('cv-iframe');
    const loading = document.getElementById('cv-loading');
    const preview = document.getElementById('cv-preview');

    console.log('Chargement MANUEL du CV demandé');

    // Cacher le bouton de chargement
    if (preview) {
        preview.style.display = 'none';
        preview.style.visibility = 'hidden';
    }

    // Afficher le loading
    if (loading) {
        loading.style.display = 'block';
        loading.style.visibility = 'visible';
    }

    // Charger le PDF dans l'iframe SEULEMENT maintenant
    if (iframe) {
        iframe.src = 'Image/CV/cv Arnaud Hunt numérique.pdf';
        iframe.onload = function () {
            if (loading) {
                loading.style.display = 'none';
                loading.style.visibility = 'hidden';
            }
            iframe.style.display = 'block';
            iframe.style.visibility = 'visible';
            iframe.classList.add('loaded');
            console.log('CV chargé avec succès');
        };

        iframe.onerror = function () {
            if (loading) {
                loading.style.display = 'none';
                loading.style.visibility = 'hidden';
            }
            if (preview) {
                preview.innerHTML = '<p style="color: white; text-align: center;">Erreur lors du chargement du CV</p>';
                preview.style.display = 'flex';
                preview.style.visibility = 'visible';
            }
            console.error('Erreur lors du chargement du CV');
        };
    }
}

function closeCV() {
    var modal = document.getElementById('cv-modal');
    if (!modal) return;
    trapFocus(null);
    modal.classList.remove('open');
    setTimeout(function() {
        modal.style.display = 'none';
        modal.classList.add('hidden', 'cv-force-hidden');
        document.body.style.overflow = '';
        var iframe = document.getElementById('cv-iframe');
        if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
        if (_cvModalTrigger) { _cvModalTrigger.focus(); _cvModalTrigger = null; }
    }, 300);
}

// Fermeture avec la touche Échap
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('cv-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeCV();
        }
    }
});

// EMPÊCHER TOUT CHARGEMENT AUTOMATIQUE AU DÉMARRAGE
document.addEventListener('DOMContentLoaded', function () {
    // S'assurer qu'aucune modal ne s'ouvre automatiquement
    const modal = document.getElementById('cv-modal');
    if (modal) {
        modal.classList.add('hidden', 'cv-force-hidden');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modal.style.pointerEvents = 'none';
        modal.style.zIndex = '-1';
    }
    console.log('Vérification : aucune modal ne doit s\'ouvrir automatiquement');
});

// ===============================
// ANIMATIONS DE SCROLL
// ===============================

function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                if (entry.target.id === 'skills') {
                    animateUECards();
                }
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });
}

function animateUECards() {
    const ueCards = document.querySelectorAll('.ue-card');
    ueCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }, index * 150);
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = sectionId === 'about' ? section.offsetTop : section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===============================
// FORMULAIRE DE CONTACT
// ===============================

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form ? form.querySelector('[type="submit"]') : null;
    if (!form || !submitBtn) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const nom = formData.get('name') || formData.get('nom');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!nom || !email || !message) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;
        const subject = encodeURIComponent(`Contact Portfolio - ${nom}`);
        const body = encodeURIComponent(`
Nom: ${nom}
Email: ${email}

Message:
${message}

---
Envoyé depuis le portfolio de Hunt Arnaud
        `);
        const mailtoLink = `mailto:huntarnaud97113@gmail.com?subject=${subject}&body=${body}`;
        setTimeout(() => {
            window.location.href = mailtoLink;
            showNotification('Votre client email va s\'ouvrir', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}

// ===============================
// SYSTÈME DE NOTIFICATIONS
// ===============================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
        <span>${message}</span>
    `;
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        color: 'white',
        padding: '15px 20px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '300px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    });
    if (type === 'success') {
        notification.style.borderColor = 'rgba(76, 175, 80, 0.5)';
    } else if (type === 'error') {
        notification.style.borderColor = 'rgba(244, 67, 54, 0.5)';
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===============================
// BOUTON SCROLL TO TOP
// ===============================

function initializeScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    // La visibilité du bouton est gérée dans _runScrollEffects (listener scroll unifié)
    window._scrollToTopBtn = scrollBtn;
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// ===============================
// EFFETS VISUELS AVANCÉS + LIENS ACTIFS (handler unifié, throttlé avec rAF)
// ===============================

let _scrollRAFPending = false;

window.addEventListener('scroll', function () {
    if (!_scrollRAFPending) {
        _scrollRAFPending = true;
        requestAnimationFrame(_runScrollEffects);
    }
}, { passive: true });

function _runScrollEffects() {
    _scrollRAFPending = false;
    const scrolled = window.pageYOffset;

    // scroll-to-top géré dans le script parallax inline

    // Parallaxe géré dans le script inline de index.html (rAF unifié)

    // Mise à jour des liens actifs dans la nav sidebar
    document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        const link = document.querySelector(`a[href="#${section.id}"]`);
        if (link) {
            if (rect.top <= 150 && rect.bottom >= 150) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// ===============================
// GESTION DES ERREURS
// ===============================

window.addEventListener('error', function (e) {
    console.error('Erreur JavaScript:', e.error);
});


// ===============================
// FONCTIONS GLOBALES (accessibles depuis HTML)
// ===============================

window.openCV = openCV;
window.closeCV = closeCV;
window.loadCV = loadCV;
window.showMainSkills = showMainSkills;

console.log('Portfolio HUNT ARNAUD chargé avec succès - CV NE S\'OUVRE PAS automatiquement !');

// ===============================
// PROJECT DETAIL MODAL + META GENERATION
// ===============================

function initProjectDetails() {
    var modal = document.getElementById('proj-detail-modal');
    if (!modal) return;

    var pdmGallery = modal.querySelector('.pdm-gallery');
    var pdmTrack   = document.getElementById('pdm-gallery-track');
    var pdmPrev    = document.getElementById('pdm-gallery-prev');
    var pdmNext    = document.getElementById('pdm-gallery-next');
    var pdmDots    = document.getElementById('pdm-gallery-dots');
    var pdmTitle   = document.getElementById('pdm-title');
    var pdmRole    = document.getElementById('pdm-role');
    var pdmTools   = document.getElementById('pdm-tools');
    var pdmDesc    = document.getElementById('pdm-desc');
    var pdmTags    = document.getElementById('pdm-tags');
    var pdmLink    = document.getElementById('pdm-link');
    var pdmClose   = modal.querySelector('.pdm-close');
    var pdmOverlay = modal.querySelector('.pdm-overlay');
    var _pdmTrigger = null;
    var galleryIdx = 0;
    var galleryImages = [];

    document.querySelectorAll('.proj-card[data-role]').forEach(function(card) {
        var role  = card.getAttribute('data-role');
        var tools = card.getAttribute('data-tools');
        var body  = card.querySelector('.proj-body');
        if (!body) return;

        var meta = document.createElement('div');
        meta.className = 'proj-meta';
        if (role) {
            meta.innerHTML += '<span class="proj-meta-item"><i class="fas fa-user-tag"></i> ' + role + '</span>';
        }
        if (tools && tools !== '—') {
            meta.innerHTML += '<span class="proj-meta-item"><i class="fas fa-tools"></i> ' + tools + '</span>';
        }

        var tags = body.querySelector('.proj-tags');
        if (tags) body.insertBefore(meta, tags);
        else body.appendChild(meta);

        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            if (e.target.closest('.proj-link') || e.target.closest('.proj-img-wrap')) return;
            openProjectModal(card);
        });
    });

    function buildGallery(images) {
        pdmTrack.innerHTML = '';
        pdmDots.innerHTML = '';
        galleryImages = images;
        galleryIdx = 0;

        var hasMultiple = images.length > 1;
        pdmGallery.classList.toggle('has-multiple', hasMultiple);

        images.forEach(function(src, i) {
            var isVideo = /\.(mp4|mov|webm)$/i.test(src);
            var el;
            if (isVideo) {
                el = document.createElement('video');
                el.src = src;
                el.controls = true;
                el.preload = 'metadata';
                el.playsInline = true;
            } else {
                el = document.createElement('img');
                el.src = src;
                el.alt = 'Image ' + (i + 1);
                el.loading = i === 0 ? 'eager' : 'lazy';
            }
            pdmTrack.appendChild(el);

            if (hasMultiple) {
                var dot = document.createElement('button');
                dot.className = 'pdm-gallery-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Image ' + (i + 1));
                dot.addEventListener('click', function() { scrollToSlide(i); });
                pdmDots.appendChild(dot);
            }
        });
    }

    function scrollToSlide(i) {
        galleryIdx = Math.max(0, Math.min(i, galleryImages.length - 1));
        var slide = pdmTrack.children[galleryIdx];
        if (slide) slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        updateDots();
    }

    function updateDots() {
        pdmDots.querySelectorAll('.pdm-gallery-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === galleryIdx);
        });
    }

    // Scroll listener pour mettre à jour les dots au swipe
    var scrollTimer;
    pdmTrack.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            var trackRect = pdmTrack.getBoundingClientRect();
            var closest = 0;
            var closestDist = Infinity;
            Array.from(pdmTrack.children).forEach(function(img, i) {
                var imgRect = img.getBoundingClientRect();
                var dist = Math.abs(imgRect.left - trackRect.left);
                if (dist < closestDist) { closestDist = dist; closest = i; }
            });
            galleryIdx = closest;
            updateDots();
        }, 80);
    }, { passive: true });

    pdmPrev.addEventListener('click', function() { scrollToSlide(galleryIdx - 1); });
    pdmNext.addEventListener('click', function() { scrollToSlide(galleryIdx + 1); });

    function openProjectModal(card) {
        _pdmTrigger = document.activeElement;

        var img = card.querySelector('.proj-img-wrap img');
        var title = card.querySelector('.proj-title');
        var desc  = card.querySelector('.proj-desc');
        var tags  = card.querySelector('.proj-tags');
        var link  = card.querySelector('.proj-link');
        var role  = card.getAttribute('data-role');
        var tools = card.getAttribute('data-tools');
        var gallerySrc = card.getAttribute('data-gallery');

        // Galerie : data-gallery ou image seule
        var images = [];
        if (gallerySrc) {
            images = gallerySrc.split(',').map(function(s) { return s.trim(); });
        } else if (img) {
            images = [img.src];
        }

        if (images.length > 0) {
            buildGallery(images);
            pdmGallery.style.display = '';
        } else {
            pdmGallery.style.display = 'none';
        }

        pdmTitle.textContent = title ? title.textContent : '';
        pdmDesc.textContent = desc ? desc.textContent : '';

        pdmRole.querySelector('span').textContent = role || '';
        pdmRole.style.display = role ? '' : 'none';

        pdmTools.querySelector('span').textContent = tools || '';
        pdmTools.style.display = (tools && tools !== '—') ? '' : 'none';

        pdmTags.innerHTML = tags ? tags.innerHTML : '';

        if (link && !link.classList.contains('disabled')) {
            pdmLink.href = link.href;
            pdmLink.innerHTML = link.innerHTML;
            pdmLink.style.display = '';
        } else {
            pdmLink.style.display = 'none';
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        pdmTrack.scrollLeft = 0;
        setTimeout(function() { pdmClose.focus(); trapFocus(modal); }, 50);
    }

    function closeProjectModal() {
        trapFocus(null);
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (_pdmTrigger) { _pdmTrigger.focus(); _pdmTrigger = null; }
    }

    pdmClose.addEventListener('click', closeProjectModal);
    pdmOverlay.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeProjectModal();
        }
    });
}

// ===============================
// HERO — TEXTE ROTATIF
// ===============================
function initHeroRotate() {
    var el = document.getElementById('hero-rotate');
    if (!el) return;
    var wordsByLang = {
        fr: ['Design.', 'Vidéo.', 'Musique.'],
        en: ['Design.', 'Video.', 'Music.'],
        es: ['Diseño.', 'Vídeo.', 'Música.']
    };
    function getWords() {
        var lang = document.documentElement.lang || 'fr';
        return wordsByLang[lang] || wordsByLang.fr;
    }
    var idx = 0;

    setInterval(function() {
        el.classList.add('fade-out');
        setTimeout(function() {
            var words = getWords();
            idx = (idx + 1) % words.length;
            el.textContent = words[idx];
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    el.classList.remove('fade-in');
                });
            });
        }, 400);
    }, 2500);
}

// (liens actifs gérés dans _runScrollEffects ci-dessus)

// ===============================
// CAROUSEL INTERFACE 2025
// ===============================
function initInterfaceCarousel() {
    var track = document.getElementById('interface-track');
    var carousel = document.getElementById('interface-carousel');
    var dotsWrap = document.getElementById('interface-dots');
    var prevBtn = document.getElementById('interface-prev');
    var nextBtn = document.getElementById('interface-next');
    if (!track || !carousel) return;

    var slides = Array.from(track.querySelectorAll('img'));
    if (slides.length === 0) return;

    var idx = 0;
    var autoTimer = null;
    var AUTO_DELAY = 4000;

    if (slides.length <= 1) carousel.classList.add('single-slide');

    slides[0].classList.add('active');

    slides.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'interface-carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Image ' + (i + 1));
        dot.addEventListener('click', function() { goTo(i); resetAuto(); });
        dotsWrap.appendChild(dot);
    });

    function goTo(i) {
        slides[idx].classList.remove('active');
        idx = (i + slides.length) % slides.length;
        slides[idx].classList.add('active');
        dotsWrap.querySelectorAll('.interface-carousel-dot').forEach(function(d, j) {
            d.classList.toggle('active', j === idx);
        });
    }

    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    prevBtn.addEventListener('click', function() { prev(); resetAuto(); });
    nextBtn.addEventListener('click', function() { next(); resetAuto(); });

    function startAuto() {
        stopAuto();
        if (slides.length > 1) autoTimer = setInterval(next, AUTO_DELAY);
    }
    function stopAuto() { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Swipe touch
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) next(); else prev();
        }
        startAuto();
    }, { passive: true });

    startAuto();
}

/* ==========================================================================
   READYMAG BENTO GRID SCROLL EFFECT
   ========================================================================== */
function initReadymagStacking() {
    const items = document.querySelectorAll('.bento-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    items.forEach((item, index) => {
        // Add slight progressive delay based on DOM order for cascading effect
        item.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(item);
    });

    // Initialisation de Vanilla Tilt pour le Grid (Effet 3D stylé)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(items, {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.02,
            perspective: 1000,
            transition: true
        });
    } else {
        setTimeout(() => {
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(items, {
                    max: 5,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.3,
                    scale: 1.02,
                    perspective: 1000,
                    transition: true
                });
            }
        }, 500);
    }
} 

function openLightbox(src, caption) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;';
    
    const inner = document.createElement('div');
    inner.style.cssText = 'position:relative;max-width:90%;max-height:90%;';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:100%;max-height:85vh;border-radius:12px;';
    
    const cap = document.createElement('p');
    cap.textContent = caption || ''; // textContent évite toute injection XSS
    cap.style.cssText = 'color:white;text-align:center;margin-top:1rem;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.06);color:white;border:none;padding:8px 12px;border-radius:50%;cursor:pointer;';
    closeBtn.addEventListener('click', () => lightbox.remove());
    
    inner.appendChild(img);
    inner.appendChild(cap);
    inner.appendChild(closeBtn);
    lightbox.appendChild(inner);
    document.body.appendChild(lightbox);
}

// ==========================================================================
// ACCESSIBILITÉ (A11y)
// ==========================================================================

let currentModalFocusTrap = null;
function trapFocus(modal) {
    if (currentModalFocusTrap) {
        document.removeEventListener('keydown', currentModalFocusTrap);
    }
    if (!modal) return;
    currentModalFocusTrap = function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;
        const focusableEls = modal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusableEls.length === 0) return;
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (!modal.contains(document.activeElement)) {
            firstFocusableEl.focus();
            e.preventDefault();
            return;
        }
        if (e.shiftKey) { 
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else { 
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    };
    document.addEventListener('keydown', currentModalFocusTrap);
}

function openA11yGuide() {
    const guide = document.getElementById('a11y-guide');
    if (guide) {
        guide.classList.add('active');
        setTimeout(() => {
            const btn = document.getElementById('a11y-close-btn');
            if (btn) btn.focus();
            trapFocus(guide);
        }, 100);
    }
}

function closeA11yGuide() {
    const guide = document.getElementById('a11y-guide');
    if (guide) {
        guide.classList.remove('active');
        trapFocus(null);
        // Remettre le focus
        const a11yTrigger = document.getElementById('guide-a11y-btn');
        if (a11yTrigger) a11yTrigger.focus();
    }
}

// Assigner le tabindex + role bouton dynamique aux Bento cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bento-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });
});

// Écoute des touches Entrée et Échap globalement
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeA11yGuide();
    }
    else if (e.key === 'Enter') {
        const activeElem = document.activeElement;
        
        // Si c'est le menu burger
        if (activeElem && activeElem.id === 'menu-toggle') {
            // Empêche le comportement par défaut si nécessaire
            e.preventDefault();
            activeElem.click();
        }
        // Si c'est une tuile bento (Alternance)
        else if (activeElem && activeElem.classList.contains('bento-item')) {
            e.preventDefault();
            // Simuler un clic manuel 
            const link = activeElem.querySelector('a.bento-link');
            if (link) {
                link.click();
            } else {
                activeElem.click();
            }
        }
        // Si c'est un bouton de retour
        else if (activeElem && activeElem.classList.contains('back-btn')) {
            e.preventDefault();
            activeElem.click();
        }
    }
});

// ===============================
// BLOB AMBIANT ORANGE
// ===============================
function initAmbientBlob() {
    const blob = document.getElementById('ambient-blob');
    if (!blob) return;

    // Sections qui activent le blob + position souhaitée (% viewport)
    const BLOB_SECTIONS = [
        { id: 'skills',      top: '38%', left: '72%' },
        { id: 'services',    top: '55%', left: '28%' },
        { id: 'alternance',  top: '45%', left: '62%' },
        { id: 'contact',     top: '60%', left: '40%' },
    ];

    // Sections qui cachent le blob
    const HIDE_SECTIONS = ['hero', 'about'];

    let blobVisible = false;

    function showBlob(topPct, leftPct) {
        blob.style.top  = topPct;
        blob.style.left = leftPct;
        if (!blobVisible) {
            blob.classList.add('blob-visible');
            blobVisible = true;
        }
    }
    function hideBlob() {
        if (blobVisible) {
            blob.classList.remove('blob-visible');
            blobVisible = false;
        }
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            const match = BLOB_SECTIONS.find(s => s.id === id);
            if (match) {
                showBlob(match.top, match.left);
            } else if (HIDE_SECTIONS.includes(id)) {
                hideBlob();
            }
        });
    }, { threshold: 0.25 });

    // Observe tous les sections
    [...BLOB_SECTIONS.map(s => s.id), ...HIDE_SECTIONS].forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

// ===============================
// SCROLL REVEAL
// ===============================
function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Ne PAS inclure les conteneurs dont les enfants sont déjà staggerés
    const SELECTORS = [
        '.section-label', '.section-line', '.section-title',
        '.about-grid', '.alt-table', '.alt-actions',
        '.skills-reel-wrap', '#contact-form', '.footer-inner'
    ].join(',');

    function isAboveFold(el) {
        return el.getBoundingClientRect().top < window.innerHeight * 1.1;
    }

    // Stagger cartes alternance et services
    [
        ['.alt-carousel-simple', '.alt-card', 0.08],
        ['.svc-grid', '.svc-card', 0.07]
    ].forEach(function([grid, card, step]) {
        document.querySelectorAll(grid).forEach(function(g) {
            Array.from(g.querySelectorAll(card)).forEach(function(el, i) {
                if (!isAboveFold(el)) {
                    el.classList.add('reveal-init');
                    el.style.transitionDelay = (i * step) + 's';
                }
            });
        });
    });

    // Délais séquentiels label → line → title
    document.querySelectorAll('.section-line').forEach(function(el) {
        el.style.transitionDelay = '0.12s';
    });
    document.querySelectorAll('.section-title').forEach(function(el) {
        el.style.transitionDelay = '0.2s';
    });

    // Éléments principaux
    document.querySelectorAll(SELECTORS).forEach(function(el) {
        if (!el.classList.contains('reveal-init') && !isAboveFold(el)) {
            el.classList.add('reveal-init');
        }
    });

    const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.07 });

    document.querySelectorAll('.reveal-init').forEach(function(el) {
        obs.observe(el);
    });
}

// ===============================
// LIGHTBOX
// ===============================
(function () {
    var lb      = document.getElementById('lightbox');
    var lbImg   = document.getElementById('lightbox-img');
    var lbClose = document.getElementById('lightbox-close');
    var lbPrev  = document.getElementById('lightbox-prev');
    var lbNext  = document.getElementById('lightbox-next');
    var lbCount = document.getElementById('lightbox-counter');
    if (!lb || !lbImg) return;

    var imgs = [];
    var idx  = 0;
    var busy = false;

    var EXIT_MS  = 160;
    var ENTER_MS = 260;
    var OPEN_MS  = 360;
    var CLOSE_MS = 240;
    var _lbTrigger = null;

    function collectImgs(clicked) {
        var section = clicked.closest('.ue-projects-section');
        imgs = Array.from((section || document).querySelectorAll('.proj-img-wrap img'));
        idx  = imgs.indexOf(clicked);
    }

    function updateNav() {
        var multiple = imgs.length > 1;
        if (lbPrev)  lbPrev.disabled = !multiple;
        if (lbNext)  lbNext.disabled = !multiple;
        if (!lbCount) return;
        lbCount.innerHTML = '';
        if (multiple) {
            imgs.forEach(function (_, i) {
                var dot = document.createElement('button');
                dot.className = 'lightbox-dot' + (i === idx ? ' active' : '');
                dot.setAttribute('aria-label', 'Image ' + (i + 1) + ' sur ' + imgs.length);
                dot.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
                (function (i) {
                    dot.addEventListener('click', function () { goTo(i, i >= idx ? 1 : -1); });
                }(i));
                lbCount.appendChild(dot);
            });
        }
    }

    /* dir : 1 = suivant (glisse gauche), -1 = précédent (glisse droite) */
    function goTo(i, dir) {
        if (busy || imgs.length <= 1) return;
        busy = true;
        var newIdx   = (i + imgs.length) % imgs.length;
        var exitCls  = dir >= 0 ? 'lb-exit-left'   : 'lb-exit-right';
        var enterCls = dir >= 0 ? 'lb-enter-right'  : 'lb-enter-left';

        lbImg.classList.add(exitCls);

        setTimeout(function () {
            lbImg.classList.remove(exitCls);
            idx = newIdx;
            lbImg.src = imgs[idx].src;
            lbImg.alt = imgs[idx].alt || '';
            updateNav();
            /* double rAF : laisse le navigateur appliquer le retrait de classe
               avant d'ajouter la classe d'entrée — évite le flash */
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    lbImg.classList.add(enterCls);
                    setTimeout(function () {
                        lbImg.classList.remove(enterCls);
                        busy = false;
                    }, ENTER_MS);
                });
            });
        }, EXIT_MS);
    }

    function open(clicked) {
        _lbTrigger = document.activeElement;
        collectImgs(clicked);
        lbImg.src = clicked.src;
        lbImg.alt = clicked.alt || '';
        lb.classList.remove('hidden', 'lb-closing');
        requestAnimationFrame(function () {
            lb.classList.add('lb-open');
            lbImg.classList.add('lb-img-open');
            setTimeout(function () { lbImg.classList.remove('lb-img-open'); }, OPEN_MS);
            if (lbClose) lbClose.focus();
            trapFocus(lb);
        });
        document.body.style.overflow = 'hidden';
        updateNav();
    }

    function close() {
        if (!lb.classList.contains('lb-open')) return;
        trapFocus(null);
        lb.classList.remove('lb-open');
        lb.classList.add('lb-closing');
        lbImg.classList.add('lb-img-close');
        setTimeout(function () {
            lb.classList.remove('lb-closing');
            lb.classList.add('hidden');
            lbImg.classList.remove('lb-img-close');
            lbImg.src = '';
            imgs = [];
            busy = false;
            document.body.style.overflow = '';
            if (_lbTrigger) { _lbTrigger.focus(); _lbTrigger = null; }
        }, CLOSE_MS);
    }

    document.addEventListener('click', function (e) {
        var img = e.target.closest('.proj-img-wrap img');
        if (img) { e.preventDefault(); open(img); }
    });

    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev)  lbPrev.addEventListener('click',  function () { goTo(idx - 1, -1); });
    if (lbNext)  lbNext.addEventListener('click',  function () { goTo(idx + 1,  1); });

    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('lb-open')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  goTo(idx - 1, -1);
        if (e.key === 'ArrowRight') goTo(idx + 1,  1);
    });

    /* Rendre chaque image de projet navigable au clavier */
    document.querySelectorAll('.proj-img-wrap').forEach(function (wrap) {
        wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('role', 'button');
        var img = wrap.querySelector('img');
        if (img) wrap.setAttribute('aria-label', 'Voir en grand : ' + (img.alt || 'image'));
        wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (img) open(img);
            }
        });
    });
}());

// ===============================
// VOIX OFF (Text-to-Speech)
// ===============================
(function () {
    if (!window.speechSynthesis) return;
    var synth = window.speechSynthesis;
    var voiceActive = false;

    var LANG_MAP = { fr: 'fr-FR', en: 'en-US', es: 'es-ES' };

    var VO_MSGS = {
        fr: { on: 'Voix off activée. Utilisez la touche tabulation pour naviguer.',
              labelOn:  'Désactiver la voix off (Alt+V)',
              labelOff: 'Activer la voix off (Alt+V)',
              tooltip:  'Voix off Alt+V' },
        en: { on: 'Voice-over enabled. Use Tab to navigate.',
              labelOn:  'Disable voice-over (Alt+V)',
              labelOff: 'Enable voice-over (Alt+V)',
              tooltip:  'Voice-over Alt+V' },
        es: { on: 'Voz activada. Use Tab para navegar.',
              labelOn:  'Desactivar voz (Alt+V)',
              labelOff: 'Activar voz (Alt+V)',
              tooltip:  'Voz Alt+V' }
    };

    function msgs() { return VO_MSGS[document.documentElement.lang] || VO_MSGS.fr; }

    var btn = document.createElement('button');
    btn.id = 'voiceover-toggle';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<i class="fas fa-volume-mute"></i><span class="vo-tooltip"></span>';
    document.body.appendChild(btn);

    function updateBtnLabels() {
        var m = msgs();
        btn.setAttribute('aria-label', voiceActive ? m.labelOn : m.labelOff);
        btn.querySelector('.vo-tooltip').textContent = m.tooltip;
    }
    updateBtnLabels();

    function speak(text) {
        if (!voiceActive || !text || !text.trim()) return;
        synth.cancel();
        var utt = new SpeechSynthesisUtterance(text.trim().substring(0, 300));
        utt.lang = LANG_MAP[document.documentElement.lang] || 'fr-FR';
        utt.rate = 0.92;
        utt.pitch = 1;
        synth.speak(utt);
    }

    function getLabel(el) {
        if (!el || el === document.body) return '';
        return el.getAttribute('aria-label') ||
               el.getAttribute('alt') ||
               el.getAttribute('title') ||
               (el.tagName === 'INPUT' ? el.getAttribute('placeholder') : '') ||
               el.textContent.replace(/\s+/g, ' ').trim().substring(0, 200);
    }

    function toggle() {
        voiceActive = !voiceActive;
        btn.setAttribute('aria-pressed', voiceActive ? 'true' : 'false');
        btn.classList.toggle('vo-active', voiceActive);
        btn.querySelector('i').className = voiceActive ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        updateBtnLabels();
        if (voiceActive) {
            speak(msgs().on);
        } else {
            synth.cancel();
        }
    }

    btn.addEventListener('click', toggle);

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === 'v') { e.preventDefault(); toggle(); }
    });

    document.addEventListener('focusin', function (e) {
        speak(getLabel(e.target));
    });

    /* Rafraîchir les labels quand la langue change */
    document.addEventListener('click', function (e) {
        if (e.target.closest('.lang-btn')) setTimeout(updateBtnLabels, 50);
    });
}());
