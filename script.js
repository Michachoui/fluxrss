// Loader
window.addEventListener('load', () => {
    gsap.to('.loader', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
            initAnimations();
        }
    });
});

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Gestion de la Lightbox (Zoom au Clic pour la badgeuse)
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close-modal');

document.querySelectorAll('.badgeuse-thumb').forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);
    });
});

if (closeBtn) {
    const closeModalFunc = () => {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); 
    };
    closeBtn.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
}

// LOGIQUE DU SLIDER INTERACTIF AVANT/APRÈS (Baie de Brassage)
const baieSliderInput = document.getElementById('baie-slider-input');
if (baieSliderInput) {
    baieSliderInput.addEventListener('input', (e) => {
        const sliderPos = e.target.value;
        const beforeImg = document.querySelector('.baie-img-before');
        const sliderLine = document.querySelector('.baie-slider-line');
        const sliderBtn = document.querySelector('.baie-slider-button');
        
        if (beforeImg) beforeImg.style.width = `${sliderPos}%`;
        if (sliderLine) sliderLine.style.left = `${sliderPos}%`;
        if (sliderBtn) sliderBtn.style.left = `${sliderPos}%`;
    });
}

// Custom Vanilla JS Network Canvas Background
const canvas = document.getElementById('network-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        particles = [];
        for (let i = 0; i < 55; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        let pointColor = body.classList.contains('light-mode') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        let lineColor = body.classList.contains('light-mode') ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
        
        if(body.classList.contains('umbrella-mode')) {
            pointColor = 'rgba(255, 0, 0, 0.7)';
            lineColor = 'rgba(255, 0, 0, 0.15)';
        }

        ctx.fillStyle = pointColor;
        ctx.strokeStyle = lineColor;

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    draw();
}

// Easter Egg Code Séquentiel : STARS
let keyBuffer = '';
const secretCode = 'stars';

document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > secretCode.length) {
            keyBuffer = keyBuffer.slice(-secretCode.length);
        }
        if (keyBuffer === secretCode) {
            activateUmbrellaMode();
            keyBuffer = ''; 
        }
    }
});

function activateUmbrellaMode() {
    body.classList.toggle('umbrella-mode');
    const titleFirst = document.getElementById('name-first');
    const titleLast = document.getElementById('name-last');
    
    if(body.classList.contains('umbrella-mode')) {
        titleFirst.innerText = 'Umbrella';
        titleLast.innerText = 'Corp.';
        titleLast.style.color = '#ff0000';
    } else {
        titleFirst.innerText = 'Michel';
        titleLast.innerText = 'Gomez';
        titleLast.style.color = '';
    }
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();
    tl.from('.reveal', {
        y: 30, opacity: 0, stagger: 0.2, duration: 1, ease: 'power4.out'
    })
    .from('.reveal-title', {
        y: 100, opacity: 0, duration: 1.5, ease: 'expo.out'
    }, "-=1");

    gsap.utils.toArray('.anim-fade').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 50, opacity: 0, duration: 1, ease: 'power3.out'
        });
    });

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// === NOUVELLE FONCTION FLUX RSS AVEC FILTRE DE DATE ===
function loadITConnectFeed() {
    const rssUrl = 'https://www.it-connect.fr/feed/';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const container = document.getElementById('it-connect-feed');

    if (!container) return;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                const now = new Date();
                const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // Une semaine en millisecondes

                // Filtre : Ne garder que les articles publiés il y a moins de 7 jours
                const recentItems = data.items.filter(item => {
                    const pubDate = new Date(item.pubDate);
                    return (now - pubDate) <= oneWeekInMs;
                });

                container.innerHTML = ''; 

                if (recentItems.length === 0) {
                    container.innerHTML = '<p style="color: var(--text-muted);">Aucun article publié ces 7 derniers jours sur IT-Connect.</p>';
                    return;
                }
                
                // Prendre jusqu'à 3 articles maximum parmi les récents
                const itemsToDisplay = recentItems.slice(0, 3);
                
                const ul = document.createElement('ul');
                ul.style.listStyle = 'none';
                ul.style.display = 'flex';
                ul.style.flexDirection = 'column';
                ul.style.gap = '15px';
                ul.style.marginTop = '15px';

                itemsToDisplay.forEach(item => {
                    const li = document.createElement('li');
                    
                    const pubDateStr = new Date(item.pubDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    });

                    li.innerHTML = `
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: var(--text); font-weight: 600; display: block; transition: color 0.3s;">
                            ${item.title}
                        </a>
                        <small style="color: var(--secondary); font-size: 0.8rem;">Publié le ${pubDateStr}</small>
                    `;
                    
                    const linkEl = li.querySelector('a');
                    linkEl.addEventListener('mouseenter', () => linkEl.style.color = 'var(--secondary)');
                    linkEl.addEventListener('mouseleave', () => linkEl.style.color = 'var(--text)');
                    
                    ul.appendChild(li);
                });

                container.appendChild(ul);
            } else {
                container.innerHTML = `<p style="color: var(--secondary);">Impossible de charger le flux.</p>`;
            }
        })
        .catch(() => {
            container.innerHTML = `<p style="color: var(--secondary);">Erreur de connexion au flux RSS.</p>`;
        });
}

document.addEventListener('DOMContentLoaded', loadITConnectFeed);
