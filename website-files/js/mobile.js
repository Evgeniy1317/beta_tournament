// Mobile-specific JavaScript functionality
// This file contains only mobile-specific scripts to avoid conflicts with desktop

document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initMobileAnimations();
    initMobileForms();
});

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Mobile Animations
function initMobileAnimations() {
    // Intersection Observer for mobile animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .card, .rule-item, .overview-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile Forms
function initMobileForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add mobile-specific form handling
        form.addEventListener('submit', function(e) {
            // Add mobile-specific validation
            validateMobileForm(form);
        });
        
        // Add mobile-specific input handling
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Scroll input into view on mobile
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    });
}

// Mobile Form Validation
function validateMobileForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Show mobile-friendly error message
            showMobileNotification('Please fill in all required fields', 'error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Mobile Notifications
function showMobileNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.mobile-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `mobile-notification mobile-notification-${type}`;
    notification.innerHTML = `
        <div class="mobile-notification-content">
            <span class="mobile-notification-message">${message}</span>
            <button class="mobile-notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateY(-100px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.mobile-notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateY(-100px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateY(-100px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile Touch Events
function initMobileTouchEvents() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .cta-button, .nav-link');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize mobile touch events
initMobileTouchEvents();

// Mobile Viewport Height Fix
function fixMobileViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Fix viewport on load and resize
window.addEventListener('load', fixMobileViewport);
window.addEventListener('resize', fixMobileViewport);

// Mobile Performance Optimizations
function optimizeMobilePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize mobile optimizations
optimizeMobilePerformance();
