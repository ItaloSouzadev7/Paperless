class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add event listeners with proper binding
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Ensure first slide is visible
        this.goToSlide(1);
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active and prev classes from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Add active class to target slide
        const targetSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }
        
        // Add prev class to slides that should be positioned left
        this.slides.forEach(slide => {
            const slideNum = parseInt(slide.getAttribute('data-slide'));
            if (slideNum < slideNumber) {
                slide.classList.add('prev');
            }
        });
        
        // Update current slide
        this.currentSlide = slideNumber;
        
        // Update UI
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
    }
    
    nextSlide() {
        console.log('Next slide called, current:', this.currentSlide);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        console.log('Previous slide called, current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            
            // Update button text for last slide
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.textContent = 'Fim';
            } else {
                this.nextBtn.textContent = 'Próximo ▶';
            }
        }
    }
    
    handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowRight':
            case ' ': // Space bar
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                event.preventDefault();
                this.exitFullscreen();
                break;
        }
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, minSwipeDistance);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX, minDistance) {
        const distance = startX - endX;
        const absDistance = Math.abs(distance);
        
        if (absDistance < minDistance) {
            return;
        }
        
        if (distance > 0) {
            // Swipe left - next slide
            this.nextSlide();
        } else {
            // Swipe right - previous slide
            this.previousSlide();
        }
    }
    
    announceSlideChange() {
        // Create or update screen reader announcement
        let announcement = document.getElementById('slide-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'slide-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            document.body.appendChild(announcement);
        }
        
        const slideTitle = document.querySelector(`.slide[data-slide="${this.currentSlide}"] .slide-title`);
        const title = slideTitle ? slideTitle.textContent : `Slide ${this.currentSlide}`;
        
        announcement.textContent = `${title}. Slide ${this.currentSlide} de ${this.totalSlides}.`;
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    // Method to get slide information for external use
    getSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            title: document.querySelector(`.slide[data-slide="${this.currentSlide}"] .slide-title`)?.textContent || `Slide ${this.currentSlide}`
        };
    }
}

// Additional utility functions
class PresentationUtils {
    static addFullscreenToggle() {
        // Add fullscreen toggle button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'nav-btn';
        fullscreenBtn.innerHTML = '⛶ Tela Cheia';
        fullscreenBtn.style.cssText = `
            position: fixed;
            top: 24px;
            left: 24px;
            z-index: 1000;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            border-radius: var(--radius-base);
            padding: var(--space-8) var(--space-12);
            font-size: var(--font-size-sm);
            cursor: pointer;
            box-shadow: var(--shadow-sm);
        `;
        
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (document.fullscreenElement) {
                presentation.exitFullscreen();
                fullscreenBtn.innerHTML = '⛶ Tela Cheia';
            } else {
                presentation.enterFullscreen();
                fullscreenBtn.innerHTML = '✕ Sair';
            }
        });
        
        document.body.appendChild(fullscreenBtn);
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.innerHTML = '⛶ Tela Cheia';
            }
        });
    }
    
    static addSlideProgress() {
        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            height: 4px;
            background: var(--color-primary);
            transition: width 0.3s ease;
            z-index: 1000;
            width: ${(1 / 14) * 100}%;
        `;
        
        document.body.appendChild(progressBar);
        
        return progressBar;
    }
    
    static updateProgress(currentSlide, totalSlides) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (currentSlide / totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
}

// Initialize the presentation when the page loads
let presentation;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Initialize presentation controller
    presentation = new PresentationController();
    
    // Add additional features
    PresentationUtils.addFullscreenToggle();
    const progressBar = PresentationUtils.addSlideProgress();
    
    // Override goToSlide to update progress
    const originalGoToSlide = presentation.goToSlide.bind(presentation);
    presentation.goToSlide = function(slideNumber) {
        originalGoToSlide(slideNumber);
        PresentationUtils.updateProgress(slideNumber, 14);
    };
    
    // Add keyboard shortcuts help
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = '?';
    helpBtn.className = 'nav-btn';
    helpBtn.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 80px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-weight: bold;
        z-index: 1000;
        background: var(--color-secondary);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        cursor: pointer;
        box-shadow: var(--shadow-sm);
    `;
    
    helpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const helpText = `Atalhos do Teclado:
→ ou Espaço: Próximo slide
← : Slide anterior  
Home: Primeiro slide
End: Último slide
Esc: Sair da tela cheia

Navegação Touch:
Deslize para esquerda: Próximo
Deslize para direita: Anterior`;
        
        alert(helpText);
    });
    
    document.body.appendChild(helpBtn);
    
    // Prevent accidental page refresh
    window.addEventListener('beforeunload', (e) => {
        if (presentation.currentSlide > 1) {
            e.preventDefault();
            e.returnValue = 'Tem certeza que deseja sair da apresentação?';
        }
    });
    
    console.log('Presentation initialized successfully');
});

// Make presentation globally available for debugging
window.presentation = presentation;