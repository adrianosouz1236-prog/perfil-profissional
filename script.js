/* ==================== MENU HAMBÚRGUER (RESPONSIVO) ==================== */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevenir scroll da página quando menu está aberto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ==================== TEMA CLARO/ESCURO ==================== */
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Carregar tema salvo
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i> Tema Claro';
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Tema Claro';
        } else {
            localStorage.setItem('theme', 'light');
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Tema Escuro';
        }
    });
}

/* ==================== VALIDAÇÃO DO FORMULÁRIO DE CONTATO ==================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nome = document.getElementById('nome')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const mensagem = document.getElementById('mensagem')?.value.trim() || '';
        
        if (nome === '') {
            alert('❌ Por favor, preencha o campo Nome.');
            document.getElementById('nome')?.focus();
            return;
        }
        
        if (email === '') {
            alert('❌ Por favor, preencha o campo E-mail.');
            document.getElementById('email')?.focus();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('❌ Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).');
            document.getElementById('email')?.focus();
            return;
        }
        
        if (mensagem === '') {
            alert('❌ Por favor, preencha o campo Mensagem.');
            document.getElementById('mensagem')?.focus();
            return;
        }
        
        alert('✅ Mensagem enviada com sucesso! Em breve entrarei em contato.');
        contactForm.reset();
    });
}

/* ==================== SCROLL SUAVE PARA ÂNCORAS ==================== */
document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offset = 70; // Altura do header fixo
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ==================== CARROSSEL / SLIDER ==================== */
function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        const slidesContainer = carousel.querySelector('[data-carousel-slides]');
        const prevBtn = carousel.querySelector('[data-carousel-btn="prev"]');
        const nextBtn = carousel.querySelector('[data-carousel-btn="next"]');
        const dotsContainer = carousel.querySelector('[data-carousel-dots]');
        
        if (!slidesContainer) return;
        
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        let currentIndex = 0;
        let autoInterval;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Limpar dots container
        if (dotsContainer) dotsContainer.innerHTML = '';
        
        // Criar dots
        if (dotsContainer && slides.length > 1) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];
        
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (slides.length === 0) return;
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
            resetAutoPlay();
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function resetAutoPlay() {
            if (slides.length <= 1) return;
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            if (autoInterval) clearInterval(autoInterval);
        }
        
        // Eventos dos botões
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            stopAutoPlay();
            resetAutoPlay();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            stopAutoPlay();
            resetAutoPlay();
        });
        
        // Touch events para mobile
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
            resetAutoPlay();
        });
        
        // Mouse events
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', resetAutoPlay);
        
        // Esconder botões se houver apenas 1 slide
        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        } else {
            resetAutoPlay();
        }
    });
}

/* ==================== LIGHTBOX (IMAGEM AMPLIADA) ==================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const counter = document.getElementById('lightbox-counter');
    
    if (!lightbox) return;
    
    let currentImages = [];
    let currentIndex = 0;
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        currentImages = [];
        document.body.style.overflow = '';
    }
    
    function openLightbox(images, index) {
        currentImages = images;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightboxImage() {
        if (currentImages.length > 0 && currentImages[currentIndex]) {
            lightboxImg.src = currentImages[currentIndex];
            if (counter) counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
    }
    
    function nextImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        }
    }
    
    function prevImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        }
    }
    
    // Eventos
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
    
    // Adicionar evento de clique em cada imagem do carrossel
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.addEventListener('click', (e) => {
            if (e.target.closest('.carousel-btn')) return;
            
            const carousel = slide.closest('.carousel-container');
            if (carousel) {
                const allSlides = Array.from(carousel.querySelectorAll('.carousel-slide'));
                const images = allSlides.map(s => {
                    return s.getAttribute('data-lightbox-img') || s.querySelector('img')?.src;
                }).filter(src => src);
                const clickedIndex = allSlides.indexOf(slide);
                if (images.length > 0) openLightbox(images, clickedIndex);
            }
        });
    });
}

/* ==================== VERIFICAR IMAGENS FALTANTES ==================== */
function checkMissingImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Imagem não encontrada: ${this.src}`);
            
        });
    });
}

/* ==================== AJUSTE DE SCROLL PARA HEADER FIXO ==================== */
function adjustScrollOnLoad() {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const offset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 100);
        }
    }
}

/* ==================== INICIALIZAÇÃO ==================== */
document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
    initLightbox();
    checkMissingImages();
    adjustScrollOnLoad();
});

// Recarregar carrosséis quando a janela for redimensionada 
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reajustar posição dos carrosséis
        document.querySelectorAll('.carousel-slides').forEach(slides => {
            const carousel = slides.closest('.carousel-container');
            if (carousel && carousel._currentIndex) {
                slides.style.transform = `translateX(-${carousel._currentIndex * 100}%)`;
            }
        });
    }, 250);
});