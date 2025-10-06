// Homepage Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initScrollAnimations();
    initParallaxEffects();
    initCardHoverEffects();
    initSmoothScrolling();
    initMobileMenu();
});

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

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

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-section::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.info-card, .contact-item');
    
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

// Flyer download functionality
function downloadImage(format) {
    const imageUrl = 'images/3rd-Annual-Spades-Tournament.png';
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `3rd-Annual-Spades-Tournament.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification('Flyer downloaded successfully!', 'success');
}

// Social sharing
function shareOnInstagram() {
    const url = window.location.href; // Не кодируем URL для копирования
    
    // Instagram doesn't have direct sharing API, so we'll copy the link and show instructions
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied! Paste it in your Instagram story or post.', 'success');
        }).catch(() => {
            showNotification('Please copy the link manually and share on Instagram', 'info');
        });
    } else {
        showNotification('Please copy the link manually and share on Instagram', 'info');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CTA button interactions
function registerTeam() {
    window.location.href = 'register.html';
}

function viewRules() {
    window.location.href = 'rules.html';
}

function scrollToFlyer() {
    const flyerSection = document.getElementById('flyer');
    if (flyerSection) {
        flyerSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize ripple effects
addRippleEffect();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const heroBackground = document.querySelector('.hero-section::before');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
}, 10);

// Image error handling for Edge compatibility
function initImageErrorHandling() {
    const flyerImage = document.querySelector('.tournament-flyer-image');
    if (flyerImage) {
        flyerImage.addEventListener('error', function() {
            console.log('Image failed to load, trying alternative path...');
            // Try alternative paths
            const alternativePaths = [
                './images/3rd-Annual-Spades-Tournament.jpg',
                'images/3rd-Annual-Spades-Tournament.jpg',
                './images/3rd-Annual-Spades-Tournament.png',
                'images/3rd-Annual-Spades-Tournament.png',
                '../images/3rd-Annual-Spades-Tournament.jpg',
                '/images/3rd-Annual-Spades-Tournament.jpg'
            ];
            
            let currentIndex = 0;
            const tryNextPath = () => {
                if (currentIndex < alternativePaths.length) {
                    this.src = alternativePaths[currentIndex];
                    currentIndex++;
                } else {
                    console.log('All image paths failed, showing fallback');
                    this.style.display = 'none';
                    // Show fallback message
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'image-fallback';
                    fallbackDiv.innerHTML = `
                        <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 15px; border: 2px dashed #dee2e6;">
                            <h3 style="color: #6c757d; margin-bottom: 1rem;">Tournament Flyer</h3>
                            <p style="color: #6c757d;">Image loading issue detected. Please refresh the page or try a different browser.</p>
                            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
                        </div>
                    `;
                    this.parentNode.insertBefore(fallbackDiv, this);
                }
            };
            
            this.addEventListener('error', tryNextPath);
            tryNextPath();
        });
        
        // Also try to preload the image
        const preloadImg = new Image();
        preloadImg.onload = function() {
            console.log('Image preloaded successfully');
        };
        preloadImg.onerror = function() {
            console.log('Image preload failed');
        };
        preloadImg.src = flyerImage.src;
    }
}

// Initialize image error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageErrorHandling();
});

window.addEventListener('scroll', optimizedScrollHandler);
