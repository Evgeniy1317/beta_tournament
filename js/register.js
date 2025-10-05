// Register Page Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initScrollAnimations();
    initCardHoverEffects();
    initSmoothScrolling();
    initFormEnhancements();
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
    const cards = document.querySelectorAll('.info-item, .payment-method, .form-container');
    
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

// Form enhancements
function initFormEnhancements() {
    const iframe = document.querySelector('.google-form-iframe');
    if (iframe) {
        // Add loading animation
        iframe.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Initial state
        iframe.style.opacity = '0';
        iframe.style.transform = 'scale(0.95)';
        iframe.style.transition = 'all 0.5s ease';
    }
}

// Add ripple effect to interactive elements
function addRippleEffect() {
    const elements = document.querySelectorAll('.info-item, .payment-method');
    
    elements.forEach(element => {
        element.addEventListener('click', function(e) {
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
                background: rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
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

// Optimized scroll handler for parallax effects
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    const pageHeader = document.querySelector('.page-header::before');
    if (pageHeader) {
        pageHeader.style.transform = `translateY(${rate}px)`;
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add special effects for payment methods
function initPaymentMethodEffects() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 35px rgba(39, 174, 96, 0.3)';
            this.style.borderColor = '#27ae60';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            this.style.borderColor = 'rgba(39, 174, 96, 0.2)';
        });
    });
}

// Initialize payment method effects
initPaymentMethodEffects();

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

// Add form validation feedback
function initFormValidation() {
    const iframe = document.querySelector('.google-form-iframe');
    if (iframe) {
        // Listen for form submission events
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'form-submit') {
                showNotification('Registration submitted successfully!', 'success');
            }
        });
    }
}

// Initialize form validation
initFormValidation();

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