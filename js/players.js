// Players Page Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initScrollAnimations();
    initCardHoverEffects();
    initSmoothScrolling();
    
    // Initialize Google Sheets integration
    initGoogleSheetsIntegration();
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.stat-item, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Google Sheets Integration
function initGoogleSheetsIntegration() {
    console.log('Initializing Google Sheets integration...');
    
    // Force update statistics immediately
    if (typeof forceUpdateStatistics === 'function') {
        forceUpdateStatistics();
    } else {
        console.log('forceUpdateStatistics function not available, using fallback');
        updatePlayersFromGoogleSheets();
    }
    
    // Set up auto-refresh
    startAutoRefresh();
    
    // Set up manual refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Manual refresh button clicked');
            this.disabled = true;
            this.textContent = '🔄 Refreshing...';
            
            updatePlayersFromGoogleSheets().finally(() => {
                this.disabled = false;
                this.textContent = '🔄 Refresh Players List';
            });
        });
    }
}

// Add typing effect for main title
function initTypingEffect() {
    // Typing effect disabled - static text only
    const title = document.querySelector('.page-header h2');
    if (title) {
        // Just ensure the title is visible immediately
        title.style.opacity = '1';
        title.style.visibility = 'visible';
    }
}

// Initialize typing effect
initTypingEffect();