// ==================== PORTFOLIO WEBSITE - MAIN JAVASCRIPT ====================
// Author: Marion Kipruto
// Description: Complete JavaScript functionality for portfolio website

'use strict';

// ==================== DOM ELEMENT REFERENCES ====================
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ==================== MOBILE MENU TOGGLE ====================
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ==================== PAGE NAVIGATION SYSTEM ====================
/**
 * Navigate to a specific page section
 * @param {string} pageId - The ID of the page to navigate to
 */
function navigateToPage(pageId) {
    // Remove active class from all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu if open
    if (mobileToggle && navMenu) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL hash
    if (window.location.hash.slice(1) !== pageId) {
        window.history.pushState(null, null, '#' + pageId);
    }
    
    // Trigger skill animation if on about page
    if (pageId === 'about') {
        setTimeout(animateSkills, 300);
    }
}

// ==================== NAVIGATION LINK CLICK HANDLERS ====================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            navigateToPage(pageId);
        }
    });
});

// Handle all elements with data-page attribute
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target && target.hasAttribute('href')) {
        e.preventDefault();
        const pageId = target.getAttribute('data-page');
        navigateToPage(pageId);
    }
});

// ==================== SCROLL EFFECTS ====================
/**
 * Add/remove scrolled class to header on scroll
 */
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

// Debounce function for performance
function debounce(func, wait = 10) {
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

// Apply debounced scroll handler
window.addEventListener('scroll', debounce(handleScroll, 10));

// ==================== SKILL BARS ANIMATION ====================
/**
 * Animate skill progress bars
 */
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        // Reset width first
        bar.style.width = '0%';
        // Trigger reflow
        void bar.offsetWidth;
        // Animate to target width
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 100);
    });
}

// ==================== FORM VALIDATION ====================
/**
 * Validation rules for form fields
 */
