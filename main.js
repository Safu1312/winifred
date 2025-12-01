// smooth-scroll.js - Smooth Scroll Animations Only
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. SMOOTH SCROLLING WITH HEADER OFFSET
    // ============================================
    
    function smoothScrollTo(targetId, duration = 800) {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const header = document.getElementById('main-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - headerHeight;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
        history.pushState(null, null, targetId);
    }
    
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
    
    // Apply smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                smoothScrollTo(href);
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // ============================================
    // 2. MOBILE MENU TOGGLE
    // ============================================
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function toggleMobileMenu() {
        if (!mobileMenu || !mobileMenuBtn) return;
        
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            mobileMenu.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            document.body.style.overflow = '';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMobileMenu);
        });
    }
    
    // ============================================
    // 3. SCROLL-REVEAL ANIMATIONS FOR ELEMENTS
    // ============================================
    
    // Elements that should animate when scrolled into view
    const animatedElements = document.querySelectorAll(
        '.card, .contact-card, #available-spaces, #location-highlights, #why-us, .section-alt'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled-into-view');
                    
                    // Add staggered animation for children
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                        child.classList.add('stagger-animated');
                    });
                    
                    // Unobserve after animation
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ============================================
    // 4. STICKY HEADER ON SCROLL
    // ============================================
    
    const header = document.getElementById('main-header');
    
    if (header) {
        window.addEventListener('scroll', debounce(() => {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > 100) {
                header.classList.add('header-scrolled');
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.classList.remove('header-scrolled');
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                header.style.backdropFilter = 'none';
                header.style.backgroundColor = '#ffffff';
            }
        }, 10));
    }
    
    // ============================================
    // 5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', debounce(highlightActiveSection, 50));
    
    // ============================================
    // 6. BACK TO TOP BUTTON
    // ============================================
    
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    `;
    backToTopButton.id = 'back-to-top';
    backToTopButton.className = 'fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform translate-y-10 opacity-0 z-40 hover:scale-110';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.remove('opacity-0', 'translate-y-10');
            backToTopButton.classList.add('opacity-100', 'translate-y-0');
        } else {
            backToTopButton.classList.remove('opacity-100', 'translate-y-0');
            backToTopButton.classList.add('opacity-0', 'translate-y-10');
        }
    });
    
    // Back to top functionality
    backToTopButton.addEventListener('click', () => {
        smoothScrollTo('#hero');
    });
    
    // ============================================
    // 7. HOVER ANIMATIONS FOR BUTTONS AND CARDS
    // ============================================
    
    // Button hover effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Card hover effects
    document.querySelectorAll('.card-hover, .contact-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // ============================================
    // 8. DEBOUNCE UTILITY FUNCTION
    // ============================================
    
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // ============================================
    // 9. INITIALIZE SCROLL ANIMATIONS
    // ============================================
    
    // Check initial state on page load
    highlightActiveSection();
    
    // Add loaded class to body for transition effects
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
    
});

// ============================================
// CSS STYLES TO ADD
// ============================================
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
        }
        
        /* Scroll animation classes */
        .card, .contact-card, .section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .card.scrolled-into-view,
        .contact-card.scrolled-into-view,
        .section.scrolled-into-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animations */
        .stagger-child {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .stagger-child.stagger-animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Header scroll styles */
        #main-header {
            transition: all 0.3s ease;
        }
        
        #main-header.header-scrolled {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.95) !important;
        }
        
        /* Mobile menu animations */
        #mobile-menu {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-out, opacity 0.3s ease-out;
        }
        
        #mobile-menu.active {
            max-height: 500px;
            opacity: 1;
        }
        
        /* Button hover effects */
        .btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Card hover effects */
        .card-hover, .contact-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-hover:hover, .contact-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        /* Active nav link */
        .nav-link.active {
            color: #3b82f6;
            font-weight: 600;
        }
        
        /* Back to top button */
        #back-to-top {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        #back-to-top:hover {
            transform: translateY(-2px) scale(1.1);
        }
        
        /* Gallery image transitions */
        .gallery-image {
            transition: transform 0.3s ease;
        }
        
        .gallery-image:hover {
            transform: scale(1.03);
        }
        
        /* Lightbox animations */
        #lightbox {
            transition: opacity 0.3s ease;
        }
        
        .lightbox-enter {
            animation: fadeInScale 0.3s ease;
        }
        
        .lightbox-exit {
            animation: fadeOutScale 0.3s ease;
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeOutScale {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
        }
        
        /* Page load transition */
        .page-loaded * {
            transition-duration: 0.3s;
        }
    `;
    document.head.appendChild(style);
}

// Add styles when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollAnimationStyles);