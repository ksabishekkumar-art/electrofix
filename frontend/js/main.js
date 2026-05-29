// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Load Services dynamically if on the Home or Services page
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        loadPublicServices(servicesContainer);
    }

    // Initialize Animations
    initAnimations();
    initRipples();
    initParticles();
    initJarvis();
});

function initParticles() {
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#00e5ff", "#38f9ff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00e5ff", "opacity": 0.3, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } },
                    "push": { "particles_nb": 3 }
                }
            },
            "retina_detect": true
        });
    }
}

// Utility to format date
window.formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
};

// Add Global Loader
const loaderHtml = '<div id="global-loader"><div class="loader-core"></div></div>';
document.body.insertAdjacentHTML('afterbegin', loaderHtml);

window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.add('loaded'), 300);
});

// Smooth Page Transitions
document.querySelectorAll('a').forEach(anchor => {
    if(anchor.href && anchor.hostname === window.location.hostname && !anchor.href.includes('#') && anchor.target !== "_blank") {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = anchor.href;
            document.body.classList.add('page-exit');
            setTimeout(() => window.location.href = target, 400);
        });
    }
});

// Initialization
function initAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) reveals[i].classList.add('active');
    }
}
window.addEventListener('scroll', initAnimations);

function initRipples() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.classList.contains('ripple-btn')) {
            let btn = e.target;
            let ripple = document.createElement('span');
            ripple.classList.add('ripple-element');
            let rect = btn.getBoundingClientRect();
            let size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            btn.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        }
    });
}

window.openMediaModal = (type, src) => {
    let modal = document.getElementById('globalMediaModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalMediaModal';
        modal.className = 'media-modal';
        modal.innerHTML = `
            <span class="media-modal-close" onclick="document.getElementById('globalMediaModal').style.display='none'">&times;</span>
            <div id="mediaModalContentWrapper" style="text-align:center; height:100%;"></div>
        `;
        document.body.appendChild(modal);
    }
    
    const wrapper = document.getElementById('mediaModalContentWrapper');
    if (type === 'image') {
        wrapper.innerHTML = `<img src="${src}" class="media-modal-content" style="max-height:80vh; max-width:90vw;">`;
    } else if (type === 'video') {
        wrapper.innerHTML = `<video src="${src}" controls autoplay class="media-modal-content" style="max-height:80vh; max-width:90vw;"></video>`;
    }
    modal.style.display = 'block';
}

async function loadPublicServices(container) {
    container.innerHTML = '<p>Loading services...</p>';
    try {
        const services = await api.getServices();
        if (services.length === 0) {
            container.innerHTML = '<p>No services available currently.</p>';
            return;
        }

        container.innerHTML = services.map((service, index) => `
            <div class="glass-card service-card reveal hover-glow" style="animation-delay: ${index * 0.1}s">
                ${service.imageUrl ? `<img src="${service.imageUrl}" alt="${service.name}" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:2px; margin-bottom:15px; border: 1px solid var(--arc-blue);">` : ''}
                <h3 style="color:var(--accent);">${service.name}</h3>
                <p style="color:var(--text-muted); margin: 10px 0;">${service.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                    <span style="font-size:18px; font-weight:bold;">₹${service.price}</span>
                    <a href="contact.html" class="btn ripple-btn">Book Now</a>
                </div>
            </div>
        `).join('');
        setTimeout(initAnimations, 100); // trigger animations for new DOM

    } catch (error) {
        container.innerHTML = '<p>Error loading services.</p>';
    }
}

function initJarvis() {
    const jarvisDiv = document.createElement('div');
    jarvisDiv.id = 'jarvis-widget';
    jarvisDiv.innerHTML = `
        <div class="jarvis-panel" id="jarvis-panel">
            <div class="jarvis-header">
                <h4>JARVIS SYSTEM</h4>
                <span class="jarvis-close" id="jarvis-close">X</span>
            </div>
            <div class="jarvis-chat" id="jarvis-chat">
                <div class="jarvis-msg">Hello, I am JARVIS. How may I assist you with ElectroFix today?</div>
            </div>
            <div class="jarvis-options">
                <button class="jarvis-btn" onclick="jarvisReply('I need to book a service.', 'Redirecting to Services module...', 'services.html')">Book Service</button>
                <button class="jarvis-btn" onclick="jarvisReply('Show me your previous work.', 'Loading Portfolio records...', 'portfolio.html')">View Portfolio</button>
                <button class="jarvis-btn" onclick="jarvisReply('I want to contact admin.', 'Initiating Contact protocol...', 'contact.html')">Contact</button>
            </div>
        </div>
        <div class="jarvis-icon" id="jarvis-icon">
            <i class="fas fa-microchip"></i>
        </div>
    `;
    document.body.appendChild(jarvisDiv);

    const icon = document.getElementById('jarvis-icon');
    const panel = document.getElementById('jarvis-panel');
    const close = document.getElementById('jarvis-close');

    icon.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
        // Play notification sound
        playJarvisSound();
    });

    close.addEventListener('click', () => {
        panel.style.display = 'none';
    });
}

function jarvisReply(userMsg, jarvisResponse, redirectUrl) {
    const chat = document.getElementById('jarvis-chat');
    chat.innerHTML += `<div class="jarvis-msg" style="border-left:none; border-right:2px solid var(--iron-gold); text-align:right;">${userMsg}</div>`;
    
    // Typing animation simulation
    const loadingId = 'loading-' + Date.now();
    chat.innerHTML += `<div class="jarvis-msg" id="${loadingId}">Processing...</div>`;
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        document.getElementById(loadingId).innerText = jarvisResponse;
        chat.scrollTop = chat.scrollHeight;
        if(redirectUrl) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        }
    }, 800);
}

function playJarvisSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}