const validationRules = {
    name: {
        pattern: /^[a-zA-Z\s]{2,50}$/,
        message: 'Name must be 2-50 characters and contain only letters'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    message: {
        pattern: /^.{10,500}$/,
        message: 'Message must be between 10 and 500 characters'
    }
};

/**
 * Validate a single form field
 * @param {HTMLElement} field - The input/textarea element to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (!formGroup || !errorElement) return false;
    
    // Check if field is empty
    if (!fieldValue) {
        formGroup.classList.add('error');
        errorElement.textContent = 'This field is required';
        return false;
    }
    
    // Check against validation pattern
    const rule = validationRules[fieldName];
    if (rule && !rule.pattern.test(fieldValue)) {
        formGroup.classList.add('error');
        errorElement.textContent = rule.message;
        return false;
    }
    
    // Field is valid
    formGroup.classList.remove('error');
    errorElement.textContent = '';
    return true;
}

/**
 * Validate all form fields
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
    let isValid = true;
    const formFields = contactForm.querySelectorAll('input, textarea');
    
    formFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ==================== FORM EVENT LISTENERS ====================
if (contactForm) {
    const formFields = contactForm.querySelectorAll('input, textarea');
    
    // Real-time validation on blur
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        // Clear error on input if field was invalid
        field.addEventListener('input', () => {
            const formGroup = field.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (validateForm()) {
            // Get form data
            const formData = new FormData(contactForm);
            
            // Log form data (in production, send to server)
            console.log('Form submitted with data:');
            console.log('Name:', formData.get('name'));
            console.log('Email:', formData.get('email'));
            console.log('Message:', formData.get('message'));
            
            // Hide form
            contactForm.style.display = 'none';
            
            // Show success message
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
            }
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                
                if (formSuccess) {
                    formSuccess.classList.add('hidden');
                }
                
                // Remove any error states
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
                
                document.querySelectorAll('.error-message').forEach(error => {
                    error.textContent = '';
                });
            }, 3000);
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Focus on the input field
                const errorInput = firstError.querySelector('input, textarea');
                if (errorInput) {
                    errorInput.focus();
                }
            }
        }
    });
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
/**
 * Observe elements and animate them when they enter viewport
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

/**
 * Initialize scroll animations on page load
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.stat-card, .project-card, .timeline-item, .about-card, .contact-card, .cert-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
/**
 * Handle smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's a page navigation link
        if (this.hasAttribute('data-page')) {
            return;
        }
        
        // Only handle actual hash links
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== KEYBOARD NAVIGATION ====================
/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Navigate with number keys (1-4)
    if (e.key >= '1' && e.key <= '4') {
        const pageMap = ['home', 'about', 'projects', 'contact'];
        const pageIndex = parseInt(e.key) - 1;
        
        if (pageMap[pageIndex]) {
            navigateToPage(pageMap[pageIndex]);
        }
    }
});

// ==================== BROWSER BACK/FORWARD NAVIGATION ====================
/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1) || 'home';
    
    // Update active states without pushing to history
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    const targetPage = document.getElementById(hash);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    const activeLink = document.querySelector(`[data-page="${hash}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Animate skills if on about page
    if (hash === 'about') {
        setTimeout(animateSkills, 300);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== IMAGE LAZY LOADING ====================
/**
 * Lazy load images for better performance
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==================== PAGE LOAD INITIALIZATION ====================
/**
 * Initialize website when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Determine initial page from URL hash
    const hash = window.location.hash.slice(1) || 'home';
    
    // Navigate to initial page
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    const initialPage = document.getElementById(hash);
    if (initialPage) {
        initialPage.classList.add('active');
    } else {
        // Fallback to home if invalid hash
        document.getElementById('home').classList.add('active');
    }
    
    const initialLink = document.querySelector(`[data-page="${hash}"]`);
    if (initialLink) {
        initialLink.classList.add('active');
    } else {
        document.querySelector('[data-page="home"]').classList.add('active');
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Animate skills if starting on about page
    if (hash === 'about') {
        setTimeout(animateSkills, 500);
    }
});

// ==================== WINDOW LOAD EVENT ====================
/**
 * Execute after all resources are loaded
 */
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Log welcome message
    console.log('%c👋 Welcome to Marion Kipruto\'s Portfolio!', 
        'color: #06b6d4; font-size: 20px; font-weight: bold;');
    console.log('%c🚀 Interested in the code? Check out my GitHub!', 
        'color: #3b82f6; font-size: 14px;');
    console.log('%c💼 Built with HTML, CSS, and JavaScript', 
        'color: #8b5cf6; font-size: 12px;');
});

// ==================== PREVENT FORM RESUBMISSION ====================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is visible
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get current active page
 * @returns {string} - ID of active page
 */
function getCurrentPage() {
    const activePage = document.querySelector('.page.active');
    return activePage ? activePage.id : 'home';
}

// ==================== PERFORMANCE MONITORING ====================
/**
 * Log performance metrics (optional)
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('⚡ Performance Metrics:');
            console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
            console.log(`🔌 Connection Time: ${connectTime}ms`);
            console.log(`🎨 Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// ==================== ERROR HANDLING ====================
/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('⚠️ An error occurred:', e.message);
    // In production, you might want to send this to an error tracking service
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('⚠️ Unhandled promise rejection:', e.reason);
});

// ==================== VISIBILITY CHANGE HANDLER ====================
/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Page is now hidden');
    } else {
        console.log('👀 Page is now visible');
    }
});

// ==================== RESIZE HANDLER ====================
/**
 * Handle window resize events
 */
const handleResize = debounce(() => {
    // Close mobile menu if window is resized to desktop size
    if (window.innerWidth > 768) {
        if (navMenu && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// ==================== CUSTOM CURSOR (OPTIONAL) ====================
/**
 * Add custom cursor effect (uncomment to enable)
 */
/*
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
*/

// ==================== EXPORT FUNCTIONS (for testing) ====================
// If using modules, uncomment the following:
/*
export {
    navigateToPage,
    validateField,
    validateForm,
    animateSkills,
    getCurrentPage,
    isInViewport,
    debounce,
    throttle
};
*/

// ==================== END OF SCRIPT ====================
console.log('✨ Portfolio script loaded successfully!');
console.log('💡 Press 1-4 to quickly navigate between pages');
console.log('⌨️ Press ESC to close mobile menu');